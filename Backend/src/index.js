import express from "express";
import bodyParser from "body-parser";
import { db } from "./database/index.js";
import { 
  userRouter, 
  authRouter, 
  laptopRouter, 
  orderRouter, 
  wishlistRouter, 
  uploadRouter 
} from "./route/index.js";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/token-middleware.js";
import { createUploadsFolder } from "./security/helper.js";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads'));

// Public routes (no authentication required)
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/laptops", laptopRouter);

// Protected routes (require authentication)
app.use("/api/orders", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/file", uploadRouter);

// Create uploads folder
createUploadsFolder();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Server is running", 
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Something went wrong!" 
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
  db(); // Connect to database
});
