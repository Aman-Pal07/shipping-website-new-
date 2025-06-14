const mongoose = require("mongoose");

const completedTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    description: {
      type: String,
    },
    dimensions: {
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
    volumetricWeight: {
      type: Number,
      min: 0,
    },
    volumetricWeightUnit: {
      type: String,
      enum: [
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
      ],
      default: "kg",
    },
    adminTrackingId: {
      type: String,
      unique: true,
      sparse: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
    },
    weightUnit: {
      type: String,
    },
    packageStatus: {
      type: String,
      enum: ["Processing", "Dispatch"],
      default: "Processing",
      required: true,
      select: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save hook to log document before saving
completedTransactionSchema.pre("save", function (next) {
  console.log("Saving document with packageStatus:", this.packageStatus);
  next();
});

// Add indexes for better query performance
completedTransactionSchema.index({ userId: 1 });
completedTransactionSchema.index({ packageId: 1 });
completedTransactionSchema.index({ status: 1 });
completedTransactionSchema.index({ completedAt: 1 });
completedTransactionSchema.index({ adminTrackingId: 1 });
completedTransactionSchema.index({ packageStatus: 1 });

// Check if the model exists before creating it
const CompletedTransaction =
  mongoose.models.CompletedTransaction ||
  mongoose.model("CompletedTransaction", completedTransactionSchema);

module.exports = CompletedTransaction;
