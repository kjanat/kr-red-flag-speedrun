import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from 'vite-svg-to-ico';

export default defineConfig({
	plugins: [
		sveltekit(),
		svg({
			input: 'src/lib/assets/favicon.svg',
			emit: { source: true, inject: true },
		}),
	],
});
