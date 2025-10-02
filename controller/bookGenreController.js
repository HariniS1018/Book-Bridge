import models from "../models/index.js";
const { BookGenre } = models;

export const createBookGenre = async (req, res) => {
  try {
    const { book_id, genre } = req.body;
    const bg = await BookGenre.create({ book_id, genre });
    res.status(201).json(bg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
