
if (process.env.NODE_ENV !== 'production') {
    /*Below method takes variables from .env file and adds it to Node process(process.env) as a variable
    so that it is available across the app . 
    we mention dotenv but it can automatically access .env file and set the varaiable */
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const MongoDBStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const secret = process.env.SECRET || 'thisshouldbeabettersecret';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => { console.log('connection open') })
    .catch(err => {
        console.log('OH NO Error');
        console.log(err);
    });
//store sessions in db
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60

})
//create session
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session(sessionConfig));
app.use(flash());

//use passport.Must be initializzed only after app.use(session(sessionConfig))
app.use(passport.initialize());
//to persist login session so user would be authenticated on every page
app.use(passport.session());
/*set local srategy(user name and password auth) using passport-local module.
Passport uses authentication method created automatically by passport-local-mongoose plugin

*/
passport.use(new LocalStrategy(User.authenticate()));
//store userID in session  
passport.serializeUser(User.serializeUser());
//delete userID from session 
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went Wrong!' } = err;
    if (!err.message) err.message = 'No, Something went wrong !';
    res.status(statusCode).render('error', { err });

});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

