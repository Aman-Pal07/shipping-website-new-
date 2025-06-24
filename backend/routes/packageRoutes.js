// import express from "express";
// import {
//   authenticateToken,
//   isAdmin,
//   isPackageOwnerOrAdmin,
// } from "../middlewares/authMiddleware";
// import {
//   getAllPackages,
//   getUserPackages,
//   getPackageById,
//   createPackage,
//   updatePackageStatus,
//   updatePackageTracking,
//   updatePackageInsurance,
//   deletePackage,
//   updatePackageDetails,
// } from "../controllers/packageController";

const express = require("express");
const {
  authenticateToken,
  isAdmin,
  isPackageOwnerOrAdmin,
} = require("../middlewares/authMiddleware");
const {
  getAllPackages,
  getUserPackages,
  getPackageById,
  createPackage,
  updatePackageStatus,
  updatePackageTracking,
  updatePackageInsurance,
  deletePackage,
  updatePackageDetails,
} = require("../controllers/packageController");

const router = express.Router();

// Get all packages with optional status filter (admin only)
router.get("/", authenticateToken, isAdmin, getAllPackages);

// Get user's packages
router.get("/my", authenticateToken, getUserPackages);

// Get package by ID
router.get("/:id", authenticateToken, isPackageOwnerOrAdmin, getPackageById);

// Create a new package
router.post("/", authenticateToken, createPackage);

// Update package status (admin only)
router.put("/:id/status", authenticateToken, isAdmin, updatePackageStatus);

// Update package tracking details (admin only)
router.put("/:id/track", authenticateToken, isAdmin, updatePackageTracking);

// Update package insurance
router.put(
  "/:id/insurance",
  authenticateToken,
  isPackageOwnerOrAdmin,
  updatePackageInsurance
);

// Update package details (admin only)
router.put("/:id/details", authenticateToken, isAdmin, updatePackageDetails);

// Delete a package (admin only)
router.delete("/:id", authenticateToken, isAdmin, deletePackage);

module.exports = router;
