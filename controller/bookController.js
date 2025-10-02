import models from "../models/index.js";
const { Book } = models;

export const createBook = async (req, res) => {
  try {
    const { book_id,book_name, author_name, publication_year, isbn } = req.body;
    const book = await Book.create({book_id,book_name, author_name, publication_year, isbn });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
