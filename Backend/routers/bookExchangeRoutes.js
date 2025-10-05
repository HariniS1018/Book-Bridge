import express from "express";
const exchangeRoutes = express.Router();

import { authenticateToken } from "../middlewares/verifyToken.js";
import {
  createBookRequest,
  fetchListOfRequestedBooks,
} from "../controllers/bookExchangeControllers.js";

exchangeRoutes.post("/createBookRequest", authenticateToken, createBookRequest);
exchangeRoutes.get("/fetchListOfRequestedBooks", authenticateToken, fetchListOfRequestedBooks);

export { exchangeRoutes };