import { createBookRequestService } from "../services/bookExchangeServices.js";


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

export { createBookRequest };