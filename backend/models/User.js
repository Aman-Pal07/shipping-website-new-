// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    documents: [
      {
        documentType: {
          type: String,
          enum: ["PAN Card", "Aadhar Card", "Passport"],
          required: true,
        },
        documentImage: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpires: {
      type: Date,
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
    },
    addressLine1: {
      type: String,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v) {
          // Basic validation for phone number (10 digits, optional + at start)
          return /^[+]?[0-9]{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    emailUpdate: {
      newEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },
      otp: String,
      otpExpiry: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const user = this;
  const JWT_SECRET = process.env.JWT_SECRET || "somesecrettoken";

  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Add virtual for id
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included in toJSON output
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
    delete ret.twoFactorSecret;
    delete ret.verificationCode;
    delete ret.verificationCodeExpires;
    delete ret.emailUpdate;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
