const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment')

const data = [
	{
		name: 'Laidto Rest',
		image: 'https://farm4.staticflickr.com/3935/15330165577_37788ab759_b.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	},
	{
		name: 'Wolf Creek',
		image: 'https://farm3.staticflickr.com/2022/2104390061_f7a929b26b_b.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	},
	{
		name: 'Coffin Rock',
		image: 'https://farm1.staticflickr.com/821/40170812364_b195a8e9d5_b.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	}
]

function seedDB() {
	//remove all campgrounds
	Campground.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		}
		console.log('removed campgrounds!');
		Comment.deleteMany({}, (err) => {
			if (err) {
				console.log(err);
			}
			console.log('removed comments!');
			//add a few campgrounds
			data.forEach(seed => {
				Campground.create(seed, (err, campground) => {
					if (err) {
						console.log(err);
					} else {
						console.log('Added campground');
						//add comment
						Comment.create({
							text: 'This place sucks, super spoopy.',
							author: 'Heather'
						}, (err, comment) => {
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log('created new comment');
							}
						})
					}
				})
			});
		})
	});
}

module.exports = seedDB;
