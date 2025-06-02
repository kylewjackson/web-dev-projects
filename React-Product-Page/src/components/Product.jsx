import { AddToCart, RemoveItem } from "./Cart";
import { MinusIcon, PlusIcon } from "./Icons";
import { Thumbnails } from "./Thumbnails";
import { Rating } from "./Rating";
import { itemOptions } from "../utilities";
import { maxQty, colorDarkGrey } from "../variables";

//=============
//Interactions
//=============

export function ProductForm(props) {
	return (
		<form
			id={`${props.id}-form`}
			className="forms"
			onSubmit={(e) => props.handleSubmit(props.index, 'cart', e)}
			onKeyPress={props.cart ? (e) => props.preventEnter(e) : null}
		>
			{props.cart ? (
				<div className="cart-option-label">
					<span><strong>Option:</strong> {itemOptions.find(o => o.id === props.opt)?.name || 'N/A'}</span>
				</div>
			) : (
				<Options
					modal={props.modal}
					cart={false}
					index={-1}
					id={props.id}
					opt={props.opt}
					handleInput={props.handleInput}
				/>
			)}
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

export function Quantity(props) {
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

export function Options(props) {
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

//=============
//Info
//=============

export function ProductInfo(props) {
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

export function Price(props) {
	return (
		<strong id={`${props.prodId}-price`} className="prices">
			${props.price.toFixed(2)}
		</strong>
	);
};

export function Description(props) {
	const productDescription = `This a description of your product. It’s very cool and very affordable. You’ll be the envy of all your friends should you buy this product. It’s THAT good.`;
	return (
		<p id={`${props.prodId}-description`} className="paragraphs">
			{productDescription}
		</p>
	);
};

export function ReviewsLink(props) {
	return (
		<button type="button" id={`${props.prodId}-reviews-link`} className="links" tabIndex={props.modal ? -1 : null} onClick={(e) => document.querySelector('.review-displays').scrollIntoView()}>
			Reviews ({props.reviewCount.toString()})
		</button>
	);
};