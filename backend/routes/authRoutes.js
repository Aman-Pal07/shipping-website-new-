const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  registerUser,
  loginUser,
  verifyTwoFactor,
  verifyEmail,
  getCurrentUser,
  logoutUser,
  upload,
  requestEmailUpdate,
  verifyEmailUpdate,
  forgotPassword,
  resetPassword,
  resendVerification,
  validateFileSize
} = require('../controllers/authController');

const router = express.Router();

// Register a new user (with single document upload)
router.post(
  "/register",
  upload.single('documents'),
  validateFileSize,
  registerUser
);

// Login a user
router.post("/login", loginUser);

// Verify email with verification code
router.post("/verify-email", verifyEmail);

// Verify two-factor authentication
router.post("/verify-2fa", verifyTwoFactor);

// Get current user profile
router.get("/me", authenticateToken, getCurrentUser);

// Logout user
router.post("/logout", authenticateToken, logoutUser);

// Request email update with OTP
router.post("/request-email-update", authenticateToken, requestEmailUpdate);

// Verify email update with OTP
router.post("/verify-email-update", authenticateToken, verifyEmailUpdate);

// Forgot password - Send reset link
router.post("/forgot-password", forgotPassword);

// Resend verification email
router.post("/resend-verification", resendVerification);

// Reset password with token
router.post("/reset-password/:token", resetPassword);

module.exports = router;
