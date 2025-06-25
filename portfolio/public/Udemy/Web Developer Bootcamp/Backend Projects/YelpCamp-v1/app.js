const express 	 	 = require('express'),
	  app 	  	 	 = express(),
	  bodyParser 	 = require('body-parser'),
	  mongoose 	 	 = require('mongoose'),
	  passport 	 	 = require('passport'),
	  LocalStrategy  = require('passport-local'),
	  Campground 	 = require('./models/campground'),
	  Comment 	 	 = require('./models/comment'),
	  User 			 = require('./models/user'),
	  seedDB 	 	 = require('./seeds'),
	  methodOverride = require('method-override'),
	  flash 		 = require('connect-flash');

//require routes
const commentRoutes    = require('./routes/comments'),
	  campgroundRoutes = require('./routes/campgrounds'),
	  indexRoutes 	   = require('./routes/index');

const url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp';
mongoose.connect(url, { 
	useNewUrlParser: true, 
	useFindAndModify: false 
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seed database
// seedDB();

//passport configuration
app.use(require('express-session')({
	secret: 'Tyne Daly Yo',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


// //c9 server
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log('YelpCamp server has started!');
// });

//local server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('The YelpCamp server has started!');
});