// import express from "express";
// import { authenticateToken, isAdmin } from "../middlewares/authMiddleware";
// import {
//   createRazorpayOrder,
//   verifyRazorpayPayment,
//   handleWebhook,
//   getUserTransactions,
//   getAllTransactions,
//   getRazorpayKey,
//   getTransactionOrderDetails,
//   createTransaction,
//   getPendingTransactionForPackage,
//   updateTransaction,
// } from "../controllers/paymentController";

const express = require("express");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleWebhook,
  getUserTransactions,
  getAllTransactions,
  getRazorpayKey,
  getTransactionOrderDetails,
  createTransaction,
  getPendingTransactionForPackage,
  updateTransaction,
} = require("../controllers/paymentController");

const router = express.Router();

// Get Razorpay key ID
router.get("/key", authenticateToken, getRazorpayKey);

// Create a Razorpay order for purchasing insurance
router.post("/create-order", authenticateToken, createRazorpayOrder);

// Verify Razorpay payment
router.post("/verify", authenticateToken, verifyRazorpayPayment);

// Get user's transactions
router.get("/my", authenticateToken, getUserTransactions);

// Get all transactions (admin only)
router.get("/", authenticateToken, isAdmin, getAllTransactions);

// Webhook endpoint for Razorpay events
// Note: This route is already handled by the middleware in server.js
// We're keeping it here for documentation purposes
router.post("/webhook", handleWebhook);

// Create a transaction
router.post("/transaction", authenticateToken, createTransaction);

// Update a transaction
router.put("/transaction/:id", authenticateToken, updateTransaction);

// Get pending transaction for a package
router.get(
  "/package/:id/pending-transaction",
  authenticateToken,
  getPendingTransactionForPackage
);

// Get Razorpay order details from an existing transaction
router.get(
  "/transaction/:id/order-details",
  authenticateToken,
  getTransactionOrderDetails
);

module.exports = router;
