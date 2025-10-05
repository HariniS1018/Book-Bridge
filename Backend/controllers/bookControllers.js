import { getAllBooksServices } from "../services/bookServices.js";

async function getAllBooks(req, res, next) {
  try {
    const books = await getAllBooksServices();
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

export { getAllBooks };