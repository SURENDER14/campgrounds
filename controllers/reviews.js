const campGround = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'Successfully added your review');
    res.redirect(`/campgrounds/${campground._id}`);


};
module.exports.deleteReview= async (req, res) => {

    const { id, reviewId } = req.params;
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}; 