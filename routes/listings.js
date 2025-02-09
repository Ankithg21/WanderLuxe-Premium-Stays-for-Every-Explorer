const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");

//Validating(Server Side) for Listings.
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
};

//index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route.
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route.
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    // let {title,description,image,price,location,country}=req.body;
    let listing=req.body.listing;
    let newListing=new Listing(listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

//Show Route.
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//Edit Route.
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route.
router.put("/:id",wrapAsync(async(req,res)=>{
    if(!(req.body.listing)){
        throw new ExpressError(400,"Send Valid Data for Listings!");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
}));

//delete Route.
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports=router;
