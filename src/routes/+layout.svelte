<script lang="ts">
import { browser } from '$app/environment';

let { children } = $props();

type Theme = 'dark' | 'light';

const themeStorageKey = 'rf-theme';

function resolveInitialTheme(): Theme {
	if (!browser) return 'dark';
	const stored = window.localStorage.getItem(themeStorageKey);
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: light)').matches
		? 'light'
		: 'dark';
}

let theme = $state<Theme>(resolveInitialTheme());

// Sync theme to DOM + localStorage. All writes target external APIs,
// not reactive state — $effect is correct here, not $derived.
$effect(() => {
	if (!browser) return;
	document.documentElement.dataset.theme = theme;
	document.documentElement.style.colorScheme = theme;
	window.localStorage.setItem(themeStorageKey, theme);
});

function toggleTheme() {
	theme = theme === 'dark' ? 'light' : 'dark';
}
</script>

<svelte:head>
	<title>Red Flag Speedrun</title>
	<meta
		name="description"
		content="Klinische triage trainer - herken alarmsignalen onder tijdsdruk"
	>
</svelte:head>

{@render children()}

<button
	class="theme-toggle"
	type="button"
	onclick={toggleTheme}
	aria-label="Schakel naar {theme === 'dark' ? 'licht' : 'donker'} thema"
>
	Thema: {theme === 'dark' ? 'donker' : 'licht'}
</button>

<style>
/*
 * ── Color system ───────────────────────────────────────
 * Primitives are hand-tuned per theme. Everything else is
 * derived via color-mix(in oklch, …) — perceptually uniform
 * interpolation means hover/bg/muted states stay coherent
 * when seeds or primitives change.
 *
 * Theme-agnostic derivations (surface-hover, text-muted,
 * focus, semantic borders) live here once; CSS resolves
 * var() references against whichever primitive wins the
 * cascade, so light overrides propagate automatically.
 */

/* ── Dark (default) ─────────────────────────────────── */
:global(:root) {
	color-scheme: dark;

	/* Primitives */
	--color-bg: oklch(20.77% 0.0398 265.75);
	--color-surface: oklch(27.95% 0.0368 260.03);
	--color-border: oklch(37.17% 0.0392 257.29);
	--color-text: oklch(92.88% 0.0126 255.51);
	--color-text-strong: oklch(96.83% 0.0069 247.9);
	--color-text-soft: oklch(55.44% 0.0407 257.42);
	--color-accent-a: oklch(63.68% 0.2078 25.33);
	--color-accent-b: oklch(70.49% 0.1867 47.6);

	/* Derived — theme-agnostic, re-evaluates when primitives change */
	--color-surface-hover: color-mix(
		in oklch,
		var(--color-surface) 93%,
		var(--color-text)
	);
	--color-text-muted: color-mix(
		in oklch,
		var(--color-text) 70%,
		var(--color-bg)
	);
	--color-focus: var(--color-accent-b);

	/* Semantic seeds — one source hue per family */
	--_danger: oklch(57.71% 0.2152 27.33);
	--_success: oklch(62.71% 0.1699 149.21);
	--_warning: oklch(76.86% 0.1647 70.08);

	/* Semantic — border = seed (auto-adapts), bg derived, text hand-tuned */
	--color-danger-border: var(--_danger);
	--color-danger-bg: color-mix(in oklch, var(--_danger) 69%, black);
	--color-danger-bg-hover: color-mix(in oklch, var(--_danger) 77%, black);
	--color-danger-text: oklch(80.77% 0.1035 19.57);

	--color-success-border: var(--_success);
	--color-success-bg: color-mix(in oklch, var(--_success) 63%, black);
	--color-success-bg-hover: color-mix(in oklch, var(--_success) 71%, black);
	--color-success-text: oklch(87.12% 0.1363 154.45);

	--color-warning-border: var(--_warning);
	--color-warning-text: oklch(83.69% 0.1644 84.43);
}

/*
 * ── Light (paint-synchronous via media query) ──────────
 * Applies immediately for OS-light users before any JS runs.
 * :not([data-theme="dark"]) lets an explicit user override win.
 *
 * Only primitives and per-theme derivations here — agnostic
 * vars (surface-hover, text-muted, focus, semantic borders)
 * auto-adapt from the :root formulas.
 */
@media (prefers-color-scheme: light) {
	:global(:root:not([data-theme="dark"])) {
		color-scheme: light;

		--color-bg: oklch(98.42% 0.0034 247.86);
		--color-surface: oklch(100% 0 none);
		--color-border: oklch(86.9% 0.0198 252.89);
		--color-text: oklch(20.77% 0.0398 265.75);
		--color-text-strong: oklch(12.88% 0.0406 264.7);
		--color-text-soft: oklch(55.44% 0.0407 257.42);
		--color-accent-a: oklch(57.71% 0.2152 27.33);
		--color-accent-b: oklch(64.61% 0.1943 41.12);

		--_danger: oklch(50.54% 0.1905 27.52);
		--_success: oklch(52.73% 0.1371 150.07);
		--_warning: oklch(66.58% 0.1574 58.32);

		--color-danger-bg: color-mix(in oklch, var(--_danger) 13%, white);
		--color-danger-bg-hover: color-mix(in oklch, var(--_danger) 23%, white);
		--color-danger-text: oklch(44.37% 0.1613 26.9);

		--color-success-bg: color-mix(in oklch, var(--_success) 8%, white);
		--color-success-bg-hover: color-mix(in oklch, var(--_success) 16%, white);
		--color-success-text: oklch(44.79% 0.1083 151.33);

		--color-warning-text: oklch(47.32% 0.1247 46.2);
	}
}

/*
 * ── Light (explicit user override via data-theme) ──────
 * Applies after hydration when user has toggled to light on
 * a dark-OS system. Same primitives + seeds as media query.
 */
:global(:root[data-theme="light"]) {
	color-scheme: light;

	--color-bg: oklch(98.42% 0.0034 247.86);
	--color-surface: oklch(100% 0 none);
	--color-border: oklch(86.9% 0.0198 252.89);
	--color-text: oklch(20.77% 0.0398 265.75);
	--color-text-strong: oklch(12.88% 0.0406 264.7);
	--color-text-soft: oklch(55.44% 0.0407 257.42);
	--color-accent-a: oklch(57.71% 0.2152 27.33);
	--color-accent-b: oklch(64.61% 0.1943 41.12);

	--_danger: oklch(50.54% 0.1905 27.52);
	--_success: oklch(52.73% 0.1371 150.07);
	--_warning: oklch(66.58% 0.1574 58.32);

	--color-danger-bg: color-mix(in oklch, var(--_danger) 13%, white);
	--color-danger-bg-hover: color-mix(in oklch, var(--_danger) 23%, white);
	--color-danger-text: oklch(44.37% 0.1613 26.9);

	--color-success-bg: color-mix(in oklch, var(--_success) 8%, white);
	--color-success-bg-hover: color-mix(in oklch, var(--_success) 16%, white);
	--color-success-text: oklch(44.79% 0.1083 151.33);

	--color-warning-text: oklch(47.32% 0.1247 46.2);
}

:global(*) {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:global(:focus-visible) {
	outline: 2px solid var(--color-focus);
	outline-offset: 2px;
}

:global(body) {
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	background:
		radial-gradient(
			circle at top right,
			color-mix(in oklch, var(--color-accent-b) 10%, transparent),
			transparent 40%
		),
		var(--color-bg);
	color: var(--color-text);
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding: max(3.5rem, env(safe-area-inset-top))
		max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom))
		max(1rem, env(safe-area-inset-left));
	transition: background-color 0.22s ease, color 0.22s ease;
}

:global(body *) {
	transition:
		background-color 0.22s ease,
		border-color 0.22s ease,
		color 0.22s ease;
}

@media (prefers-reduced-motion: reduce) {
	:global(body),
	:global(body *) {
		transition: none;
	}
}

.theme-toggle {
	position: fixed;
	top: max(0.75rem, env(safe-area-inset-top));
	right: max(0.75rem, env(safe-area-inset-right));
	z-index: 100;
	min-height: 44px;
	min-width: 44px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.55rem 0.85rem;
	border-radius: 999px;
	border: 1.5px solid var(--color-border);
	background: var(--color-surface);
	color: var(--color-text);
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.15s ease;
}

.theme-toggle:hover {
	border-color: var(--color-accent-a);
	background: var(--color-surface-hover);
	transform: translateY(-1px);
}

.theme-toggle:active {
	transform: translateY(0);
}

/* ── View Transitions ────────────────────────────── */

@keyframes vt-fade-in {
	from {
		opacity: 0;
	}
}

@keyframes vt-fade-out {
	to {
		opacity: 0;
	}
}

@keyframes vt-slide-up-in {
	from {
		opacity: 0;
		transform: translateY(12px);
	}
}

@keyframes vt-slide-up-out {
	to {
		opacity: 0;
		transform: translateY(-12px);
	}
}

@keyframes vt-slide-down-in {
	from {
		opacity: 0;
		transform: translateY(-12px);
	}
}

@keyframes vt-slide-down-out {
	to {
		opacity: 0;
		transform: translateY(12px);
	}
}

@keyframes vt-scale-in {
	from {
		opacity: 0;
		transform: scale(0.92);
	}
}

:global(::view-transition-group(*)) {
	animation-duration: 0.25s;
	animation-timing-function: ease-out;
}

/* Forwards: old slides up-out, new slides up-in */
:global(html:active-view-transition-type(forwards)) {
	&::view-transition-old(root) {
		animation: 0.2s ease-out both vt-slide-up-out;
	}
	&::view-transition-new(root) {
		animation: 0.25s ease-out both vt-slide-up-in;
	}
	/* Scenario card: crossfade + subtle scale */
	&::view-transition-old(scenario-card) {
		animation: 0.15s ease-out both vt-fade-out;
	}
	&::view-transition-new(scenario-card) {
		animation: 0.2s 0.05s ease-out both vt-scale-in;
	}
}

/* Backwards: old slides down-out, new slides down-in */
:global(html:active-view-transition-type(backwards)) {
	&::view-transition-old(root) {
		animation: 0.2s ease-out both vt-slide-down-out;
	}
	&::view-transition-new(root) {
		animation: 0.25s ease-out both vt-slide-down-in;
	}
}

@media (prefers-reduced-motion: reduce) {
	:global(::view-transition-group(*)),
	:global(::view-transition-old(*)),
	:global(::view-transition-new(*)) {
		animation-duration: 0.01s !important;
		animation-delay: 0s !important;
	}
}
</style>
