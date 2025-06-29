const { Request, Response } = require("express");
const User = require("../models/User");
const { promisify } = require("util");
const fs = require("fs");
const getFileSize = promisify(fs.stat);
const { asyncHandler } = require("../middlewares/errorMiddleware");
const {
  generateVerificationCode,
  sendVerificationEmail,
  sendEmailUpdateVerification,
  sendPasswordResetEmail,
  sendVerificationCode,
} = require("../utils/sendEmail");

/**
 * Resend verification email
 * @route POST /api/auth/resend-verification
 */
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
    });
  }
});
const crypto = require("crypto");

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const registerUser = asyncHandler(async (req, res) => {
  console.log("=== Registration Request Received ===");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));

  try {
    console.log("Request body:", req.body);
    
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Enhanced email check with detailed logging
    console.log("\n=== Email Check Debug ===");
    console.log("Email being checked (raw):", JSON.stringify(email));
    console.log("Email length:", email.length);
    console.log(
      "Email character codes:",
      [...email].map((c) => c.charCodeAt(0))
    );

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    // Check if user exists (case-insensitive)
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (existingUser) {
      console.log("Registration failed - Email already exists:", email);
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        error: "A user with this email already exists."
      });
    }

    // Create user
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phoneNumber: phoneNumber.trim(),
      role: "user",
      isVerified: false
    });
    
    console.log("Creating new user:", {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    newUser.verificationCode = verificationCode;
    newUser.verificationCodeExpires = verificationCodeExpires;
    
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationCode);

    console.log("User registered successfully:", {
      id: newUser._id,
      email: newUser.email,
    });

    // Generate token
    const token = newUser.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Unexpected error in registerUser:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during registration",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Verify user email with verification code
 * @route POST /api/auth/verify-email
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    res.status(400);
    throw new Error("Email and verification code are required");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if user is already verified
  if (user.isVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }

  // Check if verification code is valid and not expired
  if (
    user.verificationCode !== verificationCode ||
    !user.verificationCodeExpires ||
    user.verificationCodeExpires < new Date()
  ) {
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  // Update user as verified and clear verification code
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  // Generate token
  const token = user.generateAuthToken();

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    documents: user.documents,
    token,
    message: "Email verified successfully",
  });
});

/**
 * Login user
 * @route POST /api/auth/login
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if email is verified
  if (!user.isVerified) {
    // Generate a new verification code if the old one expired
    if (
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < new Date()
    ) {
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();

      // Send new verification email
      try {
        await sendVerificationEmail(email, verificationCode);
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    }

    return res.status(403).json({
      message:
        "Email not verified. Please check your email for verification code.",
      requiresVerification: true,
      email: user.email,
    });
  }

  // Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    // In a real implementation, you would generate and send a 2FA code
    // For now, we'll just indicate that 2FA is required
    return res.status(200).json({
      requiresTwoFactor: true,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      documents: user.documents,
    });
  }

  // Generate token
  const token = user.generateAuthToken();

  // Safely get document info if documents array exists and has items
  const documentInfo = user.documents && user.documents.length > 0 
    ? {
        documentType: user.documents[0].documentType,
        documentImage: user.documents[0].documentImage
      }
    : {};

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    ...documentInfo,  // Spread the document info if it exists
    token,
  });
});

/**
 * Request email update with OTP verification
 * @route POST /api/auth/request-email-update
 */
const requestEmailUpdate = asyncHandler(async (req, res) => {
  console.log('=== Request Email Update ===');
  console.log('Request body:', req.body);
  console.log('Authenticated user ID:', req.user?._id);

  const { email } = req.body;
  const userId = req.user?._id;

  if (!email || !email.includes("@")) {
    console.log('Invalid email format:', email);
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (!userId) {
    console.log('No user ID found in request');
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    // Check if email is already in use by another user
    console.log('Checking if email is already in use:', email);
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      console.log('Email already in use by another account:', email);
      return res.status(400).json({
        success: false,
        message: "This email is already in use by another account",
      });
    }

    // Generate OTP
    const otp = generateVerificationCode();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    console.log('Generated OTP for email update:', { email, otp, otpExpiry });

    try {
      // Save OTP to user document
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          emailUpdate: {
            newEmail: email,
            otp,
            otpExpiry,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error('Failed to update user with OTP');
        return res.status(500).json({
          success: false,
          message: 'Failed to process email update request',
        });
      }

      console.log('User document updated with OTP');

      // Send verification email
      console.log('Sending verification email to:', email);
      await sendEmailUpdateVerification(email, otp);
      console.log('Verification email sent successfully');

      res.status(200).json({
        success: true,
        message: 'Verification code sent to your new email address',
        expiresIn: '10 minutes',
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error('Error in requestEmailUpdate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process email update request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * Verify email update with OTP
 * @route POST /api/auth/verify-email-update
 */
const verifyEmailUpdate = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const userId = req.user?._id;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if there's a pending email update
    if (!user.emailUpdate || user.emailUpdate.newEmail !== email) {
      return res.status(400).json({
        success: false,
        message: "No pending email update request found for this email",
      });
    }

    // Check if OTP is expired
    if (user.emailUpdate.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.emailUpdate.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Update user's email
    user.email = email;
    user.emailUpdate = undefined; // Clear the update request
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error in verifyEmailUpdate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email update",
    });
  }
});

const verifyTwoFactor = asyncHandler(async (req, res) => {
  const { userId, twoFactorCode } = req.body;

  if (!userId || !twoFactorCode) {
    res.status(400);
    throw new Error("User ID and 2FA code are required");
  }

  // Find user
  const user = await User.findById(userId);

  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    res.status(401);
    throw new Error("Invalid user or 2FA not enabled");
  }

  // In a real implementation, you would verify the 2FA code against the user's secret
  // For now, we'll just accept any code (this should be replaced with actual verification)
  const isValidCode = twoFactorCode === "123456"; // Dummy validation

  if (!isValidCode) {
    res.status(401);
    throw new Error("Invalid 2FA code");
  }

  // Generate JWT token
  const token = user.generateAuthToken();

  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    documentType: user.documents[0]?.documentType,
    documentImage: user.documents[0]?.documentImage,
    token,
  });
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

/**
 * Logout user
 * @route POST /api/auth/logout
 */
const logoutUser = asyncHandler(async (req, res) => {
  // In a stateless JWT authentication system, the client is responsible for removing the token
  // The server doesn't need to do anything special for logout
  res.status(200).json({ message: "Logged out successfully" });
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Forgot password - Send reset password email
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal if the email exists or not
      return res.status(200).json({
        success: true,
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (10 minutes from now)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        resetUrl,
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500);
      throw new Error("Email could not be sent");
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500);
    throw new Error("Server error");
  }
});

/**
 * @route PUT /api/auth/reset-password/:resetToken
 * @desc Reset password
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  console.log('=== Reset Password Request ===');
  console.log('Reset token:', req.params.resetToken);
  console.log('Request body:', req.body);

  try {
    if (!req.params.resetToken) {
      console.error('No reset token provided');
      return res.status(400).json({
        success: false,
        message: 'Reset token is required',
      });
    }

    if (!req.body.password) {
      console.error('No password provided');
      return res.status(400).json({
        success: false,
        message: 'New password is required',
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    console.log('Hashed token:', resetPasswordToken);

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.error('Invalid or expired reset token');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    try {
      // Set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      console.log('Password updated for user:', user.email);

      // Generate token
      const token = user.generateAuthToken();

      // Create HTTP-only cookie with token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } catch (saveError) {
      console.error('Error saving new password:', saveError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update password',
        error: process.env.NODE_ENV === 'development' ? saveError.message : undefined,
      });
    }
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  requestEmailUpdate,
  verifyEmailUpdate,
  verifyTwoFactor,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  resendVerification,
};
