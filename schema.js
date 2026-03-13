const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required().label("Title"),
    description: joi.string().required().label("Description"),
    location: joi.string().required().label("Location"),
    country: joi.string().required().label("Country"),
    price: joi.number().required().min(0).label("Price"),
    image: joi.string().allow("", null).label("Image"),
  }).required(),
}).required();

module.exports.reviewSchema = joi.object({
  review: joi.object({
    comment: joi.string().required().label("Comment"),
    rating: joi.number().required().min(1).max(5).label("Rating"),
  }).required(),
});


