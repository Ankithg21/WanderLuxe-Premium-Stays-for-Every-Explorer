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

const listings=require("./routes/listings.js");
const reviews=require("./routes/review.js");

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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


