import {
  getUserByEmailId,
  getUserByRegistrationNumber,
  registerUserModel,
  updatePasswordModel,
  storeRefreshToken,
  getRefreshToken,
  updateRefreshToken,
} from "./userAuthModels.js";
import { getRedisClient } from "../db/redisUtils.js";
import { sendOtpEmail } from "../utils/sendMail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME;
const REFRESH_TOKEN_LIFETIME = Number(process.env.REFRESH_TOKEN_LIFETIME) || 7;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Set JWT SECRETS as environment variables");
}
function generateAccessToken(user) {
  return jwt.sign({ userId: user.user_id, role: user.role }, ACCESS_TOKEN_SECRET, {
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
    { userId: user.user_id,role: user.role,  exp: expires_in },
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
    const emailExists = await getUserByEmailId(emailId);
    if (emailExists) {
      console.log("User already exists with email ID:", emailId);
      throw new Error(
        "Invalid Registration. User with this email ID already exists"
      );
    }

    
    const regNoExists = await getUserByRegistrationNumber(registrationNumber);
    if (regNoExists) {
      console.log("User already exists with registration number:", registrationNumber);
      throw new Error(
        "Invalid Registration. User with this registration number already exists"
      );
    }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const redisClient = await getRedisClient();
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const userData = {
    userName,
    emailId,
    registrationNumber,
    password: hashedPassword,
  };

  try {
    await redisClient.set(`otp:${emailId}`, otp, { EX: 300 });
    await redisClient.set(`pendingUser:${emailId}`, JSON.stringify(userData), {
      EX: 300,
    });
  } catch (err) {
    console.error("Redis error. Cannot store OTP or user data:", err);
    throw new Error("Failed to store OTP or user data in Redis");
  }
  
  const isOtpSent = await sendOtpEmail(emailId, otp);
  if (isOtpSent) {
    console.log("OTP sent successfully");
    return true;
  } else {
    console.log("Failed to send OTP");
    return false;
  }
}

async function verifyOtpAndRegisterUserService(emailId, userEnteredOtp) {
  const redisClient = await getRedisClient();
  const storedOtp = await redisClient.get(`otp:${emailId}`);
  if (storedOtp === null) {
    throw new Error("Invalid or expired email");
  }
  if (storedOtp !== userEnteredOtp) {
    throw new Error("Invalid or expired OTP");
  }

  const userJson = await redisClient.get(`pendingUser:${emailId}`);
  if (!userJson) throw new Error("User data expired or missing");

  const userData = JSON.parse(userJson);

  const user = await registerUserModel(
    userData.userName,
    userData.emailId,
    userData.registrationNumber,
    userData.password
  );

  await redisClient.del(`pendingUser:${emailId}`);
  await redisClient.del(`otp:${emailId}`);
  return user;
}

async function resendOtpService(emailId) {
  const redisClient = await getRedisClient();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await redisClient.set(`otp:${emailId}`, otp, { EX: 300 });
  } catch (err) {
    console.error("Redis error:", err);
    throw new Error("Failed to store OTP");
  }

  const isOtpSent = await sendOtpEmail(emailId, otp);
  if (isOtpSent) {
    console.log("OTP resent successfully");
    return true;
  } else {
    console.error("Failed to resend OTP");
    return false;
  }
}

async function loginUserService(emailId, password) {
  let accessToken, refreshToken, expiresAt;
  
  const user = await getUserByEmailId(emailId);
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
  const isStored = await storeRefreshToken(
    refreshToken,
    expiresAt,
    user.user_id
  );
  if(isStored){
    return { accessToken, refreshToken, user };
  }
  else{
    return { accessToken: null, refreshToken: null, user: null }; // confirm on this
  }
}

async function forgotPasswordService(emailId) {
  const redisClient = await getRedisClient();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await redisClient.set(`otp:${emailId}`, otp, { EX: 300 });
  } catch (err) {
    console.error("Redis error:", err);
    throw new Error("Failed to store OTP");
  }

  const isOtpSent = await sendOtpEmail(emailId, otp);
  if (isOtpSent) {
    console.log("OTP sent successfully");
    return true;
  } else {
    console.error("Failed to send OTP");
    return false;
  }
}

async function verifyAndUpdatePasswordService(
  emailId,
  newPassword,
  userEnteredOtp
) {
  const redisClient = await getRedisClient();
  const storedOtp = await redisClient.get(`otp:${emailId}`);
  if (storedOtp === null) {
    throw new Error("Invalid or expired email");
  }
  if (storedOtp !== userEnteredOtp) {
    throw new Error("Invalid or expired OTP");
  }

  const isUser = await getUserByEmailId(emailId);
  if (!isUser) {
    throw new Error("User with this email ID does not exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  const user = await updatePasswordModel(emailId, hashedPassword);
  if (!user) {
    console.error("No user for the given email ID to update password.");
    throw new Error("Invalid Email ID. Cannot update Password.");
  }

  await redisClient.del(`otp:${emailId}`);
  return user;
}

async function refreshAccessTokenService(BearerHeader) {
  
  const refreshToken = BearerHeader.split(" ")[1];
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const storedRefreshToken = await getRefreshToken(
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
  let newAccessToken;
  try {
    newAccessToken = generateAccessToken(user);
  } catch (error) {
    console.error("Error generating Access token:", error.message);
    throw new Error("Error generating Access token. Please try again later.");
  }
  return { accessToken: newAccessToken };
}

async function logoutUserService(BearerHeader) {
  const refreshToken = BearerHeader.split(" ")[1];
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  try {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (jwtError) {
    throw new Error("Invalid refresh token");
  }

  const isvalid = await getRefreshToken(refreshToken);
  if (isvalid){
    const result = await updateRefreshToken(refreshToken);
    if (result === null) {
      throw new Error("Refresh token not found");
    }
  }
  else{
    throw new Error("Refresh token is already invalidated or logged out.");
  }
  return true;
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


export {
  registerUserService,
  verifyOtpAndRegisterUserService,
  resendOtpService,
  loginUserService,
  forgotPasswordService,
  verifyAndUpdatePasswordService,
  refreshAccessTokenService,
  logoutUserService,
};
