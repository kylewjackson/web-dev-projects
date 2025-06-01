import React from 'react';

class Modal extends React.Component {

	constructor(props) {
		super(props);
		this.buttonFocus = React.createRef();
		this.container = React.createRef();
		this.keydownCallback = (e) => {
			if (e.key === 'Escape') {
				this.props.handleModal({ act: 'close' });
			};
		};
		this.clickCallback = (e) => {
			if (e.target === this.container.current) {
				this.props.handleModal({ act: 'close' });
			};
		};
	};

	componentDidUpdate() {
		if (this.props.show) {
			const modalButton = this.buttonFocus.current;
			//focus button
			modalButton.focus();
			//prevent body scroll
			document.body.style.overflow = 'hidden';
			//add listeners for closing with escape and click
			document.addEventListener('keydown', this.keydownCallback);
			document.addEventListener('click', this.clickCallback);
		} else if (document.body.style.overflow === 'hidden') {
			document.body.style.overflow = 'unset';
			document.removeEventListener('keydown', this.keydownCallback);
			document.removeEventListener('click', this.clickCallback);
		};
	};

	render() {
		const showButton = this.props.btn && typeof this.props.btn.rmv === 'number' ?
			[
				<button type="button" key="confirm-remove" ref={this.buttonFocus} onClick={() => this.props.handleModal({ act: 'close', rmv: this.props.btn.rmv })}>Remove</button>,
				<button type="button" key="cancel-remove" onClick={() => this.props.handleModal({ act: 'close' })}>Cancel</button>,
			] :
			<button type="button" onClick={() => this.props.handleModal({ act: 'close' })} ref={this.buttonFocus}>Close</button>
		if (!this.props.show) {
			return null;
		} else {
			return (
				<div id="modal" className="modal" ref={this.container}>
					<aside id="modal-window" className="modal-window" role="dialog" aria-labelledby="modal-message">
						{this.props.img ?
							<img src={this.props.img} alt="main thumb in modal" className="modal-images" /> :
							<p id="modal-message">{this.props.msg ? this.props.msg : ''}</p>
						}
						{showButton}
					</aside>
				</div>
			);
		};
	};
};

export default Modal;