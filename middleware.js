const Campground = require('./models/campground');
const { campgroundSchema,reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    //Passport method to find if someone is already logged in 
    if (!req.isAuthenticated()) {
        //we create returnTo variable in session so that it will be available across the site 
        //req.originalUrl gives current Url opened by user 
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please login to Continue');
        return res.redirect('/login')
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'you dont have permission to edit this page');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you dont have permission to delete this review ');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};