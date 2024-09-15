const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
});
userSchema.plugin(passportLocalMongoose);  // ye username and password ka sab kux sambhal lega

module.exports=mongoose.model("User",userSchema); // ye export kr diya