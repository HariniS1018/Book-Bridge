import { error } from "console";
import {
  registerUserService,
  loginUserService,
  refreshAccessTokenService,
  logoutUserService,
  authenticateTokenService,
} from "./userAuthServices.js";

async function registerUser(req, res) {
  const { userName, emailId, registrationNumber, password } = req.body;

  if (userName === undefined || emailId === undefined || registrationNumber == undefined || password === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof userName !== "string" || userName.trim().length < 3) {
    return res.status(400).json({
      error: "Invalid user name. User name must be at least 3 characters long.",
    });
  } 
  if (!/^\S+@\S+\.\S+$/.test(emailId)) {
    return res.status(400).json({
      error: "Invalid email format.",
    });
  }
  if (typeof registrationNumber !== "number" || (registrationNumber).toString().length !== 10) {
    return res.status(400).json({ error: "Registration number must be a 10-digit number." });
  }
  if (
    password.length < 8 ||
    !/[A-Za-z]/.test(password) || // at least one letter
    !/[0-9]/.test(password) // at least one number
  ) {
    return res.status(400).json({
      error:
        "Invalid password. Password must be at least 8 characters long, and contain at least one letter and one number.",
    });
  }
  

  try {
    const user = await registerUserService(
      userName,
      emailId,
      registrationNumber,
      password
    );
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    if (error.message.includes("Invalid phone number")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
}

async function loginUser(req, res) {
  const { emailId, password } = req.body;

  if (emailId === undefined || password === undefined) {
    return res.status(400).json({ error: "Missing required fields: emailId, password." + error.message });
  } 
  
  if (password.length < 8 ||
    !/[A-Za-z]/.test(password) || // at least one letter
    !/[0-9]/.test(password) // at least one number
  ) {
    return res.status(400).json({
      error:
        "Invalid password. Password must be at least 8 characters long, and contain at least one letter and one number." + error.message,
    });
  }
  
  if (!/^\S+@\S+\.\S+$/.test(emailId)) {
    return res.status(400).json({
      error: "Invalid email format." + error.message,
    });
  }

  try {
    const {
      accessToken,
      refreshToken,
      user: user,
    } = await loginUserService(emailId, password);
    console.log("Login user var:", user);
    res.json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    if (error.message.includes("Invalid credentials")) {
      return res.status(401).json({ error: error.message });
    }
    if (error.message.includes("Error generating tokens")) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
}

async function refreshAccessToken(req, res) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  try {
    const { accessToken } = await refreshAccessTokenService(bearerHeader);
    res.json({ accessToken });
  } catch (error) {
    if (
      error.message.includes("Invalid refresh token") ||
      error.message.includes("Refresh token has expired") ||
      error.message.includes("Refresh token is required")
    ) {
      return res.status(401).json({ error: error.message });
    } else if (error.message.includes("Error generating Access token")) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

async function logout(req, res) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  try {
    await logoutUserService(bearerHeader);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    if (error.message === "Refresh token is required") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Refresh token not found") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

const authenticateToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  try {
    const user = await authenticateToken(bearerHeader);
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Authorization header is missing or invalid") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(403).json({ error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logout,
  authenticateToken
};
