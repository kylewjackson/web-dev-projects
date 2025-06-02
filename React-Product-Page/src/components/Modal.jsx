// src/components/Modal.jsx
import React from 'react';

export default class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.buttonFocus = React.createRef();
		this.container = React.createRef();

		this.keydownCallback = (e) => {
			if (e.key === 'Escape') {
				this.props.handleModal({ act: 'close' });
			}
		};
		this.clickCallback = (e) => {
			if (e.target === this.container.current) {
				this.props.handleModal({ act: 'close' });
			}
		};
	}

	componentDidUpdate() {
		if (this.props.show) {
			// Prevent body from scrolling:
			document.body.style.overflow = 'hidden';

			// Only focus the close‐button if we’re *not* rendering custom content.
			// If `props.content` exists, assume it contains its own focusable input/button.
			if (!this.props.content && this.buttonFocus.current) {
				this.buttonFocus.current.focus();
			}

			// Attach listeners for Escape/backdrop‐click:
			document.addEventListener('keydown', this.keydownCallback);
			document.addEventListener('click', this.clickCallback);
		} else {
			// Remove scrolling lock & listeners when modal goes away:
			if (document.body.style.overflow === 'hidden') {
				document.body.style.overflow = 'unset';
				document.removeEventListener('keydown', this.keydownCallback);
				document.removeEventListener('click', this.clickCallback);
			}
		}
	}

	render() {
		if (!this.props.show) {
			return null;
		}

		// If the parent passed a custom content node, render that:
		if (this.props.content) {
			return (
				<div id="modal" className="modal" ref={this.container}>
					<aside id="modal-window" className="modal-window" role="dialog">
						{/* Custom React node from props.content */}
						{this.props.content}

						{/* Still give them a default “Close” button (or you can let the content include its own) */}
						<button
							ref={this.buttonFocus}
							onClick={() => this.props.handleModal({ act: 'close' })}
						>
							Close
						</button>
					</aside>
				</div>
			);
		}

		// Otherwise, fall back to existing logic (msg/img + buttons):
		const showButton =
			this.props.btn && typeof this.props.btn.rmv === 'number' ? (
				[
					<button
						type="button"
						key="confirm-remove"
						ref={this.buttonFocus}
						onClick={() =>
							this.props.handleModal({ act: 'close', rmv: this.props.btn.rmv })
						}
					>
						Remove
					</button>,
					<button
						type="button"
						key="cancel-remove"
						onClick={() => this.props.handleModal({ act: 'close' })}
					>
						Cancel
					</button>,
				]
			) : (
				<button
					type="button"
					onClick={() => this.props.handleModal({ act: 'close' })}
					ref={this.buttonFocus}
				>
					Close
				</button>
			);

		return (
			<div id="modal" className="modal" ref={this.container}>
				<aside id="modal-window" className="modal-window" role="dialog" aria-labelledby="modal-message">
					{this.props.content ? this.props.content : this.props.img ? (
						<img
							src={this.props.img}
							alt="modal‐image"
							className="modal‐images"
						/>
					) : (
						<p id="modal-message">{this.props.msg || ''}</p>
					)}
					{showButton}
				</aside>
			</div>
		);
	}
}
