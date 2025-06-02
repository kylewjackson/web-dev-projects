import { ProductForm } from './Product';
import { CartIcon, CloseArrowIcon } from './Icons';
import { deepCopy, itemOptions } from '../utilities';
import { colorRed, colorDarkGrey, colorWhite, maxQty } from '../variables';

export function Cart(props) {
	return (
		<aside id="cart" ref={props.cartRef}>
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

export function InCart(props) {
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

export function CartProduct(props) {
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

export function RemoveItem(props) {
	return (
		<button
			type="button"
			id={`remove-${props.id}`}
			className="remove-items"
			aria-label="remove from cart"
			onClick={(e) => props.handleSubmit(props.index, 'cart', e)}
			tabIndex={props.modal ? -1 : null}
		>
			Remove
		</button>
	);
};

export function Total(props) {
	const subTotal = props.itemsInCart.map(item => item.qty * item.price * 100 / 100).reduce((x, y) => x + y);
	const tax = (subTotal * 1000) * (0.0825 * 1000 / 1000) / 1000;
	const finalTotal = (subTotal * 100 / 100) + (tax * 100 / 100);
	return (
		<div id="cart-totals-container" className="cart-totals">
			<span id="cart-subtotal">Subtotal: ${subTotal.toFixed(2)} </span>
			<span id="cart-tax">Tax: ${tax.toFixed(2)} </span>
			<span id="cart-final-total"><strong>Total: ${finalTotal.toFixed(2)} </strong></span>
		</div>
	);
};

export function Checkout(props) {
	return (
		<button
			type="button"
			id="checkout-button"
			className="icons buttons"
			tabIndex={props.modal ? -1 : null}
			onClick={() => props.handleButton('checkout')}
		>
			<span id="checkout-button-span">
				<CartIcon fillColor={colorRed} />
				<span>Proceed to Checkout</span>
			</span>
		</button>
	);
};

export function CloseCart(props) {
	return (
		<button type="button" id="close-cart-button" className="icons" onClick={() => props.toggleMenu('cart')} tabIndex={props.modal ? -1 : null}>
			<CloseArrowIcon fillColor={colorDarkGrey} />
		</button>
	);
};

export function AddToCart(props) {
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
				<i>
					<CartIcon fillColor={colorWhite} />
				</i>
				<span>{!dupeInCart ? 'Add to Cart' : qtyTogther <= maxQty ? 'Update Cart' : 'Maxed Out'}</span>
			</span>
		</button>
	);
};