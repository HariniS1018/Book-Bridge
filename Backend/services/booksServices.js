import { withTransaction } from "../db/transactionHandler.js";
import { getAllBooksModels } from "../models/booksModels.js";

async function getAllBooksServices() {
  return withTransaction(async (transaction) => {
    const books = await getAllBooksModels(transaction);
    return books;
  });
}

export { getAllBooksServices };