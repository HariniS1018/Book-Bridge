import {
  checkAlreadyBookBorrowedByUserId,
  createBookRequest,
  checkBookAvailability,
  isBookOwnedByBorrower,
  fetchListOfRequestedBooksByUserId,
  updateBookRequestStatusByLender,
  getRequestStatusByLender,
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

async function updateBookRequestStatusByLenderService(lenderId, borrowerId, bookId, newStatus) {
  return withTransaction(async (transaction) => {
    console.log("[SERVICES] STATUS: ", newStatus);
    const currentStatus = await getRequestStatusByLender(lenderId, borrowerId, bookId, transaction);
    if (currentStatus === null) {
      throw new Error("No matching book exchange record found.");
    }
    else if (currentStatus === "Pending" && (newStatus !== "Accepted" && newStatus !== "Rejected")) {
      throw new Error("Pending requests can be marked either as accepted or rejected.");
    }
    else if (currentStatus === "Accepted" && newStatus !== "Returned") {
      throw new Error("Accepted requests can only be marked as returned.");
    }
    else if (currentStatus === "Rejected" || currentStatus === "Returned") {
      throw new Error(`Requests with status '${currentStatus}' cannot be updated further.`);
    }
    else if (currentStatus === newStatus) {
      throw new Error(`The request is already marked as '${newStatus}'.`);
    }
    else if (currentStatus === "Overdue" && newStatus !== "Returned") {
      throw new Error("Can change status from 'Overdue' only to 'Returned'.");
    }
    
    const updatedRowsCount = await updateBookRequestStatusByLender(lenderId, borrowerId, bookId, newStatus, transaction);
    return updatedRowsCount;
  });
}

export { createBookRequestService, fetchListOfRequestedBooksByUserIdService, updateBookRequestStatusByLenderService };