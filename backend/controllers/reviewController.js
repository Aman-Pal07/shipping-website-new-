const Review = require("../models/reviewModel.js");
const { asyncHandler } = require("../middlewares/errorMiddleware");

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body

    const { name, rating, comment } = req.body;

    // Validate required fields
    if (!name || !rating || !comment) {
      const error = new Error(
        "Please provide all required fields: name, rating, and comment"
      );
      error.statusCode = 400;
      throw error;
    }

    const review = await Review.create({
      name,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create review",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Get a single review
// @route   GET /api/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

module.exports = {
  createReview,
  getReviews,
  getReview,
};
