const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    adminTrackingId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["waiting", "in_transit", "india", "dispatch", "completed"],
      default: "waiting",
    },
    description: {
      type: String,
    },
    content: {
      type: String,
    },
    weight: {
      type: Number,
    },
    weightUnit: {
      type: String,
      enum: ["kg", "g", "lb", "oz"],
      default: "kg",
    },
    currentLocation: {
      type: String,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    isInsured: {
      type: Boolean,
      default: false,
    },
    insurancePlan: {
      type: String,
    },
    amount: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
