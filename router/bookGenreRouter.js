import {Router} from "express";
import {createBookGenre} from "../controller/bookGenreController.js"

const router = Router();

router.post("/creategenre", createBookGenre); 

export default router;
