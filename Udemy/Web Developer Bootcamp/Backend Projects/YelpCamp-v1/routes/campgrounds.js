const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//INDEX - show all campgrounds
router.get('/', (req, res) => {
	//get all campgrounds from db
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	})
});

//CREATE - add new campground to database
router.post('/', middleware.isLoggedIn, (req, res) => {
	//get data from form
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {name: name, price: price, image: image, description: desc, author: author};
	//create new campground and save to db
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect('/campgrounds');
		}
	})
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
})

//SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
	//find campground with provided id
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err || !foundCampground) {
			req.flash('error', 'Campground not found.');
			res.redirect('back');
		} else {
			// console.log(foundCampground);
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});


//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err || !foundCampground) {
			req.flash('error', 'Something went wrong.');
			res.redirect('back');
		} else {
			res.render('campgrounds/edit', {campground: foundCampground});
		};	
	});
});



//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	})
});


module.exports = router;

