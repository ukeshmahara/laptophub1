import express from "express";
import { 
  getAllLaptops, 
  getLaptopById, 
  createLaptop, 
  updateLaptop, 
  deleteLaptop, 
  searchLaptops 
} from "../../controller/laptop/laptopController.js";
import { authenticateToken, requireAdmin } from "../../middleware/token-middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllLaptops);
router.get("/search", searchLaptops);
router.get("/:id", getLaptopById);

// Admin routes (require authentication and admin privileges)
router.post("/", authenticateToken, requireAdmin, createLaptop);
router.put("/:id", authenticateToken, requireAdmin, updateLaptop);
router.delete("/:id", authenticateToken, requireAdmin, deleteLaptop);

export default router; 