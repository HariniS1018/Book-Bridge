import Book from "./book.js";

async function getAllBooks(transaction) {
  try {
    const books = await Book.findAll({ transaction });
    if (books.length === 0) {
      return null;
    }
    return books;
  } catch (error) {
    throw new Error("Error fetching books");
  }
}

async function getBookByBookId(id, transaction) {
  try {
    const book = await Book.findByPk(id, { transaction });
    if (!book) {
      return null;
    }
    return book;
  } catch (error) {
    throw new Error("Error fetching book details");
  }
}

async function createBook(
  bookName,
  authorName,
  isbn,
  publishedYear,
  transaction
) {
  try {
    const newBook = await Book.create({
      bookName,
      authorName,
      isbn,
      publishedYear,
    }, { transaction });
    if (!newBook) {
      throw new Error("Book creation failed");
    }
    return newBook;
  } catch (error) {
    throw new Error("Error creating book");
  }
}
export { getAllBooks, getBookByBookId, createBook };
