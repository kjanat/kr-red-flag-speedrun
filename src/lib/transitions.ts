import { flushSync } from 'svelte';

type TransitionDirection = 'forwards' | 'backwards';

/**
 * Wrap a synchronous state mutation in a View Transition.
 * Falls back to immediate execution when unsupported or reduced-motion.
 */
export function withViewTransition(
	mutate: () => void,
	direction?: TransitionDirection,
): void {
	if (
		typeof document === 'undefined'
		|| !('startViewTransition' in document)
		|| window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		mutate();
		return;
	}

	document.startViewTransition({
		update: () => flushSync(mutate),
		types: direction ? [direction] : [],
	});
}
