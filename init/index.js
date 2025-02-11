const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().then((res)=>{
    console.log("Connection Successful for DataBase.")
}).catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/DataBaseAIRBNB');
};

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67aad17e72d67a832d51ca43"}));
    await Listing.insertMany(initData.data);
    console.log("Data is Initialied!");
};

initDB();

