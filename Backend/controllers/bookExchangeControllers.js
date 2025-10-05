import {
  createBookRequestService,
  fetchListOfRequestedBooksByUserIdService,
  updateBookRequestStatusByLenderService,
} from "../services/bookExchangeServices.js";


async function createBookRequest(req, res, next) {
    try{
        const borrowerId = req.user.userId;
        const lenderId = req.body.lenderId;
        const bookId = req.body.bookId;
        const requestDetails = await createBookRequestService(borrowerId, lenderId, bookId);
        res.status(201).json(requestDetails);
    }
    catch(error){
        next(error);
    }
}


async function fetchListOfRequestedBooks(req, res, next) {
    try {
        const userId = req.user.userId;
        const today = new Date();
        const requestedBooks = await fetchListOfRequestedBooksByUserIdService(userId, today);
        res.status(200).json(requestedBooks);
    } catch (error) {
      next(error);
    }
}


async function updateBookRequestStatus(req, res, next) {
    try {
        const lenderId = req.user.userId;
        const borrowerId = req.body.borrowerId;
        const bookId = req.body.bookId;
        const newStatus = req.body.newStatus;

        const validStatuses = ["Accepted", "Rejected", "Returned"];
        if (!validStatuses.includes(newStatus)) {
          throw new Error(
            "Invalid status. Valid statuses are: " + validStatuses.join(", ")
          );
        }
        
        const updatedRowsCount = await updateBookRequestStatusByLenderService(lenderId, borrowerId, bookId, newStatus);
        res.status(200).json({ updatedRowsCount });
    } catch (error) {
        next(error);
    }
}

export {
  createBookRequest,
  fetchListOfRequestedBooks,
  updateBookRequestStatus,
};