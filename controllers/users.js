
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        username = username.toLowerCase();
        const user = new User({ username, email });
        //register method was automatically created by passport-local-mongoose plugin 
        //This method registers user instance with the given password and user is saved in db
        //register method checks for username uniqueness and also hashes password
        const registerUserInstanceWithPassword = await User.register(user, password);
        req.login(registerUserInstanceWithPassword, err => {
            if (err) return next(err);
            else {
                req.flash('success', 'Welcome to Campgrounds!');
                res.redirect('/campgrounds')


            }
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};
module.exports.renderLoginPage = (req, res) => {
    res.render('users/login')
};
module.exports.loginUser = (req, res) => {
    req.flash('success', 'Logged in Successfully!');

    redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};
module.exports.logoutUser = (req, res) => {
    //Passport adds a method in request object which helps for logout 
    req.logout();
    req.flash('success', 'Logged out Successfully');
    res.redirect('/');

};