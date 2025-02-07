const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

//Validating(Server Side) for Reviews.
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
};

//Reviews POST Route.
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Review Delete Route.
router.delete("/:reviewId",(wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})));

module.exports=router;


