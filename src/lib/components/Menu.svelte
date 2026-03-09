<script lang="ts">
import { scenarios } from '$lib/data/scenarios';
import { getHighScore } from '$lib/engine/history';
import {
	DEFAULT_ROUND_LENGTH,
	ROUND_LENGTHS,
	type RoundFilter,
	type RoundLength,
} from '$lib/engine/round';
import type { Difficulty, StatKrTopic } from '$lib/types';

interface Props {
	onstart: (
		difficulty: Difficulty,
		filter?: RoundFilter,
		count?: RoundLength,
	) => void;
}

const { onstart }: Props = $props();

const MIN_PLAYABLE = 5;

const levels: { id: Difficulty; label: string; description: string }[] = [
	{
		id: 'intern',
		label: 'Intern',
		description: 'Klassieke, duidelijke alarmsignalen',
	},
	{
		id: 'anios',
		label: 'ANIOS',
		description: 'Subtielere, atypische presentaties',
	},
	{
		id: 'huisarts',
		label: 'Huisarts',
		description: 'Grijze gebieden, ambigue symptomen',
	},
];

const topics: { id: StatKrTopic; label: string }[] = [
	{ id: 'Hoofdpijn', label: 'Hoofdpijn' },
	{ id: 'Hartkloppingen', label: 'Hartkloppingen' },
	{ id: 'Acute buikpijn', label: 'Acute buikpijn' },
	{ id: 'Enkeloedeem', label: 'Enkeloedeem' },
	{ id: 'Verwardheid', label: 'Verwardheid' },
	{ id: 'Vergeetachtigheid', label: 'Vergeetachtigheid' },
];

/** Selected topic ids; empty = all topics */
let selectedTopics: StatKrTopic[] = $state([]);
let roundLength: RoundLength = $state(DEFAULT_ROUND_LENGTH);
let filterExpanded = $state(false);

function toggleTopic(topic: StatKrTopic): void {
	if (selectedTopics.includes(topic)) {
		selectedTopics = selectedTopics.filter((t) => t !== topic);
	} else {
		selectedTopics = [...selectedTopics, topic];
	}
}

function countForDifficulty(difficulty: Difficulty): number {
	if (selectedTopics.length === 0) {
		return scenarios.filter((s) => s.difficulty === difficulty).length;
	}
	const topicSet = new Set(selectedTopics);
	return scenarios.filter(
		(s) => s.difficulty === difficulty && topicSet.has(s.sourceTopic),
	).length;
}

const dev = import.meta.env.DEV;

/** In dev mode, show scenario count per topic */
const topicCounts: ReadonlyMap<StatKrTopic, number> = new Map(
	topics.map((
		{ id },
	) => [id, scenarios.filter((s) => s.sourceTopic === id).length]),
);

function buildFilter(): RoundFilter | undefined {
	return selectedTopics.length > 0 ? { topics: selectedTopics } : undefined;
}

const filterCount = $derived(selectedTopics.length);
</script>

<div class="menu">
	<h1 class="title">Red Flag Speedrun</h1>
	<p class="subtitle">Herken alarmsignalen onder tijdsdruk</p>

	<!-- Mobile filter toggle -->
	<button
		class="filter-toggle"
		onclick={() => (filterExpanded = !filterExpanded)}
		aria-expanded={filterExpanded}
		aria-controls="topic-filter"
	>
		<span>Filter{filterCount > 0 ? ` (${filterCount})` : ''}</span>
		<span class="chevron" class:open={filterExpanded}>&#x25BE;</span>
	</button>

	<!-- Topic filter pills -->
	<div
		id="topic-filter"
		class="topic-bar"
		class:collapsed={!filterExpanded}
		role="group"
		aria-label="Filter op onderwerp"
	>
		<button
			class="pill"
			class:pill-active={selectedTopics.length === 0}
			onclick={() => (selectedTopics = [])}
			aria-pressed={selectedTopics.length === 0}
		>
			Alles
		</button>
		{#each topics as topic}
			<button
				class="pill"
				class:pill-active={selectedTopics.includes(topic.id)}
				onclick={() => toggleTopic(topic.id)}
				aria-pressed={selectedTopics.includes(topic.id)}
			>
				{topic.label}{#if dev}<span class="dev-count">{
						topicCounts.get(topic.id)
					}</span>{/if}
			</button>
		{/each}
	</div>

	<!-- Round length selector -->
	<div class="round-config" role="group" aria-label="Aantal vragen per ronde">
		{#each ROUND_LENGTHS as len}
			<button
				class="pill length-pill"
				class:pill-active={roundLength === len}
				onclick={() => (roundLength = len)}
				aria-pressed={roundLength === len}
			>
				{len}
			</button>
		{/each}
		<span class="round-label">vragen</span>
	</div>

	<div class="levels" role="group" aria-label="Kies moeilijkheidsgraad">
		{#each levels as level}
			{@const count = countForDifficulty(level.id)}
			{@const best = getHighScore(level.id, roundLength)}
			<button
				class="level-btn"
				disabled={count < MIN_PLAYABLE}
				onclick={() => onstart(level.id, buildFilter(), roundLength)}
			>
				<span class="level-name">{level.label}</span>
				<span class="level-desc">{level.description}</span>
				<span class="level-meta">
					<span>{count} scenario's</span>
					{#if best !== null}<span class="high-score">PR: {best}</span>{/if}
				</span>
			</button>
		{/each}
	</div>

	<p class="hint">Tot {roundLength} vragen per ronde. Snelheid telt.</p>
</div>

<style>
.menu {
	text-align: center;
	padding: 2rem;
	max-width: 480px;
	width: 100%;
	margin-block: auto;
}

.title {
	font-size: 2.5rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
	background: linear-gradient(
		135deg,
		var(--color-accent-a),
		var(--color-accent-b)
	);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.subtitle {
	color: var(--color-text-muted);
	margin-bottom: 1.5rem;
	font-size: 1.1rem;
}

/* ── Filter toggle (mobile only) ──────────────── */

.filter-toggle {
	display: none;
}

.chevron {
	font-size: 0.75rem;
	transition: transform 0.2s ease;
}

.chevron.open {
	transform: rotate(180deg);
}

/* ── Topic pills ──────────────────────────────── */

.topic-bar {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
	margin-bottom: 1rem;
}

.pill {
	flex-shrink: 0;
	padding: 0.5rem 1rem;
	min-height: 44px;
	display: inline-flex;
	align-items: center;
	border: 1.5px solid var(--color-border);
	border-radius: 999px;
	background: transparent;
	color: var(--color-text-muted);
	font-size: 0.8125rem;
	cursor: pointer;
	transition: all 0.15s ease;
	white-space: nowrap;
}

.pill:hover {
	border-color: var(--color-accent-a);
	color: var(--color-text);
}

.pill-active {
	border-color: var(--color-accent-a);
	background: var(--color-accent-a);
	color: var(--color-bg);
}

.dev-count {
	margin-left: 0.25rem;
	font-size: 0.65rem;
	opacity: 0.6;
}

.dev-count::before {
	content: "(";
}

.dev-count::after {
	content: ")";
}

/* ── Round length config ──────────────────────── */

.round-config {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
}

.length-pill {
	min-width: 3rem;
	justify-content: center;
}

.round-label {
	font-size: 0.8125rem;
	color: var(--color-text-soft);
	margin-left: 0.25rem;
}

/* ── Difficulty buttons ───────────────────────── */

.levels {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.level-btn {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 1.25rem 1.5rem;
	border: 2px solid var(--color-border);
	border-radius: 12px;
	background: var(--color-surface);
	color: var(--color-text);
	cursor: pointer;
	transition: all 0.15s ease;
	text-align: left;
}

.level-btn:hover:not(:disabled) {
	border-color: var(--color-accent-a);
	background: var(--color-surface-hover);
	transform: translateY(-2px);
}

.level-btn:active:not(:disabled) {
	transform: translateY(0);
}

.level-btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.level-name {
	font-size: 1.25rem;
	font-weight: 700;
}

.level-desc {
	font-size: 0.875rem;
	color: var(--color-text-muted);
}

.level-meta {
	display: flex;
	gap: 0.75rem;
	font-size: 0.8125rem;
	color: var(--color-text-soft);
	margin-top: 0.15rem;
}

.high-score {
	color: var(--color-accent-a);
	font-weight: 600;
}

.hint {
	margin-top: 2rem;
	font-size: 0.8rem;
	color: var(--color-text-soft);
}

/* ── Mobile ────────────────────────────────────── */

@media (max-width: 480px) {
	.filter-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		min-height: 44px;
		border: 1.5px solid var(--color-border);
		border-radius: 10px;
		background: transparent;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		cursor: pointer;
		margin-bottom: 0.75rem;
		transition: border-color 0.15s ease;
	}

	.filter-toggle:hover {
		border-color: var(--color-accent-a);
	}

	.topic-bar.collapsed {
		display: none;
	}
}
</style>
