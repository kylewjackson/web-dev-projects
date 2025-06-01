import IconPlus from '../../assets/Plus.svg?react';
import IconMinus from '../../assets/Minus.svg?react';
interface QuantityInputProps {
	quantity: number;
	min?: number;
	max?: number;
	onChange: (newQuantity: number) => void;
	disabled?: boolean;
}

export const QuantityInput = ({
	quantity,
	min = 1,
	max = 99,
	onChange,
	disabled = false,
}: QuantityInputProps) => {
	const handleDecrease = () => {
		if (quantity > min) {
			onChange(quantity - 1);
		}
	};

	const handleIncrease = () => {
		if (quantity < max) {
			onChange(quantity + 1);
		}
	};

	return (
		<div className="ppd-quantity-input" aria-label="Quantity selector">
			<button
				type="button"
				onClick={handleDecrease}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
				className="ppd-quantity-input__button"
			>
				<IconMinus />
			</button>

			<input
				type="text"
				inputMode="numeric"
				pattern="[0-9]*"
				readOnly
				value={quantity}
				aria-live="polite"
				aria-label="Quantity"
				className="ppd-quantity-input__value"
			/>

			<button
				type="button"
				onClick={handleIncrease}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
				className="ppd-quantity-input__button"
			>
				<IconPlus />
			</button>
		</div>
	);
};
