const { Request, Response } = require("express");
const multer = require("multer");
const User = require("../models/User");
const { asyncHandler } = require("../middlewares/errorMiddleware");
const {
  generateVerificationCode,
  sendVerificationEmail,
  sendEmailUpdateVerification,
} = require("../utils/sendEmail");
const { uploadToCloudinary } = require("../utils/cloudinary");

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const registerUser = asyncHandler(async (req, res) => {
  console.log('=== Registration Request Received ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
  
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { firstName, lastName, email, password, documentTypes } = req.body;

    // Handle file uploads
    const files = req.files?.documents || [];

    // Parse document types
    let documentTypesArray = [];
    try {
      documentTypesArray = Array.isArray(documentTypes)
        ? documentTypes
        : documentTypes
        ? JSON.parse(documentTypes)
        : [];
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Invalid document types format",
      });
    }

    // Validate document count
    if (files.length === 0 || files.length > 2) {
      return res.status(400).json({
        success: false,
        message: "Please upload 1-2 documents",
      });
    }

    // Validate document types
    if (files.length !== documentTypesArray.length) {
      return res.status(400).json({
        success: false,
        message: "Mismatch between number of documents and document types",
      });
    }

    // Validate document types
    const validDocumentTypes = ["PAN Card", "Aadhar Card", "Passport"];
    for (const doc of documentTypesArray) {
      if (!validDocumentTypes.includes(doc.documentType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid document type: ${
            doc.documentType
          }. Must be one of: ${validDocumentTypes.join(", ")}`,
        });
      }
    }

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
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

    try {
      // Log all users in database for debugging
      const allUsers = await User.find({}, "email");
      console.log("\n=== All users in database ===");
      console.log(`Total users: ${allUsers.length}`);
      allUsers.forEach((u, i) => {
        console.log(`User ${i + 1}:`);
        console.log(`- ID: ${u._id}`);
        console.log(`- Email: ${u.email}`);
        console.log(`- Email length: ${u.email?.length || "N/A"}`);
        console.log(`- Created: ${u.createdAt}`);
        console.log("---");
      });

      // Check with exact match
      const exactMatch = await User.findOne({ email });
      console.log("\n=== Exact match check ===");
      console.log("Match found:", exactMatch ? "YES" : "NO");

      if (exactMatch) {
        const debugInfo = {
          emailProvided: email,
          emailInDb: exactMatch.email,
          matchType: "exact",
          comparison: email === exactMatch.email ? "exact match" : "different",
          lengthComparison:
            email.length === exactMatch.email.length ? "same" : "different",
          codes: {
            provided: [...email].map((c) => c.charCodeAt(0)),
            inDb: [...exactMatch.email].map((c) => c.charCodeAt(0)),
          },
          userId: exactMatch._id,
          userCreatedAt: exactMatch.createdAt,
        };

        console.log("Debug info:", JSON.stringify(debugInfo, null, 2));

        return res.status(400).json({
          success: false,
          message: "A user with this email already exists",
          error: {
            message: "Email already registered",
            details: debugInfo,
          },
        });
      }

      // If no exact match, check case-insensitive
      const caseInsensitiveMatch = await User.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });

      console.log("\n=== Case-insensitive check ===");
      console.log("Match found:", caseInsensitiveMatch ? "YES" : "NO");

      if (caseInsensitiveMatch) {
        const debugInfo = {
          emailProvided: email,
          emailInDb: caseInsensitiveMatch.email,
          matchType: "case-insensitive",
          comparison:
            email.toLowerCase() === caseInsensitiveMatch.email?.toLowerCase()
              ? "case-insensitive match"
              : "different",
          lengthComparison:
            email.length === caseInsensitiveMatch.email.length
              ? "same"
              : "different",
          codes: {
            provided: [...email].map((c) => c.charCodeAt(0)),
            inDb: [...caseInsensitiveMatch.email].map((c) => c.charCodeAt(0)),
            providedLower: [...email.toLowerCase()].map((c) => c.charCodeAt(0)),
            inDbLower: [...caseInsensitiveMatch.email.toLowerCase()].map((c) =>
              c.charCodeAt(0)
            ),
          },
          userId: caseInsensitiveMatch._id,
          userCreatedAt: caseInsensitiveMatch.createdAt,
        };

        console.log("Debug info:", JSON.stringify(debugInfo, null, 2));

        return res.status(400).json({
          success: false,
          message:
            "A user with this email already exists (case-insensitive match)",
          error: {
            message: "Email already registered",
            details: debugInfo,
          },
        });
      }

      console.log("\n=== Email Check Result ===");
      console.log(`No user found with email: ${email}`);
    } catch (error) {
      console.error("Error checking for existing user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return res.status(500).json({
        success: false,
        message: "Error checking email existence",
        error: errorMessage,
      });
    }

    try {
      // Upload documents to Cloudinary
      console.log("Uploading documents to Cloudinary...");
      const uploadedDocuments = [];

      if (!req.files || !req.files.documents) {
        console.error('No files were uploaded');
        return res.status(400).json({
          success: false,
          message: 'No documents were uploaded. Please upload 1-2 documents.',
        });
      }

      for (let i = 0; i < files.length; i++) {
        try {
          const documentType = documentTypesArray[i]?.documentType;
          if (!documentType) {
            throw new Error("Document type is required for each file");
          }
          const file = files[i];
          const documentImageUrl = await uploadToCloudinary(file);

          if (!documentImageUrl) {
            throw new Error("Failed to upload document to Cloudinary");
          }
          uploadedDocuments.push({
            documentType,
            documentImage: documentImageUrl,
            uploadedAt: new Date(),
          });
        } catch (error) {
          console.error("Error uploading document:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error(`Document upload failed: ${errorMessage}`, error.stack);
          return res.status(500).json({
            success: false,
            message: 'Document upload failed',
            error: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
        }
      }

      console.log("Documents uploaded to Cloudinary");

      // Generate verification code
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user with hashed password
      const user = new User({
        firstName,
        lastName,
        email,
        password, // The password will be hashed by the pre-save hook in the User model
        documents: uploadedDocuments,
        role: "user",
        isVerified: false,
        verificationCode,
        verificationCodeExpires,
      });

      console.log("Saving user to database...");
      const savedUser = await user.save();
      console.log("User saved successfully:", savedUser._id);

      // Send verification email in the background
      sendVerificationEmail(email, verificationCode)
        .then(() => {
          console.log("Verification email sent to:", email);
        })
        .catch((emailError) => {
          console.error("Error sending verification email:", emailError);
          // Log the error but don't fail the request
        });

      // Return success response
      return res.status(201).json({
        success: true,
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        documents: savedUser.documents,
        message:
          "Registration successful! Please check your email for verification code.",
        requiresVerification: true,
      });
    } catch (error) {
      console.error("Error during registration:", error);

      // Handle duplicate key error (e.g., duplicate email)
      if (error && error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
          error: "A user with this email already exists.",
        });
      }

      // Handle validation errors
      if (error && error.name === "ValidationError" && error.message) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: String(error.message),
        });
      }

      // For all other errors
      return res.status(500).json({
        success: false,
        message: "Registration failed. Please try again.",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
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

  res.status(200).json({
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
 * Request email update with OTP verification
 * @route POST /api/auth/request-email-update
 */
const requestEmailUpdate = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userId = req.user?._id;

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  // Check if email is already in use by another user
  const existingUser = await User.findOne({ email, _id: { $ne: userId } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "This email is already in use by another account",
    });
  }

  try {
    // Generate OTP
    const otp = generateVerificationCode();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to user document
    await User.findByIdAndUpdate(userId, {
      emailUpdate: {
        newEmail: email,
        otp,
        otpExpiry,
      },
    });

    // Send verification email
    await sendEmailUpdateVerification(email, otp);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your new email address",
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("Error in requestEmailUpdate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process email update request",
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

module.exports = {
  upload,
  registerUser,
  verifyEmail,
  loginUser,
  requestEmailUpdate,
  verifyEmailUpdate,
  verifyTwoFactor,
  getCurrentUser,
  logoutUser,
};
