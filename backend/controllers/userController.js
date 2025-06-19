// import User from "../models/User";
// import { asyncHandler } from "../middlewares/errorMiddleware";

const User = require("../models/User");
const { asyncHandler } = require("../middlewares/errorMiddleware");

/**
 * Get all users (admin only)
 * @route GET /api/users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
const getUserById = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  // Only admins can view other users' profiles
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error("Not authorized to view this user");
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

/**
 * Update user details
 * @route PUT /api/users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  // Only the user themselves or an admin can update the profile
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error("Not authorized to update this user");
  }

  const { 
    email, 
    firstName, 
    lastName, 
    addressLine1, 
    addressLine2, 
    city, 
    state, 
    pincode, 
    phoneNumber 
  } = req.body;

  // Fields that can be updated by the user
  const updateData = {};
  if (email) updateData.email = email;
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1;
  if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2;
  if (city) updateData.city = city;
  if (state) updateData.state = state;
  if (pincode) updateData.pincode = pincode;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;

  // Additional fields that only admins can update
  if (req.user.role === "admin" && req.body.role) {
    updateData.role = req.body.role;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

/**
 * Delete user (admin only)
 * @route DELETE /api/users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.status(200).json({ message: "User removed" });
});

/**
 * Update user role (admin only)
 * @route PUT /api/users/:id/role
 */
const updateUserRole = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const { role } = req.body;

  if (!role || !["user", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role value");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { role } },
    { new: true }
  ).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

/**
 * Enable/disable two-factor authentication
 * @route PUT /api/users/:id/two-factor
 */
const updateTwoFactor = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  // Only the user themselves can update their 2FA settings
  if (req.user._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error("Not authorized to update 2FA settings");
  }

  const { twoFactorEnabled, twoFactorSecret } = req.body;

  const updateData = {
    twoFactorEnabled,
  };

  if (twoFactorSecret) {
    updateData.twoFactorSecret = twoFactorSecret;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  updateTwoFactor,
};
