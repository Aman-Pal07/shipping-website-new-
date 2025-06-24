// import express from "express";
// import {
//   moveToCompleted,
//   getAllCompletedTransactions,
//   getCompletedTransactionsByPackage,
//   getMyCompletedTransactions,
//   updateAdminTrackingId,
//   updatePackageStatus,
// } from "../controllers/completedTransactionController";
// import { authenticateToken, isAdmin } from "../middlewares/authMiddleware";

const express = require("express");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  moveToCompleted,
  getAllCompletedTransactions,
  getCompletedTransactionsByPackage,
  getMyCompletedTransactions,
  updateAdminTrackingId,
  updatePackageStatus,
} = require("../controllers/completedTransactionController");

const router = express.Router();

// Move a transaction to completed
router.post(
  "/transactions/:id/complete",
  authenticateToken,
  isAdmin,
  moveToCompleted
);

// Get all completed transactions (admin only)
router.get(
  "/completed-transactions",
  authenticateToken,
  isAdmin,
  getAllCompletedTransactions
);

// Get completed transactions for the current user
router.get(
  "/completed-transactions/my",
  authenticateToken,
  getMyCompletedTransactions
);

// Get completed transactions for a specific package
router.get(
  "/completed-transactions/package/:packageId",
  authenticateToken,
  getCompletedTransactionsByPackage
);

// Update admin tracking ID for a completed transaction
router.patch(
  "/completed-transactions/:id/tracking",
  authenticateToken,
  isAdmin,
  updateAdminTrackingId
);

// Update package status
router.patch(
  "/completed-transactions/:id/status",
  authenticateToken,
  isAdmin,
  updatePackageStatus
);

module.exports = router;
