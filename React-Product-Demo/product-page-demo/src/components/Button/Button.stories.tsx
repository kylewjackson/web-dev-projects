import { Button } from './Button';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			description: "Contexual button variant",
			control: {type: 'radio'},
			options: ['add-to-cart', 'neutral', 'submit']
		}
	},
	args: {
		children: 'Add to Cart',
		variant: 'add-to-cart'
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const AddToBag: Story = {};

export const Neutral: Story = {
    args: {
        children: "Click Me",
        variant: "neutral"
    }
};

export const Submit: Story = {
    args: {
        children: "Submit Review",
        variant: "submit",
        type: "submit"
    }
};