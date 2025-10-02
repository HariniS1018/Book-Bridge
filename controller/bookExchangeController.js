import models from "../models/index.js";
const { BookExchange } = models;

export const createBookExchange = async (req, res) => {
  try {
    const { exchange_id,borrower_id, lender_id, book_id, status } = req.body;
    const be = await BookExchange.create({ exchange_id,borrower_id, lender_id, book_id, status });
    res.status(201).json(be);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
