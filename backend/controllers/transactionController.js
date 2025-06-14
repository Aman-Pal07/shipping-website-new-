// import Transaction from "../models/Transaction";
// import Package from "../models/Package";
// import { asyncHandler } from "../middlewares/errorMiddleware";
// import mongoose from "mongoose";

const Transaction = require("../models/Transaction");
const Package = require("../models/Package");
const { asyncHandler } = require("../middlewares/errorMiddleware");
const mongoose = require("mongoose");

// Define default dimensions
const defaultDimensions = {
  width: 0,
  height: 0,
  length: 0,
  unit: "cm",
};

/**
 * Get all transactions (admin only)
 * @route GET /api/transactions
 */
const getAllTransactions = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  // Filter by status if provided
  const status = req.query.status;
  const filter = {};

  if (status && ["pending", "completed", "failed"].includes(status)) {
    filter.status = status;
  }

  const transactions = await Transaction.find(filter)
    .populate("userId", "firstName lastName email")
    .populate({
      path: "packageId",
      select:
        "trackingId status weight weightUnit volumetricWeight volumetricWeightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .select("+dimensions") // Explicitly include dimensions
    .sort({ createdAt: -1 })
    .lean() // Convert to plain JavaScript object for better serialization
    .then((transactions) => {
      // Ensure transactions is an array
      if (!Array.isArray(transactions)) {
        console.error("Transactions is not an array:", transactions);
        return [];
      }

      // Ensure dimensions are properly formatted
      return transactions.map((transaction) => {
        // Log the raw transaction data for debugging
        console.log(
          "Raw transaction data:",
          JSON.stringify(transaction, null, 2)
        );

        // Safely get dimensions with defaults
        const defaultDimensions = {
          width: 0,
          height: 0,
          length: 0,
          unit: "cm",
        };
        const transactionDimensions =
          transaction.dimensions || defaultDimensions;

        return {
          ...transaction,
          dimensions: {
            width: transactionDimensions.width,
            height: transactionDimensions.height,
            length: transactionDimensions.length,
            unit: transactionDimensions.unit,
          },
        };
      });
    })
    .catch((error) => {
      console.error("Error fetching transactions:", error);
      throw error;
    });

  res.status(200).json(transactions);
});

/**
 * Get user's transactions
 * @route GET /api/transactions/my
 */
const getUserTransactions = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  // Filter by status if provided
  const status = req.query.status;
  const filter = { userId: req.user._id };

  if (status && ["pending", "completed", "failed"].includes(status)) {
    filter.status = status;
  }

  const transactions = await Transaction.find(filter)
    .populate({
      path: "packageId",
      select:
        "trackingId status weight weightUnit volumetricWeight volumetricWeightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .select("+dimensions") // Explicitly include dimensions
    .sort({ createdAt: -1 })
    .lean()
    .then((transactions) => {
      // Ensure transactions is an array
      if (!Array.isArray(transactions)) {
        console.error("User transactions is not an array:", transactions);
        return [];
      }

      // Ensure dimensions are properly formatted
      return transactions.map((transaction) => {
        // Log the raw transaction data for debugging
        console.log(
          "Raw user transaction data:",
          JSON.stringify(transaction, null, 2)
        );

        // Safely get dimensions with defaults

        const defaultDimensions = {
          width: 0,
          height: 0,
          length: 0,
          unit: "cm",
        };
        const transactionDimensions =
          transaction.dimensions || defaultDimensions;

        return {
          ...transaction,
          dimensions: {
            width: transactionDimensions.width,
            height: transactionDimensions.height,
            length: transactionDimensions.length,
            unit: transactionDimensions.unit,
          },
        };
      });
    })
    .catch((error) => {
      console.error("Error fetching user transactions:", error);
      throw error;
    });

  res.status(200).json(transactions);
});

/**
 * Get transaction by ID
 * @route GET /api/transactions/:id
 */
const getTransactionById = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const transactionId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    res.status(400);
    throw new Error("Invalid transaction ID");
  }

  const transaction = await Transaction.findById(transactionId)
    .populate("userId", "firstName lastName email")
    .populate({
      path: "packageId",
      select:
        "trackingId status weight weightUnit volumetricWeight volumetricWeightUnit dimensions",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Check if user is authorized to view this transaction
  if (
    req.user.role !== "admin" &&
    transaction.userId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to access this transaction");
  }

  res.status(200).json(transaction);
});

/**
 * Create a transaction for package status change
 * @route POST /api/transactions/package-status
 */
const createPackageStatusTransaction = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { packageId, description } = req.body;

  if (!packageId || !mongoose.Types.ObjectId.isValid(packageId)) {
    res.status(400);
    throw new Error("Valid package ID is required");
  }

  // Find the package
  const pkg = await Package.findById(packageId);

  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }

  // Verify the user owns the package or is an admin
  if (
    req.user.role !== "admin" &&
    pkg.userId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to create a transaction for this package");
  }

  // Create a new transaction with pending status and waiting amount
  const newTransaction = new Transaction({
    userId: pkg.userId,
    packageId: pkg._id,
    amount: 0, // Initial amount is 0, will be updated by admin
    currency: "USD",
    status: "pending",
    description: description || `Package status changed to ${pkg.status}`,
  });

  const savedTransaction = await newTransaction.save();

  // Return the saved transaction with populated fields
  const populatedTransaction = await Transaction.findById(savedTransaction._id)
    .populate("userId", "firstName lastName email")
    .populate("packageId");

  res.status(201).json(populatedTransaction);
});

/**
 * Update transaction amount and status (admin only)
 * @route PUT /api/transactions/:id
 */
const updateTransaction = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const { amount, status, description } = req.body;

  if (status && !["pending", "completed", "failed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const updateData = {};

  // Handle amount updates properly - ensure it's stored as a number
  if (amount !== undefined) {
    // Convert string to number if needed
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    // Validate that amount is a valid number
    if (isNaN(numericAmount)) {
      res.status(400);
      throw new Error("Amount must be a valid number");
    }

    updateData.amount = numericAmount;
    console.log(`Updating transaction amount to: ${numericAmount}`);
  }

  if (status) updateData.status = status;
  if (description) updateData.description = description;

  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("No valid update fields provided");
  }

  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  )
    .populate("userId", "firstName lastName email")
    .populate("packageId");

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  res.status(200).json(transaction);
});

/**
 * Delete a transaction (admin only)
 * @route DELETE /api/transactions/:id
 */
const deleteTransaction = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  await transaction.deleteOne();

  res.status(200).json({ message: "Transaction removed" });
});

/**
 * Update transaction dimensions
 * @route PUT /api/transactions/:id/dimensions
 */
const updateTransactionDimensions = asyncHandler(async (req, res) => {
  const { width, height, length, unit = "cm" } = req.body;
  const transactionId = req.params.id;

  // Validate input
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    res.status(400);
    throw new Error("Invalid transaction ID");
  }

  // Check if required fields are present
  if (width === undefined || height === undefined || length === undefined) {
    res.status(400);
    throw new Error("Width, height, and length are required");
  }

  // Convert to numbers and validate
  const widthNum = Number(width);
  const heightNum = Number(height);
  const lengthNum = Number(length);

  if (isNaN(widthNum) || widthNum <= 0) {
    res.status(400);
    throw new Error("Width must be a positive number");
  }

  if (isNaN(heightNum) || heightNum <= 0) {
    res.status(400);
    throw new Error("Height must be a positive number");
  }

  if (isNaN(lengthNum) || lengthNum <= 0) {
    res.status(400);
    throw new Error("Length must be a positive number");
  }

  // Validate unit
  const validUnits = ["cm", "in", "m", "ft"];
  if (!validUnits.includes(unit)) {
    res.status(400);
    throw new Error(`Invalid unit. Must be one of: ${validUnits.join(", ")}`);
  }

  // Find and update the transaction
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Update dimensions
  transaction.dimensions = {
    width: widthNum,
    height: heightNum,
    length: lengthNum,
    unit: unit,
  };

  await transaction.save();

  // Return the updated transaction with populated fields
  const updatedTransaction = await Transaction.findById(transaction._id)
    .populate("userId", "firstName lastName email")
    .populate({
      path: "packageId",
      select: "trackingId status weight weightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .select("+dimensions");

  if (!updatedTransaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  const response = {
    ...updatedTransaction.toObject(),
    dimensions: updatedTransaction.dimensions
      ? {
          width: updatedTransaction.dimensions.width,
          height: updatedTransaction.dimensions.height,
          length: updatedTransaction.dimensions.length,
          unit: updatedTransaction.dimensions.unit || "cm",
        }
      : undefined,
  };

  res.status(200).json(response);
});

/**
 * Update transaction volumetric weight
 * @route PUT /api/transactions/:id/volumetric-weight
 */
const updateTransactionVolumetricWeight = asyncHandler(async (req, res) => {
  const { volumetricWeight, volumetricWeightUnit = "kg" } = req.body;
  const transactionId = req.params.id;

  // Validate input
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    res.status(400);
    throw new Error("Invalid transaction ID");
  }

  // Check if required fields are present
  if (volumetricWeight === undefined) {
    res.status(400);
    throw new Error("Volumetric weight is required");
  }

  // Convert to number and validate
  const weightNum = Number(volumetricWeight);

  if (isNaN(weightNum) || weightNum <= 0) {
    res.status(400);
    throw new Error("Volumetric weight must be a positive number");
  }

  // Validate unit
  const validUnits = [
    "kg",
    "kilograms", // Kilograms
    "kgs",
    "g",
    "grams", // Grams
    "gm",
    "lb",
    "lbs", // Pounds
    "pounds",
    "oz",
    "ounces", // Ounces
    "ounce",
    "ton",
    "tons",
    "metric ton", // Metric tons
    "metric tons",
    "stone", // Stones
    "stones",
    "mg", // Milligrams
    "milligrams",
    "microg", // Micrograms
    "micrograms",
    "t", // Metric tonne
    "metric tonne",
    "cwt", // Hundredweight
    "hundredweight",
  ];

  if (!validUnits.includes(volumetricWeightUnit)) {
    res.status(400);
    throw new Error(`Invalid unit. Must be one of: ${validUnits.join(", ")}`);
  }

  // Find and update the transaction
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Update volumetric weight
  transaction.volumetricWeight = weightNum;
  transaction.volumetricWeightUnit = volumetricWeightUnit;

  await transaction.save();

  // Return the updated transaction with populated fields
  const updatedTransaction = await Transaction.findById(transaction._id)
    .populate("userId", "firstName lastName email")
    .populate({
      path: "packageId",
      select: "trackingId status weight weightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .select("+dimensions");

  if (!updatedTransaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  const response = {
    ...updatedTransaction.toObject(),
    dimensions: updatedTransaction.dimensions
      ? {
          width: updatedTransaction.dimensions.width,
          height: updatedTransaction.dimensions.height,
          length: updatedTransaction.dimensions.length,
          unit: updatedTransaction.dimensions.unit || "cm",
        }
      : undefined,
  };

  res.status(200).json(response);
});

/**
 * Update multiple transaction fields at once (admin only)
 * @route PUT /api/transactions/:id/update-fields
 */
const updateTransactionFields = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const transactionId = req.params.id;
  const {
    adminTrackingId,
    amount,
    dimensions,
    volumetricWeight,
    volumetricWeightUnit,
  } = req.body;

  // Validate transaction ID
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    res.status(400);
    throw new Error("Invalid transaction ID");
  }

  const updateData = {};

  // Handle admin tracking ID
  if (adminTrackingId !== undefined) {
    // Check if the adminTrackingId is already in use by another transaction
    if (adminTrackingId) {
      const existingTransaction = await Transaction.findOne({
        adminTrackingId,
      });
      if (
        existingTransaction &&
        existingTransaction._id &&
        existingTransaction._id.toString() !== transactionId
      ) {
        res.status(400);
        throw new Error("Admin tracking ID is already in use");
      }
    }
    updateData.adminTrackingId = adminTrackingId;
  }

  // Handle amount
  if (amount !== undefined) {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) {
      res.status(400);
      throw new Error("Amount must be a valid number");
    }
    updateData.amount = numericAmount;
  }

  // Handle dimensions
  if (dimensions) {
    const { width, height, length, unit = "cm" } = dimensions;

    // Validate dimensions
    if (width === undefined || height === undefined || length === undefined) {
      res.status(400);
      throw new Error("Width, height, and length are required for dimensions");
    }

    const widthNum = Number(width);
    const heightNum = Number(height);
    const lengthNum = Number(length);

    if (isNaN(widthNum) || widthNum <= 0) {
      res.status(400);
      throw new Error("Width must be a positive number");
    }
    if (isNaN(heightNum) || heightNum <= 0) {
      res.status(400);
      throw new Error("Height must be a positive number");
    }
    if (isNaN(lengthNum) || lengthNum <= 0) {
      res.status(400);
      throw new Error("Length must be a positive number");
    }

    const validUnits = ["cm", "in", "m", "ft"];
    if (!validUnits.includes(unit)) {
      res.status(400);
      throw new Error(`Invalid unit. Must be one of: ${validUnits.join(", ")}`);
    }

    updateData.dimensions = {
      width: widthNum,
      height: heightNum,
      length: lengthNum,
      unit: unit,
    };
  }

  // Handle volumetric weight
  if (volumetricWeight !== undefined) {
    const weightNum = Number(volumetricWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      res.status(400);
      throw new Error("Volumetric weight must be a positive number");
    }
    updateData.volumetricWeight = weightNum;
  }

  // Handle volumetric weight unit
  if (volumetricWeightUnit !== undefined) {
    const validUnits = [
      "kg",
      "kilograms",
      "kgs",
      "g",
      "grams",
      "gm",
      "lb",
      "lbs",
      "pounds",
      "oz",
      "ounces",
      "ounce",
      "ton",
      "tons",
      "metric ton",
      "metric tons",
      "stone",
      "stones",
      "mg",
      "milligrams",
      "microg",
      "micrograms",
      "t",
      "metric tonne",
      "cwt",
      "hundredweight",
    ];

    if (!validUnits.includes(volumetricWeightUnit)) {
      res.status(400);
      throw new Error(`Invalid unit. Must be one of: ${validUnits.join(", ")}`);
    }
    updateData.volumetricWeightUnit = volumetricWeightUnit;
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("No valid update fields provided");
  }

  // Find and update the transaction
  const transaction = await Transaction.findByIdAndUpdate(
    transactionId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("userId", "firstName lastName email")
    .populate({
      path: "packageId",
      select: "trackingId status weight weightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .select("+dimensions");

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // At this point, transaction is guaranteed to be non-null
  const populatedTransaction = transaction;
  res.status(200).json(populatedTransaction);
});

module.exports = {
  getAllTransactions,
  getUserTransactions,
  getTransactionById,
  createPackageStatusTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionDimensions,
  updateTransactionVolumetricWeight,
  updateTransactionFields,
};
