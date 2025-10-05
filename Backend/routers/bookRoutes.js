import express from "express";
const booksRoutes = express.Router();

import { authenticateToken } from "../middlewares/verifyToken.js";
import {
  getAllBooks,
  //   fetchBookDetails,
  //   addBook
} from "../controllers/bookControllers.js";

booksRoutes.get("/getAllBooks", authenticateToken, getAllBooks);
// booksRoutes.get("/fetchBookDetails/:id", authenticateToken, fetchBookDetails);
// booksRoutes.post("/addBook", authenticateToken, addBook);

export { booksRoutes };
