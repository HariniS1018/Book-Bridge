import {
  checkAlreadyBookBorrowedByUserId,
  createBookRequest,
  checkBookAvailability,
  isBookOwnedByBorrower,
  fetchListOfRequestedBooksByUserId,
} from "../models/bookExchangeModels.js";
import { withTransaction } from "../db/transactionHandler.js";


async function createBookRequestService(borrowerId, lenderId, bookId) {
    return withTransaction(async (transaction) => {
        const alreadyBorrowed = await checkAlreadyBookBorrowedByUserId(
          borrowerId,
          bookId,
          transaction
        );
        if(alreadyBorrowed){
            throw new Error("The Requested book is already borrowed by the user. So cannot request the same book again.");
        }
        
        const isAvailable = await checkBookAvailability(bookId, lenderId, transaction);
        if(isAvailable.availability_status !== "Available"){
            throw new Error("The requested book is not Available.")
        }
        
        const isOwned = await isBookOwnedByBorrower(bookId, borrowerId, transaction);
        if(isOwned){
            throw new Error("You already own this book. So you cannot request this book.")
        }

        const requestDetails = await createBookRequest(borrowerId, lenderId, bookId, transaction);
        if(!requestDetails){
            throw new Error("Error while requesting.")
        }
        
        console.log("[SERVICES] REQUEST DETAILS: ", requestDetails)
        return requestDetails;
    });
}

async function fetchListOfRequestedBooksByUserIdService(userId, uptoDate) {
  return withTransaction(async (transaction) => {
    const requestedBooks = await fetchListOfRequestedBooksByUserId(
      userId,
      uptoDate,
      transaction
    );
    if (!requestedBooks) {
      throw new Error("Error while fetching requested books.");
    }
    return requestedBooks;
  });
}

export { createBookRequestService, fetchListOfRequestedBooksByUserIdService };