import express from "express";
import { 
  login, 
  getCurrentUser, 
  register 
} from "../../controller/auth/authController.js";
import { authenticateToken } from "../../middleware/token-middleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes (require authentication)
router.get("/me", authenticateToken, getCurrentUser);

export default router;
