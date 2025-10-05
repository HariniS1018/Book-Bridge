import app from "./App.js";
import { sequelize } from "./db/sequelize.js"
import models from "./models/index.js";

const PORT = process.env.PORT || 3000;


sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected!");
    return sequelize.sync({ alter: true });
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

//- Triggered when you press Ctrl+C in the terminal. - Closes Sequelize’s DB connection pool. - Exits with code 0 (success).
process.on("SIGINT", async () => {
  console.log("SIGINT signal received. Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

// - Triggered when the OS or a process manager (like Docker or PM2) tells your app to shut down.
// - Closes Sequelize’s DB connection pool. - Exits with code 0 (success).
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

// - Triggered when your code throws an error that’s not caught anywhere.
// - Logs the error and stack trace. - Closes DB connections and exits with code 1 (failure).
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err.message, err.stack);
  await sequelize.close();
  process.exit(1);
});

// - Triggered when a Promise is rejected but not caught with .catch() or try/catch.
// - Logs the reason and promise. - Cleans up and exits.
process.on("unhandledRejection", async (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  await sequelize.close();
  process.exit(1);
});
