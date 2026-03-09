<script lang="ts">
import { getStats, type HistoryStats } from '$lib/engine/history';
import type { ClinicalCategory, RoundResult, Scenario } from '$lib/types';

interface Props {
	result: RoundResult;
	scenarios: readonly Scenario[];
	onrestart: () => void;
}

const { result, scenarios, onrestart }: Props = $props();

const scenarioMap = $derived(new Map(scenarios.map((s) => [s.id, s])));

const correctCount = $derived(result.answers.filter((a) => a.correct).length);
const totalCount = $derived(result.answers.length);
const pct = $derived(Math.round((correctCount / totalCount) * 100));

const missedRedFlags = $derived(result.answers.filter((a) => {
	if (a.correct) return false;
	const s = scenarioMap.get(a.scenarioId);
	return s?.verdict === 'alarm';
}));

const falseAlarms = $derived(result.answers.filter((a) => {
	if (a.correct) return false;
	const s = scenarioMap.get(a.scenarioId);
	return s?.verdict === 'safe';
}));

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	if (minutes > 0) return `${minutes}m ${seconds}s`;
	return `${seconds}s`;
}

const categoryLabels: Record<ClinicalCategory, string> = {
	cardiac: 'Cardiaal',
	neurological: 'Neurologisch',
	respiratory: 'Respiratoir',
	abdominal: 'Abdominaal',
	musculoskeletal: 'Bewegingsapparaat',
	psychiatric: 'Psychiatrisch',
	pediatric: 'Kindergeneeskunde',
	obstetric: 'Verloskunde',
	infectious: 'Infectieziekten',
	vascular: 'Vasculair',
};

const difficultyLabels = {
	intern: 'Intern',
	anios: 'ANIOS',
	huisarts: 'Huisarts',
} as const;

let stats: HistoryStats | null = $state(null);
$effect(() => {
	// Read after mount (localStorage not available during SSR)
	stats = getStats();
});
</script>

<div class="results" role="region" aria-label="Resultaten">
	<h1 class="title">Ronde klaar</h1>
	<p class="level">{difficultyLabels[result.difficulty]}</p>

	<div class="score-card">
		<div
			class="big-score"
			aria-label="Score: {result.score} van {result.maxPossibleScore}"
		>
			{result.score}
		</div>
		<div class="score-detail">van {result.maxPossibleScore} mogelijk</div>
		<div class="stats">
			<span>{correctCount}/{totalCount} correct ({pct}%)</span>
			<span class="separator">&middot;</span>
			<span>{formatDuration(result.totalTimeMs)}</span>
		</div>
	</div>

	{#if stats && stats.totalRoundsPlayed > 1}
		<div class="history-strip">
			{#if stats.highScores[result.difficulty] !== null}
				<span>PR {difficultyLabels[result.difficulty]}: {
						stats.highScores[result.difficulty]
					}</span>
			{/if}
			<span>{stats.totalRoundsPlayed} rondes gespeeld</span>
			{#if stats.overallAccuracy !== null}
				<span>{stats.overallAccuracy}% nauwkeurigheid</span>
			{/if}
		</div>
	{/if}

	{#if result.weakCategories.length > 0}
		<div class="section weak">
			<h2>Zwakke gebieden</h2>
			<p class="weak-hint">Je mist vaak alarmsignalen in:</p>
			<ul>
				{#each result.weakCategories as cat}
					<li>{categoryLabels[cat]}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if missedRedFlags.length > 0}
		<div class="section errors">
			<h2>Gemiste rode vlaggen</h2>
			{#each missedRedFlags as answer}
				{@const scenario = scenarioMap.get(answer.scenarioId)}
				{#if scenario}
					<div class="feedback-card missed">
						<p class="fb-presentation">{scenario.presentation}</p>
						<p class="fb-verdict">Jouw antwoord: SAFE &mdash; Correct: ALARM</p>
						<p class="fb-explanation">{scenario.explanation}</p>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	{#if falseAlarms.length > 0}
		<div class="section errors">
			<h2>Foute alarmen</h2>
			{#each falseAlarms as answer}
				{@const scenario = scenarioMap.get(answer.scenarioId)}
				{#if scenario}
					<div class="feedback-card false-alarm">
						<p class="fb-presentation">{scenario.presentation}</p>
						<p class="fb-verdict">Jouw antwoord: ALARM &mdash; Correct: SAFE</p>
						<p class="fb-explanation">{scenario.explanation}</p>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<button class="restart-btn" onclick={onrestart}>Terug naar menu</button>
</div>

<style>
.results {
	width: 100%;
	max-width: 600px;
	padding: 2rem;
	padding-bottom: 3rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.title {
	font-size: 2rem;
	font-weight: 800;
	text-align: center;
}

.level {
	text-align: center;
	color: var(--color-text-muted);
	font-size: 1rem;
	margin-top: -1rem;
}

.score-card {
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 16px;
	padding: 2rem;
	text-align: center;
}

.big-score {
	font-size: 3.5rem;
	font-weight: 800;
	font-variant-numeric: tabular-nums;
	background: linear-gradient(
		135deg,
		var(--color-accent-a),
		var(--color-accent-b)
	);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.score-detail {
	color: var(--color-text-soft);
	font-size: 0.875rem;
}

.stats {
	margin-top: 0.75rem;
	color: var(--color-text-muted);
	font-size: 0.9rem;
}

.separator {
	margin: 0 0.5rem;
}

.history-strip {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 1rem;
	justify-content: center;
	font-size: 0.8125rem;
	color: var(--color-text-soft);
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.section h2 {
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--color-text-strong);
}

.weak-hint {
	color: var(--color-text-muted);
	font-size: 0.9rem;
}

.weak ul {
	list-style: none;
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.weak li {
	background: var(--color-danger-bg);
	color: var(--color-danger-text);
	padding: 0.4rem 0.85rem;
	border-radius: 6px;
	font-size: 0.875rem;
	font-weight: 600;
}

.feedback-card {
	background: var(--color-surface);
	border-radius: 10px;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.feedback-card.missed {
	border-left: 3px solid var(--color-danger-border);
}

.feedback-card.false-alarm {
	border-left: 3px solid var(--color-warning-border);
}

.fb-presentation {
	font-style: italic;
	color: var(--color-text);
	font-size: 0.95rem;
}

.fb-verdict {
	font-size: 0.875rem;
	font-weight: 700;
	color: var(--color-danger-border);
}

.false-alarm .fb-verdict {
	color: var(--color-warning-text);
}

.fb-explanation {
	font-size: 0.85rem;
	color: var(--color-text-muted);
	line-height: 1.5;
}

.restart-btn {
	padding: 1rem;
	font-size: 1.1rem;
	font-weight: 700;
	border: 2px solid var(--color-border);
	border-radius: 12px;
	background: var(--color-surface);
	color: var(--color-text);
	cursor: pointer;
	transition: all 0.15s ease;
	margin-top: 0.5rem;
}

.restart-btn:hover {
	border-color: var(--color-accent-a);
	background: var(--color-surface-hover);
	transform: translateY(-2px);
}
</style>
