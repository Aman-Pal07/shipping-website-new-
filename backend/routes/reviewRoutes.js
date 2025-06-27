const express = require("express");
const {
  createReview,
  getReviews,
  getReview,
} = require("../controllers/reviewController.js");

const router = express.Router();

// Public routes
router.route("/").get(getReviews).post(createReview);

router.route("/:id").get(getReview);

module.exports = router;
