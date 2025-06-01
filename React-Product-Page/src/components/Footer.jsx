export default function Footer(props) {
	return (
		<footer>
			Site copyright <a href="https://www.kylejackson.dev" tabIndex={props.modal ? -1 : null}>Kyle Jackson</a> 2019. All Rights Reserved.
		</footer>
	);
}