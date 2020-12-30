const campGround = require('../models/campground');

module.exports.index = async (req, res, next) => {

    const campgrounds = await campGround.find({});
    res.render('campgrounds/index', { campgrounds });
};
module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new')
};

module.exports.showCampground = async (req, res, next) => {
    const campground = await campGround.findById(req.params.id).
        populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');

    if (!campground) {
        req.flash('error', 'cannot find this campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};
module.exports.createCampground = async (req, res, next) => {
    const campground = new campGround(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`campgrounds/${campground._id}`);

};
module.exports.renderEditForm = async (req, res, next) => {

    const campground = await campGround.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'cannot find this campground!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
};
module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!');
    res.redirect(`/campgrounds`);
};
module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await campGround.findByIdAndUpdate(id, { ...req.body.campground });
    const newImg = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImg);
    await campground.save();
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
};