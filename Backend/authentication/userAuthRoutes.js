import express from "express";
const userAuthRoutes = express.Router();

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logout
} from "./userAuthControllers.js";

console.log("User Auth Routes loaded");
userAuthRoutes.post("/registerUser", registerUser);
console.log("User Auth Routes loaded");
userAuthRoutes.post("/loginUser", loginUser);
userAuthRoutes.post(
  "/refreshAccessToken",
  refreshAccessToken
);
userAuthRoutes.post("/logoutUser", logout);

export { userAuthRoutes };
