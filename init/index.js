const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing=require("../models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderplace');     
};
main()
    .then(()=>{
        console.log("Connection successful");
    })
    .catch((err)=>console.log(err));



const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"66dc2fdae2c8ab87faddb508"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();