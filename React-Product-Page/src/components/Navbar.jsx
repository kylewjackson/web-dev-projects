import { CSSTransition } from 'react-transition-group';
import { Cart } from './Cart';
import LogIn from './LogIn';
import { CloseArrowIcon, CartIcon } from './Icons';
import { colorDarkGrey, colorYellow, colorWhite } from '../variables';

export function Navbar(props) {
	return (
		<nav id="navbar">
			<ul id="nav-link-container">
				<li id="nav-categories" className={props.navOpen ? 'active links' : 'links'} ref={props.navRef}>
					<button type="button" tabIndex={props.modal ? -1 : null} onClick={() => props.toggleMenu('nav')}>
						Categories
					</button>
					<CSSTransition
						in={props.navOpen}
						timeout={300}
						classNames="category-flyout"
						unmountOnExit
					>
						<NavLinks modal={props.modal} handleModal={props.handleModal} toggleMenu={props.toggleMenu} />
					</CSSTransition>
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
					cartButtonRef={props.cartButtonRef}
				/>
			</ul>
			<CSSTransition
				in={!props.cartClosed}
				timeout={300}
				classNames="cart-flyout"
				unmountOnExit
			>
				<Cart
					modal={props.modal}
					itemsInCart={props.itemsInCart}
					handleInput={props.handleInput}
					handleFocus={props.handleFocus}
					handleSubmit={props.handleSubmit}
					handleButton={props.handleButton}
					preventEnter={props.preventEnter}
					toggleMenu={props.toggleMenu}
					cartRef={props.cartRef}
				/>
			</CSSTransition>
		</nav>
	);
};

export function NavLinks(props) {
	return (
		<ol id="categories-links" className="nav-links">
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 1</button></li>
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 2</button></li>
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 3</button></li>
			<li><button type="button" tabIndex={props.modal ? -1 : null} onClick={(e) => props.handleModal({ msg: 'This link will go to a designated page, or some other action you decide on.' }, e)}>Cat. 4</button></li>
			<button type="button" tabIndex={props.modal ? -1 : null} onClick={() => props.toggleMenu('nav')}>
				<CloseArrowIcon fillColor={colorDarkGrey} />
			</button>
		</ol>
	);
};

export function NavCart(props) {
	return (
		<li id="nav-cart" className="links">
			<button type="button" onClick={() => props.toggleMenu('cart')} aria-label="open cart" ref={props.cartButtonRef} tabIndex={props.modal ? -1 : null}>
				<span id="cart-button-span">
					<CartIcon fillColor={props.itemCount > 0 ? colorYellow : colorWhite} />
					<span className={props.itemCount > 0 ? 'active' : null}>Cart ({props.itemCount.toString()})</span>
				</span>
			</button>
		</li>
	);
};