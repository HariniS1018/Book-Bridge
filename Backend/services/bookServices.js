import { withTransaction } from "../db/transactionHandler.js";
import {
  getAllBooks,
  getBookByBookId,
  createBook,
} from "../models/bookModels.js";

async function getAllBooksService() {
  return withTransaction(async (transaction) => {
    const books = await getAllBooks(transaction);
    return books;
  });
}

async function getBookByBookIdService(id) {
  return withTransaction(async (transaction) => {
    const book = await getBookByBookId(id, transaction);
    return book;
  });
}

async function addBookService(bookName, authorName, isbn, publishedYear) {
  return withTransaction(async(transaction) => {
    const createdBook = await createBook(bookName, authorName, isbn, publishedYear, transaction);
    return createdBook;
  })
}

export { getAllBooksService, getBookByBookIdService, addBookService };