import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		fs: {
			allow: ['..']
		},
		open: true
	},
	build: {
		target: 'es2020',
		rollupOptions: {
			output: {
				manualChunks: undefined
			}
		}
	}
});
