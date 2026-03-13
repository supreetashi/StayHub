const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js")
const Listing = require("../models/listing.js");


function validateListing(req, res, next){
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ExpressError(400, "Body is empty");
  }
   const {error} = listingSchema.validate(req.body, {abortEarly: false});
    // console.log(result);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join("<br>");
      console.log(errMsg)
    throw new ExpressError(400, errMsg);
  }
    else{
      next();
    }
}

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }),
);

// New Route
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
  }),
);

// Create Route
router.post(
  "/", validateListing,
  wrapAsync(async (req, res, next) => {
    // if (!req.body || !req.body.listing) {
    //   throw new ExpressError(400, "Send valid data");
    // }
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
    // can add try catch and next variable and next function,
    // but express v5 does it automatically
  })
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
      if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
  }),
);

// Update Route
router  .put(
  "/:id", validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;