const Review = require("../models/review");
const Listing = require("../models/listing.js"); // model ko require kr liya h


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    listing.review.push(newreview);
    newreview.author=req.user._id;
    await newreview.save();
    await listing.save();
    req.flash("success","Review has been saved successfully!");

    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review has been deleted successfully!");

    res.redirect(`/listings/${id}`);
};