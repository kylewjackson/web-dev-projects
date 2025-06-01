import { QuantityInput } from './QuantityInput';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof QuantityInput> = {
	title: 'Components/QuantityInput',
	component: QuantityInput,
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof QuantityInput>;

export const Qun: Story = {};