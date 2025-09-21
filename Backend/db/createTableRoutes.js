import express from "express";
const router = express.Router();

import { createTables } from "../db/createTableModels.js";

router.post("/createTables", createTables);

export default router;
