export function Thumbnails(props) {
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

export function SubThumbnails(props) {
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