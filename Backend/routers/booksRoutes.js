import express from "express";
const booksRoutes = express.Router();

import {
  getAllBooks,
  //   fetchBookDetails,
  //   addBook
} from "../controllers/booksControllers.js";

booksRoutes.get("/getAllBooks", getAllBooks);
// booksRoutes.get("/fetchBookDetails/:id", fetchBookDetails);
// booksRoutes.post("/addBook", addBook);

export { booksRoutes };
