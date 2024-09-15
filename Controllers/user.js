const User = require("../models/user");


// signup form
module.exports.signupform= (req, res) => {
    res.render("user/signup.ejs");
};

// signup
module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WonderPlace");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// login form
module.exports.loginform=(req, res) => {
    res.render("user/login.ejs");
};

// login
module.exports.login= async (req, res) => {
    req.flash("success", "Welcome back to WonderPlace");
    let redirectURL=res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectURL);
};

// logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out Successfully!");
        res.redirect("/listings");
    })
};