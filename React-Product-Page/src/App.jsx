import React from 'react';
//Variables & utils
import { currentProduct, initInCart, maxQty, initReviews } from './variables';
import { deepCopy, transformUserId, itemOptions } from './utilities';
//Components
import Modal from './components/Modal';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
//Stylesheet
import './scss/global.scss';
import { LogInForm, SignUpForm } from './components/LogIn';

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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			modalImg: null,
			modalMsg: null,
			modalBtn: null,
			modalView: null,
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
			userNameError: '',
			rating: null,
			publishedRating: null,
			reviewBody: '',
			reviewSubmitted: false,
			edit: false,
			itemsInCart: deepCopy(initInCart),
			cartClosed: true,
		};

		this.cartRef = React.createRef();
		this.cartButtonRef = React.createRef();
		this.navRef = React.createRef();

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

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside = (event) => {
		// Only try closing if cart is currently open:
		if (!this.state.cartClosed) {
			const clickedInsideCart =
				this.cartRef.current && this.cartRef.current.contains(event.target);
			const clickedOnButton =
				this.cartButtonRef.current && this.cartButtonRef.current.contains(event.target);

			if (!clickedInsideCart && !clickedOnButton) {
				this.setState({ cartClosed: true });
			}
		}

		// Nav logic unchanged (or add navButtonRef similarly if needed):
		if (this.navRef.current && !this.navRef.current.contains(event.target)) {
			if (this.state.navOpen) {
				this.setState({ navOpen: false });
			}
		}
	};


	handleModal(params, e) {
		if (e) {
			params.prev = e.target;
		}

		if (params.act === 'close') {
			// If closing, clear modal and modalView:
			if (this.state.prevEle) {
				this.state.prevEle.focus();
			}
			if (typeof params.rmv === 'number') {
				this.setState({
					itemsInCart: deepCopy(this.state.itemsInCart).filter((item, i) => i !== params.rmv),
				});
			}
			this.setState({
				modal: false,
				modalImg: null,
				modalMsg: null,
				modalBtn: null,
				modalView: null,
				prevEle: null,
			});
		}
		else if (params.view === 'login') {
			// When caller wants to open the login form
			this.setState({
				modal: true,
				modalImg: null,
				modalMsg: null,
				modalBtn: null,
				modalView: 'login',
				prevEle: params.prev || null,
			});
		}
		else if (params.view === 'signup') {
			// When caller wants to open the signup form
			this.setState({
				modal: true,
				modalImg: null,
				modalMsg: null,
				modalBtn: null,
				modalView: 'signup',
				prevEle: params.prev || null,
			});
		}
		else {
			// Fallback: still allow showing a one‐off message or image
			this.setState({
				modal: true,
				modalImg: params.img || null,
				modalMsg: params.msg || null,
				modalBtn: params.btn || null,
				modalView: null,
				prevEle: params.prev || null,
			});
		}
	}


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

	handleLogin(e) {
		if (e.target.value === 'login') {
			this.setState({ openLogin: true, openSignup: false }, () => document.querySelector('#login-form input').focus());
		} else {
			this.setState({ openSignup: true, openLogin: false });
		};
	};

	handleSubmit(ind, type, e) {
		e.preventDefault();

		//CART LOGIC
		if (type === 'cart' && ind > -1) {
			this.handleModal({ msg: 'Are you sure you want to delete this item?', btn: { rmv: ind } });
			return;
		} else if (type === 'cart') {
			// Add to cart
			const itemToAdd = {
				prodName: this.prodName,
				prodId: this.prodId,
				thumb: this.subthumbs,
				opt: this.state.opt,
				qty: this.state.qty,
				price: this.price,
			};
			this.setState({
				itemsInCart: this.addItem(itemToAdd),
				qty: freshState.qty,
				opt: freshState.opt,
			});
			this.handleModal({ msg: `${this.prodName} - ${this.state.opt} x ${this.state.qty} added to cart succesfully!`});
			return;
		}

		// 2) SIGN-IN / SIGN-UP / LOGOUT
		if (type === 'login') {
			// Attempt to sign in: check if a review with this.state.userId exists
			const found = this.state.reviews.some((r) => r.id === this.state.userId);

			if (found) {
				// > SUCCESSFUL LOGIN:
				const userReview = this.state.reviews.find((r) => r.id === this.state.userId);
				this.setState({
					loggedIn: true,
					openLogin: false,
					rating: userReview.rating,
					publishedRating: userReview.publishedRating,
					reviewBody: userReview.review || '',
					reviewSubmitted: !!userReview.review,
					rated: userReview.rated,
					userNameError: '', // clear any previous error
				});

				// combine carts if they had one saved
				if (userReview.cart) {
					this.combineCarts(userReview.cart);
				} else {
					// if no saved cart, keep whatever is currently in state
					this.setState({
						itemsInCart: this.state.itemsInCart.length > 0
							? deepCopy(this.state.itemsInCart)
							: [],
					});
				}

				this.handleFilterReviews(this.state.sort);
				// Close the modal entirely
				this.handleModal({ act: 'close' });
			} else {
				// > LOGIN FAILED: no such user
				this.setState({
					userNameError: `There's no user named "${this.state.user}". Sign Up instead?`,
				}, () => {
					// After setting the error, switch to the SIGNUP view
					// (the input will stay prefilled, so they can correct or sign up with same name)
					this.handleModal({ view: 'signup' });
				});
			}

			return;
		}
		else if (type === 'signup') {
			// Signing up: check if a review with this.state.userId already exists
			const exists = this.state.reviews.some((r) => r.id === this.state.userId);

			if (!exists) {
				// > SUCCESSFUL SIGNUP:
				const newUser = {
					user: this.state.user,
					id: this.state.userId,
					rating: this.state.rating, // might be null initially
					rated: this.state.rated,  // might be []
				};
				this.setState({
					reviews: deepCopy(this.state.reviews).concat(newUser),
					loggedIn: true,
					openSignup: false,
					userNameError: '', // clear any previous error
				});
				// Close the modal
				this.handleModal({ act: 'close' });
			} else {
				// > SIGNUP FAILED: user already exists
				this.setState({
					userNameError: `User "${this.state.user}" already exists. Log In instead?`,
				}, () => {
					// After the error is set, switch back to the LOGIN view (input remains prefilled)
					this.handleModal({ view: 'login' });
				});
			}

			return;
		}
		else if (type === 'logout') {
			// LOGOUT: preserve cart into user’s review
			if (this.state.loggedIn) {
				const userCart = this.state.itemsInCart.length > 0
					? deepCopy(this.state.itemsInCart)
					: [];
				const reviewFeedback = this.state.rated.length > 0
					? deepCopy(this.state.rated)
					: [];
				const updatedReviews = this.state.reviews.map((r) => {
					if (r.id === this.state.userId) {
						r.cart = userCart;
						r.rated = reviewFeedback;
					}
					if (r.hidden) {
						r.hidden = false;
					}
					return r;
				});
				this.handleFilterReviews(this.state.sort, updatedReviews);
				// Finally, reset everything except we keep cart saved in reviews
				this.setState(freshState);
			}
			return;
		}

		// “WRITE REVIEW” LOGIC
		if (type === 'write' && this.state.rating) {
			const reviewArray = deepCopy(this.state.reviews).map((item) => {
				if (item.id === this.state.userId) {
					item.rating = this.state.rating;
					item.review = this.state.reviewBody;
					item.hidden = false;
					item.feedback = { up: 0, down: 0 };
					item.publishedRating = this.state.rating;
					item.date = new Intl.DateTimeFormat('en', {
						dateStyle: 'medium',
						timeStyle: 'medium',
					}).format(new Date());
				} else if (this.state.edit && item.rated) {
					item.rated.forEach((obj, i) => {
						if (obj[this.state.userId]) {
							item.rated.splice(i, 1);
						}
					});
				}
				return item;
			});

			this.setState({
				reviews: reviewArray,
				reviewSubmitted: true,
				publishedRating: this.state.rating,
			});
			if (this.state.edit) {
				this.editReview();
			}
			this.handleModal({ msg: 'Thanks for your feedback!' });
		}
		else if (type === 'write') {
			this.handleModal({
				msg: 'Sorry, you must leave a rating first.',
				prev: e.target.querySelector('.empty-4-star'),
			});
		}
	}


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
		this.setState(prevState => {
			if (type === 'cart') {
				return {
					cartClosed: !prevState.cartClosed,
					navOpen: false
				};
			} else if (type === 'nav') {
				return {
					navOpen: !prevState.navOpen,
					cartClosed: true
				};
			}
			return null;
		});
	}

	handleUsername(e) {
		const raw = e.target.value;
		console.log(`raw: ${raw}`);
		const newError =
			!transformUserId(raw) && raw.length > 0
				? "Invalid character detected. Avoid: -!$%^&*()_+|~=`{}[]:\";'<>?,./"
				: "";

		this.setState({
			user: raw,
			userId: transformUserId(raw),
			userNameError: newError
		});
	}

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
	};

	handleText(e) {
		const text = e.target.value;
		this.setState({ reviewBody: text });
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
					content={
						this.state.modalView === 'login' ? (
							<LogInForm
								user={this.state.user}
								userNameError={this.state.userNameError}
								modal={this.state.modal}
								handleSubmit={this.handleSubmit}
								handleUsername={this.handleUsername}
								handleModal={this.handleModal}
								fullForm={true}
							/>
						) : this.state.modalView === 'signup' ? (
							<SignUpForm
								user={this.state.user}
								userNameError={this.state.userNameError}
								modal={this.state.modal}
								handleSubmit={this.handleSubmit}
								handleUsername={this.handleUsername}
								handleModal={this.handleModal}
								fullForm={true}
							/>
						) : null
					}
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
					userNameError={this.state.userNameError}
					loggedIn={this.state.loggedIn}
					openLogin={this.state.openLogin}
					openSignup={this.state.openSignup}
					handleUsername={this.handleUsername}
					handleLogin={this.handleLogin}
					handleButton={this.handleButton}
					navRef={this.navRef}
					cartRef={this.cartRef}
					cartButtonRef={this.cartButtonRef}
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

export default App;