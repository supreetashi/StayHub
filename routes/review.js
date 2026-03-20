const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const { createReview, destroyReview } = require("../controller/reviews.js");

// Post Review Route
router.post(
  "/",
  isLoggedIn("You must be logged in to add a review"),
  validateReview,
  wrapAsync(createReview),
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn("You must be logged in to delete a review!"),
  isReviewAuthor,
  wrapAsync(destroyReview),
);

module.exports = router;
