import React from 'react';
import './App.css';
import { CartIcon, CloseArrowIcon, StarIcon, StarOutline, StarHalf, PlusIcon, MinusIcon, ThumbsUpIcon, ThumbsDownIcon } from './Icons';

const imagePath = process.env.PUBLIC_URL + '/images/';

// deep copy helper for arrays
function deepCopy(ele) {
	return JSON.parse(JSON.stringify(ele));
};

//shallow clone
// function shallowClone(obj) {
//   return Object.create(
//       Object.getPrototypeOf(obj),
//       Object.getOwnPropertyDescriptors(obj)
//   );
// };

//generate thumbnails
function genThumbs(amt, def) {
	return Array(amt).fill(def).map((pic, i) => `${imagePath}${pic}-${i + 1}.jpg`);
};

//colors
const colorWhite = '#EFEFEF';
const colorBlack = '#0F0F0F';
const colorDarkGrey = '#383838';
const colorYellow = '#FFF59B';
const colorRed = '#9E1800';

//regex
function transformId(ele) {
	const symbols = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/;
	if (ele.match(symbols)) {
		return false;
	} else {
		const whitespace = /\s/g;
		return ele.split('').map(i => i.match(whitespace) ? '-' : i.toLowerCase()).join('');
	};
};

//product options
const itemOptions = Array(3).fill(null).map((opt, i) => {
	return { name: `Option ${i + 1}`, id: `opt-${i + 1}` }
});

//info of the product on current page
const currentProduct = {
	prodName: 'Your Product',
	prodId: null,
	opt: '',
	qty: 1,
	price: 10.50,
	thumb: genThumbs(3, 'jar'),
};

currentProduct.prodId = transformId(currentProduct.prodName);

//items initially in cart
const initInCart = [
	{
		prodName: 'Product 1',
		prodId: null,
		opt: itemOptions[2].id,
		qty: 1,
		price: 29.99,
		thumb: genThumbs(3, 'notebook'),
	},
	{
		prodName: 'Product 2',
		prodId: null,
		opt: itemOptions[1].id,
		qty: 3,
		price: 11.45,
		thumb: genThumbs(3, 'necklace'),
	},
];

initInCart.forEach(item => item.prodId = transformId(item.prodName));

//max qty of items in cart
const maxQty = 9;

//initial revies
const initReviews = [
	{
		user: 'Cool User',
		id: null,
		rating: 4,
		rated: [],
		publishedRating: 4,
		review: "I love this product sooooo much, what would I do without it??",
		hidden: false,
		feedback: { up: 38, down: 2 },
		date: new Date(2018, 3, 10, 7, 45, 16).toLocaleDateString("en-US", { dateStyle: 'medium', timeStyle: 'medium' }),
	},
	{
		user: 'Troll',
		id: null,
		rating: 1,
		rated: [],
		publishedRating: 1,
		review: "I didn’t use this product correctly and I HATE IT.",
		hidden: false,
		feedback: { up: 10, down: 155 },
		date: new Date(2019, 6, 23, 18, 12, 13).toLocaleDateString("en-US", { dateStyle: 'medium', timeStyle: 'medium' }),
	},
].sort((a, b) => b.feedback.up - a.feedback.up);

initReviews.forEach(review => {
	review.id = transformId(review.user);
});

const maxRating = 4;

const freshState = {
	qty: parseInt(currentProduct.qty),
	opt: currentProduct.opt,
	sort: 'helpful',
	stars: 0,
	rated: [],
	loggedIn: null,
	openLogin: false,
	openSignup: false,
	user: null,
	userId: null,
	rating: null,
	publishedRating: null,
	reviewBody: '',
	reviewSubmitted: false,
	edit: false,
	itemsInCart: [],
	cartClosed: true,
};

class Modal extends React.Component {

	constructor(props) {
		super(props);
		this.buttonFocus = React.createRef();
		this.container = React.createRef();
		this.keydownCallback = (e) => {
			if (e.key === 'Escape') {
				this.props.handleModal({ act: 'close' });
			};
		};
		this.clickCallback = (e) => {
			if (e.target === this.container.current) {
				this.props.handleModal({ act: 'close' });
			};
		};
	};

	componentDidUpdate() {
		if (this.props.show) {
			const modalButton = this.buttonFocus.current;
			//focus button
			modalButton.focus();
			//prevent body scroll
			document.body.style.overflow = 'hidden';
			//add listeners for closing with escape and click
			document.addEventListener('keydown', this.keydownCallback);
			document.addEventListener('click', this.clickCallback);
		} else if (document.body.style.overflow === 'hidden') {
			document.body.style.overflow = 'unset';
			document.removeEventListener('keydown', this.keydownCallback);
			document.removeEventListener('click', this.clickCallback);
		};
	};

	render() {
		const showButton = this.props.btn && typeof this.props.btn.rmv === 'number' ?
			[
				<button type="button" key="confirm-remove" ref={this.buttonFocus} onClick={() => this.props.handleModal({ act: 'close', rmv: this.props.btn.rmv })}>Remove</button>,
				<button type="button" key="cancel-remove" onClick={() => this.props.handleModal({ act: 'close' })}>Cancel</button>,
			] :
			<button type="button" onClick={() => this.props.handleModal({ act: 'close' })} ref={this.buttonFocus}>Close</button>
		if (!this.props.show) {
			return null;
		} else {
			return (
				<div id="modal" className="modal" ref={this.container}>
					<aside id="modal-window" className="modal-window" role="dialog" aria-labelledby="modal-message">
						{this.props.img ?
							<img src={this.props.img} alt="main thumb in modal" className="modal-images" /> :
							<p id="modal-message">{this.props.msg ? this.props.msg : ''}</p>
						}
						{showButton}
					</aside>
				</div>
			);
		};
	};
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			modalImg: null,
			modalMsg: null,
			modalBtn: null,
			prevEle: null,
			navOpen: false,
			qty: parseInt(currentProduct.qty),
			opt: currentProduct.opt,
			reviews: deepCopy(initReviews),
			sort: 'helpful',
			stars: 0,
			rated: [],
			loggedIn: null,
			openLogin: false,
			openSignup: false,
			user: null,
			userId: null,
			rating: null,
			publishedRating: null,
			reviewBody: '',
			reviewSubmitted: false,
			edit: false,
			itemsInCart: deepCopy(initInCart),
			cartClosed: true,
		};

		this.prodName = currentProduct.prodName;
		this.prodId = currentProduct.prodId;
		this.price = currentProduct.price;
		this.subthumbs = [...currentProduct.thumb];

		this.checkIfInCart = this.checkIfInCart.bind(this);
		this.checkFeedback = this.checkFeedback.bind(this);

		this.handleModal = this.handleModal.bind(this);

		this.toggleMenu = this.toggleMenu.bind(this);
		this.editReview = this.editReview.bind(this);

		this.handleInput = this.handleInput.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.preventEnter = this.preventEnter.bind(this);
		this.handleButton = this.handleButton.bind(this);
		this.handleUsername = this.handleUsername.bind(this);
		this.handleText = this.handleText.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleFilterReviews = this.handleFilterReviews.bind(this);
	};

	handleModal(params, e) {
		//set passed in element
		if (e) {
			params.prev = e.target;
		};
		if (params.act === 'close') {
			//focus previously focused element
			if (this.state.prevEle) {
				this.state.prevEle.focus();
			};
			//remove item from cart, with rmv being index of item in cart
			if (typeof params.rmv === 'number') {
				this.setState({ itemsInCart: deepCopy(this.state.itemsInCart).filter((item, i) => i !== params.rmv) });
			};
			this.setState({
				modal: false,
				modalImg: false,
				modalMsg: null,
				modalBtn: null,
				prevEle: null,
			});
		} else {
			this.setState({
				modal: true,
				modalImg: params.img ? params.img : null,
				modalMsg: params.msg ? params.msg : null,
				modalBtn: params.btn ? params.btn : null,
				prevEle: params.prev ? params.prev : null,
			});
		};
	};

	//accepts index as ind, type of input, and event as e
	handleInput(params, e) {
		if (params === 'ratings') {
			const starFilter = parseInt(e.target.value);
			//filter out all reviews that are not of that star rating
			this.setState({
				stars: starFilter,
				reviews: starFilter < 1 ?
					this.state.reviews.map(review => {
						if (review.hidden) {
							review.hidden = false;
						};
						return review;
					}) :
					this.state.reviews.map(review => {
						review.rating === starFilter ? review.hidden = false : review.hidden = true;
						return review;
					}),
			});
		} else {
			this.handleOptions(params, e);
		};
	};

	handleOptions(params, e) {
		//set e based on input type
		let val = typeof e !== 'number' ? e.target.value : e;
		if (typeof e === 'number') {
			if (params.add) {
				val++;
			} else {
				val--;
			};
		};
		if (params.type === 'qty') {
			//max out qty at max qty
			if (val > maxQty) {
				val = maxQty;
				// alert(`Sorry, you can't have more than ${maxQty} of an item`);
				this.handleModal({ msg: `Sorry, you can't have more than ${maxQty} of an item`, prev: e.target });
			} else if (val - 1 === -1) {
				//make sure input doesn't go lower than 1
				val = 1;
			}
		};
		if (params.ind > -1) {
			//make a copy of the itemsInCart state array
			const itemArray = deepCopy(this.state.itemsInCart);
			//set object at array index's key to whatever was selected
			if (params.type === 'qty') {
				itemArray[params.ind].qty = parseInt(val);
				//update state with new array
				this.setState({ itemsInCart: itemArray });
			} else if (params.type === 'opt') {
				//set option
				itemArray[params.ind].opt = val;
				//splice item out of cart to compare for dupes
				const arrayToCheck = deepCopy(itemArray);
				const itemToCheck = arrayToCheck.splice(params.ind, 1);
				const checkedCart = this.checkIfInCart(itemToCheck[0], arrayToCheck, 'opt');
				//if there's a dupe, run addItem with spliced item
				if (checkedCart.hasDupe) {
					this.setState({ itemsInCart: this.addItem(itemToCheck[0], checkedCart.cart) });
				} else {
					//else set cart state with spliced element intact
					this.setState({ itemsInCart: itemArray });
				}
			};
		} else {
			//reset quantity on option change
			if (params.type === "opt" && val !== this.state.opt) {
				this.setState({ qty: 1 });
			};
			this.setState({ [params.type]: val });
		};
	};

	handleFocus(e) {
		e.target.select();
	};

	preventEnter(e) {
		if (e.which === 13) {
			e.preventDefault();
		};
	};

	handleSubmit(ind, type, e) {
		e.preventDefault();

		//remove from cart
		if (type === 'cart' && ind > -1) {
			this.handleModal({ msg: 'Are you sure you want to delete this item?', btn: { rmv: ind } });
		} else if (type === 'cart') {
			//add to cart
			const itemToAdd = {
				prodName: this.prodName,
				prodId: this.prodId,
				thumb: this.subthumbs,
				opt: this.state.opt,
				qty: this.state.qty,
				price: this.price,
			};
			this.setState({ itemsInCart: this.addItem(itemToAdd), qty: freshState.qty, opt: freshState.opt });
		};

		//sign in/out
		if (type === 'login') {
			//make sure user exists
			if (this.state.reviews.some(review => review.id === this.state.userId)) {
				//get user review
				const userReview = this.state.reviews.filter(review => review.id === this.state.userId)[0];
				this.setState({
					loggedIn: true,
					openLogin: false,
					rating: userReview.rating,
					publishedRating: userReview.publishedRating,
					reviewBody: userReview.review ? userReview.review : "",
					reviewSubmitted: userReview.review ? true : false,
					rated: userReview.rated,
				});
				//check for cart
				userReview.cart ?
					this.combineCarts(userReview.cart) :
					this.setState({ itemsInCart: this.state.itemsInCart.length > 0 ? deepCopy(this.state.itemsInCart) : [] });
				//resort reviews with user's review at bottom, if applicable
				this.handleFilterReviews(this.state.sort);
			} else {
				// alert(`There's no user named ${this.state.user}. Trying signing up instead.`);
				this.handleModal({ msg: `There's no user named ${this.state.user}. Trying signing up instead.`, prev: document.querySelector('form input') })
				this.setState({ openLogin: false, openSignup: true });
			};
		} else if (type === 'signup') {
			// create review entry for user, if not already
			if (!this.state.reviews.some(review => review.id === this.state.userId)) {
				const userToAdd = {
					user: this.state.user,
					id: this.state.userId,
					rating: this.state.rating,
					rated: this.state.rated,
				};
				this.setState({
					reviews: deepCopy(this.state.reviews).concat(userToAdd),
					loggedIn: true,
					openSignup: false,
				});
			} else {
				// alert(`The user ${this.state.user} already exists. Try signing in instead.`);
				this.handleModal({ msg: `The user ${this.state.user} already exists. Try signing in instead.`, prev: document.querySelector('form input') });
				this.setState({ openSignup: false, openLogin: true });
			};
		} else if (type === 'logout') {
			//empty cart and reset states on logout
			if (this.state.loggedIn) {
				//retain cart in review
				const userCart = this.state.itemsInCart.length > 0 ? deepCopy(this.state.itemsInCart) : [];
				const reviewFeedback = this.state.rated.length > 0 ? deepCopy(this.state.rated) : [];
				const userReviews = this.state.reviews.map(review => {
					if (review.id === this.state.userId) {
						review.cart = userCart;
						review.rated = reviewFeedback;
					};
					if (review.hidden) {
						review.hidden = false;
					};
					return review;
				});
				this.handleFilterReviews(this.state.sort, userReviews);
				//reset other states
				this.setState(freshState);
			};
		};

		//leave review
		if (type === 'write' && this.state.rating) {
			//copy reviews array
			const reviewArray = deepCopy(this.state.reviews).map(item => {
				//map to find array with userId, and add review properties
				if (item.id === this.state.userId) {
					item.rating = this.state.rating;
					item.review = this.state.reviewBody;
					item.hidden = false;
					item.feedback = { up: 0, down: 0 };
					item.publishedRating = this.state.rating;
					item.date = new Date().toLocaleDateString("en-US", { dateStyle: 'medium', timeStyle: 'medium' });
				} else if (this.state.edit && item.rated) {
					//remove user from rated array in other reviews on edit
					item.rated.forEach((obj, i) => {
						if (obj[this.state.userId]) {
							item.rated.splice(i, 1);
						};
					});
				};
				return item;
			});
			//set review
			this.setState({ reviews: reviewArray, reviewSubmitted: true, publishedRating: this.state.rating });
			if (this.state.edit) {
				this.editReview();
			};
			//modal thank you message
			this.handleModal({ msg: 'Thanks for your feedback!' });
		} else if (type === 'write') {
			// alert('Sorry, you must leave a rating first.');
			this.handleModal({ msg: 'Sorry, you must leave a rating first.', prev: e.target.querySelector('.empty-4-star') });
		};
	};

	checkIfInCart(itemToCheck, currentCart, type) {
		//map items, return index of matching items, and filter out -1
		const duplicateItems = currentCart.map((item, i) => {
			if (item.prodId === itemToCheck.prodId && item[type] === itemToCheck[type]) {
				return i;
			} else {
				return -1;
			};
		}).filter(i => i > -1);
		//return dupe
		if (duplicateItems.length > 0) {
			return {
				hasDupe: true,
				dupe: currentCart[duplicateItems[0]],
				dupeIndex: duplicateItems[0],
				cart: currentCart,
			};
		} else {
			return {
				hasDupe: false,
				cart: currentCart,
			};
		};
	};

	addItem(itemToAdd, customCart, loop) {
		const checkedCart = this.checkIfInCart(itemToAdd, customCart ? customCart : deepCopy(this.state.itemsInCart), 'opt');
		//consolidate duplicate items
		if (checkedCart.hasDupe) {
			const totalQty = parseInt(checkedCart.dupe.qty) + parseInt(itemToAdd.qty);
			if (totalQty <= maxQty) {
				//increase item in cart qty by item qty from product page, if not exceeding max qty
				checkedCart.cart[checkedCart.dupeIndex].qty = totalQty;
			} else {
				//max out at max qty
				if (!loop) {
					//only alert if not being used in a loop
					// alert(`The max amount of ${itemToAdd.prodName} - ${itemToAdd.opt} allowed is ${maxQty}`);
					this.handleModal({ msg: `The max amount of ${itemToAdd.prodName} - ${itemToAdd.opt} allowed is ${maxQty}`, prev: document.querySelector('#nav-cart button') });
				};
				checkedCart.cart[checkedCart.dupeIndex].qty = maxQty;
			};
			return checkedCart.cart;
		} else {
			//add to entry if unique
			return checkedCart.cart.concat(itemToAdd);
		};
	};

	combineCarts(userCart) {
		//if current state cart and user cart have items, consolidate them
		if (this.state.itemsInCart.length > 0) {
			let combinedCart = deepCopy(this.state.itemsInCart);
			//map through user's previous cart and use add item function with state cart
			userCart.forEach(item => {
				combinedCart = this.addItem(item, combinedCart, true);
			});
			this.setState({ itemsInCart: combinedCart });
			// alert('Your previously saved items have been combined with your current cart.');
			this.handleModal({ msg: 'Your previously saved items have been combined with your current cart.', prev: document.querySelector('#nav-cart button') });
		} else {
			this.setState({ itemsInCart: userCart });
		};
	};

	toggleMenu(type) {
		type === 'cart' ? this.setState({ cartClosed: !this.state.cartClosed }) : this.setState({ navOpen: !this.state.navOpen });
	};

	handleUsername(e) {
		// const formattedUser = e.target.value.split('').filter(i => i.match(/\S/g)).join('');
		//erase if has invalid characters
		if (!transformId(e.target.value)) {
			this.handleModal({ msg: `Your username contains one or more invalid characters. Try again,  to avoid: -!$%^&*()_+|~=\`{}[]:";'<>?,./`, prev: e.target });
			e.target.value = '';
		};
		this.setState({ user: e.target.value, userId: transformId(e.target.value) });
	};

	handleButton(type, e) {
		//checkout alert
		if (type === 'checkout' && this.state.itemsInCart && this.state.itemsInCart.length > 0) {
			this.handleModal({ msg: `Thanks for your hypothetical purchase! Since this is just a demo, your cart will be reset.`, prev: document.querySelector('#nav-cart button') });
			this.setState({ itemsInCart: [] });
		} else if (type === 'checkout') {
			//shouldn't ever happen
			this.handleModal({ msg: `Sorry, there aren't any items in your cart.` });
		};

		if (type === 'star' && this.state.loggedIn) {
			const val = e.currentTarget.value
			//update rating for logged in user in review array
			const reviewsArr = this.state.reviews.map(item => {
				if (item.id === this.state.userId) {
					item.rating = parseInt(val);
				};
				return item;
			});
			this.setState({ rating: parseInt(val), reviews: reviewsArr });
		} else if (type === 'star') {
			// alert('You must be logged in to rate this product.');
			this.handleModal({ msg: 'You must be logged in to rate this product.', prev: document.querySelector('form button') });
		};

		if (type === 'thumb') {
			const val = e.currentTarget.value;
			this.setState({ opt: itemOptions.map(item => item.id)[val] });
		};

		if (type.type === 'feedback') {
			const val = e.currentTarget.value;
			const userToRate = type.user;
			//make sure user is signed in to rate a review
			if (this.state.loggedIn) {
				//user cannot rate their own review
				if (this.state.userId === userToRate) {
					// alert('You cannot rate your own review');
					this.handleModal({ msg: 'You cannot rate your own review' });
				} else {
					//only change if val is opposite or not currently set
					const shouldUpdate =
						this.state.rated.length < 1 ?
							true :
							this.state.rated.filter(user => user[userToRate]).length < 1 ?
								true :
								this.state.rated.filter(user => user[userToRate])[0][userToRate] !== val ?
									true : false;
					if (shouldUpdate) {
						const updatedReview = deepCopy(this.state.reviews).map(review => {
							if (review.id === userToRate) {
								if (val === 'up') {
									review.feedback.up++;
									//only decrease opposite if previously rated by the same user
									if (this.state.rated.some(item => item[userToRate])) {
										review.feedback.down > 0 ? review.feedback.down-- : review.feedback.down = 0;
									};
								} else if (val === 'down') {
									review.feedback.down++;
									if (this.state.rated.some(item => item[userToRate])) {
										review.feedback.up > 0 ? review.feedback.up-- : review.feedback.up = 0;
									};
								};
							};
							return review;
						});
						this.setState({ reviews: updatedReview });
					};

					//keep track of which reviewers the current user has rated
					const updateRated = deepCopy(this.state.rated);
					const shouldAdd = !updateRated.some(item => item[userToRate]);
					const updatedArray = shouldAdd ? updateRated.concat({ [userToRate]: val }) : updateRated.map(item => {
						if (item[userToRate]) {
							item[userToRate] = val;
						};
						return item;
					});
					this.setState({ rated: updatedArray });
				};
			} else {
				// alert('You must be logged in to rate a review');
				this.handleModal({ msg: 'You must be logged in to rate a review', prev: document.querySelector('form button') });
			}
		};

		if (type === 'cancel') {
			this.editReview();
			//revert review body
			const submittedReview = deepCopy(this.state.reviews).filter(review => review.id === this.state.userId)[0].review;
			if (submittedReview !== this.state.reviewBody) {
				this.setState({ reviewBody: submittedReview });
			};
		};
	};

	checkFeedback(reviewer) {
		//if current user's rated array contains the reviewer, return that thumb rating
		return this.state.rated.some(user => user[reviewer]) ? this.state.rated.filter(user => user[reviewer])[0][reviewer] : false;
	};

	editReview() {
		const toggle = !this.state.edit;
		this.setState({ edit: toggle });
	};

	handleFilterReviews(e, custom) {
		const reviewsToFilter = custom ? custom : deepCopy(this.state.reviews);
		const sortOption = typeof e === 'string' ? e : e.target.value;
		const currentUser = custom ? false : this.state.userId;
		if (sortOption === 'helpful') {
			this.setState({
				sort: 'helpful', reviews: reviewsToFilter.map(review => {
					if (review.publishedRating) {
						//include if published
						return review;
					} else {
						//hide if not
						review.hidden = true;
						return review;
					}
				}).sort((a, b) =>
					//sort current user to end, and ignore hidden users
					(((a.id === currentUser) !== (b.id === currentUser)) || a.hidden || b.hidden) ?
						(a.id === currentUser || a.hidden ? 1 : -1) : b.feedback.up - a.feedback.up
				)
			});
		} else if (sortOption === 'recent') {
			this.setState({
				sort: 'recent', reviews: reviewsToFilter.map(review => {
					if (review.publishedRating) {
						return review;
					} else {
						review.hidden = true;
						return review;
					}
				}).sort((a, b) =>
					(((a.id === currentUser) !== (b.id === currentUser)) || a.hidden || b.hidden) ?
						(a.id === currentUser || a.hidden ? 1 : -1) : Date.parse(b.date) - Date.parse(a.date)
				)
			});
		} else if (sortOption === 'old') {
			this.setState({
				sort: 'old', reviews: reviewsToFilter.map(review => {
					if (review.publishedRating) {
						return review;
					} else {
						review.hidden = true;
						return review;
					}
				}).sort((a, b) =>
					(((a.id === currentUser) !== (b.id === currentUser)) || a.hidden || b.hidden) ?
						(a.id === currentUser || a.hidden ? 1 : -1) : Date.parse(a.date) - Date.parse(b.date)
				)
			});
		};
		// } else if (sortOption === 'controversial') {
		//   this.setState({sort: 'controversial', hiddenReviews: reviewsToFilter.filter(review => review.publishedRating).sort((a, b) =>
		//     ((a.id === currentUser) !== (b.id === currentUser)) ? (a.id === currentUser ? 1 : -1) : b.feedback.down - a.feedback.down
		//     )});
		// };
	};

	handleText(e) {
		const text = e.target.value;
		this.setState({ reviewBody: text });
	};

	handleLogin(e) {
		if (e.target.value === 'login') {
			this.setState({ openLogin: true, openSignup: false }, () => document.querySelector('#login-form input').focus());
		} else {
			this.setState({ openSignup: true, openLogin: false });
		};
	};

	render() {
		let itemCount;
		if (this.state.itemsInCart.length > 0) {
			//number of items in cart based on quantity present
			this.state.itemsInCart.forEach(item => {
				//increment if itemCount is set
				if (itemCount) {
					itemCount += parseInt(item.qty);
				} else {
					//set
					itemCount = parseInt(item.qty);
				};
			});
		} else {
			itemCount = 0;
		};

		return (
			<>
				<Modal
					show={this.state.modal}
					img={this.state.modalImg}
					msg={this.state.modalMsg}
					btn={this.state.modalBtn}
					prev={this.state.prevEle}
					handleModal={this.handleModal}
				/>
				<Header
					modal={this.state.modal}
					handleModal={this.handleModal}
					navOpen={this.state.navOpen}
					itemsInCart={this.state.itemsInCart}
					itemCount={itemCount}
					cartClosed={this.state.cartClosed}
					handleInput={this.handleInput}
					handleFocus={this.handleFocus}
					handleSubmit={this.handleSubmit}
					preventEnter={this.preventEnter}
					toggleMenu={this.toggleMenu}
					user={this.state.user}
					loggedIn={this.state.loggedIn}
					openLogin={this.state.openLogin}
					openSignup={this.state.openSignup}
					handleUsername={this.handleUsername}
					handleLogin={this.handleLogin}
					handleButton={this.handleButton}
				/>
				<Main
					modal={this.state.modal}
					handleModal={this.handleModal}
					user={this.state.user ? this.state.user : 'Your Name'}
					userId={this.state.userId ? this.state.userId : 'your-name'}
					loggedIn={this.state.loggedIn}
					rating={this.state.rating}
					itemsInCart={this.state.itemsInCart}
					prodName={this.prodName}
					prodId={this.prodId}
					thumb={this.subthumbs[this.state.opt ? itemOptions.map(opt => opt.id).indexOf(this.state.opt) : 0]}
					subthumbs={this.subthumbs}
					qty={this.state.qty}
					opt={this.state.opt}
					price={this.price}
					reviews={this.state.reviews}
					sort={this.state.sort}
					stars={this.state.stars}
					checkFeedback={this.checkFeedback}
					reviewBody={this.state.reviewBody}
					publishedRating={this.state.publishedRating}
					reviewSubmitted={this.state.reviewSubmitted}
					editReview={this.editReview}
					editOpen={this.state.edit}
					checkIfInCart={this.checkIfInCart}
					handleInput={this.handleInput}
					handleFocus={this.handleFocus}
					handleSubmit={this.handleSubmit}
					handleButton={this.handleButton}
					handleUsername={this.handleUsername}
					handleText={this.handleText}
					handleFilterReviews={this.handleFilterReviews}
				/>
				<Footer modal={this.state.modal} />
			</>
		);
	};
};

//====================
//Header
//====================

function Header(props) {
	return (
		<header>
			<Navbar
				modal={props.modal}
				handleModal={props.handleModal}
				navOpen={props.navOpen}
				cartClosed={props.cartClosed}
				itemCount={props.itemCount}
				itemsInCart={props.itemsInCart}
				toggleMenu={props.toggleMenu}
				loggedIn={props.loggedIn}
				openLogin={props.openLogin}
				openSignup={props.openSignup}
				user={props.user}
				preventEnter={props.preventEnter}
				handleInput={props.handleInput}
				handleButton={props.handleButton}
				handleFocus={props.handleFocus}
				handleSubmit={props.handleSubmit}
				handleUsername={props.handleUsername}
				handleLogin={props.handleLogin}
			/>
			{/* {!props.cartClosed ?
            <Cart
              modal={props.modal}
              itemsInCart={props.itemsInCart}
              handleInput={props.handleInput}
              handleFocus={props.handleFocus}
              handleSubmit={props.handleSubmit}
              handleButton={props.handleButton}
              preventEnter={props.preventEnter}
              toggleMenu={props.toggleMenu}
            /> :
            ''
          } */}
		</header>
	);
};

function Navbar(props) {
	return (
		<nav id="navbar">
			<ul id="nav-link-container">
				<li id="nav-home" className="links">
					<button type="button" tabIndex={props.modal ? -1 : null}>Home</button>
				</li>
				<li id="nav-categories" className={props.navOpen ? 'active links' : 'links'}>
					<button type="button" tabIndex={props.modal ? -1 : null} onClick={() => props.toggleMenu('nav')}>
						Categories
					</button>
					{props.navOpen ? <NavLinks modal={props.modal} handleModal={props.handleModal} /> : ''}
				</li>
				<LogIn
					modal={props.modal}
					loggedIn={props.loggedIn}
					openLogin={props.openLogin}
					openSignup={props.openSignup}
					user={props.user}
					handleSubmit={props.handleSubmit}
					handleUsername={props.handleUsername}
					handleLogin={props.handleLogin}
				/>
				<NavCart
					modal={props.modal}
					itemCount={props.itemCount}
					toggleMenu={props.toggleMenu}
					handleButton={props.handleButton}
				/>
			</ul>
			{!props.cartClosed ?
				<Cart
					modal={props.modal}
					itemsInCart={props.itemsInCart}
					handleInput={props.handleInput}
					handleFocus={props.handleFocus}
					handleSubmit={props.handleSubmit}
					handleButton={props.handleButton}
					preventEnter={props.preventEnter}
					toggleMenu={props.toggleMenu}
				/> :
				''
			}
		</nav>
	);
};

function NavLinks(props) {
	return (
		<ol id="categories-links" className="nav-links">
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 1</button></li>
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 2</button></li>
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 3</button></li>
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 4</button></li>
		</ol>
	);
};

function LogIn(props) {
	return (
		<li id="nav-login" className="login">
			{props.loggedIn ? (
				<form id="welcome-form" onSubmit={(e) => props.handleSubmit(null, 'logout', e)}>
					<label htmlFor="welcome-form">Hi, {props.user}!</label>
					<button type="submit" name="signout" value="signout" tabIndex={props.modal ? -1 : null}>Sign Out</button>
				</form>
			) : props.openLogin ? (
				<form id="login-form" onSubmit={(e) => props.handleSubmit(null, 'login', e)}>
					<label htmlFor="login-input">You are not signed in.</label>
					<input type='text' id="login-input" name="login-input" placeholder="enter a name to test" onChange={(e) => props.handleUsername(e)} required tabIndex={props.modal ? -1 : null} />
					<button type="submit" name="login" value="login" tabIndex={props.modal ? -1 : null}>Log In</button>
					<button type="button" name="signup" value="signup" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Need an account? Sign Up</button>
				</form>
			) : props.openSignup ? (
				<form id="sign-up-form" onSubmit={(e) => props.handleSubmit(null, 'signup', e)}>
					<label htmlFor="login-input">You are not signed in.</label>
					<input type='text' id="login-input" name="login-input" placeholder="enter a name to test" onChange={(e) => props.handleUsername(e)} required tabIndex={props.modal ? -1 : null} />
					<button type="submit" name="signup" value="signup" tabIndex={props.modal ? -1 : null}>Sign Up</button>
					<button type="button" name="login" value="login" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Already have an account? Log In</button>
				</form>
			) : (
				<form id="sign-in-form">
					<label htmlFor="login-input">You are not signed in.</label>
					<button type="button" name="login" value="login" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Log In</button>
					<button type="button" name="signup" value="signup" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Sign Up</button>
				</form>
			)}
		</li>
	);
};

function NavCart(props) {
	return (
		<li id="nav-cart" className="links">
			<button type="button" onClick={() => props.toggleMenu('cart')} aria-label="open cart" tabIndex={props.modal ? -1 : null}>
				<span id="cart-button-span">
					<CartIcon fillColor={props.itemCount > 0 ? colorYellow : colorWhite} />
					<span className={props.itemCount > 0 ? 'active' : null}>Cart ({props.itemCount.toString()})</span>
				</span>
			</button>
		</li>
	);
};

function Cart(props) {
	return (
		<aside id="cart">
			{props.itemsInCart.length > 0 ?
				<>
					<InCart
						modal={props.modal}
						itemsInCart={props.itemsInCart}
						handleInput={props.handleInput}
						handleFocus={props.handleFocus}
						handleSubmit={props.handleSubmit}
						preventEnter={props.preventEnter}
					/>
					<Total itemsInCart={props.itemsInCart} />
					<Checkout modal={props.modal} handleButton={props.handleButton} />
				</>
				:
				<span id="empty-cart">Cart is Empty</span>
			}
			<CloseCart modal={props.modal} toggleMenu={props.toggleMenu} />
		</aside>
	);
};

function InCart(props) {
	const items = props.itemsInCart;
	const opts = itemOptions.map(opt => opt.id);
	const listItems =
		items.map((item, ind) =>
			<CartProduct
				key={`cart-item-${ind + 1}`}
				modal={props.modal}
				index={ind}
				itemsInCart={props.itemsInCart}
				prodName={item.prodName}
				id={`${item.prodId}-${item.opt}`}
				prodId={item.prodId}
				thumb={item.thumb[opts.indexOf(item.opt)]}
				qty={item.qty}
				opt={item.opt}
				price={item.price}
				handleInput={props.handleInput}
				handleFocus={props.handleFocus}
				handleSubmit={props.handleSubmit}
				preventEnter={props.preventEnter}
			/>
		);
	return (
		<ol id="products-in-cart">
			{listItems}
		</ol>
	);
};

function CartProduct(props) {
	//product id with option
	return (
		<li className="cart-products">
			<img src={props.thumb} alt={`${props.prodName} thumbnail`} id={`${props.id}-thumbnail`} className="thumbnails" />
			<h3 id={`${props.id}-title`} className="titles">{props.prodName}</h3>
			<ProductForm
				modal={props.modal}
				cart={true}
				index={props.index}
				itemsInCart={props.itemsInCart}
				id={props.id}
				prodId={props.prodId}
				qty={props.qty}
				opt={props.opt}
				price={props.price}
				handleInput={props.handleInput}
				handleFocus={props.handleFocus}
				handleSubmit={props.handleSubmit}
				preventEnter={props.preventEnter}
			/>
		</li>
	);
};

function ProductForm(props) {
	return (
		<form
			id={`${props.id}-form`}
			className="forms"
			onSubmit={(e) => props.handleSubmit(props.index, 'cart', e)}
			onKeyPress={props.cart ? (e) => props.preventEnter(e) : null}
		>
			<Options
				modal={props.modal}
				cart={props.cart}
				index={props.cart ? props.index : -1}
				id={props.id}
				opt={props.opt}
				handleInput={props.handleInput}
			/>
			<Quantity
				modal={props.modal}
				index={props.cart ? props.index : -1}
				id={props.id}
				opt={props.opt}
				qty={props.qty}
				price={props.price}
				handleInput={props.handleInput}
				handleFocus={props.handleFocus}
				preventEnter={props.preventEnter}
			/>
			{props.cart ?
				<RemoveItem
					modal={props.modal}
					id={props.id}
					index={props.index}
					handleSubmit={props.handleSubmit}
				/> :
				<AddToCart
					modal={props.modal}
					prodId={props.prodId}
					id={props.id}
					itemsInCart={props.itemsInCart}
					qty={props.qty}
					opt={props.opt}
					checkIfInCart={props.checkIfInCart}
				/>
			}
		</form>
	);
};

function Quantity(props) {
	return (
		//conditionals if quantity is in cart or not
		<div id={`${props.id}-quantity-container`} className="quantities">
			{props.index > -1 ? ( //in cart
				<>
					<label htmlFor={`${props.id}-quantity`} aria-label="item quantity">
						{`$${props.price.toFixed(2)} x `}
					</label>
					<input
						type="number"
						id={`${props.id}-quantity`}
						name={`${props.id}-quantity`}
						value={props.qty}
						min="1"
						max={maxQty}
						onChange={(e) => props.handleInput({ ind: props.index, type: 'qty' }, e)}
						onFocus={(e) => props.handleFocus(e)}
						tabIndex={props.modal ? -1 : null}
						required
					/>
					<strong aria-label="price" className="prices">{` = $${(props.qty * props.price * 100 / 100).toFixed(2)}`}</strong>
				</>
			) : ( //in info
				<>
					<label htmlFor={`${props.id}-quantity`} aria-label="item quantity">
						Qty.{' '}
					</label>
					<button
						type="button"
						className="icons quantity-decrease"
						onClick={() => props.handleInput({ ind: props.index, type: 'qty', add: false }, parseInt(props.qty))}
						disabled={props.qty === 1 ? true : null}
						tabIndex={props.modal ? -1 : null}
					>
						<MinusIcon fillColor={colorDarkGrey} />
					</button>
					<input
						type="number"
						id={`${props.id}-quantity`}
						name={`${props.id}-quantity`}
						value={props.qty}
						min="1"
						max={maxQty}
						onChange={(e) => props.handleInput({ ind: props.index, type: 'qty' }, e)}
						onFocus={(e) => props.handleFocus(e)}
						tabIndex={props.modal ? -1 : null}
						required
					/>
					<button
						type="button"
						className="icons quantity-increase"
						onClick={() => props.handleInput({ ind: props.index, type: 'qty', add: true }, parseInt(props.qty))}
						disabled={props.qty === maxQty ? true : null}
						tabIndex={props.modal ? -1 : null}
					>
						<PlusIcon fillColor={colorDarkGrey} />
					</button>
				</>
			)}
		</div>
	);
};

function Options(props) {
	return (
		<div id={`${props.id}-options-container`} className="options">
			<label htmlFor={`${props.id}-options`}>Options:</label>
			<select
				id={`${props.id}-options`}
				name={`${props.id}-options`}
				value={props.opt}
				onChange={(e) => props.handleInput({ ind: props.index, type: 'opt' }, e)}
				tabIndex={props.modal ? -1 : null}
				required
			>
				<option value="" disabled>Choose</option>
				{itemOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
			</select>
		</div>
	);
};

function RemoveItem(props) {
	return (
		<button
			type="button"
			id={`remove-${props.id}`}
			className="remove-items"
			aria-label="remove from cart"
			onClick={(e) => props.handleSubmit(props.index, 'cart', e)}
			tabIndex={props.modal ? -1 : null}
		>
			Rmv
		</button>
	);
};

function Total(props) {
	const subTotal = props.itemsInCart.map(item => item.qty * item.price * 100 / 100).reduce((x, y) => x + y);
	const tax = (subTotal * 1000) * (0.0825 * 1000 / 1000) / 1000;
	const finalTotal = (subTotal * 100 / 100) + (tax * 100 / 100);
	return (
		<div id="cart-totals-container" className="cart-totals">
			<span id="cart-subtotal">Subtotal: ${subTotal.toFixed(2)} </span>
			<span id="cart-tax">Tax: ${tax.toFixed(2)} </span>
			<span id="cart-final-total"><strong>Final Total: ${finalTotal.toFixed(2)} </strong></span>
		</div>
	);
};

function Checkout(props) {
	return (
		<button
			type="button"
			id="checkout-button"
			className="icons buttons"
			tabIndex={props.modal ? -1 : null}
			onClick={() => props.handleButton('checkout')}
		>
			<span id="checkout-button-span">
				<span>Proceed to Checkout</span>
				<CartIcon fillColor={colorRed} />
			</span>
		</button>
	);
};

function CloseCart(props) {
	return (
		<button type="button" id="close-cart-button" className="icons" onClick={() => props.toggleMenu('cart')} tabIndex={props.modal ? -1 : null}>
			<CloseArrowIcon fillColor={colorDarkGrey} />
		</button>
	);
};

//====================
//Main
//====================
function Main(props) {
	//filter reviews array based on those with ratings
	const ratedReviews = props.reviews.filter(review => review.rating);
	const avgRating = ratedReviews.reduce((x, y) => x + y.rating, 0) / ratedReviews.length;
	const avgStars = Math.floor(avgRating * 2) / 2;
	const wholeStars = Math.floor(avgRating);
	const halfStar = Math.round(avgRating - wholeStars);
	const emptyStars = maxRating - (wholeStars + halfStar);
	return (
		<main>
			<ProductInfo
				modal={props.modal}
				handleModal={props.handleModal}
				itemsInCart={props.itemsInCart}
				prodName={props.prodName}
				prodId={props.prodId}
				thumb={props.thumb}
				subthumbs={props.subthumbs}
				qty={props.qty}
				opt={props.opt}
				price={props.price}
				reviews={props.reviews}
				reviewCount={props.reviews.filter(review => review.review).length}
				rating={props.rating}
				user={props.user}
				userId={props.userId}
				whole={wholeStars}
				half={halfStar}
				empty={emptyStars}
				checkIfInCart={props.checkIfInCart}
				handleInput={props.handleInput}
				handleFocus={props.handleFocus}
				handleSubmit={props.handleSubmit}
				handleButton={props.handleButton}
			/>
			<ReviewDisplay
				modal={props.modal}
				prodId={props.prodId}
				reviews={props.reviews}
				sort={props.sort}
				stars={props.stars}
				publishedRating={props.publishedRating}
				checkFeedback={props.checkFeedback}
				reviewBody={props.reviewBody}
				reviewSubmitted={props.reviewSubmitted}
				editReview={props.editReview}
				editOpen={props.editOpen}
				avg={avgStars}
				rating={props.rating}
				user={props.user}
				userId={props.userId}
				loggedIn={props.loggedIn}
				whole={wholeStars}
				half={halfStar}
				empty={emptyStars}
				handleSubmit={props.handleSubmit}
				handleButton={props.handleButton}
				handleInput={props.handleInput}
				handleFocus={props.handleFocus}
				handleUsername={props.handleUsername}
				handleText={props.handleText}
				handleFilterReviews={props.handleFilterReviews}
			/>
		</main>
	);
};

//=============
//Product Info
//=============
function ProductInfo(props) {
	return (
		<section id={`${props.prodId}-info-container`} className="product-info">
			<h1 id={`${props.prodId}-title`} className="titles">{props.prodName}</h1>
			<figure id={`${props.prodId}-thumbnails`} className="thumbnail-container">
				<button
					type="button"
					id="main-thumbnail"
					aria-label="enlarge image"
					tabIndex={props.modal ? -1 : null}
					onClick={(e) => props.handleModal({ img: props.thumb }, e)}
				>
					<img src={props.thumb} alt={`${props.prodName} main preview`} id={`${props.prodId}-main-image`} className="main-image" />
				</button>
				<Thumbnails
					modal={props.modal}
					prodName={props.prodName}
					prodId={props.prodId}
					mainThumb={props.thumb}
					subthumbs={props.subthumbs}
					handleButton={props.handleButton}
				/>
			</figure>
			<form>
				{props.rating ? (
					<Rating
						modal={props.modal}
						prodId={props.prodId}
						user={props.userId}
						kind="user"
						section="info"
						reviewer={false}
						rating={props.rating}
						handleButton={props.handleButton}
					/>
				) : (
					<Rating
						modal={props.modal}
						prodId={props.prodId}
						kind='avg'
						section="info"
						whole={props.whole}
						half={props.half}
						empty={props.empty}
						handleButton={props.handleButton}
					/>
				)}
			</form>
			<ReviewsLink modal={props.modal} prodId={props.prodId} reviewCount={props.reviewCount} />
			<Description prodId={props.prodId} />
			<Price prodId={props.prodId} price={props.price} />
			<ProductForm
				modal={props.modal}
				itemsInCart={props.itemsInCart}
				id={`${props.prodId}-product`}
				prodId={props.prodId}
				qty={props.qty}
				opt={props.opt}
				checkIfInCart={props.checkIfInCart}
				handleInput={props.handleInput}
				handleFocus={props.handleFocus}
				handleSubmit={props.handleSubmit}
			/>
		</section>
	);
};

function Thumbnails(props) {
	const listItems = props.subthumbs.map((thumb, i) => {
		return (
			<SubThumbnails
				key={`prod-sub-${i + 1}`}
				modal={props.modal}
				prodName={props.prodName}
				ind={i}
				id={props.prodId}
				mainThumb={props.mainThumb}
				subthumb={thumb}
				handleButton={props.handleButton}
			/>
		);
	});
	return (
		<ol id={`${props.prodId}-sub-thumbnails`} className="sub-thumbnails">
			{listItems}
		</ol>
	);
};

function SubThumbnails(props) {
	return (
		<li id={props.prodId} className={props.mainThumb === props.subthumb ? "sub-thumbnail" : "sub-thumbnail dimmed"}>
			<button
				type="button"
				className="link"
				disabled={props.mainThumb === props.subthumb ? true : false}
				value={props.ind}
				aria-label={`switch to thumbnail for option ${props.ind + 1}`}
				onClick={(e) => props.handleButton('thumb', e)}
				tabIndex={props.modal ? -1 : null}
			>
				<img src={props.subthumb} alt={`${props.prodName} thumbnail`} className="thumbnails" />
			</button>
		</li>
	);
};

function Rating(props) {
	//conditional for avg or user
	const displayRating = [];
	if (props.kind === 'user') { //user ratings
		if (props.rating) { //if the user has already rated it, full and red outline
			const ratingToShow = props.publishedRating ? props.publishedRating : props.rating;
			//if in a review, user static rating, otherwise dynamically update
			for (let i = 1; i <= ratingToShow; i++) {
				displayRating.push(
					<Star
						key={`${props.user}-${props.kind}-star-${i}`}
						id={`${props.user}-${props.kind}-star-${i}`}
						ind={i}
						type={props.kind}
						section={props.section}
						kind={props.kind}
						reviewer={props.reviewer}
						handleButton={props.handleButton}
					/>
				);
			};
			//fill remaing slots with red outlines if not reviewers
			if (!props.reviewer) {
				while (displayRating.length < maxRating) {
					let i = displayRating.length + 1;
					displayRating.push(
						<Star
							key={`${props.user}-${props.kind}-star-${i}`}
							modal={props.modal}
							ind={i}
							id={`${props.user}-${props.kind}-star-${i}`}
							type='empty'
							section={props.section}
							kind={props.kind}
							handleButton={props.handleButton}
						/>
					);
				};
			};
		} else { //set all stars to empty black outlines
			for (let i = 1; i <= maxRating; i++) {
				displayRating.push(
					<Star
						key={`${props.user}-${props.kind}-star-${i}`}
						modal={props.modal}
						ind={i}
						id={`${props.user}-${props.kind}-star-${i}`}
						type='empty'
						section={props.section}
						kind={props.kind}
						handleButton={props.handleButton}
					/>
				);
			};
		};
	} else {
		if (props.whole > 0) { //whole stars
			for (let i = 1; i <= props.whole; i++) {
				displayRating.push(
					<Star
						key={`${props.section}-whole-star-${i}`}
						modal={props.modal}
						ind={i}
						id={`${props.section}-whole-star-${i}`}
						type='whole'
						section={props.section}
						kind={props.kind}
						handleButton={props.handleButton}
					/>
				);
			};
		};
		if (props.half > 0) { //half stars
			for (let i = 1; i <= props.half; i++) {
				displayRating.push(
					<Star
						key={`${props.section}-half-star-${i}`}
						modal={props.modal}
						ind={i + props.whole}
						id={`${props.section}-half-star-${i}`}
						section={props.section}
						type='half'
						kind={props.kind}
						handleButton={props.handleButton}
					/>
				);
			};
		};
		if (props.empty > 0) { //star outlines
			for (let i = 1; i <= props.empty; i++) {
				displayRating.push(
					<Star
						key={`${props.section}-empty-star-${i}`}
						modal={props.modal}
						ind={i + props.whole + props.half}
						id={`${props.section}-empty-star-${i}`}
						section={props.section}
						type='empty'
						kind={props.kind}
						handleButton={props.handleButton}
					/>
				);
			};
		};
	};
	return (
		<div
			id={props.kind === 'user' ? `${props.prodId}-${props.kind}-rating` : `${props.prodId}-${props.section}-${props.kind}-rating`}
			className="rating"
		>
			{displayRating}
		</div>
	);
};

function Star(props) {
	//different kinds of stars
	const starVariants = props.type === 'user' ?
		<StarIcon fillColor={colorRed} /> :
		props.type === 'whole' ?
			<StarIcon fillColor={colorDarkGrey} /> :
			props.type === 'half' ?
				<StarHalf fillColor={colorDarkGrey} strokeColor={colorDarkGrey} /> :
				<StarOutline strokeColor={props.kind === 'user' ? colorRed : colorDarkGrey} />;
	return (
		<>
			{props.reviewer ? ( //static if in review
				<i id={`${props.id}-icon`} className={`${props.type}-${props.ind}-star stars`}>
					<StarIcon fillColor={colorBlack} />
				</i>
			) : props.kind === 'avg' && props.section !== 'info' ? ( //static if avg rating in review section
				<i id={`${props.id}-icon`} className={`${props.type}-${props.ind}-star stars`}>
					{starVariants}
				</i>
			) : (
				<button
					type="button"
					id={`${props.id}-icon`}
					className={`${props.type}-${props.ind}-star stars`}
					aria-label={`rate ${props.ind} star button`}
					value={props.ind}
					onClick={(e) => props.handleButton('star', e)}
					tabIndex={props.modal ? -1 : null}
				>
					{starVariants}
				</button>
			)}
		</>
	);
};

function ReviewsLink(props) {
	return (
		<button type="button" id={`${props.prodId}-reviews-link`} className="links" tabIndex={props.modal ? -1 : null}>
			Reviews ({props.reviewCount.toString()})
		</button>
	);
};

function Description(props) {
	const productDescription = `This a description of your product. It’s very cool and very affordable. You’ll be the envy of all your friends should you buy this product. It’s THAT good.`;
	return (
		<p id={`${props.prodId}-description`} className="paragraphs">
			{productDescription}
		</p>
	);
};

function Price(props) {
	return (
		<strong id={`${props.prodId}-price`} className="prices">
			${props.price.toFixed(2)}
		</strong>
	);
};

function AddToCart(props) {
	const checkedCart = props.checkIfInCart({ prodId: props.prodId, opt: props.opt }, deepCopy(props.itemsInCart), 'opt');
	const dupeInCart = checkedCart.hasDupe;
	const qtyInCart = dupeInCart ? checkedCart.cart[checkedCart.dupeIndex].qty : 0;
	const qtyTogther = parseInt(props.qty) + parseInt(qtyInCart);
	return (
		<button
			type="submit"
			id={`${props.id}-add-to-cart-button`}
			className={dupeInCart && qtyTogther > maxQty ? "add-to-cart buttons" : "add-to-cart buttons active"}
			aria-label="add to cart"
			disabled={qtyTogther > maxQty ? true : false}
			tabIndex={props.modal ? -1 : null}
		>
			<span id="add-to-cart-span">
				<span>{!dupeInCart ? 'Add to Cart' : qtyTogther <= maxQty ? 'Update Cart' : 'Maxed Out'}</span>
				<i>
					<CartIcon fillColor={colorWhite} />
				</i>
			</span>
		</button>
	);
};

//=============
//Reviews
//=============
function ReviewDisplay(props) {
	return (
		<section id={`${props.prodId}-reviews-display`} className="review-displays">
			<ProductReviews
				modal={props.modal}
				prodId={props.prodId}
				userId={props.userId}
				user={props.user}
				loggedIn={props.loggedIn}
				reviews={props.reviews}
				sort={props.sort}
				stars={props.stars}
				reviewBody={props.reviewBody}
				publishedRating={props.publishedRating}
				editReview={props.editReview}
				editOpen={props.editOpen}
				checkFeedback={props.checkFeedback}
				rating={props.rating}
				avg={props.avg}
				whole={props.whole}
				half={props.half}
				empty={props.empty}
				handleButton={props.handleButton}
				handleSubmit={props.handleSubmit}
				handleInput={props.handleInput}
				handleFocus={props.handleFocus}
				handleText={props.handleText}
				handleFilterReviews={props.handleFilterReviews}
			/>
			{props.reviewSubmitted ? (
				<div id="review-submitted" className="review-prompts">
					<p>Thanks for your feedback!</p>
				</div>
			) : (
				<WriteProductReview
					modal={props.modal}
					prodId={props.prodId}
					reviewBody={props.reviewBody}
					rating={props.rating}
					user={props.user}
					userId={props.userId}
					loggedIn={props.loggedIn}
					handleSubmit={props.handleSubmit}
					handleButton={props.handleButton}
					handleFocus={props.handleFocus}
					handleUsername={props.handleUsername}
					handleText={props.handleText}
				/>
			)}
		</section>
	);
};

function ProductReviews(props) {
	return (
		<section id={`${props.prodId}-reviews`} className="product-reviews">
			<h2 className="titles">Reviews</h2>
			<div>
				<Rating
					modal={props.modal}
					prodId={props.prodId}
					section="reviews"
					kind="avg"
					whole={props.whole}
					half={props.half}
					empty={props.empty}
				/>
				<span>Avg Ratings ({props.avg})</span>
			</div>
			<form id="my-rating">
				<Rating
					modal={props.modal}
					prodId={props.prodId}
					section="reviews"
					user={props.userId}
					kind="user"
					rating={props.rating}
					handleButton={props.handleButton}
				/>
				<label htmlFor="my-rating">{props.loggedIn ? 'Your rating' : 'Log in to rate'}</label>
			</form>
			<Reviews
				modal={props.modal}
				prodId={props.prodId}
				currentUser={props.userId}
				reviews={props.reviews}
				sort={props.sort}
				stars={props.stars}
				publishedRating={props.publishedRating}
				loggedIn={props.loggedIn}
				editReview={props.editReview}
				reviewBody={props.reviewBody}
				editOpen={props.editOpen}
				checkFeedback={props.checkFeedback}
				handleButton={props.handleButton}
				handleFocus={props.handleFocus}
				handleInput={props.handleInput}
				handleUsername={props.handleUsername}
				handleText={props.handleText}
				handleSubmit={props.handleSubmit}
				handleFilterReviews={props.handleFilterReviews}
			/>
		</section>
	);
};

function Reviews(props) {
	//filter out if not posted
	const reviewList = props.reviews.filter(item => item.review && !item.hidden).map((review, i) => {
		const reviewToShow = props.currentUser === review.id ? props.reviewBody : review.review;
		return (
			<Review
				key={`review-${i + 1}`}
				modal={props.modal}
				currentUser={props.currentUser}
				loggedIn={props.loggedIn}
				prodId={props.prodId}
				userId={review.id}
				user={review.user}
				date={review.date}
				reviewBody={reviewToShow}
				rating={review.rating}
				publishedRating={review.publishedRating}
				publishedReview={review.review}
				editOpen={props.editOpen}
				feedback={review.feedback}
				checkFeedback={props.checkFeedback}
				handleButton={props.handleButton}
				handleFocus={props.handleFocus}
				handleUsername={props.handleUsername}
				handleText={props.handleText}
				handleSubmit={props.handleSubmit}
				editReview={props.editReview}
			/>
		);
	});
	return (
		<section id={`${props.prodId}-user-reviews`} className="reviews-container">
			<ReviewFilter modal={props.modal} handleFilterReviews={props.handleFilterReviews} sort={props.sort} />
			<ReviewRatings modal={props.modal} reviews={props.reviews} handleInput={props.handleInput} stars={props.stars} />
			{reviewList}
		</section>
	);
};

function ReviewFilter(props) {
	return (
		<form id="review-filter-form">
			<label htmlFor="review-filter-form">Sort by: </label>
			<select value={props.sort} onChange={(e) => props.handleFilterReviews(e)} tabIndex={props.modal ? -1 : null}>
				<option value="helpful">Most Helpful</option>
				<option value="recent">Recent</option>
				<option value="old">Oldest</option>
				{/* <option value="controversial">Controversial</option> */}
			</select>
		</form>
	);
};

function ReviewRatings(props) {
	const ratingsSort = [];
	for (let i = 0; i < maxRating; i++) {
		ratingsSort.push(
			<ReviewRatingInputs
				key={`rating-sort-${i + 1}`}
				modal={props.modal}
				val={i + 1}
				handleInput={props.handleInput}
				reviews={props.reviews}
				stars={props.stars}
			/>
		);
	};
	return (
		<form id="review-ratings-form">
			<label htmlFor="review-ratings-form">Sort By Rating</label>
			<div>
				<input
					type="radio"
					name="review-ratings"
					id="all-stars"
					value={0}
					checked={props.stars === 0}
					onChange={(e) => props.handleInput('ratings', e)}
					tabIndex={props.modal ? -1 : null}
				/>
				<label htmlFor="all-stars" aria-label="show all star ratings">All</label>
			</div>
			{ratingsSort}
		</form>
	);
};

function ReviewRatingInputs(props) {
	const stars = [];
	const num = props.reviews.filter(review => review.publishedRating === props.val).length;
	for (let i = 0; i < props.val; i++) {
		stars.push(
			<StarIcon key={`${props.val}-star-${i + 1}`} fillColor={colorDarkGrey} />
		);
	};
	return (
		<div>
			<input
				type="radio"
				id={`${props.val}-star`}
				name="review-ratings"
				value={props.val}
				checked={props.stars === props.val}
				onChange={(e) => props.handleInput('ratings', e)}
				tabIndex={props.modal ? -1 : null}
			/>
			<label htmlFor={`${props.val}-star`} aria-label={`sort by ${props.val}`}>
				{stars}
				<span>({num})</span>
			</label>
		</div>
	);
};

function Review(props) {
	const kindOfClass = props.userId === props.currentUser && props.editOpen ? "current-user reviews active" : props.userId === props.currentUser ? "current-user reviews" : "reviews";
	return (
		<article id={`${props.userId}-review`} className={kindOfClass}>
			<h4 className="names">{props.user.toUpperCase()}</h4>
			<span className="dates">{props.date}</span>
			{props.editOpen && props.userId === props.currentUser ? (
				<WriteProductReview
					modal={props.modal}
					user={props.user}
					userId={props.userId}
					loggedIn={props.loggedIn}
					reviewBody={props.reviewBody}
					publishedReview={props.publishedReview}
					rating={props.rating}
					publishedRating={props.publishedRating}
					handleButton={props.handleButton}
					handleFocus={props.handleFocus}
					handleUsername={props.handleUsername}
					handleText={props.handleText}
					handleSubmit={props.handleSubmit}
					editReview={props.editReview}
					editOpen={props.editOpen}
				/>
			) : (
				<>
					<p className="comments paragraphs">{props.reviewBody}</p>
					<Rating
						modal={props.modal}
						prodId={props.prodId}
						rating={props.rating}
						publishedRating={props.publishedRating}
						kind="user"
						section="review"
						user={props.userId}
						reviewer={true}
					/>
					<Feedback
						modal={props.modal}
						prodId={props.prodId}
						userId={props.userId}
						currentUser={props.currentUser}
						feedback={props.feedback}
						checkFeedback={props.checkFeedback}
						handleButton={props.handleButton}
					/>
				</>
			)}
			{props.userId === props.currentUser && !props.editOpen ? (
				<button
					type="button"
					id="edit-review"
					className="buttons"
					onClick={() => props.editReview()}
					tabIndex={props.modal ? -1 : null}
				>
					Edit Review
				</button>
			) : ''}
		</article>
	);
};

function Feedback(props) {
	const thumbed = props.checkFeedback(props.userId);
	return (
		<div id={`${props.prodId}-${props.userId}-feedback`} className="feedback">
			<button
				type="button"
				className="thumbs-down"
				disabled={props.currentUser === props.userId ? true : false}
				value="down"
				onClick={(e) => props.handleButton({ type: 'feedback', user: props.userId }, e)}
				tabIndex={props.modal ? -1 : null}
			>
				<ThumbsDownIcon
					fillColor={thumbed === 'down' ? colorRed : colorDarkGrey}
					//set opacity based on if user has thumbed or not
					opacity={thumbed === 'down' ? 1 : thumbed === 'up' ? 0.25 : props.feedback.down > props.feedback.up ? 1 : 0.25}
				/>
				({props.feedback.down})
			</button>
			<button
				type="button"
				className="thumbs-up"
				disabled={props.currentUser === props.userId ? true : false}
				data-user={props.userId}
				value="up"
				onClick={(e) => props.handleButton({ type: 'feedback', user: props.userId }, e)}
				tabIndex={props.modal ? -1 : null}
			>
				<ThumbsUpIcon
					fillColor={thumbed === 'up' ? colorRed : colorDarkGrey}
					opacity={thumbed === 'up' ? 1 : thumbed === 'down' ? 0.25 : props.feedback.down < props.feedback.up ? 1 : 0.25}
				/>
				({props.feedback.up})
			</button>
		</div>
	);
};

function WriteProductReview(props) {
	//determine if submit button should be enabled based on content of edit
	const disableEdit = props.editOpen && props.rating === props.publishedRating && props.reviewBody === props.publishedReview ? true : false;
	return (
		<form
			id={`${props.prodId}-write-review-form`}
			className="write-review-form"
			onSubmit={(e) => props.handleSubmit(null, 'write', e)}
		>
			{props.loggedIn ?
				<label htmlFor={`${props.prodId}-write-review-form`} className="titles">{props.editOpen ? 'Edit your review' : 'Write a review'}</label> :
				<p id="review-must-login" className="review-prompts">You must be logged in to leave a review.</p>
			}
			<WriteReview
				modal={props.modal}
				user={props.user}
				userId={props.userId}
				prodId={props.prodId}
				loggedIn={props.loggedIn}
				reviewBody={props.reviewBody}
				editOpen={props.editOpen}
				rating={props.rating}
				handleButton={props.handleButton}
				handleFocus={props.handleFocus}
				handleUsername={props.handleUsername}
				handleText={props.handleText}
			/>
			{props.loggedIn ?
				<button type="submit" className={disableEdit ? "buttons" : "active buttons"} disabled={disableEdit} tabIndex={props.modal ? -1 : null}>Submit</button> :
				<button type="submit" className="buttons" disabled tabIndex={props.modal ? -1 : null}>Login First</button>
			}
			{props.editOpen ? <button type="button" className="buttons" onClick={(e) => props.handleButton('cancel', e)} tabIndex={props.modal ? -1 : null}>Cancel</button> : null}
		</form>
	);
};

function WriteReview(props) {
	return (
		<fieldset className={props.editOpen ? 'active' : null}>
			<div>
				<span id="write-username" className="usernames">{props.loggedIn && !props.editOpen ? `Posting as ${props.user}` : ''}</span>
				<textarea
					name="review-body"
					id="write-review"
					cols="30"
					rows="10"
					maxLength="255"
					placeholder={props.editOpen ? null : "Max length 255 chars"}
					defaultValue={props.editOpen ? props.reviewBody : ''}
					onChange={(e) => props.handleText(e)}
					tabIndex={props.modal ? -1 : null}
					required
				/>
				<span id="character-count">{255 - props.reviewBody.length}</span>
				<Rating
					modal={props.modal}
					user={props.userId}
					prodId={props.prodId}
					section="write"
					kind="user"
					rating={props.rating}
					handleButton={props.handleButton}
				/>
			</div>
		</fieldset>
	);
};

//====================
//Footer
//====================
function Footer(props) {
	return (
		<footer>
			Site copyright <a href="https://www.kylejackson.dev" tabIndex={props.modal ? -1 : null}>Kyle Jackson</a> 2019. All Rights Reserved.
		</footer>
	);
}

export default App;