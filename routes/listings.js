const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js"); // model ko require kr liya h
// const { listingSchema} = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isowner, validateListing } = require("../middeware.js");

const listingcontroller = require("../Controllers/listing.js");

const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});


router.route("/")
    .get(wrapAsync(listingcontroller.index))  // index route
    .post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.createlistings));  // create route
   
//    ye upload folder k liye pehl basics seekh rhe the
    // .post(upload.single("listing[image]"),(req,res)=>{
    //     res.send(req.file);
    // })

//New Route
router.get("/new", isLoggedIn, wrapAsync(listingcontroller.newForm));


router.route("/:id")
    .get(wrapAsync(listingcontroller.showlisting))  // Show route
    .put(isLoggedIn, isowner,upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.updatelisting))  // Update route
    .delete(isLoggedIn, isowner, wrapAsync(listingcontroller.deletelisting));  // Delete Route


// Edit Route  
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(listingcontroller.editform));


module.exports = router;