const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR", // Changed default to INR for Razorpay
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    stripePaymentIntentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },

    adminTrackingId: {
      type: String,
      unique: true,
      sparse: true,
    },
    dimensions: {
      type: {
        width: { type: Number, required: true, min: 0 },
        height: { type: Number, required: true, min: 0 },
        length: { type: Number, required: true, min: 0 },
        unit: {
          type: String,
          required: true,
          enum: ["cm", "in", "m", "ft"],
          default: "cm",
        },
      },
      required: false,
    },
    volumetricWeight: {
      type: Number,
      min: 0,
    },
    volumetricWeightUnit: {
      type: String,
      enum: [
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
      ],
      default: "kg",
    },
    paymentMethod: {
      type: String,
      enum: [
        "credit_card",
        "debit_card",
        "upi",
        "net_banking",
        "wallet",
        "razorpay",
        "other",
      ],
      default: "razorpay",
    },
    description: {
      type: String,
    },
    weight: {
      type: Number,
    },
    weightUnit: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

const CompletedTransaction = mongoose.model(
  "CompletedTransaction",
  transactionSchema
);

module.exports = Transaction;
