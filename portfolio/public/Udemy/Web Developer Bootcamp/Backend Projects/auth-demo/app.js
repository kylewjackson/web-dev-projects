const express  				= require('express'),
	  mongoose 				= require('mongoose'),
	  passport 				= require('passport'),
	  bodyParser 			= require('body-parser'),
	  LocalStrategy 		= require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  User 					= require('./models/user');


mongoose.connect('mongodb://localhost:27017/auth_demo_app', { 
	useNewUrlParser: true, 
	useFindAndModify: false 
});

const app = express();
app.set('view engine', 'ejs');

app.use(require('express-session')({
	secret: 'Tyne Daly Yaas Mama',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//======================
// ROUTES
//======================

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
	res.render('secret');
})

//AUTH ROUTES
//Show signup form
app.get('/register', (req, res) => {
	res.render('register');
});
//Usersignup
app.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			res.render('register');
		} else {
			passport.authenticate('local')(req, res, () => {
				res.redirect('/secret');
			});
		};
	});
});

//LOGIN ROUTES
//render login form
app.get('/login', (req, res) => {
	res.render('login');
});
//login logic
//middleware
app.post('/login', passport.authenticate('local', {
	successRedirect: '/secret',
	failureRedirect: '/login'
}), (req, res) => {
	console.log('butt');
})


//LOGOUT ROUTES
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}



app.listen(3000, () => {
	console.log('Shh!! Secret Server Started');
});