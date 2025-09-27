import {Router} from "express";
import {createBookExchange} from "../controller/bookExchangeController.js"

const router = Router();

router.post("/createbookexchange", createBookExchange); 

export default router;
