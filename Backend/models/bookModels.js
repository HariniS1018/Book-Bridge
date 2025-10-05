import Book from "./book.js";
import User from "./user.js";
import BookUser from "./bookUser.js";

async function getAllBooks(transaction) {
  try {
    const books = await Book.findAll({ transaction });
    if (books.length === 0) {
      return null;
    }
    return books;
  } catch (error) {
    console.error("Sequelize error during book fetching:", error.message);
    throw error;
  }
}

async function getBookByBookId(id, transaction) {
  try {
    const book = await Book.findByPk(id, {
      transaction,
      include: [
        {
          model: User,
          through: {
            model: BookUser,
            attributes: ["count", "available_count", "availability_status"],
          },
          attributes: ["user_id", "user_name", "email_id", "registration_number"], // customize as needed
        },
      ],
    });

    if (!book) {
      return null;
    }

    return book;
  } catch (error) {
    console.error(
      "Sequelize error while fetching book with owners:",
      error.message
    );
    throw error;
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
    const newBook = await Book.create(
      {
        book_name: bookName,
        author_name: authorName,
        isbn: isbn,
        publication_year: publishedYear,
      },
      { transaction }
    );
    if (!newBook) {
      throw new Error("Book creation failed");
    }
    return newBook;
  } catch (error) {
    console.error("Sequelize error during book creation:", error.message);
    throw error;
  }
  
}

async function getBookByBookDetails(
  bookName,
  authorName,
  isbn,
  publishedYear,
  transaction
) {
  try {
    const book = await Book.findOne({
      where: {
        book_name: bookName,
        author_name: authorName,
        isbn: isbn,
        publication_year: publishedYear,
      },
      transaction
    });
    return book;
  } catch (error) {
    console.error("Sequelize error while fetching book details:", error.message);
    throw error;
  }
}

async function CheckLinkedBookToUser(bookId, userId, transaction) {
  try {
    const link = await BookUser.findOne({
      where: { book_id: bookId, owner_id: userId },
      transaction
    });
    return link;
  } catch (error) {
    console.error("Sequelize error while checking linked book to user:", error.message);
    throw error;
  }
}

async function updateBookCount(bookId, userId, transaction) {
  try{
    const updation = await BookUser.increment(
      { count: 1, available_count: 1 },
      { where: { book_id: bookId, owner_id: userId }, transaction }
    );
    return updation;
  } catch (error) {
    console.error("Sequelize error while updating book count:", error.message);
    throw error;
  }
}

async function linkBookToUser(bookId, userId, count=1, availableCount=1, transaction) {
  try {
    return BookUser.create(
      { book_id: bookId, owner_id: userId, count: count, available_count: availableCount },
      { transaction }
    );
  } catch (error) {
    console.error("Sequelize error while linking book to user:", error.message);
    throw error;
  }
}


export {
  getAllBooks,
  getBookByBookId,
  createBook,
  getBookByBookDetails, 
  CheckLinkedBookToUser,
  updateBookCount,
  linkBookToUser,
};
