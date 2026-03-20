const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  };

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
  };

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
  };


  // Geocode function

async function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "stayhub/1.0 (supreetashi11@gmail.com)"
    }
  });

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("Address not found");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
}

module.exports.createListing = async (req, res, next) => {
  try {
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    // Get coordinates from location
    const coords = await getCoordinates(newListing.location);

    // Assign GeoJSON geometry
    newListing.geometry = {
      type: 'Point',
      coordinates: [coords.lng, coords.lat] // Note: [lng, lat] order
    };

    newListing.owner = req.user._id;
    newListing.image = { url, filename };

   let savedListing= await newListing.save();
   console.log(savedListing)

    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,q_auto,f_auto,e_blur:50")
    res.render("listing/edit.ejs", { listing, originalImageUrl });
  };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //  Update image if uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
  }

  //  ALWAYS update coordinates if location exists
  if (req.body.listing.location) {
    const coords = await getCoordinates(req.body.listing.location);
    console.log("New coords:", coords);

    updatedListing.geometry = {
      type: 'Point',
      coordinates: [coords.lng, coords.lat]
    };
  
    console.log(updatedListing)
    await updatedListing.save();
    };
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  };
  