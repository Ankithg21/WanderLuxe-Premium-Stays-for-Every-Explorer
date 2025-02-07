const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
var methodOverride = require('method-override');
const body_parser=require("body-parser");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const Listing=require("./models/listing.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

app.use(express.urlencoded({extended:true}));
app.use(body_parser.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

//Making connection with DataBase using Mongoose.
main().then((res)=>{
    console.log("Connection Successful for DataBase.")
}).catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/DataBaseAIRBNB');
}

//Validating(Server Side) for Listings.
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
};

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
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Review Delete Route.
app.delete("/listings/:id/reviews/:reviewId",(wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})));

//index Route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route.
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route.
app.post("/listings",validateListing,wrapAsync(async(req,res)=>{
    // let {title,description,image,price,location,country}=req.body;
    let listing=req.body.listing;
    let newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Show Route.
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//Edit Route.
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route.
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    if(!(req.body.listing)){
        throw new ExpressError(400,"Send Valid Data for Listings!");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//delete Route.
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.get("/testListing",async(req,res)=>{
//     let newListing=new Listing({
//         title:"My New Villa",
//         description:"By The Beach",
//         price:1200,
//         location:"New York",
//         country:"USA"
//     });
//     await newListing.save();
//     console.log("Sample Saved.");
//     res.send("Successful Testing.");
// });

app.get("/",(req,res)=>{
    res.send("Hii");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!")); 
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something Went Wrong!"}=err;
    res.render("listings/error.ejs",{err});
    // res.status(statusCode).send(message);
});

const port=5555
app.listen(port,()=>{
    console.log(`server running on port ${port}.`);
});