<script lang="ts">
import { browser } from '$app/environment';

let { children } = $props();

type Theme = 'dark' | 'light';

const themeStorageKey = 'rf-theme';

let theme = $state<Theme>('dark');

if (browser) {
	const storedTheme = window.localStorage.getItem(themeStorageKey);
	if (storedTheme === 'light' || storedTheme === 'dark') {
		theme = storedTheme;
	} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
		theme = 'light';
	}
}

$effect(() => {
	if (!browser) return;
	document.documentElement.dataset.theme = theme;
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
:global(:root) {
	--color-bg: #0f172a;
	--color-surface: #1e293b;
	--color-surface-hover: #243449;
	--color-border: #334155;
	--color-text: #e2e8f0;
	--color-text-strong: #f1f5f9;
	--color-text-muted: #94a3b8;
	--color-text-soft: #64748b;
	--color-accent-a: #ef4444;
	--color-accent-b: #f97316;
	--color-danger-border: #dc2626;
	--color-danger-bg: #7f1d1d;
	--color-danger-bg-hover: #991b1b;
	--color-danger-text: #fca5a5;
	--color-success-border: #16a34a;
	--color-success-bg: #14532d;
	--color-success-bg-hover: #166534;
	--color-success-text: #86efac;
	--color-warning-border: #f59e0b;
	--color-warning-text: #fbbf24;
	--color-focus: #f97316;
}

:global(:root[data-theme="light"]) {
	--color-bg: #f8fafc;
	--color-surface: #ffffff;
	--color-surface-hover: #f1f5f9;
	--color-border: #cbd5e1;
	--color-text: #0f172a;
	--color-text-strong: #020617;
	--color-text-muted: #475569;
	--color-text-soft: #64748b;
	--color-accent-a: #dc2626;
	--color-accent-b: #ea580c;
	--color-danger-border: #b91c1c;
	--color-danger-bg: #fee2e2;
	--color-danger-bg-hover: #fecaca;
	--color-danger-text: #991b1b;
	--color-success-border: #15803d;
	--color-success-bg: #dcfce7;
	--color-success-bg-hover: #bbf7d0;
	--color-success-text: #166534;
	--color-warning-border: #d97706;
	--color-warning-text: #92400e;
	--color-focus: #ea580c;
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
			rgb(249 115 22 / 0.1),
			transparent 40%
		),
		var(--color-bg);
	color: var(--color-text);
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	transition: background-color 0.22s ease, color 0.22s ease;
}

:global(.menu),
:global(.subtitle),
:global(.level-btn),
:global(.level-desc),
:global(.hint),
:global(.progress-bar),
:global(.counter),
:global(.timer),
:global(.scenario-card),
:global(.presentation),
:global(.keys-hint),
:global(.score-card),
:global(.feedback-card),
:global(.level),
:global(.weak-hint),
:global(.fb-presentation),
:global(.fb-explanation),
:global(.section h2),
:global(.restart-btn),
:global(.theme-toggle) {
	transition:
		background-color 0.22s ease,
		border-color 0.22s ease,
		color 0.22s ease;
}

@media (prefers-reduced-motion: reduce) {
	:global(.menu),
	:global(.subtitle),
	:global(.level-btn),
	:global(.level-desc),
	:global(.hint),
	:global(.progress-bar),
	:global(.counter),
	:global(.timer),
	:global(.scenario-card),
	:global(.presentation),
	:global(.keys-hint),
	:global(.score-card),
	:global(.feedback-card),
	:global(.level),
	:global(.weak-hint),
	:global(.fb-presentation),
	:global(.fb-explanation),
	:global(.section h2),
	:global(.restart-btn),
	:global(.theme-toggle),
	:global(body) {
		transition: none;
	}
}

.theme-toggle {
	position: fixed;
	top: 1rem;
	right: 1rem;
	padding: 0.55rem 0.85rem;
	border-radius: 999px;
	border: 1px solid var(--color-border);
	background: var(--color-surface);
	color: var(--color-text);
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.15s ease;
}

.theme-toggle:hover {
	background: var(--color-surface-hover);
}
</style>
