const mongoose=require("mongoose");
const Review=require("./review.js");
const { Schema } = mongoose;
//creating a schema for Listing(variables and types of variables).
const ListingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(V)=>(V===" ")?"https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":V
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type: Schema.Types.ObjectID,
            ref:"Review"
        }
    ]
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

//creating Model using ListingSchema.
const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;