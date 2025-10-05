import { withTransaction } from "../db/transactionHandler.js";
import { getAllBooksModels } from "../models/bookModels.js";

async function getAllBooksServices() {
  return withTransaction(async (transaction) => {
    const books = await getAllBooksModels(transaction);
    return books;
  });
}

export { getAllBooksServices };