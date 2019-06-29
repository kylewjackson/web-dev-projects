const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


//root route
router.get('/', (req, res) =>{
	res.render('landing');
});


//show register form
router.get('/register', (req, res) => {
	res.render('register');
})
//handle sign up logic
router.post('/register', (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/register');
			return;
		} else {
			passport.authenticate('local')(req, res, () => {
				req.flash('success', `Welcome to YelpCamp ${user.username}!`);
				res.redirect('/campgrounds');
			})
		}
	});
});

//show login form
router.get('/login', (req, res) => {
	res.render('login');
});
//handle log in logic
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login',
		failureFlash: true,
		successFlash: `Welcome back ${req.body.username}!`
	})(req, res);
})

//logout route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You have been logged out');
	res.redirect('/campgrounds');
});

module.exports = router;