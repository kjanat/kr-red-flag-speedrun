import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import robots from 'vite-robots-txt';
import svg from 'vite-svg-to-ico';

export default defineConfig({
	plugins: [
		sveltekit(),
		robots({
			preset: 'allowAll',
			header: 'allow crawling everything by default',
			devMode: 'same',
		}),
		svg({
			input: './src/lib/assets/favicon.svg',
			emit: { source: true, inject: 'minimal' },
			dev: { injection: 'shim' },
		}),
	]
});
