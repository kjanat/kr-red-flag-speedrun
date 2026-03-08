import adapter from '@sveltejs/adapter-static';
import type { Config } from '@sveltejs/kit';
import { env } from 'node:process';

const config: Config = {
	kit: {
		adapter: adapter({
			fallback: '404.html',
		}),
		paths: {
			base: env.GITHUB_ACTIONS === 'true' && env.GITHUB_REPOSITORY
				? `/${env.GITHUB_REPOSITORY.split('/')[1]}`
				: '',
		},
	},
};

export default config;
