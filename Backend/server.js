import app from "./app.js";
import { getPool, closePool } from "./db/dbUtils.js";

const PORT = process.env.PORT || 3000;

getPool();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handlers
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down gracefully...");
  closePool();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");
  closePool();
  process.exit(0);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err.message, err.stack);
  await closePool();
  process.exit(1);
});

process.on("unhandledRejection", async (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  await closePool();
  process.exit(1);
});
