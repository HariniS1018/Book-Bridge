import express from "express";
const userRoutes = express.Router();

import { authenticateToken } from "../middlewares/verifyToken.js";
import {
  getProfileDetails,
  updateProfileDetails,
  deleteUser,
  
} from "../controllers/userControllers.js";

userRoutes.get("/getProfileDetails", authenticateToken, getProfileDetails);
userRoutes.put("/updateProfileDetails",authenticateToken,updateProfileDetails);
userRoutes.delete("/deleteUser",authenticateToken,deleteUser)


export { userRoutes };