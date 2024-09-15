const Listing=require("../models/listing");

// all listings ka
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
};

// new form ka route 
module.exports.newForm=(req, res) => {
    res.render("listing/new.ejs");
};


// Show route ka
module.exports.showlisting=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
                    .populate({path:"review",
                        populate:{path:"author"},})
                    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
}

// create post krna
module.exports.createlistings=async (req, res) => {
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send Valid Data");
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing has been created successfully!");
    res.redirect("/listings");
};

// edit form ka route
module.exports.editform=async (req, res) => {
    let { id } = req.params;  //id kheenchi
    const listing = await Listing.findById(id);  //id se dhundha
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let ogimageurl=listing.image.url;
    // console.log(ogimageurl);
    ogimageurl=ogimageurl.replace("/upload","/upload/c_scale,h_200,w_250");

    res.render("listing/edit.ejs", { listing, ogimageurl });
};

// update route
module.exports.updatelisting=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // image and url tbhiu achnge honge jb kux naya aaya hoga
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing has been updated successfully!");

    res.redirect(`/listings/${id}`);
};


// delete listing ka route
module.exports.deletelisting=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing has been deleted successfully!");

    res.redirect("/listings");
};