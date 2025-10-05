import {
  getAllBooksService,
  getBookByBookIdService,
  addBookService
} from "../services/bookServices.js";

async function getAllBooks(req, res, next) {
  try {
    const books = await getAllBooksService();
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

async function fetchBookDetails(req, res, next) {
  try {
    const bookId = req.params.id;
    const book = await getBookByBookIdService(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

async function addBook(req, res, next) {
  try {
    const bookName = req.body.bookName;
    const authorName = req.body.authorName;
    const isbn = req.body.isbn || null;
    const publishedYear = req.body.publishedYear || null;
    const addedBook = await addBookService(bookName, authorName, isbn, publishedYear);
    res.status(201).json(addedBook);
  } catch (error) {
    next(error);
  }
}

export { getAllBooks, fetchBookDetails, addBook };