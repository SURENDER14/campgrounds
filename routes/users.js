const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users')

router.route('/register').get(users.renderRegister)
    .post(catchAsync(users.registerUser));

router.route('/login').get(users.renderLoginPage)
    /*
    passport's authenticate middleware validates the user name and password by checking db 
    If login fails flashes error in redirect page
    */
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;

