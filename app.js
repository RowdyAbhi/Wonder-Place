// env file ko access krne k liye
if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js"); 

const dbUrl=process.env.ATLASDB_URL;

// This is session storage 
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});

store.on("error",()=>{
  console.log("error is generated on MongoStore",err);
});

const sessionoptions=({
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,   // aaj ki date se agle 7 din tk
    maxAge:7*24*60*60*1000,   
    httpOnly:true,  // ye cross-scripting attack se bachata h
  }
});

app.use(session(sessionoptions));
app.use(flash());

// Passport ki basic settings
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser=req.user; // ye vha login signup vgreah me use hoga ye h curr user ki details
  next();
})


// routes require kr liye
const listingrouter=require("./routes/listings.js");  
const reviewrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");


// EJS_MATE for layouts
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));


const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening to the ${port}`);
});


const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(dbUrl);
};
main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));



// listings k routes
app.use("/listings",listingrouter);

// Reviews ka route
app.use("/listings/:id",reviewrouter)

// user k routes
app.use("/",userrouter);

//Sarkari route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Custom error handler h koi b error aaega to ye run ho jaaega
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err });
}); 