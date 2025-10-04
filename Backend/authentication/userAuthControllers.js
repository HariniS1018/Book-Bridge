import { error } from "console";
import {
  registerUserService,
  verifyOtpAndRegisterUserService,
  resendOtpService,
  loginUserService,
  forgotPasswordService,
  verifyAndUpdatePasswordService,
  refreshAccessTokenService,
  logoutUserService,
} from "./userAuthServices.js";

async function registerUser(req, res) {
  const userName = req.body.userName;
  const emailId = req.body.emailId;
  const registrationNumber = req.body.registrationNumber;
  const password = req.body.password;

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
    if (user) {
      res.status(201).json({ message: "OTP sent to your email" });
    }
    else{
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  } catch (error) {
    res.status(500).json({ error: "Registration failed. Internal server error: " + error.message });
  }
}

async function verifyOtp(req, res) {
  const emailId = req.body.emailId;
  const otp = req.body.otp;

  if (
    emailId === undefined ||
    otp === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof otp !== "string" || (otp).trim().length !== 6 || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      error: "Invalid OTP. OTP must be a 6-digit number.",
    });
  }
  if (!/^\S+@\S+\.\S+$/.test(emailId)) {
    return res.status(400).json({
      error: "Invalid email format.",
    });
  }

  try {
    const user = await verifyOtpAndRegisterUserService(
      emailId,
      otp
    );
    if (user) {
      res.status(201).json({ message: "User registered successfully", user });
    } else {
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  } catch (error) {
    if (error.message.includes("Invalid or expired")) {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({
        error: "Registration failed. Internal server error: " + error.message,
      });
  }
}

async function resendOtp(req, res) {
  const emailId = req.body.emailId;

  if (emailId === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!/^\S+@\S+\.\S+$/.test(emailId)) {
    return res.status(400).json({
      error: "Invalid email format.",
    });
  }

  try {
    const isOtpSent = await resendOtpService(emailId);
    if (isOtpSent) {
      res.status(200).json({ message: "OTP resent successfully" });
    } else {
      res.status(500).json({ error: "Failed to resend OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
}

async function loginUser(req, res) {
  const emailId = req.body.emailId;
  const password = req.body.password;

  if (emailId === undefined || password === undefined) {
    return res
      .status(400)
      .json({ error: "Missing required fields: emailId, password." });
  }

  if (
    password.length < 8 ||
    !/[A-Za-z]/.test(password) || // at least one letter
    !/[0-9]/.test(password) // at least one number
  ) {
    return res.status(400).json({
      error:
        "Invalid password. Password must be at least 8 characters long, and contain at least one letter and one number." +
        error.message,
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
    if(accessToken && refreshToken && user){
      console.log("Login user var:", user);
      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user,
      });
    }
    else{
      return res.status(401).json({ error: "Login failed. Please check your credentials." });
    }
    
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

async function forgotPassword(req, res) {
  const emailId = req.body.emailId;

  if (emailId === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!/^\S+@\S+\.\S+$/.test(emailId)) {
    return res.status(400).json({
      error: "Invalid email format." + error.message,
    });
  }

  try {
    const isOtpSent = await forgotPasswordService(emailId);
    if (isOtpSent) {
      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
}

async function verifyAndUpdatePassword(req, res) {
  const emailId = req.body.emailId;
  const newPassword = req.body.newPassword;
  const otp = req.body.otp;

  if (emailId === undefined || newPassword === undefined || otp === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await verifyAndUpdatePasswordService(emailId, newPassword, otp);
    if (user) {
      res.status(200).json({ message: "Password updated successfully", user });
    } else {
      res.status(500).json({ error: "Failed to update password" });
    }
  } catch (error) {
    if (error.message.includes("Invalid or expired")) {
      return res.status(400).json({ error: error.message });
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
    const isLoggedOut = await logoutUserService(bearerHeader);
    if (isLoggedOut) {
      res.status(200).json({ message: "Logged out successfully" });
    } else {
      res.status(500).json({ error: "Failed to log out" });
    }
  } catch (error) {
    if (error.message === "Refresh token not found") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error " + error });
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
  verifyOtp,
  resendOtp,
  loginUser,
  forgotPassword,
  verifyAndUpdatePassword,
  refreshAccessToken,
  logout,
  authenticateToken
};
