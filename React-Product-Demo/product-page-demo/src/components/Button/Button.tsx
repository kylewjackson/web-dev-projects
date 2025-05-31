import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	variant: 'add-to-cart' | 'neutral';
};

export const Button = ({ children, onClick, type = 'button', variant = 'add-to-cart'}: ButtonProps) => {
	const classes = classNames('ppd-button', {
		[`ppd-button--${variant}`] : variant
	});

	return (
		<button className={classes} onClick={onClick} type={type}>
			{children}
		</button>
	);
}