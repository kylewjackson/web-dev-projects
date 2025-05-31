import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': '/src',
			"@styles": '/src/styles',
			"@variables": '/src/styles/variables/_index.scss',
			"@mixins": '/src/styles/mixins/_index.scss',
			"@index": "/src/styles/_index.scss"
		}
	}
})
