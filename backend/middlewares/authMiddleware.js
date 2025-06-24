const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Package = require("../models/Package");

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    console.log('Auth Headers:', req.headers);
    
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    
    if (!authHeader) {
      console.error('No authorization header found');
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    console.log('Extracted Token:', token ? 'Token exists' : 'No token found');

    if (!token) {
      console.error('No token found in authorization header');
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || "somesecrettoken";
    console.log('Using JWT_SECRET:', JWT_SECRET ? 'Secret exists' : 'No secret found');
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded Token:', decoded);
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return res.status(401).json({ 
        message: "Token is not valid",
        error: jwtError.message 
      });
    }

    if (!decoded.id) {
      console.error('No user ID in token');
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Convert string ID to ObjectId
    let userId;
    try {
      userId = new mongoose.Types.ObjectId(decoded.id);
      console.log('User ID from token:', userId);
    } catch (idError) {
      console.error('Invalid user ID format in token:', decoded.id);
      return res.status(401).json({ 
        message: "Invalid user ID format in token",
        error: idError.message 
      });
    }

    const user = await User.findById(userId).select("-password");
    console.log('Found user:', user ? 'User exists' : 'User not found');

    if (!user) {
      console.error('User not found in database');
      return res.status(401).json({ message: "User not found" });
    }

    console.log('Authentication successful for user:', {
      id: user._id,
      email: user.email,
      role: user.role
    });
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      message: "Authentication failed",
      error: error.message 
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized as an admin" });
  }

  next();
};

/**
 * Middleware to check if user owns the package or is admin
 */
const isPackageOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // If user is admin, allow access
    if (req.user.role === "admin") {
      return next();
    }

    const packageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (pkg.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this package" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isPackageOwnerOrAdmin,
};
