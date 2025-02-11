module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must Be Logged in to Create New Listing.");
        res.redirect("/login");
    }
    next();
}