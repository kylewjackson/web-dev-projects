const expressSanitizer = require('express-sanitizer')
	  methodOverride   = require('method-override'),
	  bodyParser 	   = require('body-parser'),
	  mongoose 		   = require('mongoose'),
	  express 		   = require('express'),
	  app 			   = express();


//app config
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { 
	useNewUrlParser: true, 
	useFindAndModify: false 
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));


//mongoose/model config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
const Blog = mongoose.model('Blog', blogSchema);


// RESTful routes
app.get('/', (req, res) => {
	res.redirect('/blogs');
});

//INDEX route
app.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', {blogs: blogs});
		};
	});
});

//NEW route
app.get('/blogs/new', (req, res) => {
	res.render('new');
});


//CREATE route
app.post('/blogs', (req, res) => {
	//create blogs
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog) => {
		if (err) {
			res.render('new');
		} else {
			//redirect
			res.redirect('/blogs');
		}
	});
});


//Show route
app.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('show', {blog: foundBlog});
		}
	})
})


//Edit Route
app.get('/blogs/:id/edit', (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('edit', {blog: foundBlog});
		}
	});
});


//Update route
app.put('/blogs/:id', (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect(`/blogs/${req.params.id}`);
		}
	})
});


//Delete Route
app.delete('/blogs/:id', (req, res) => {
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
});


//listen
app.listen(3000, () => {
	console.log('Honest to Blog, the server is preggo!');
});
