// import express from "express";
// import { authenticateToken, isAdmin } from "../middlewares/authMiddleware";
// import {
//   getDashboardStats,
//   getSystemLogs,
//   updateSystemSettings,
//   manageInsurancePlans,
//   updateTermsAndConditions,
// } from "../controllers/adminController";

const express = require("express");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getDashboardStats,
  getSystemLogs,
  updateSystemSettings,
  manageInsurancePlans,
  updateTermsAndConditions,
} = require("../controllers/adminController");

const router = express.Router();

// Get dashboard statistics for admin
router.get("/stats", authenticateToken, isAdmin, getDashboardStats);

// Get system logs (admin only)
router.get("/logs", authenticateToken, isAdmin, getSystemLogs);

// Update system settings (admin only)
router.put("/settings", authenticateToken, isAdmin, updateSystemSettings);

// Manage insurance plans (admin only)
router.put(
  "/insurance-plans",
  authenticateToken,
  isAdmin,
  manageInsurancePlans
);

// Update terms and conditions (admin only)
router.put("/terms", authenticateToken, isAdmin, updateTermsAndConditions);

module.exports = router;
