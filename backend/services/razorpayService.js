// import razorpay from "../config/razorpay";
// import crypto from "crypto";

const razorpay = require("../config/razorpay");
const crypto = require("crypto");

/**
 * Create a new Razorpay order
 * @param amount Amount in INR (rupees, not paise)
 * @param receipt Optional receipt ID
 * @param notes Optional notes for the order
 * @returns Promise with the created order
 */
const createOrder = async (amount, receipt = "", notes = {}) => {
  if (!razorpay) {
    // Return mock order for development
    return {
      id: `order_mock_${Date.now()}`,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt,
      notes,
      created_at: new Date().toISOString(),
    };
  }

  // Convert amount to paise (Razorpay uses smallest currency unit)
  const amountInPaise = Math.round(amount * 100);

  return await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
    notes,
  });
};

/**
 * Verify Razorpay payment signature
 * @param orderId Razorpay order ID
 * @param paymentId Razorpay payment ID
 * @param signature Razorpay signature from the client
 * @returns Boolean indicating if the signature is valid
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  if (!razorpay) {
    // For development, always return true
    console.log("Mock verification in development mode");
    return true;
  }

  // Use KEY_SECRET for payment verification (not webhook secret)
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    console.error("Missing Razorpay secret for signature verification");
    return false;
  }

  console.log(
    `Verifying signature for order ${orderId} and payment ${paymentId}`
  );

  // Try different payload formats
  // Format 1: orderId|paymentId (standard format)
  const payload1 = `${orderId}|${paymentId}`;
  const expectedSignature1 = crypto
    .createHmac("sha256", secret)
    .update(payload1)
    .digest("hex");

  // Format 2: paymentId|orderId (alternative format)
  const payload2 = `${paymentId}|${orderId}`;
  const expectedSignature2 = crypto
    .createHmac("sha256", secret)
    .update(payload2)
    .digest("hex");

  // Debug information
  console.log({
    providedSignature: signature,
    expectedSignature1,
    expectedSignature2,
    payload1,
    payload2,
    match1: expectedSignature1 === signature,
    match2: expectedSignature2 === signature,
  });

  // Check if either signature format matches
  return expectedSignature1 === signature || expectedSignature2 === signature;
};

/**
 * Fetch payment details by payment ID
 * @param paymentId Razorpay payment ID
 * @returns Payment details
 */
const fetchPaymentById = async (paymentId) => {
  if (!razorpay) {
    // Return mock payment for development
    return {
      id: paymentId,
      order_id: `order_mock_${Date.now()}`,
      amount: 1000,
      currency: "INR",
      status: "captured",
      method: "upi",
      created_at: new Date().toISOString(),
    };
  }

  return await razorpay.payments.fetch(paymentId);
};

/**
 * Process webhook event from Razorpay
 * @param body The request body from Razorpay webhook
 * @param signature The X-Razorpay-Signature header
 * @returns The parsed event if signature is valid, throws error otherwise
 */
const processWebhookEvent = (body, signature) => {
  if (!razorpay) {
    // For development, return the parsed body
    console.log("Mock webhook processing in development mode");
    return JSON.parse(body);
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing RAZORPAY_WEBHOOK_SECRET for webhook verification");
  }

  // Verify the webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new Error("Invalid webhook signature");
  }

  return JSON.parse(body);
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
  fetchPaymentById,
  processWebhookEvent,
};
