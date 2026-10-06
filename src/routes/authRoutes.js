import { Router } from "express";
import { loginUser } from "../controllers/authController.js";

const router = Router();

router.post('/login', loginUser); // 👈 El login vive exclusivamente aquí

export default router;