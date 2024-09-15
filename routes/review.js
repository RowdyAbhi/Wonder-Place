const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
// const { listingSchema,reviewSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isauthor}=require("../middeware.js");
const reviewcontrollers=require("../Controllers/review.js");


// Reviews k routes

// create krne ka route
router.post("/reviews",isLoggedIn,validateReview, wrapAsync(reviewcontrollers.createReview));

// Reviews ko delete krne ka route
router.delete("/reviews/:reviewId",isLoggedIn,isauthor, wrapAsync(reviewcontrollers.deleteReview));



module.exports=router;