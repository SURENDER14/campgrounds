
const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas.js');
const campGround = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas.js');
const { isReviewAuthor, validateReview } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;