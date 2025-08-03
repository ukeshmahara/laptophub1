import express from "express";
import { 
  getAllOrders, 
  getOrdersByUserId, 
  getOrderById, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder, 
  getPendingOrders 
} from "../../controller/order/orderController.js";
import { authenticateToken, requireAdmin } from "../../middleware/token-middleware.js";

const router = express.Router();

// User routes (require authentication)
router.get("/user/:userId", authenticateToken, getOrdersByUserId);
router.get("/:id", authenticateToken, getOrderById);
router.post("/", authenticateToken, createOrder);

// Admin routes (require authentication and admin privileges)
router.get("/", authenticateToken, requireAdmin, getAllOrders);
router.get("/pending", authenticateToken, requireAdmin, getPendingOrders);
router.put("/:id/status", authenticateToken, requireAdmin, updateOrderStatus);
router.delete("/:id", authenticateToken, requireAdmin, deleteOrder);

export default router; 