<script lang="ts">
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
</script>

<div class="results">
	<h1 class="title">Ronde klaar</h1>
	<p class="level">{difficultyLabels[result.difficulty]}</p>

	<div class="score-card">
		<div class="big-score">{result.score}</div>
		<div class="score-detail">van {result.maxPossibleScore} mogelijk</div>
		<div class="stats">
			<span>{correctCount}/{totalCount} correct ({pct}%)</span>
			<span class="separator">&middot;</span>
			<span>{formatDuration(result.totalTimeMs)}</span>
		</div>
	</div>

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
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-height: 100dvh;
	overflow-y: auto;
}

.title {
	font-size: 2rem;
	font-weight: 800;
	text-align: center;
}

.level {
	text-align: center;
	color: #94a3b8;
	font-size: 1rem;
	margin-top: -1rem;
}

.score-card {
	background: #1e293b;
	border: 1px solid #334155;
	border-radius: 16px;
	padding: 2rem;
	text-align: center;
}

.big-score {
	font-size: 3.5rem;
	font-weight: 800;
	font-variant-numeric: tabular-nums;
	background: linear-gradient(135deg, #ef4444, #f97316);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.score-detail {
	color: #64748b;
	font-size: 0.875rem;
}

.stats {
	margin-top: 0.75rem;
	color: #94a3b8;
	font-size: 0.9rem;
}

.separator {
	margin: 0 0.5rem;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.section h2 {
	font-size: 1.1rem;
	font-weight: 700;
	color: #f1f5f9;
}

.weak-hint {
	color: #94a3b8;
	font-size: 0.9rem;
}

.weak ul {
	list-style: none;
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.weak li {
	background: #7f1d1d;
	color: #fca5a5;
	padding: 0.25rem 0.75rem;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 600;
}

.feedback-card {
	background: #1e293b;
	border-radius: 10px;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.feedback-card.missed {
	border-left: 3px solid #dc2626;
}

.feedback-card.false-alarm {
	border-left: 3px solid #f59e0b;
}

.fb-presentation {
	font-style: italic;
	color: #e2e8f0;
	font-size: 0.95rem;
}

.fb-verdict {
	font-size: 0.8rem;
	font-weight: 700;
	color: #f87171;
}

.false-alarm .fb-verdict {
	color: #fbbf24;
}

.fb-explanation {
	font-size: 0.85rem;
	color: #94a3b8;
	line-height: 1.5;
}

.restart-btn {
	padding: 1rem;
	font-size: 1.1rem;
	font-weight: 700;
	border: 2px solid #334155;
	border-radius: 12px;
	background: #1e293b;
	color: #e2e8f0;
	cursor: pointer;
	transition: all 0.15s ease;
	margin-top: 0.5rem;
}

.restart-btn:hover {
	border-color: #ef4444;
	transform: translateY(-2px);
}
</style>
