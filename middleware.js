const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (message) =>{ 
  return (req, res, next) => {
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash("error",message);
      return res.redirect("/login")
    };
    next();
};
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "You dont have permission to update!");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ExpressError(400, "Body is empty");
  }
  const { error } = listingSchema.validate(req.body, { abortEarly: false });
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join("<br>");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ExpressError(400, "Body is empty");
  }
   const {error} = reviewSchema.validate(req.body, {abortEarly: false});
    // console.log(result);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join("<br>");
      console.log(errMsg)
    throw new ExpressError(400, errMsg);
  }
    else{
      next();
    }
};

module.exports.isReviewAuthor = async(req, res, next) => {
  let { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the author of this review!");
      return res.redirect(`/listings/${id}`);
    }
    next();
};