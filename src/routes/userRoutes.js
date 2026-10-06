import { Router } from "express";
import { registerUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/register', registerUser); // 👈 El registro vive aquí
router.get('/', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);

export default router;