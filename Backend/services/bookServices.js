import { withTransaction } from "../db/transactionHandler.js";
import {
  getAllBooks,
  getBookByBookId,
  createBook,
  linkBookToUser,
  getBookByBookDetails,
  CheckLinkedBookToUser,
  updateBookCount,
  updateBookModel,
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

async function addBookService(bookName, authorName, isbn, publishedYear, userId) {
  return withTransaction(async (transaction) => {
    let bookId;
    let isLinked;
    const existingBook = await getBookByBookDetails(
      bookName,
      authorName,
      isbn,
      publishedYear,
      transaction
    );
    if (existingBook) {
      bookId = existingBook.book_id;
      const alreadyLinked = await CheckLinkedBookToUser(existingBook.book_id, userId, transaction);
      if(alreadyLinked){
        const isUpdated = await updateBookCount(
          existingBook.book_id,
          userId,
          transaction
        );
        if(!isUpdated){
          throw new Error("Failed to update book count");
        }
      }
      else{
        isLinked = await linkBookToUser(existingBook.book_id, userId, 1, 1, transaction);
        if(!isLinked){
          throw new Error("Failed to link book to user");
        }
      }
      
    }
    else{
      const createdBook = await createBook(
        bookName,
        authorName,
        isbn,
        publishedYear,
        transaction
      );
      if (!createdBook) {
        throw new Error("Failed to create book");
      }
      bookId = createdBook.book_id;
      isLinked = await linkBookToUser(createdBook.book_id, userId, 1, 1, transaction);
      if(!isLinked){
        throw new Error("Failed to link book to user");
      }
    }
    const book = await getBookByBookId(bookId, transaction);
    return book;
    
  });
}

async function updateBookService(bookId, isbn, publishedYear, userId) {
  return withTransaction(async (transaction) => {
    const book = await getBookByBookId(bookId, transaction);
    if (!book) {
      throw new Error("Book not found");
    }
    const isUserBookLinked = await CheckLinkedBookToUser(bookId, userId, transaction);
    if (!isUserBookLinked) {
      throw new Error("User does not own this book. So cannot update this book.");
    }
    const updatedBook = await updateBookModel(
      bookId,
      isbn,
      publishedYear,
      transaction
    );
    return updatedBook;
  });
}

export { getAllBooksService, getBookByBookIdService, addBookService, updateBookService };