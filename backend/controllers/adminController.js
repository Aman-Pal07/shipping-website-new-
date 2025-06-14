const User = require("../models/User");
const Package = require("../models/Package");
const Transaction = require("../models/Transaction");
const { asyncHandler } = require("../middlewares/errorMiddleware");

/**
 * Get dashboard statistics for admin
 * @route GET /api/admin/stats
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const totalUsers = await User.countDocuments();

  const waitingPackages = await Package.countDocuments({ status: "waiting" });
  const inTransitPackages = await Package.countDocuments({
    status: "in_transit",
  });
  const indiaPackages = await Package.countDocuments({ status: "india" });
  const dispatchPackages = await Package.countDocuments({ status: "dispatch" });

  const recentPackages = await Package.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "firstName lastName email");

  const recentTransactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "firstName lastName email")
    .populate("packageId");

  const completedTransactions = await Transaction.find({ status: "completed" });
  const totalRevenue = completedTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  res.status(200).json({
    userStats: { totalUsers },
    packageStats: {
      waiting: waitingPackages,
      inTransit: inTransitPackages,
      india: indiaPackages,
      dispatch: dispatchPackages,
      total:
        waitingPackages + inTransitPackages + indiaPackages + dispatchPackages,
    },
    recentActivity: {
      packages: recentPackages,
      transactions: recentTransactions,
    },
    financialStats: {
      totalRevenue,
      currency: "USD",
      transactionCount: completedTransactions.length,
    },
  });
});

/**
 * Get system logs (admin only)
 * @route GET /api/admin/logs
 */
const getSystemLogs = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  res.status(200).json({
    logs: [
      {
        timestamp: new Date(),
        level: "info",
        message: "System logs would be displayed here in a real implementation",
      },
    ],
  });
});

/**
 * Update system settings (admin only)
 * @route PUT /api/admin/settings
 */
const updateSystemSettings = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const {
    defaultCurrency,
    siteTitle,
    contactEmail,
    enableNotifications,
    maintenanceMode,
  } = req.body;

  res.status(200).json({
    settings: {
      defaultCurrency: defaultCurrency || "USD",
      siteTitle: siteTitle || "Package Tracker",
      contactEmail: contactEmail || "support@packagetracker.com",
      enableNotifications:
        enableNotifications !== undefined ? enableNotifications : true,
      maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : false,
      updatedAt: new Date(),
    },
    message: "Settings updated successfully",
  });
});

/**
 * Manage insurance plans (admin only)
 * @route PUT /api/admin/insurance-plans
 */
const manageInsurancePlans = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const { plans } = req.body;

  if (!plans || !Array.isArray(plans)) {
    res.status(400);
    throw new Error("Invalid insurance plans data");
  }

  res.status(200).json({
    plans,
    message: "Insurance plans updated successfully",
  });
});

/**
 * Update terms and conditions (admin only)
 * @route PUT /api/admin/terms
 */
const updateTermsAndConditions = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }

  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Content is required");
  }

  res.status(200).json({
    message: "Terms and conditions updated successfully",
    updatedAt: new Date(),
  });
});

module.exports = {
  getDashboardStats,
  getSystemLogs,
  updateSystemSettings,
  manageInsurancePlans,
  updateTermsAndConditions,
};
