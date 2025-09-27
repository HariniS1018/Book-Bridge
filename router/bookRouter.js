import {Router} from "express";
import {createBook} from "../controller/bookController.js"

const router = Router();

router.post("/createbook", createBook); 

export default router;
