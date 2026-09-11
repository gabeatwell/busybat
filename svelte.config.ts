import adapter from '@sveltejs/adapter-vercel';
import type { Config } from '@sveltejs/kit';

const config: Config = {
	kit: {
		adapter: adapter(),
		files: {
			assets: 'static',
			lib: 'src/lib',
			routes: 'src/routes',
			appTemplate: 'src/app.html'
		}
	}
};

export default config;
