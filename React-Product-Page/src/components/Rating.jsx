import { StarIcon, StarHalf, StarOutline } from "./Icons";
import { maxRating, colorRed, colorDarkGrey, colorBlack } from "../variables";

export function Rating(props) {
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

export function Star(props) {
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