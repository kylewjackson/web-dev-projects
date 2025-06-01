import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	variant: 'add-to-cart' | 'neutral' | 'submit';
	fullWidth?: boolean;
};

export const Button = ({ children, onClick, type = 'button', variant = 'add-to-cart', fullWidth = false}: ButtonProps) => {
	const classes = classNames('ppd-button', {
		[`ppd-button--${variant}`] : variant,
		'ppd-button--full': fullWidth
	});

	return (
		<button className={classes} onClick={onClick} type={type}>
			{children}
		</button>
	);
}