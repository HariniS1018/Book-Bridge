import { where } from "sequelize";
import BookExchange from "./bookExchange.js";
import BookUser from "./bookUser.js";

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
    if(!isBorrowed){
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
                    owner_id: lenderId
                }
            }, transaction
        );
        if(!isAvailable){
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
          owner_id: borrowerId
        }
      }, transaction
    );
    if(!isOwned){
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

export {
  checkBookAvailability,
  checkAlreadyBookBorrowedByUserId,
  isBookOwnedByBorrower, createBookRequest,
};