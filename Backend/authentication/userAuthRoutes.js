import express from "express";
const userAuthRoutes = express.Router();

import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  forgotPassword,
  verifyAndUpdatePassword,
  refreshAccessToken,
  logout
} from "./userAuthControllers.js";

userAuthRoutes.post("/registerUser", registerUser);
userAuthRoutes.post("/verifyOtp", verifyOtp);
userAuthRoutes.post("/resendOtp", resendOtp);
userAuthRoutes.post("/loginUser", loginUser);
userAuthRoutes.post("/forgotPassword", forgotPassword);
userAuthRoutes.post("/verifyAndUpdatePassword", verifyAndUpdatePassword);
userAuthRoutes.post(
  "/refreshAccessToken",
  refreshAccessToken
);
userAuthRoutes.post("/logoutUser", logout);

export { userAuthRoutes };
