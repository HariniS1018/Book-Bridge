import { getPool } from "../db/dbUtils.js";
import {
  getUserByEmailId,
  registerUserModel,
  storeRefreshToken,
  getRefreshToken,
  updateRefreshToken,
} from "./userAuthModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const pool = getPool();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME;
const REFRESH_TOKEN_LIFETIME = Number(process.env.REFRESH_TOKEN_LIFETIME) || 7;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Set JWT SECRETS as environment variables");
}
function generateAccessToken(user) {
  return jwt.sign({ userId: user.user_id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFETIME,
  });
}

function generateRefreshToken(user) {
  console.log("Type of REFRESH_TOKEN_LIFETIME:", typeof REFRESH_TOKEN_LIFETIME);

  const now = new Date();
  const expirationDate = new Date(now);

  expirationDate.setDate(now.getDate() + REFRESH_TOKEN_LIFETIME); // safe now

  console.log("Current time:", now.toISOString());
  console.log("REFRESH_TOKEN_LIFETIME:", REFRESH_TOKEN_LIFETIME);
  console.log("Expires on:", expirationDate.toISOString());

  const expires_in = Math.floor(expirationDate.getTime() / 1000);
  console.log("Refresh token expires at (epoch):", expires_in);
  
  const refreshToken = jwt.sign(
    { userId: user.user_id, exp: expires_in },
    REFRESH_TOKEN_SECRET
  );

  return {
    refreshToken: refreshToken,
    expiresAt: expirationDate,
  };
}

async function registerUserService(
  userName,
  emailId,
  registrationNumber,
  password
) {
  const client = await pool.connect();
  console.log("Database connection established.");

  const userExists = await getUserByEmailId(client, emailId);
  if (userExists) {
    console.log("User already exists with email ID:", emailId);
    throw new Error(
      "Invalid Registration. User with this email ID already exists"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Hashed password:", hashedPassword);

  const user = await registerUserModel(
    client,
    userName,
    emailId,
    registrationNumber,
    hashedPassword
  );
  return user;
}

async function loginUserService(emailId, password) {
  let accessToken, refreshToken, expiresAt;
  const client = await pool.connect();
  console.log("Database connection established.");

  const user = await getUserByEmailId(client, emailId);
  if (!user) {
    throw new Error("Invalid credentials. User with this email ID is not found");
  }
  console.log("User found:", user);
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials. Incorrect password.");
  }

  try {
    accessToken = generateAccessToken(user);
    ({ refreshToken, expiresAt } = generateRefreshToken(user));
  } catch (error) {
    console.error("Error generating tokens:", error.message);
    throw new Error("Error generating tokens. Please try again later.");
  }
  await storeRefreshToken(
    client,
    refreshToken,
    expiresAt,
    user.user_id
  );
  return { accessToken, refreshToken, user };
}

async function refreshAccessTokenService(BearerHeader) {
  let newAccessToken;
  const client = await pool.connect();
  console.log("Database connection established.");

  const refreshToken = BearerHeader.split(" ")[1];
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const storedRefreshToken = await getRefreshToken(
    client,
    refreshToken
  );

  if (!storedRefreshToken) {
    throw new Error("Invalid refresh token");
  }

  if (
    storedRefreshToken.expires_at &&
    storedRefreshToken.expires_at < new Date()
  ) {
    throw new Error("Refresh token has expired");
  }

  const user = {
    user_id: storedRefreshToken.user_id,
  };
  try {
    newAccessToken = generateAccessToken(user);
  } catch (error) {
    console.error("Error generating Access token:", error.message);
    throw new Error("Error generating Access token. Please try again later.");
  }
  return { accessToken: newAccessToken };
}

async function logoutUserService(BearerHeader) {
  let client;
  try {
    client = await pool.connect();
    console.log("Database connection established.");

    const refreshToken = BearerHeader.split(" ")[1];
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    try {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (jwtError) {
      throw new Error("Invalid refresh token");
    }

    const isvalid = await getRefreshToken(client, refreshToken);
    if (isvalid){
      const result = await updateRefreshToken(client, refreshToken);
      if (result === null) {
        throw new Error("Refresh token not found");
      }
    }
    else{
      throw new Error("Refresh token is already invalidated or logged out.");
    }
    
  } catch (error) {
    console.error("[Services] Error in logoutUser:", error.message);
    throw error;
  } finally {
    if (client) {
      client.release();
      console.log("Database client released after logout.");
    }
  }
}

const jwtVerifyPromise = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

async function authenticateTokenService(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header is missing or invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await jwtVerifyPromise(token, ACCESS_TOKEN_SECRET);
    console.log("decoded: ", decoded);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired access token");
  }
}

export {
  registerUserService,
  loginUserService,
  refreshAccessTokenService,
  logoutUserService,
  authenticateTokenService,
};
