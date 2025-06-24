const Razorpay = require("razorpay");

// Use environment variables for Razorpay keys
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Initialize Razorpay if keys are available
let razorpay = null;

if (razorpayKeyId && razorpayKeySecret) {
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
  console.log("Razorpay initialized");
} else if (process.env.NODE_ENV === "production") {
  console.error(
    "Missing required Razorpay secrets: RAZORPAY_KEY_ID and/or RAZORPAY_KEY_SECRET"
  );
} else {
  console.warn(
    "Razorpay not initialized: Using mock implementation for development"
  );
}

module.exports = razorpay;
