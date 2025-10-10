import express from "express";
const exchangeRoutes = express.Router();

import { authenticateToken } from "../middlewares/verifyToken.js";
import {
  createBookRequest,
  fetchListOfRequestedBooks,
  updateBookRequestStatus,
  updateExchangeDates,
} from "../controllers/bookExchangeControllers.js";

exchangeRoutes.post("/createBookRequest", authenticateToken, createBookRequest);
exchangeRoutes.get("/fetchListOfRequestedBooks", authenticateToken, fetchListOfRequestedBooks);
exchangeRoutes.put("/updateBookRequestStatus", authenticateToken, updateBookRequestStatus);
exchangeRoutes.put("/updateExchangeDates", authenticateToken, updateExchangeDates);


export { exchangeRoutes };