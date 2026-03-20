const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  renderNewForm,
  renderEditForm,
  showListing,
  createListing,
  destroyListing,
  updateListing,
} = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn("You must be logged in to become a host!"),
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing),
  );

// New Route
router.get(
  "/new",
  isLoggedIn("You must be logged in to to become a host!"),
  renderNewForm,
);

router.get("/search", async (req, res) => {
  let { q } = req.query;

  if (!q) {
    req.flash("error", "Please enter a search term");
    return res.redirect("/listings");
  }

  // Trim and clean input
  q = q.trim();

  const listings = await Listing.find({
    $or: [
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ]
  });

  res.render("listing/search.ejs", { listings, q });
});

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn("You must be logged in to update a listing!"),
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListing),
  )
  .delete(
    isLoggedIn("You must be logged in to delete a listing!"),
    isOwner,
    wrapAsync(destroyListing),
  );

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn("You must be logged in to edit a listing!"),
  isOwner,
  wrapAsync(renderEditForm),
);


module.exports = router;
