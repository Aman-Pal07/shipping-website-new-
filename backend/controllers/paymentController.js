// import Transaction from "../models/Transaction";
// import User from "../models/User";
// import Package from "../models/Package";
// import { CompletedTransaction } from "../models/Transaction";
// import {
//   createOrder,
//   verifyPaymentSignature,
//   fetchPaymentById,
//   processWebhookEvent,
// } from "../services/razorpayService";

const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Package = require("../models/Package");
const CompletedTransaction = require("../models/CompletedTransaction");
const {
  createOrder,
  verifyPaymentSignature,
  fetchPaymentById,
  processWebhookEvent,
} = require("../services/razorpayService");

// Mock order for development when Razorpay is not available
const createMockOrder = (amount) => {
  return {
    id: `mock_order_${Date.now()}`,
    amount: amount * 100, // In paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    status: "created",
  };
};

/**
 * Get Razorpay key ID
 * @route GET /api/payments/key
 */
const getRazorpayKey = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.status(200).json({
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_SXAGAtAhJqKTPf",
    });
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a Razorpay order
 * @route POST /api/payments/create-order
 */
const createRazorpayOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const {
      amount: amountStr,
      packageId,
      description,
      transactionId,
    } = req.body;
    const amount = Number(amountStr);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    // Check for existing pending transaction
    const existingTransaction = await Transaction.findOne({
      _id: transactionId,
      userId: req.user._id,
      status: { $in: ["pending", "failed", "cancelled"] },
    }).sort({ createdAt: -1 });

    let transaction;
    if (existingTransaction) {
      // Update existing transaction for retry
      existingTransaction.paymentAttempts =
        (existingTransaction.paymentAttempts || 0) + 1;
      existingTransaction.lastPaymentAttempt = new Date();
      existingTransaction.status = "pending";
      await existingTransaction.save();
      transaction = existingTransaction;
    } else {
      // Create new transaction
      transaction = await Transaction.create({
        userId: req.user._id,
        packageId: packageId || undefined,
        amount,
        currency: "INR",
        status: "pending",
        paymentAttempts: 1,
        lastPaymentAttempt: new Date(),
        description: description || "Package payment",
      });
    }

    // Create receipt with transaction ID and attempt number (default to 1 if not set)
    const receipt = `rcpt_${transaction._id}_${
      transaction.paymentAttempts ?? 1
    }`;
    const notes = {
      transactionId: transaction._id.toString(),
      userId: req.user.id, // Using the virtual id getter
      packageId: packageId || "",
      attempt: (transaction.paymentAttempts ?? 1).toString(),
      description: description || "Package payment",
    };

    // Create Razorpay order
    const order = await createOrder(amount, receipt, notes);

    // Update transaction with order ID
    transaction.razorpayOrderId = order.id;
    await transaction.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify Razorpay payment
 * @route POST /api/payments/verify
 */
const verifyRazorpayPayment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { orderId, paymentId, signature, transactionId } = req.body;

    if (!orderId || !paymentId || !signature || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification details",
      });
    }

    // Verify the payment signature
    const isValidSignature = verifyPaymentSignature(
      orderId,
      paymentId,
      signature
    );
    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find and update the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Verify the transaction belongs to the user
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to verify this payment",
      });
    }

    // Update transaction status
    transaction.status = "completed";
    transaction.razorpayPaymentId = paymentId;
    transaction.paidAt = new Date();
    await transaction.save();

    // If this is for a package, update the package status
    if (transaction.packageId) {
      await Package.findByIdAndUpdate(
        transaction.packageId,
        { isInsured: true, insurancePlan: "standard" },
        { new: true }
      );
    }

    // Move to completed transactions
    const completed = new CompletedTransaction(transaction.toObject());
    await completed.save();
    await Transaction.findByIdAndDelete(transaction._id);

    res.status(200).json({
      success: true,
      transaction: completed,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
/**
 * Handle Razorpay webhook events
 * @route POST /api/payments/webhook
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({ message: "Missing webhook signature" });
    }

    const event = processWebhookEvent(
      typeof req.body === "string" ? req.body : JSON.stringify(req.body),
      signature
    );

    // Handle different event types
    switch (event.event) {
      case "payment.authorized":
      case "payment.captured":
        await handlePaymentSuccess(event.payload.payment.entity);
        break;
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handle payment success event
 */
const handlePaymentSuccess = async (payment) => {
  try {
    // Find transaction by Razorpay order ID
    const transaction = await Transaction.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      {
        status: "completed",
        razorpayPaymentId: payment.id,
        paymentMethod: payment.method || "razorpay",
      },
      { new: true }
    );

    if (!transaction) {
      console.error("Transaction not found for order:", payment.order_id);
      return;
    }

    // If this is for package insurance, update the package
    if (transaction.packageId) {
      await Package.findByIdAndUpdate(
        transaction.packageId,
        { isInsured: true, insurancePlan: "standard" },
        { new: true }
      );
    }

    // Update user's Razorpay customer ID if available
    if (payment.customer_id && transaction.userId) {
      await User.findByIdAndUpdate(
        transaction.userId,
        { razorpayCustomerId: payment.customer_id },
        { new: true }
      );
    }
  } catch (error) {
    console.error("Error processing payment success:", error);
  }
};

/**
 * Handle payment failed event
 */
const handlePaymentFailed = async (payment) => {
  try {
    // Update transaction status
    await Transaction.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      {
        status: "failed",
        razorpayPaymentId: payment.id,
        paymentMethod: payment.method || "razorpay",
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error processing payment failure:", error);
  }
};

/**
 * Get user transactions
 * @route GET /api/payments/my
 */
const getUserTransactions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("packageId");

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all transactions (admin only)
 * @route GET /api/payments
 */
const getAllTransactions = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email")
      .populate("packageId", "trackingId");

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a transaction
 * @route POST /api/payments/transaction
 */
const createTransaction = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const {
      packageId,
      amount,
      currency = "INR",
      description,
      paymentMethod,
    } = req.body;

    // Create the transaction
    const transaction = await Transaction.create({
      userId: req.user?._id,
      packageId: packageId || undefined,
      amount,
      currency,
      status: "pending",
      description: description || "Package payment",
      paymentMethod: paymentMethod || undefined,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update a transaction
 * @route PUT /api/payments/transaction/:id
 */
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log(`Updating transaction ${id} with data:`, updates);

    // Find the transaction using lean() to get a plain JavaScript object
    const transaction = await Transaction.findById(id).lean();

    if (!transaction) {
      console.log(`Transaction ${id} not found`);
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if the user owns this transaction or is an admin
    if (
      transaction.userId.toString() !== req.user._id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this transaction" });
    }

    // Only update allowed fields to prevent overwriting critical data
    const allowedUpdates = [
      "status",
      "razorpayOrderId",
      "razorpayPaymentId",
      "paymentMethod",
      "description",
      "amount",
    ];

    console.log("Received update with amount:", updates.amount);

    // Filter updates to only include allowed fields
    const filteredUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        // Special handling for status to ensure it's a valid enum value
        if (key === "status") {
          // Only include status if it's not empty and is a valid value
          if (
            updates[key] &&
            typeof updates[key] === "string" &&
            updates[key].trim() !== ""
          ) {
            const validStatuses = ["pending", "completed", "failed"];
            if (validStatuses.includes(updates[key])) {
              filteredUpdates[key] = updates[key];
              console.log(`Valid status update: ${updates[key]}`);
            } else {
              console.warn(
                `Invalid status value: ${
                  updates[key]
                }. Must be one of: ${validStatuses.join(", ")}`
              );
            }
          } else {
            console.warn(
              `Empty or undefined status value, skipping this field`
            );
          }
        }
        // Special handling for amount to ensure it's a number
        else if (key === "amount") {
          const numAmount =
            typeof updates[key] === "string"
              ? parseFloat(updates[key])
              : Number(updates[key]);
          if (!isNaN(numAmount)) {
            console.log(
              `Processing amount: ${updates[key]} (${typeof updates[
                key
              ]}) -> ${numAmount} (${typeof numAmount})`
            );
            filteredUpdates[key] = numAmount;
          } else {
            console.warn(
              `Invalid amount value: ${updates[key]}. Must be a valid number.`
            );
          }
        } else {
          filteredUpdates[key] = updates[key];
        }
      }
    }

    console.log("Filtered updates:", filteredUpdates);

    // Use findOneAndUpdate for safer updates with proper error handling
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id },
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found after update" });
    }

    // If this is for package insurance and the transaction is now completed, update the package
    if (
      updatedTransaction.packageId &&
      updatedTransaction.status === "completed"
    ) {
      try {
        await Package.findByIdAndUpdate(
          updatedTransaction.packageId,
          { isPaid: true },
          { new: true }
        );
        console.log(
          `Updated package ${updatedTransaction.packageId} payment status to paid`
        );
      } catch (packageError) {
        console.error(
          `Error updating package ${updatedTransaction.packageId}:`,
          packageError
        );
        // Continue with transaction update even if package update fails
      }
    }

    console.log(`Transaction ${id} updated successfully:`, updatedTransaction);
    return res.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    // Send more detailed error information
    return res.status(500).json({
      message: "Server error while updating transaction",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * Get pending transaction for a package
 * @route GET /api/payments/package/:id/pending-transaction
 */
const getPendingTransactionForPackage = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log(
      `Looking for pending transaction for package ${id} for user ${req.user._id}`
    );

    // Find the most recent pending transaction for this package and user
    const transaction = await Transaction.findOne({
      packageId: id,
      userId: req.user._id,
      status: "pending",
      type: "payment",
    }).sort({ createdAt: -1 });

    if (!transaction) {
      console.log(`No pending transaction found for package ${id}`);
      return res.status(404).json({ message: "No pending transaction found" });
    }

    console.log(`Found pending transaction: ${transaction._id}`);
    return res.json(transaction);
  } catch (error) {
    console.error("Error getting pending transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get Razorpay order details from an existing transaction
 * @route GET /api/payments/transaction/:id/order-details
 */
const getTransactionOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find the transaction
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if user is authorized to access this transaction
    // Regular users can only access their own transactions
    // Admins can access any transaction
    if (
      transaction.userId.toString() !== req.user?._id?.toString() &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this transaction" });
    }

    // If the transaction already has a Razorpay order ID, use it
    if (transaction.razorpayOrderId) {
      // Get the order details from Razorpay
      const order = await fetchPaymentById(transaction.razorpayOrderId);

      return res.status(200).json({
        orderId: order.id,
        amount: Number(order.amount || 0) / 100, // Convert from paise to rupees
        currency: order.currency,
        transactionId: transaction._id,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // If the transaction doesn't have a Razorpay order ID, create one
    const receipt = `receipt_${transaction._id}`;
    const notes = {
      packageId: transaction.packageId ? transaction.packageId.toString() : "",
      userId: req.user?._id?.toString() || "",
      transactionId: transaction._id?.toString() || "",
    };

    // Create a Razorpay order
    const order = await createOrder(transaction.amount, receipt, notes);

    // Update the transaction with the Razorpay order ID
    transaction.razorpayOrderId = order.id;
    await transaction.save();

    return res.status(200).json({
      orderId: order.id,
      amount: Number(order.amount || 0) / 100, // Convert from paise to rupees
      currency: order.currency,
      transactionId: transaction._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error getting transaction order details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
  createTransaction,
  updateTransaction,
  getUserTransactions,
  getAllTransactions,
  getPendingTransactionForPackage,
  getTransactionOrderDetails,
  handleWebhook,
};
