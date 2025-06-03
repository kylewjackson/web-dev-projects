import { Rating } from "./Rating";
import { ThumbsUpIcon, ThumbsDownIcon, StarIcon } from "./Icons";
import { maxRating, colorDarkGrey, colorRed } from "../variables";

export function ReviewDisplay(props) {
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

export function ProductReviews(props) {
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

export function Reviews(props) {
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

export function ReviewFilter(props) {
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

export function ReviewRatings(props) {
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
			<label htmlFor="review-ratings-form">Filter By Rating</label>
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

export function ReviewRatingInputs(props) {
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
				disabled={num === 0}
			/>
			<label htmlFor={`${props.val}-star`} aria-label={`sort by ${props.val}`}>
				{stars}
				<span>({num})</span>
			</label>
		</div>
	);
};

export function Review(props) {
	const kindOfClass = props.userId === props.currentUser && props.editOpen ? "current-user reviews active" : props.userId === props.currentUser ? "current-user reviews" : "reviews";
	return (
		<article id={`${props.userId}-review`} className={kindOfClass}>
			<h4 className="names">{props.user.toUpperCase()}{props.userId === props.currentUser && ' (Your Review)'}</h4>
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

export function Feedback(props) {
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

export function WriteProductReview(props) {
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

export function WriteReview(props) {
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