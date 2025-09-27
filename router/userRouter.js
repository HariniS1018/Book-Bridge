import {Router} from "express";
import {createUser} from "../controller/userController.js"

const router = Router();

router.post("/createuser", createUser); 

export default router;
