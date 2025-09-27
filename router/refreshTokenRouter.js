import {Router} from "express";
import {createRefreshToken} from "../controller/refreshTokenController.js"

const router = Router();

router.post("/createrefreshtoken", createRefreshToken);

export default router;
