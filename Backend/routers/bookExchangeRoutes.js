import express from "express";
const exchangeRoutes = express.Router();

import { authenticateToken } from "../middlewares/verifyToken.js";
import { createBookRequest } from "../controllers/bookExchangeControllers.js";

exchangeRoutes.post("/createBookRequest", authenticateToken, createBookRequest);

export { exchangeRoutes };