const { Request, Response } = require("express");
const Package = require("../models/Package");
const Transaction = require("../models/Transaction");
const { asyncHandler } = require("../middlewares/errorMiddleware");
const mongoose = require("mongoose");

/**
 * Get all packages (admin only)
 * @route GET /api/packages
 */
const getAllPackages = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  // Filter by status if provided
  const status = req.query.status;
  const filter = {};

  if (
    status &&
    ["waiting", "in_transit", "india", "dispatch"].includes(status)
  ) {
    filter.status = status;
  }

  const packages = await Package.find(filter)
    .populate({
      path: "userId",
      select: "email name",
    })
    .select("+adminTrackingId")
    .lean();

  // Transform the packages to include customer information in the expected format
  const transformedPackages = packages.map(pkg => ({
    ...pkg,
    customer: pkg.userId ? {
      name: pkg.userId.name || 'Unknown User',
      email: pkg.userId.email,
      initials: (pkg.userId.name || 'UU').split(' ').map(n => n[0]).join('').toUpperCase()
    } : null
  }));

  res.status(200).json(transformedPackages);
});

/**
 * Get user's packages
 * @route GET /api/packages/my
 */
const getUserPackages = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  // Filter by status if provided
  const status = req.query.status;
  const filter = { userId: req.user._id };

  if (
    status &&
    ["waiting", "in_transit", "india", "dispatch"].includes(status)
  ) {
    filter.status = status;
  }

  const packages = await Package.find(filter);
  res.status(200).json(packages);
});

/**
 * Get package by ID
 * @route GET /api/packages/:id
 */
const getPackageById = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const packageId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(packageId)) {
    res.status(400);
    throw new Error("Invalid package ID");
  }

  const pkg = await Package.findById(packageId)
    .populate("userId", "firstName lastName email")
    .select("+adminTrackingId");

  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }

  // Check if user is authorized to view this package
  if (
    req.user.role !== "admin" &&
    pkg.userId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to access this package");
  }

  res.status(200).json(pkg);
});

/**
 * Create a new package
 * @route POST /api/packages
 */
const createPackage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const {
    trackingId,
    description,
    content,
    weight,
    weightUnit,
    estimatedDeliveryDate,
    currentLocation,
    isInsured,
    insurancePlan,
  } = req.body;

  // Generate a random tracking ID if not provided
  const finalTrackingId = trackingId || generateTrackingId();

  const newPackage = new Package({
    userId: req.user._id,
    trackingId: finalTrackingId,
    status: "waiting",
    description,
    content: content || undefined,
    weight: weight || undefined,
    weightUnit: weightUnit || undefined,
    currentLocation: currentLocation || undefined,
    estimatedDeliveryDate: estimatedDeliveryDate || undefined,
    isInsured: isInsured || false,
    insurancePlan: insurancePlan || undefined,
  });

  const savedPackage = await newPackage.save();
  res.status(201).json(savedPackage);
});

/**
 * Update package status (admin only)
 * @route PUT /api/packages/:id/status
 */
const updatePackageStatus = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const { status, currentLocation } = req.body;

  if (
    !["waiting", "in_transit", "india", "dispatch", "delivered"].includes(
      status
    )
  ) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  // Find the package first to get the previous status
  const existingPackage = await Package.findById(req.params.id);

  if (!existingPackage) {
    res.status(404);
    throw new Error("Package not found");
  }

  const previousStatus = existingPackage.status;

  // Only create transaction when status changes from in_transit to india
  const needsTransaction =
    previousStatus === "in_transit" && status === "india";

  console.log(
    `Package status change: ${previousStatus} -> ${status}, needs transaction: ${needsTransaction}`
  );

  // Update the package status
  const updateData = { status };
  if (currentLocation) {
    updateData.currentLocation = currentLocation;
  }

  const pkg = await Package.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  );

  if (!pkg) {
    res.status(404);
    throw new Error("Package not found after update");
  }

  // Check if a transaction already exists for this package
  const existingTransaction = await Transaction.findOne({
    packageId: pkg._id,
  });

  // Check if we need to create a transaction for this status change
  if (needsTransaction) {
    console.log(
      `Creating/updating transaction for package ${req.params.id} status change to ${status}`
    );

    if (existingTransaction) {
      // Update the existing transaction instead of creating a new one
      existingTransaction.status = "pending";

      // Update the description based on the new status
      if (status === "india") {
        // Include weight information in description but don't calculate amount
        if (existingPackage.weight) {
          existingTransaction.description = `Package arrived in India. Weight: ${
            existingPackage.weight
          }${existingPackage.weightUnit || "kg"}. Tracking ID: ${
            existingPackage.trackingId
          }`;
        } else {
          existingTransaction.description = `Package arrived in India. Tracking ID: ${existingPackage.trackingId}`;
        }
      } else if (status === "dispatch") {
        existingTransaction.description = `Package status changed from india to dispatch`;
      } else {
        existingTransaction.description = `Package status changed from ${previousStatus} to ${status}`;
      }

      // Save the updated transaction
      await existingTransaction.save();
      console.log(
        `Updated existing transaction ${existingTransaction._id} for package ${req.params.id}`
      );
    } else {
      // Only create a new transaction if one doesn't exist and it's needed
      // Create basic transaction with amount ALWAYS set to 0
      const transactionData = {
        userId: pkg.userId,
        packageId: pkg._id,
        amount: 0, // Always set to 0 as requested by admin
        currency: "INR",
        status: "pending",
        description: `Package arrived in India. Tracking ID: ${existingPackage.trackingId}`,
        weight: existingPackage.weight,
        weightUnit: existingPackage.weightUnit,
      };

      // Include weight information in description but don't calculate amount
      if (existingPackage.weight) {
        transactionData.description = `Package arrived in India. Weight: ${
          existingPackage.weight
        }${existingPackage.weightUnit || "kg"}. Tracking ID: ${
          existingPackage.trackingId
        }`;
      }

      // If the package is insured, note that in the description
      if (existingPackage.isInsured) {
        transactionData.description += `. Package is insured${
          existingPackage.insurancePlan
            ? ` (${existingPackage.insurancePlan})`
            : ""
        }`;
      }

      const newTransaction = new Transaction(transactionData);
      await newTransaction.save();
      console.log(
        `Created new transaction ${newTransaction._id} for package ${req.params.id} status change to ${status}`
      );
    }
  } else {
    console.log(
      `No transaction needed for package ${req.params.id} status change from ${previousStatus} to ${status}`
    );
  }

  res.status(200).json(pkg);
});

/**
 * Update package tracking details
 * @route PUT /api/packages/:id/track
 */
const updatePackageTracking = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const packageId = req.params.id;
  const { currentLocation, estimatedDeliveryDate, adminTrackingId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(packageId)) {
    res.status(400);
    throw new Error("Invalid package ID");
  }

  const updateData = {};

  if (currentLocation) updateData.currentLocation = currentLocation;

  if (estimatedDeliveryDate) {
    const date = new Date(estimatedDeliveryDate);
    if (isNaN(date.getTime())) {
      res.status(400);
      throw new Error("Invalid estimated delivery date");
    }
    updateData.estimatedDeliveryDate = date;
  }

  if (adminTrackingId) {
    // Check if admin tracking ID already exists for another package
    const existingPackage = await Package.findOne({
      adminTrackingId: adminTrackingId,
      _id: { $ne: packageId },
    });

    if (existingPackage) {
      res.status(400);
      throw new Error("This admin tracking ID is already in use");
    }

    updateData.adminTrackingId = adminTrackingId;
  }

  const updatedPackage = await Package.findByIdAndUpdate(
    packageId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("userId", "email")
    .select("+adminTrackingId");

  if (!updatedPackage) {
    res.status(404);
    throw new Error("Package not found");
  }

  res.status(200).json(updatedPackage);
});

/**
 * Update package insurance
 * @route PUT /api/packages/:id/insurance
 */
const updatePackageInsurance = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const packageId = req.params.id;

  // Check if package exists and belongs to user or user is admin
  const pkg = await Package.findById(packageId);

  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }

  if (
    req.user.role !== "admin" &&
    pkg.userId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to update this package");
  }

  const { isInsured, insurancePlan } = req.body;

  const updateData = { isInsured };
  if (insurancePlan) {
    updateData.insurancePlan = insurancePlan;
  }

  const updatedPackage = await Package.findByIdAndUpdate(
    packageId,
    { $set: updateData },
    { new: true }
  );

  res.status(200).json(updatedPackage);
});

/**
 * Delete a package (admin only)
 * @route DELETE /api/packages/:id
 */
const deletePackage = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }

  await pkg.deleteOne();
  res.status(200).json({ message: "Package removed" });
});

/**
 * Update package details (admin only)
 * @route PUT /api/packages/:id/details
 */
const updatePackageDetails = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const {
    volumetricWeight,
    volumetricWeightUnit,
    weight,
    weightUnit,
    dimensions,
  } = req.body;

  const updateData = {};
  if (volumetricWeight !== undefined) {
    const weightNumber = parseFloat(volumetricWeight);
    if (isNaN(weightNumber)) {
      res.status(400);
      throw new Error("Invalid volumetric weight number");
    }
    updateData.volumetricWeight = weightNumber;
  }
  if (volumetricWeightUnit) {
    const normalizedUnit = volumetricWeightUnit.toLowerCase();
    const validUnits = [
      "kg",
      "kilograms",
      "kgs", // Kilograms
      "g",
      "grams",
      "gm", // Grams
      "lb",
      "lbs",
      "pounds", // Pounds
      "oz",
      "ounces",
      "ounce", // Ounces
      "ton",
      "tons",
      "metric ton",
      "metric tons", // Metric tons
      "stone",
      "stones", // Stones
      "mg",
      "milligrams", // Milligrams
      "microg",
      "micrograms", // Micrograms
      "t",
      "metric tonne", // Metric tonne
      "cwt",
      "hundredweight", // Hundredweight
    ];
    if (!validUnits.includes(normalizedUnit)) {
      res.status(400);
      throw new Error(
        `Invalid weight unit. Valid units: ${validUnits.join(", ")}`
      );
    }
    updateData.volumetricWeightUnit = normalizedUnit;
  }
  if (weight !== undefined) updateData.weight = weight;
  if (weightUnit) {
    const normalizedUnit = weightUnit.toLowerCase();
    const validUnits = [
      "kg",
      "kilograms",
      "kgs", // Kilograms
      "g",
      "grams",
      "gm", // Grams
      "lb",
      "lbs",
      "pounds", // Pounds
      "oz",
      "ounces",
      "ounce", // Ounces
      "ton",
      "tons",
      "metric ton",
      "metric tons", // Metric tons
      "stone",
      "stones", // Stones
      "mg",
      "milligrams", // Milligrams
      "microg",
      "micrograms", // Micrograms
      "t",
      "metric tonne", // Metric tonne
      "cwt",
      "hundredweight", // Hundredweight
    ];
    if (!validUnits.includes(normalizedUnit)) {
      res.status(400);
      throw new Error(
        `Invalid weight unit. Valid units: ${validUnits.join(", ")}`
      );
    }
    updateData.weightUnit = normalizedUnit;
  }

  if (dimensions) {
    const { width, height, length, unit = "cm" } = dimensions;

    // Validate all dimensions are provided and valid
    if (width === undefined || height === undefined || length === undefined) {
      res.status(400);
      throw new Error("Width, height, and length are required for dimensions");
    }

    const widthNum = Number(width);
    const heightNum = Number(height);
    const lengthNum = Number(length);

    if (isNaN(widthNum) || widthNum <= 0) {
      res.status(400);
      throw new Error("Invalid width value");
    }

    if (isNaN(heightNum) || heightNum <= 0) {
      res.status(400);
      throw new Error("Invalid height value");
    }

    if (isNaN(lengthNum) || lengthNum <= 0) {
      res.status(400);
      throw new Error("Invalid length value");
    }
    const validUnits = ["cm", "in", "m", "ft"];
    if (!validUnits.includes(unit)) {
      res.status(400);
      throw new Error(
        `Invalid unit. Valid units are: ${validUnits.join(", ")}`
      );
    }

    // Set the entire dimensions object
    updateData.dimensions = {
      width: widthNum,
      height: heightNum,
      length: lengthNum,
      unit: unit,
    };
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("No valid update fields provided");
  }

  // First update the package
  const pkg = await Package.findByIdAndUpdateId(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }

  const updatedPackage = await Package.findById(pkg._id)
    .select(
      "trackingId status weight weightUnit volumetricWeight volumetricWeightUnit dimensions"
    )
    .populate("userId", "name email")
    .lean();

  if (!updatedPackage) {
    res.status(404);
    throw new Error("Failed to fetch updated package data");
  }

  res.status(200).json(updatedPackage);
});

/**
 * Helper function to generate a random tracking ID
 */
function generateTrackingId() {
  const prefix = "PKG";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}${timestamp}${random}`;
}

module.exports = {
  getAllPackages,
  getUserPackages,
  getPackageById,
  createPackage,
  updatePackageStatus,
  updatePackageTracking,
  updatePackageInsurance,
  deletePackage,
  updatePackageDetails,
};
