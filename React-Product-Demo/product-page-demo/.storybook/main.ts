import type { StorybookConfig } from '@storybook/react-vite';
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
	"stories": [
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
	],
	"addons": [
		"@storybook/addon-onboarding",
		"@chromatic-com/storybook",
		"@storybook/addon-docs",
		"@storybook/addon-a11y",
		"@storybook/addon-vitest",
		"storybook-addon-pseudo-states"
	],
	"framework": {
		"name": "@storybook/react-vite",
		"options": {}
	},
	async viteFinal(config) {
		config.plugins = config.plugins || [];
		config.plugins.push(svgr());
		return config;
	},
};
export default config;