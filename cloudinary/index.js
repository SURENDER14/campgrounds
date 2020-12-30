//Cloudinary extension package for integrating cloudinary with node app 

const cloudinary = require('cloudinary').v2;

/*
Multer-Storage-cloudinary .This package helps connect multer with cloudinary . 
Parsed file data can be uploaded to cloudinary using this package . 
This package also helps to add file url to request objects 
*/
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//configure cludinary with your password .Below method is from cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
//setting up a folder in cloudinary 
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',//Folder that we can name to setup in cloudinary 
        allowedFormats: ['jpeg', 'png', 'jpg'] // supports promises as well

    },
});

module.exports = {
    cloudinary,
    storage
}