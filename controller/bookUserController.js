import models from "../models/index.js";
const { BookUser } = models;

export const createBookUser = async (req, res) => {
  try {
    const { id, book_id, owner_id, availability_status } = req.body;
    const bu = await BookUser.create({ id, book_id, owner_id, availability_status });
    res.status(201).json(bu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
