import {
  createBookRequestService,
  fetchListOfRequestedBooksByUserIdService,
  updateBookRequestStatusByLenderService,
  updateExchangeDatesService,
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

async function updateExchangeDates(req, res, next) {
  try {
    const lenderId = req.user.userId;
    const  borrowerId = req.body.borrowerId;
    const bookId = req.body.bookId;
    const dueDate = req.body.dueDate;
    const returnedDate = req.body.returnedDate;

    if (!borrowerId) {
      throw new Error("borrowerId is not provided.");
    }
    if (!bookId){
      throw new Error("bookId is not provided");
    }

    if (!dueDate && !returnedDate) {
      throw new Error("Please provide a dueDate (for borrowing) or returnedDate (for returning).");
    }
     if (dueDate && returnedDate) {
      throw new Error("You cannot update borrow/due date and returned date together. Please update them separately.");
    }

    const updatedRowsCount = await updateExchangeDatesService(
      lenderId,
      borrowerId,
      bookId,
      dueDate,
      returnedDate
    );

    res.status(200).json({ updatedRowsCount });
  } catch (error) {
    next(error);
  }
}


export {
  createBookRequest,
  fetchListOfRequestedBooks,
  updateBookRequestStatus,
  updateExchangeDates,
};