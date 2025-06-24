// import express from "express";
// import { authenticateToken, isAdmin } from "../middlewares/authMiddleware";
// import {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   updateUserRole,
//   updateTwoFactor,
// } from "../controllers/userController";

const express = require("express");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  updateTwoFactor,
} = require("../controllers/userController");

const router = express.Router();

// Get all users (admin only)
router.get("/", authenticateToken, isAdmin, getAllUsers);

// Get user by ID
router.get("/:id", authenticateToken, getUserById);

// Update user details
router.put("/:id", authenticateToken, updateUser);

// Delete user (admin only)
router.delete("/:id", authenticateToken, isAdmin, deleteUser);

// Update user role (admin only)
router.put("/:id/role", authenticateToken, isAdmin, updateUserRole);

// Enable/disable two-factor authentication
router.put("/:id/two-factor", authenticateToken, updateTwoFactor);

module.exports = router;
