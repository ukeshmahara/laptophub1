import express from "express";
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUserProfile, 
  deleteUser, 
  getUserProfile 
} from "../../controller/user/userController.js";
import { authenticateToken, requireAdmin } from "../../middleware/token-middleware.js";

const router = express.Router();

// Public routes
router.post("/", createUser); // Registration

// User routes (require authentication)
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

// Admin routes (require authentication and admin privileges)
router.get("/", authenticateToken, requireAdmin, getAllUsers);
router.get("/:id", authenticateToken, requireAdmin, getUserById);
router.put("/:id", authenticateToken, requireAdmin, updateUserProfile);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

export default router;
