const { asyncHandler } = require("../middlewares/errorMiddleware");
const CompletedTransaction = require("../models/CompletedTransaction");
const Transaction = require("../models/Transaction");
const Package = require("../models/Package");
const mongoose = require("mongoose");

/**
 * Move a completed transaction to the completed transactions collection
 * @route POST /api/transactions/:id/complete
 */
const moveToCompleted = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const transactionId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    res.status(400);
    throw new Error("Invalid transaction ID");
  }

  // Find the transaction
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  if (transaction.status !== "completed") {
    res.status(400);
    throw new Error("Only completed transactions can be moved");
  }

  // Create a new completed transaction
  const completedTransaction = new CompletedTransaction({
    ...transaction.toObject(),
    completedAt: new Date(),
  });

  // Save the completed transaction
  await completedTransaction.save();

  // Delete the original transaction
  await Transaction.findByIdAndDelete(transactionId);

  // Update the package status to dispatch if it's not already
  if (transaction.packageId) {
    const pkg = await Package.findById(transaction.packageId);
    if (pkg && pkg.status !== "dispatch") {
      pkg.status = "dispatch";
      await pkg.save();
    }
  }

  res.status(200).json(completedTransaction);
});

/**
 * Get all completed transactions (admin only)
 * @route GET /api/completed-transactions
 */
const getAllCompletedTransactions = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const completedTransactions = await CompletedTransaction.find()
    .select("+packageStatus") // Include packageStatus
    .populate("userId", "firstName lastName email")
    .populate({
      path: "packageId",
      select: "trackingId status weight weightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .sort({ completedAt: -1 })
    .lean();

  res.status(200).json(completedTransactions);
});

const getMyCompletedTransactions = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const completedTransactions = await CompletedTransaction.find({
    userId: req.user._id,
  })
    .select("+packageStatus +adminTrackingId") // Include both fields
    .populate(
      "packageId",
      "trackingId status weight weightUnit destinationAddress"
    )
    .sort({ completedAt: -1 })
    .lean();

  res.status(200).json(completedTransactions);
});

/**
 * Update package status for a completed transaction
 * @route PATCH /api/completed-transactions/:id/status
 */
const updatePackageStatus = asyncHandler(async (req, res) => {
  console.log("=== UPDATE PACKAGE STATUS REQUEST ===");
  console.log("Headers:", req.headers);
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  // Check authentication
  if (!req.user || req.user.role !== "admin") {
    console.error("Unauthorized: User is not an admin");
    return res.status(403).json({
      success: false,
      message: "Not authorized as an admin",
    });
  }

  const { id } = req.params;
  const { packageStatus } = req.body;

  console.log("Updating package status:", { id, packageStatus });

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid transaction ID:", id);
    return res.status(400).json({
      success: false,
      message: "Invalid transaction ID",
    });
  }

  // Validate status
  if (!["Processing", "Dispatch"].includes(packageStatus)) {
    console.error("Invalid package status:", packageStatus);
    return res.status(400).json({
      success: false,
      message:
        'Invalid package status. Must be either "Processing" or "Dispatch"',
    });
  }

  try {
    console.log(
      "Updating package status for transaction:",
      id,
      "to:",
      packageStatus
    );

    // 1. First verify the document exists
    const exists = await CompletedTransaction.exists({ _id: id });
    if (!exists) {
      throw new Error("Transaction not found");
    }

    // 2. Perform a direct update using MongoDB's native driver
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not available");
    }

    const collection = db.collection("completedtransactions");
    const updateResult = await collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { packageStatus } },
      {
        returnDocument: "after", // Return the document after update
        projection: { packageStatus: 1 }, // Only return the packageStatus field
      }
    );

    console.log(
      "MongoDB update result:",
      JSON.stringify(updateResult, null, 2)
    );

    if (!updateResult) {
      throw new Error("Failed to update transaction");
    }

    // 3. Fetch the updated document with all fields
    const updated = await CompletedTransaction.findById(id)
      .select("+packageStatus")
      .populate("userId", "firstName lastName email")
      .populate({
        path: "packageId",
        select: "trackingId status weight weightUnit",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .lean();

    if (!updated) {
      throw new Error("Failed to fetch updated transaction");
    }

    console.log("Document after update:", JSON.stringify(updated, null, 2));

    // 4. Verify the update was saved with direct MongoDB query
    try {
      const db = mongoose.connection.db;
      if (!db) {
        console.error("MongoDB connection not established");
      } else {
        // Get the raw document
        const collection = db.collection("completedtransactions");
        const rawDoc = await collection.findOne({
          _id: new mongoose.Types.ObjectId(id),
        });

        // Log the entire document structure
        console.log("=== RAW DOCUMENT STRUCTURE ===");
        console.log(JSON.stringify(rawDoc, null, 2));

        // Log all fields in the document
        if (rawDoc) {
          console.log("=== DOCUMENT FIELDS ===");
          console.log(Object.keys(rawDoc).join(", "));
          console.log("packageStatus in raw document:", rawDoc.packageStatus);

          // Check if the field exists but is undefined
          console.log("packageStatus field exists:", "packageStatus" in rawDoc);
        }
      }
    } catch (error) {
      console.error("Error querying raw collection:", error);
    }

    // Also verify using Mongoose
    const dbDoc = await CompletedTransaction.findById(id)
      .select("+packageStatus")
      .lean();

    console.log("Mongoose verification - packageStatus:", dbDoc?.packageStatus);

    // 5. Prepare response
    const response = {
      success: true,
      data: {
        ...updated,
        packageStatus: packageStatus, // Ensure it's included in the response
      },
    };

    console.log("Sending response:", response);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error updating package status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update package status",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error.stack,
    });
  }
});

/**
 * Update admin tracking ID for a completed transaction
 * @route PATCH /api/completed-transactions/:id/tracking
 */
const updateAdminTrackingId = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const { id } = req.params;
  const { adminTrackingId, notes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid transaction ID");
  }

  if (!adminTrackingId) {
    res.status(400).json;
    throw new Error("Tracking ID is required");
  }

  const updateData = {
    adminTrackingId: adminTrackingId.trim(),
  };

  if (notes !== undefined) {
    updateData.notes = notes.trim();
  }

  // Use MongoDB's native update to ensure the notes are saved
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not available");
  }

  console.log("Updating document with:", {
    adminTrackingId: updateData.adminTrackingId,
    notes,
  });

  // Create update objecta
  const updateObj = {
    $set: {
      adminTrackingId: updateData.adminTrackingId,
      updatedAt: new Date(),
    },
  };

  // Only add notes to update if they exist
  if (notes !== undefined) {
    updateObj.$set.notes = notes.trim();
    console.log("Including notes in update:", updateObj.$set.notes);
  }

  // Perform the update
  const collection = db.collection("completedtransactions");
  const updateResult = await collection.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    updateObj
  );

  console.log("Update result:", updateResult);

  console.log("Update result:", { matchedCount: 0 });
  if (updateResult.transactionCount === 0) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Now fetch the updated document with populated transactions
  const updatedTransaction = await CompletedTransaction.findById(id)
    .select("+packageStatus")
    .populate("userId", "firstName id lastName email")
    .populate({
      path: "packageId",
      select: "trackingId status weight weightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .lean();

  if (!updatedTransaction) {
    res.status(404);
    throw new Error("Failed to fetch updated transaction");
  }

  // The updated transaction includes already includes the latest data from the database
  res.status(200).json({
    success: true,
    data: updatedTransaction,
  });
});

const getCompletedTransactionsByPackage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const packageId = req.params.packageId;

  if (!mongoose.Types.ObjectId.isValid(packageId)) {
    res.status(400);
    throw new Error("Invalid package ID");
  }
  const completedTransactions = await CompletedTransaction.find({
    packageId,
  })
    .populate("userId", "firstName lastName email")
    .populate({
      path: "packageId",
      select: "trackingId status weight weightUnit",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .sort({ completedAt: -1 })
    .lean();

  res.status(200).json(completedTransactions);
});

module.exports = {
  getMyCompletedTransactions,
  getCompletedTransactionsByPackage,
  moveToCompleted,
  getAllCompletedTransactions,
  updatePackageStatus,
  updateAdminTrackingId,
};
