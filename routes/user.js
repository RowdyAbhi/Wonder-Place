const express = require("express");
const wrapasync = require("../utils/wrapasync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveredirecturl } = require("../middeware");

const usercontroller = require("../Controllers/user");


router.route("/signup")
    .get(usercontroller.signupform)  // Get route for signup
    .post(wrapasync(usercontroller.signup));  // Post route for signup


router.route("/login")
    .get(usercontroller.loginform)  // get route for login
    .post(saveredirecturl, passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        },
    ),
        usercontroller.login

    );


// Get for logout
router.get("/logout", usercontroller.logout);


module.exports = router;
