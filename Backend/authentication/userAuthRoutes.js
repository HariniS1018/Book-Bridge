import express from "express";
const userAuthRoutes = express.Router();

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logout
} from "./userAuthControllers.js";

userAuthRoutes.post("/registerUser", registerUser);
userAuthRoutes.post("/loginUser", loginUser);
userAuthRoutes.post(
  "/refreshAccessToken",
  refreshAccessToken
);
userAuthRoutes.post("/logout", logout);

export { userAuthRoutes };
