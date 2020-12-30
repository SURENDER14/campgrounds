
const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => { console.log('connection open') })
    .catch(err => {
        console.log('OH NO Error')
        console.log(err)
    });

const samples = array => array[Math.floor(array.length * Math.random())];

const seedDB = async () => {
    await campground.deleteMany({});
    for (i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor((Math.random() * 20)) + 10;
        const camp = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${samples(descriptors)} ${samples(places)}`,
            images: [{
                url: 'https://res.cloudinary.com/dva0tcs4d/image/upload/v1609243560/YelpCamp/fwsaihgivy40ztofi0k9.jpg',
                filename: 'YelpCamp/fwsaihgivy40ztofi0k9'
            }],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic dolorum nemo eveniet dolorem nobis fugit modi nisi natus ipsa iure, veniam minus tenetur maiores incidunt! Nisi assumenda distinctio cumque amet.',
            price,
            author: '5fe8b170b262620bae889d5c'

        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})