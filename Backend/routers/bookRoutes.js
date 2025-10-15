import express from "express";
const booksRoutes = express.Router();

import { authenticateToken } from "../middlewares/verifyToken.js";
import {
  getAllBooks,
  fetchBookDetails,
  addBook,
  updateBook,
  deleteBookUserLink
} from "../controllers/bookControllers.js";

booksRoutes.get("/getAllBooks", authenticateToken, getAllBooks);
booksRoutes.get(
  "/fetchBookDetails/:bookId",
  authenticateToken,
  fetchBookDetails
);
booksRoutes.post("/addBook", authenticateToken, addBook);
booksRoutes.put("/updateBook", authenticateToken, updateBook);
booksRoutes.delete("/deleteBookUserLink", authenticateToken, deleteBookUserLink);


export { booksRoutes };