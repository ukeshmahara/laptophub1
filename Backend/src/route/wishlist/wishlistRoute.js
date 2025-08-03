import express from "express";
import { 
  getUserWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  checkWishlistItem 
} from "../../controller/wishlist/wishlistController.js";
import { authenticateToken } from "../../middleware/token-middleware.js";

const router = express.Router();

// All wishlist routes require authentication
router.get("/user/:userId", authenticateToken, getUserWishlist);
router.post("/", authenticateToken, addToWishlist);
router.delete("/:userId/:laptopId", authenticateToken, removeFromWishlist);
router.get("/check/:userId/:laptopId", authenticateToken, checkWishlistItem);

export default router; 