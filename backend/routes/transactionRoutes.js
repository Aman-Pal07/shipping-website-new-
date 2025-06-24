// import express from "express";
// import { authenticateToken, isAdmin } from "../middlewares/authMiddleware";
// import {
//   getAllTransactions,
//   getUserTransactions,
//   getTransactionById,
//   createPackageStatusTransaction,
//   updateTransaction,
//   deleteTransaction,
//   updateTransactionDimensions,
//   updateTransactionVolumetricWeight,
//   updateTransactionFields,
// } from "../controllers/transactionController";

const express = require("express");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllTransactions,
  getUserTransactions,
  getTransactionById,
  createPackageStatusTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionDimensions,
  updateTransactionVolumetricWeight,
  updateTransactionFields,
  getTransactionsByPackageId,
} = require("../controllers/transactionController");

const router = express.Router();

// Get all transactions (admin only)
router.get("/", authenticateToken, isAdmin, getAllTransactions);

// Get user's transactions
router.get("/my", authenticateToken, getUserTransactions);

// Get transaction by ID
router.get("/:id", authenticateToken, getTransactionById);

// Create a transaction for package status change
router.post(
  "/package-status",
  authenticateToken,
  createPackageStatusTransaction
);

// Update transaction amount and status (admin only)
router.put("/:id", authenticateToken, isAdmin, updateTransaction);

// Delete a transaction (admin only)
router.delete("/:id", authenticateToken, isAdmin, deleteTransaction);

// Update transaction dimensions (admin only)
router.put(
  "/:id/dimensions",
  authenticateToken,
  isAdmin,
  updateTransactionDimensions
);

// Update transaction volumetric weight (admin only)
router.put(
  "/:id/volumetric-weight",
  authenticateToken,
  isAdmin,
  updateTransactionVolumetricWeight
);

// Update multiple transaction fields at once (admin only)
router.put(
  "/:id/update-fields",
  authenticateToken,
  isAdmin,
  updateTransactionFields
);

// Get all transactions for a specific package
router.get(
  "/package/:packageId",
  authenticateToken,
  getTransactionsByPackageId
);

module.exports = router;
