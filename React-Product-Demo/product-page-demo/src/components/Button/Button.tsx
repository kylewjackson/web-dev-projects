import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	variant: 'add-to-cart' | 'neutral' | 'submit' | 'cancel';
	fullWidth?: boolean;
	disabled?: boolean;
	ariaLabel?: string;
};

export const Button = ({
	children,
	onClick,
	type = 'button',
	variant = 'add-to-cart',
	fullWidth = false,
	disabled = false,
	ariaLabel
}: ButtonProps) => {
	const classes = classNames('ppd-button', {
		[`ppd-button--${variant}`]: variant,
		'ppd-button--full': fullWidth
	});

	return (
		<button
			className={classes}
			onClick={onClick}
			type={type}
			disabled={disabled}
			aria-label={ariaLabel}
		>
			{children}
		</button>
	);
}