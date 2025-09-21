import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For URL-encoded form data

import dbRoutes from './db/createTableRoutes.js';
app.use('/db', dbRoutes);

import { userAuthRoutes } from "./authentication/userAuthRoutes.js";
app.use("/userAuth", userAuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

