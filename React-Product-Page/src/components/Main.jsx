import { ProductInfo } from './Product';
import { ReviewDisplay } from './Review';
import { maxRating } from '../variables';

export default function Main(props) {
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