import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		target: 'esnext',
	},
	// Force web workers to compile as modern ES modules, bypassing the 'iife' error
	worker: {
		format: 'es',
	},
	// THIS SERVER BLOCK for local CORS bypass
	server: {
		proxy: {
			'/api/noaa': {
				target: 'https://services.swpc.noaa.gov',
				changeOrigin: true,
				rewrite: () => '/products/noaa-planetary-k-index.json',
			},
			'/api/celestrak': {
				target: 'https://celestrak.org',
				changeOrigin: true,
				rewrite: () => '/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle',
			},
		},
	},
})
