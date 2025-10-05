import { Op } from "sequelize";

import BookExchange from "./bookExchange.js";
import BookUser from "./bookUser.js";
import Book from "./book.js";
import User from "./user.js";

async function checkAlreadyBookBorrowedByUserId(
  borrowerId,
  bookId,
  transaction
) {
  try {
    const isBorrowed = await BookExchange.findOne(
      {
        where: {
          borrower_id: borrowerId,
          book_id: bookId,
        },
      },
      transaction
    );
    console.log("[MODELS] IS_BORROWED: ", isBorrowed);
    if (!isBorrowed) {
      return null;
    }
    return isBorrowed;
  } catch (error) {
    console.log(
      "Sequelize error while Checking if the book is already borrowed by the user: ",
      error.message
    );
    throw error;
  }
}

async function checkBookAvailability(bookId, lenderId, transaction) {
  try {
    const isAvailable = await BookUser.findOne(
      {
        where: {
          book_id: bookId,
          owner_id: lenderId,
        },
      },
      transaction
    );
    if (!isAvailable) {
      throw new Error("Error while checking book availability.");
    }
    return isAvailable;
  } catch (error) {
    console.log(
      "Sequelize error while checking book availability: ",
      error.message
    );
    throw error;
  }
}

async function isBookOwnedByBorrower(bookId, borrowerId, transaction) {
  try {
    const isOwned = await BookUser.findOne(
      {
        where: {
          book_id: bookId,
          owner_id: borrowerId,
        },
      },
      transaction
    );
    if (!isOwned) {
      return null;
    }
    return isOwned;
  } catch (error) {
    console.log(
      "Sequelize error while checking book ownership: ",
      error.message
    );
    throw error;
  }
}

async function createBookRequest(borrowerId, lenderId, bookId, transaction) {
  try {
    const exchange = await BookExchange.create(
      {
        borrower_id: borrowerId,
        lender_id: lenderId,
        book_id: bookId,
      },
      { transaction }
    );
    if (!exchange) {
      throw new Error("Requesting Book failed.");
    }
    return exchange;
  } catch (error) {
    console.log(
      "Sequelize error while requesting book record creation: ",
      error.message
    );
    throw error;
  }
}

async function fetchListOfRequestedBooksByUserId(
  userId,
  uptoDate,
  transaction
) {
  const requestedBooks = await BookExchange.findAll(
    {
      where: {
        borrower_id: userId,
        request_date: {
          [Op.lte]: uptoDate,
        },
      },
      include: [
        {
          model: Book,
          attributes: ["book_id", "book_name", "author_name"],
        },
        {
          model: User,
          attributes: [
            "user_id",
            "user_name",
            "registration_number",
            "email_id",
          ],
        },
      ],
      attributes: ["request_date"],
      order: [["request_date", "DESC"]],
    },
    transaction
  );

  return requestedBooks.map((exchange) => ({
    book_id: exchange.Book.book_id,
    book_name: exchange.Book.book_name,
    author_name: exchange.Book.author_name,
    requested_date: exchange.request_date,
    lender_id: exchange.User.user_id,
    lender_name: exchange.User.user_name,
    lender_registration_number: exchange.User.registration_number,
    lender_email: exchange.User.email_id,
  }));
}

async function getRequestStatusByLender(lenderId, borrowerId, bookId, transaction) {
  try {
    const exchange = await BookExchange.findOne(
      {
        where: {
          lender_id: lenderId,
          borrower_id: borrowerId,
          book_id: bookId,
        },
      },
      transaction
    );
    if (!exchange) {
      return null;
    }
    return exchange.status;
  } catch (error) {
    console.log(
      "Sequelize error while fetching book request status: ",
      error.message
    );
    throw error;
  }
}

async function updateBookRequestStatusByLender(
  lenderId,
  borrowerId,
  bookId,
  newStatus,
  transaction
) {
  try {
    const [updatedRowsCount] = await BookExchange.update(
      { status: newStatus },
      {
        where: {
          borrower_id: borrowerId,
          lender_id: lenderId,
          book_id: bookId,
        },
        transaction,
      }
    );
    console.log("[MODELS] UPDATED_ROWS_COUNT: ", updatedRowsCount);
    if (updatedRowsCount === 0) {
      throw new Error("No matching book exchange record found to update.");
    }
    return updatedRowsCount;
  } catch (error) {
    console.log(
      "Sequelize error while updating book request status: ",
      error.message
    );
    throw error;
  }
}


export {
  checkBookAvailability,
  checkAlreadyBookBorrowedByUserId,
  isBookOwnedByBorrower,
  createBookRequest,
  fetchListOfRequestedBooksByUserId,
  updateBookRequestStatusByLender,
  getRequestStatusByLender,
};
