import { Navbar } from './Navbar';
// import { Cart } from './Cart';

export default function Header(props) {
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
				navRef={props.navRef}
				cartRef={props.cartRef}
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