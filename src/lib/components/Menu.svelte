<script lang="ts">
import type { RoundFilter } from '$lib/engine/round';
import type { Difficulty, StatKrTopic } from '$lib/types';

interface Props {
	onstart: (difficulty: Difficulty, filter?: RoundFilter) => void;
}

const { onstart }: Props = $props();

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

function toggleTopic(topic: StatKrTopic): void {
	if (selectedTopics.includes(topic)) {
		selectedTopics = selectedTopics.filter((t) => t !== topic);
	} else {
		selectedTopics = [...selectedTopics, topic];
	}
}

function buildFilter(): RoundFilter | undefined {
	return selectedTopics.length > 0 ? { topics: selectedTopics } : undefined;
}
</script>

<div class="menu">
	<h1 class="title">Red Flag Speedrun</h1>
	<p class="subtitle">Herken alarmsignalen onder tijdsdruk</p>

	<fieldset class="topic-filter" aria-label="Filter op KR-onderwerp">
		<legend class="filter-legend">KR blok / onderwerp</legend>
		<div class="topic-chips">
			{#each topics as topic}
				<button
					class="chip"
					class:chip-active={selectedTopics.includes(topic.id)}
					onclick={() => toggleTopic(topic.id)}
					aria-pressed={selectedTopics.includes(topic.id)}
				>
					{topic.label}
				</button>
			{/each}
		</div>
		{#if selectedTopics.length > 0}
			<button class="clear-btn" onclick={() => (selectedTopics = [])}>
				Wis filter
			</button>
		{/if}
	</fieldset>

	<div class="levels" role="group" aria-label="Kies moeilijkheidsgraad">
		{#each levels as level}
			<button
				class="level-btn"
				onclick={() => onstart(level.id, buildFilter())}
			>
				<span class="level-name">{level.label}</span>
				<span class="level-desc">{level.description}</span>
			</button>
		{/each}
	</div>

	<p class="hint">
		{#if selectedTopics.length > 0}
			Gefilterd op {selectedTopics.length} onderwerp{
				selectedTopics.length > 1 ? 'en' : ''
			}.
		{:else}
			Alle onderwerpen.
		{/if}
		Tot 30 scenario's per ronde. Snelheid telt.
	</p>
</div>

<style>
.menu {
	text-align: center;
	padding: 2rem;
	max-width: 480px;
	width: 100%;
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
	margin-bottom: 2rem;
	font-size: 1.1rem;
}

.topic-filter {
	border: 1px solid var(--color-border);
	border-radius: 12px;
	padding: 1rem;
	margin-bottom: 1.5rem;
	background: var(--color-surface);
}

.filter-legend {
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--color-text-muted);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	padding: 0 0.5rem;
}

.topic-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
	margin-top: 0.75rem;
}

.chip {
	padding: 0.4rem 0.85rem;
	border: 1.5px solid var(--color-border);
	border-radius: 999px;
	background: transparent;
	color: var(--color-text-muted);
	font-size: 0.8rem;
	cursor: pointer;
	transition: all 0.15s ease;
}

.chip:hover {
	border-color: var(--color-accent-a);
	color: var(--color-text);
}

.chip-active {
	border-color: var(--color-accent-a);
	background: var(--color-accent-a);
	color: var(--color-bg, #fff);
}

.clear-btn {
	margin-top: 0.5rem;
	padding: 0.2rem 0.6rem;
	border: none;
	border-radius: 6px;
	background: transparent;
	color: var(--color-text-soft);
	font-size: 0.7rem;
	cursor: pointer;
	text-decoration: underline;
	text-underline-offset: 2px;
}

.clear-btn:hover {
	color: var(--color-text);
}

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

.level-btn:hover {
	border-color: var(--color-accent-a);
	background: var(--color-surface-hover);
	transform: translateY(-2px);
}

.level-btn:active {
	transform: translateY(0);
}

.level-name {
	font-size: 1.25rem;
	font-weight: 700;
}

.level-desc {
	font-size: 0.875rem;
	color: var(--color-text-muted);
}

.hint {
	margin-top: 2rem;
	font-size: 0.8rem;
	color: var(--color-text-soft);
}
</style>
