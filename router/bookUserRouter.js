import {Router} from "express";
import {createBookUser} from "../controller/bookUserController.js"

const router = Router();

router.post("/createbookuser", createBookUser); 

export default router;
