import app from "./App.js";
import { sequelize } from "./db/sequelize.js"
import models from "./models/index.js";
import { getPool, closePool } from "./db/dbUtils.js";

const PORT = process.env.PORT || 3000;

getPool();

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected!");
    return sequelize.sync({ force: true });
  })
  .then(() => {
    console.log("All models synced!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Error:", err);
});
sequelize.models = models;

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
