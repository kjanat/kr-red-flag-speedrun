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

const avgReactionMs = $derived(
	result.answers.reduce((sum, a) => sum + a.reactionTimeMs, 0)
		/ result.answers.length,
);
const fastestMs = $derived(
	Math.min(...result.answers.map((a) => a.reactionTimeMs)),
);
const slowestMs = $derived(
	Math.max(...result.answers.map((a) => a.reactionTimeMs)),
);

const missedRedFlags = $derived(
	result.answers.filter((a) => {
		if (a.correct) return false;
		const s = scenarioMap.get(a.scenarioId);
		return s?.verdict === 'alarm';
	}),
);

const falseAlarms = $derived(
	result.answers.filter((a) => {
		if (a.correct) return false;
		const s = scenarioMap.get(a.scenarioId);
		return s?.verdict === 'safe';
	}),
);

const categoryBreakdown = $derived.by(() => {
	const cats = new Map<ClinicalCategory, { correct: number; total: number }>();
	for (const answer of result.answers) {
		const s = scenarioMap.get(answer.scenarioId);
		if (!s) continue;
		const entry = cats.get(s.category) ?? { correct: 0, total: 0 };
		entry.total++;
		if (answer.correct) entry.correct++;
		cats.set(s.category, entry);
	}
	return [...cats.entries()]
		.sort((a, b) => b[1].total - a[1].total)
		.map(([cat, { correct, total }]) => ({ category: cat, correct, total }));
});

function formatTime(ms: number): string {
	return `${(ms / 1000).toFixed(1)}s`;
}

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

	<!-- Score card -->
	<div class="score-card">
		<div
			class="big-score"
			aria-label="Score: {result.score} van {result.maxPossibleScore}"
		>
			{result.score}
		</div>
		<div class="score-detail">van {result.maxPossibleScore} mogelijk</div>
		<div class="stats-row">
			<span>{correctCount}/{totalCount} correct ({pct}%)</span>
			<span class="separator">&middot;</span>
			<span>{formatDuration(result.totalTimeMs)}</span>
		</div>
	</div>

	<!-- Reaction time stats -->
	<div class="stats-grid">
		<div class="stat-cell">
			<span class="stat-value">{formatTime(avgReactionMs)}</span>
			<span class="stat-label">Gem. reactietijd</span>
		</div>
		<div class="stat-cell">
			<span class="stat-value">{formatTime(fastestMs)}</span>
			<span class="stat-label">Snelste</span>
		</div>
		<div class="stat-cell">
			<span class="stat-value">{formatTime(slowestMs)}</span>
			<span class="stat-label">Langzaamste</span>
		</div>
	</div>

	<!-- Answer timeline -->
	<div class="section">
		<h2>Tijdlijn</h2>
		<div
			class="timeline"
			role="img"
			aria-label="Antwoorden tijdlijn: {correctCount} correct, {totalCount - correctCount} fout"
		>
			{#each result.answers as answer (answer.scenarioId)}
				<span
					class="tick"
					class:correct={answer.correct}
					class:wrong={!answer.correct}
					title="{answer.correct ? 'Correct' : 'Fout'} — {formatTime(answer.reactionTimeMs)}"
				></span>
			{/each}
		</div>
	</div>

	<!-- Category breakdown -->
	{#if categoryBreakdown.length > 1}
		<div class="section">
			<h2>Per categorie</h2>
			<div class="cat-grid">
				{#each categoryBreakdown as { category, correct, total } (category)}
					<div class="cat-row">
						<span class="cat-label">{categoryLabels[category]}</span>
						<span class="cat-score">{correct}/{total}</span>
						<div class="cat-bar">
							<div
								class="cat-fill"
								class:perfect={correct === total}
								class:poor={correct / total < 0.5}
								style:width="{(correct / total) * 100}%"
							>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Weak categories -->
	{#if result.weakCategories.length > 0}
		<div class="section">
			<h2>Zwakke gebieden</h2>
			<p class="weak-hint">Je mist vaak alarmsignalen in:</p>
			<ul class="weak-list">
				{#each result.weakCategories as cat (cat)}
					<li>{categoryLabels[cat]}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Missed red flags (collapsible) -->
	{#if missedRedFlags.length > 0}
		<details class="detail-section">
			<summary class="detail-toggle">
				<span class="detail-heading">Gemiste rode vlaggen</span>
				<span class="error-count missed-count">{missedRedFlags.length}</span>
			</summary>
			<div class="detail-cards">
				{#each missedRedFlags as answer (answer.scenarioId)}
					{@const scenario = scenarioMap.get(answer.scenarioId)}
					{#if scenario}
						<div class="feedback-card missed">
							<p class="fb-presentation">{scenario.presentation}</p>
							<div class="fb-meta">
								<span class="fb-verdict"
								>Jouw antwoord: SAFE &mdash; Correct: ALARM</span>
								<span class="fb-time">{formatTime(answer.reactionTimeMs)}</span>
							</div>
							<p class="fb-explanation">{scenario.explanation}</p>
						</div>
					{/if}
				{/each}
			</div>
		</details>
	{/if}

	<!-- False alarms (collapsible) -->
	{#if falseAlarms.length > 0}
		<details class="detail-section">
			<summary class="detail-toggle">
				<span class="detail-heading">Foute alarmen</span>
				<span class="error-count alarm-count">{falseAlarms.length}</span>
			</summary>
			<div class="detail-cards">
				{#each falseAlarms as answer (answer.scenarioId)}
					{@const scenario = scenarioMap.get(answer.scenarioId)}
					{#if scenario}
						<div class="feedback-card false-alarm">
							<p class="fb-presentation">{scenario.presentation}</p>
							<div class="fb-meta">
								<span class="fb-verdict"
								>Jouw antwoord: ALARM &mdash; Correct: SAFE</span>
								<span class="fb-time">{formatTime(answer.reactionTimeMs)}</span>
							</div>
							<p class="fb-explanation">{scenario.explanation}</p>
						</div>
					{/if}
				{/each}
			</div>
		</details>
	{/if}

	<!-- History strip -->
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

/* ── Score card ────────────────────────────────── */

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

.stats-row {
	margin-top: 0.75rem;
	color: var(--color-text-muted);
	font-size: 0.9rem;
}

.separator {
	margin: 0 0.5rem;
}

/* ── Stats grid ────────────────────────────────── */

.stats-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
}

.stat-cell {
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 10px;
	padding: 0.75rem 0.5rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.stat-value {
	font-size: 1.2rem;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
	color: var(--color-text-strong);
}

.stat-label {
	font-size: 0.7rem;
	color: var(--color-text-muted);
	line-height: 1.2;
}

/* ── Sections ──────────────────────────────────── */

.section {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.section h2 {
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-text-strong);
}

/* ── Answer timeline ──────────────────────────── */

.timeline {
	display: flex;
	gap: 3px;
}

.tick {
	flex: 1;
	height: 8px;
	border-radius: 2px;
	min-width: 4px;
}

.tick.correct {
	background: var(--color-success-border);
}

.tick.wrong {
	background: var(--color-danger-border);
}

/* ── Category breakdown ───────────────────────── */

.cat-grid {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.cat-row {
	display: grid;
	grid-template-columns: 1fr auto 80px;
	gap: 0.5rem;
	align-items: center;
	font-size: 0.875rem;
}

.cat-label {
	color: var(--color-text);
	font-weight: 500;
	text-align: left;
}

.cat-score {
	color: var(--color-text-muted);
	font-variant-numeric: tabular-nums;
	font-size: 0.8125rem;
}

.cat-bar {
	height: 6px;
	background: var(--color-border);
	border-radius: 3px;
	overflow: hidden;
}

.cat-fill {
	height: 100%;
	background: var(--color-accent-a);
	border-radius: 3px;
	transition: width 0.3s ease;
}

.cat-fill.perfect {
	background: var(--color-success-border);
}

.cat-fill.poor {
	background: var(--color-danger-border);
}

/* ── Weak categories ──────────────────────────── */

.weak-hint {
	color: var(--color-text-muted);
	font-size: 0.875rem;
}

.weak-list {
	list-style: none;
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.weak-list li {
	background: var(--color-danger-bg);
	color: var(--color-danger-text);
	padding: 0.4rem 0.85rem;
	border-radius: 6px;
	font-size: 0.875rem;
	font-weight: 600;
}

/* ── Collapsible detail sections ──────────────── */

.detail-section {
	border: 1px solid var(--color-border);
	border-radius: 10px;
	overflow: hidden;
}

.detail-toggle {
	cursor: pointer;
	padding: 0.75rem 1rem;
	list-style: none;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
}

.detail-toggle::-webkit-details-marker {
	display: none;
}

.detail-toggle::after {
	content: "";
	width: 0.5rem;
	height: 0.5rem;
	border-right: 2px solid var(--color-text-muted);
	border-bottom: 2px solid var(--color-text-muted);
	transform: rotate(-45deg);
	transition: transform 0.2s ease;
	margin-left: auto;
	flex-shrink: 0;
}

.detail-section[open] > .detail-toggle::after {
	transform: rotate(45deg);
}

.detail-heading {
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-text-strong);
}

.error-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 1.5rem;
	height: 1.5rem;
	padding: 0 0.4rem;
	border-radius: 999px;
	font-size: 0.75rem;
	font-weight: 700;
}

.missed-count {
	background: var(--color-danger-bg);
	color: var(--color-danger-text);
}

.alarm-count {
	background: var(--color-warning-bg);
	color: var(--color-warning-text);
}

.detail-cards {
	padding: 0 1rem 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

/* ── Feedback cards ────────────────────────────── */

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

.fb-meta {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	flex-wrap: wrap;
	gap: 0.25rem;
}

.fb-verdict {
	font-size: 0.875rem;
	font-weight: 700;
	color: var(--color-danger-border);
}

.false-alarm .fb-verdict {
	color: var(--color-warning-text);
}

.fb-time {
	font-size: 0.8125rem;
	color: var(--color-text-soft);
	font-variant-numeric: tabular-nums;
}

.fb-explanation {
	font-size: 0.85rem;
	color: var(--color-text-muted);
	line-height: 1.5;
}

/* ── History strip ─────────────────────────────── */

.history-strip {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 1rem;
	justify-content: center;
	font-size: 0.8125rem;
	color: var(--color-text-soft);
}

/* ── Restart button ────────────────────────────── */

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
