import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Access token required" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: "Admin access required" 
    });
  }
  next();
};

// Middleware to check if user is authenticated
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  }
  next();
};
