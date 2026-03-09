<script lang="ts">
import type { Answer, Scenario, Verdict } from '$lib/types';

interface Props {
	scenario: Scenario;
	index: number;
	total: number;
	onrecord: (choice: Verdict) => Answer | undefined;
	onadvance: (answer: Answer) => void;
}

const { scenario, index, total, onrecord, onadvance }: Props = $props();

const FEEDBACK_MS = 400;

let elapsed = $state(0);
let intervalId: ReturnType<typeof setInterval> | undefined;
let startTime = $state(Date.now());
let feedbackTimeout: ReturnType<typeof setTimeout> | undefined;

/** null = accepting input; object = showing feedback */
let feedback: { correct: boolean; expected: Verdict } | null = $state(null);
let pendingAnswer: Answer | null = $state(null);

$effect(() => {
	// Reset timer + feedback when scenario changes
	void scenario.id;
	startTime = Date.now();
	elapsed = 0;
	feedback = null;
	pendingAnswer = null;

	intervalId = setInterval(() => {
		elapsed = Date.now() - startTime;
	}, 100);

	return () => {
		if (intervalId !== undefined) clearInterval(intervalId);
		if (feedbackTimeout !== undefined) clearTimeout(feedbackTimeout);
	};
});

function formatTime(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const tenths = Math.floor((ms % 1000) / 100);
	return `${seconds}.${tenths}s`;
}

function handleAnswer(choice: Verdict) {
	if (feedback) return;

	const answer = onrecord(choice);
	if (!answer) return;

	pendingAnswer = answer;
	feedback = { correct: answer.correct, expected: scenario.verdict };

	// Pause timer
	if (intervalId !== undefined) clearInterval(intervalId);

	feedbackTimeout = setTimeout(() => {
		const a = pendingAnswer;
		if (!a) return;
		onadvance(a);
		feedback = null;
		pendingAnswer = null;
	}, FEEDBACK_MS);
}

function handleKey(e: KeyboardEvent) {
	if (feedback) return;
	if (e.key === '1' || e.key === 'a' || e.key === 'ArrowLeft') {
		handleAnswer('alarm');
	} else if (e.key === '2' || e.key === 's' || e.key === 'ArrowRight') {
		handleAnswer('safe');
	}
}
</script>

<svelte:window onkeydown={handleKey} />

<div class="playing">
	<div class="header">
		<span class="counter">{index + 1} / {total}</span>
		<div
			class="progress-bar"
			role="progressbar"
			aria-valuenow={index + 1}
			aria-valuemin={1}
			aria-valuemax={total}
			aria-label="Scenario {index + 1} van {total}"
		>
			<div class="progress-fill" style:width="{(index / total) * 100}%"></div>
		</div>
		<span class="timer" class:slow={elapsed > 10000} aria-hidden="true">{
			formatTime(elapsed)
		}</span>
	</div>

	<div
		class="scenario-card"
		class:feedback-correct={feedback?.correct === true}
		class:feedback-wrong={feedback !== null && !feedback.correct}
		aria-live="assertive"
		aria-atomic="true"
	>
		<p class="presentation">{scenario.presentation}</p>
		{#if feedback && !feedback.correct}
			<p class="correction">
				Correct: {feedback.expected === 'alarm' ? 'ALARM' : 'SAFE'}
			</p>
		{/if}
	</div>

	<div class="actions">
		<button
			class="btn alarm"
			onclick={() => handleAnswer('alarm')}
			disabled={feedback !== null}
			aria-label="Alarm — patiënt doorverwijzen"
		>
			ALARM
		</button>
		<button
			class="btn safe"
			onclick={() => handleAnswer('safe')}
			disabled={feedback !== null}
			aria-label="Safe — patiënt is veilig"
		>
			SAFE
		</button>
	</div>

	<p class="keys-hint">
		Toetsen: [A / 1 / links] = Alarm &middot; [S / 2 / rechts] = Safe
	</p>
</div>

<style>
.playing {
	width: 100%;
	max-width: 560px;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-block: auto;
}

.header {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.counter {
	font-size: 0.875rem;
	color: var(--color-text-muted);
	white-space: nowrap;
	font-variant-numeric: tabular-nums;
}

.progress-bar {
	flex: 1;
	height: 6px;
	background: var(--color-border);
	border-radius: 3px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(
		90deg,
		var(--color-accent-a),
		var(--color-accent-b)
	);
	border-radius: 3px;
	transition: width 0.3s ease;
}

.timer {
	font-size: 1rem;
	font-variant-numeric: tabular-nums;
	color: var(--color-text-muted);
	min-width: 4ch;
	text-align: right;
}

.timer.slow {
	color: var(--color-accent-a);
}

.scenario-card {
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 16px;
	padding: 2.5rem 2rem;
	min-height: 140px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	view-transition-name: scenario-card;
}

.scenario-card.feedback-correct {
	border-color: var(--color-success-border);
	background: var(--color-success-bg);
}

.scenario-card.feedback-wrong {
	border-color: var(--color-danger-border);
	background: var(--color-danger-bg);
}

.correction {
	font-size: 0.9rem;
	font-weight: 700;
	text-align: center;
	margin-top: 0.75rem;
	color: var(--color-danger-text);
}

.presentation {
	font-size: 1.25rem;
	line-height: 1.6;
	text-align: center;
	font-style: italic;
	color: var(--color-text-strong);
}

.actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

.btn {
	padding: 1.25rem;
	font-size: 1.5rem;
	font-weight: 800;
	border: 2px solid transparent;
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.1s ease;
	letter-spacing: 0.05em;
}

.btn:disabled {
	cursor: default;
}

.btn:active:not(:disabled) {
	transform: scale(0.97);
}

.btn.alarm {
	background: var(--color-danger-bg);
	color: var(--color-danger-text);
	border-color: var(--color-danger-border);
}

.btn.alarm:hover:not(:disabled) {
	background: var(--color-danger-bg-hover);
}

.btn.safe {
	background: var(--color-success-bg);
	color: var(--color-success-text);
	border-color: var(--color-success-border);
}

.btn.safe:hover:not(:disabled) {
	background: var(--color-success-bg-hover);
}

.keys-hint {
	text-align: center;
	font-size: 0.75rem;
	color: var(--color-text-soft);
}

/* ── Mobile ────────────────────────────────────── */

@media (hover: none) and (pointer: coarse) {
	.keys-hint {
		display: none;
	}
}

@media (max-width: 480px) {
	.scenario-card {
		padding: 1.5rem 1rem;
	}

	.btn {
		padding: 1.5rem 1.25rem;
	}
}
</style>
