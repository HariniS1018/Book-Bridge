import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

dotenv.config();
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.urlencoded({ extended: true })); // For URL-encoded form data
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

import { userAuthRoutes } from "./authentication/userAuthRoutes.js";
app.use("/userAuth", userAuthRoutes);

import { booksRoutes } from "./routers/bookRoutes.js";
app.use("/books", booksRoutes);

import { exchangeRoutes } from "./routers/bookExchangeRoutes.js";
app.use("/exchanges", exchangeRoutes);

app.use(notFoundHandler); // Catch-all 404
app.use(errorHandler); // Global error handler

export default app;