import express from "express";
import sequelize from "./init/db.js";
import models from "./models/index.js";

import userRouter from "./router/userRouter.js";
import refreshTokenRouter from "./router/refreshTokenRouter.js";
import bookRouter from "./router/bookRouter.js";
import bookGenreRouter from "./router/bookGenreRouter.js";
import bookUserRouter from "./router/bookUserRouter.js";
import bookExchangeRouter from "./router/bookExchangeRouter.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Authenticate & sync first
sequelize.authenticate()
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

// Routes
app.use("/users", userRouter);
app.use("/refresh-tokens", refreshTokenRouter);
app.use("/books", bookRouter);
app.use("/book-genres", bookGenreRouter);
app.use("/books-users", bookUserRouter);
app.use("/books-exchanged", bookExchangeRouter);

export default app;
