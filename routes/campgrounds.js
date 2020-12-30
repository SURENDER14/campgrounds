const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campGround = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
/*Multer is a node.js middleware for handling/parsing  multipart/form-data (encryption type), 
which is primarily used for uploading files
*/
const multer = require('multer');
//Below from 'multer-storage-cloudinary' package. connects multer with cloudinary to upload files 
const { storage } = require('../cloudinary');

const upload = multer({ storage });//specifying multer to save file data to cloud


//upload.array gets image data from new form and uploads it to cloudinary 
router.route('/').get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id').get(isLoggedIn, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
module.exports = router;