<script lang="ts">
import type { Scenario, Verdict } from '$lib/types';

interface Props {
	scenario: Scenario;
	index: number;
	total: number;
	onanswer: (choice: Verdict) => void;
}

const { scenario, index, total, onanswer }: Props = $props();

let elapsed = $state(0);
let intervalId: ReturnType<typeof setInterval> | undefined;
let startTime = $state(Date.now());

$effect(() => {
	// Reset timer when scenario changes (scenario.id is the dependency)
	void scenario.id;
	startTime = Date.now();
	elapsed = 0;

	intervalId = setInterval(() => {
		elapsed = Date.now() - startTime;
	}, 100);

	return () => {
		if (intervalId !== undefined) clearInterval(intervalId);
	};
});

function formatTime(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const tenths = Math.floor((ms % 1000) / 100);
	return `${seconds}.${tenths}s`;
}

function handleKey(e: KeyboardEvent) {
	if (e.key === '1' || e.key === 'a' || e.key === 'ArrowLeft') {
		onanswer('alarm');
	} else if (e.key === '2' || e.key === 's' || e.key === 'ArrowRight') {
		onanswer('safe');
	}
}
</script>

<svelte:window onkeydown={handleKey} />

<div class="playing">
	<div class="header">
		<span class="counter">{index + 1} / {total}</span>
		<div class="progress-bar">
			<div class="progress-fill" style:width="{(index / total) * 100}%"></div>
		</div>
		<span class="timer" class:slow={elapsed > 10000}>{
			formatTime(elapsed)
		}</span>
	</div>

	<div class="scenario-card">
		<p class="presentation">{scenario.presentation}</p>
	</div>

	<div class="actions">
		<button class="btn alarm" onclick={() => onanswer('alarm')}>
			ALARM
		</button>
		<button class="btn safe" onclick={() => onanswer('safe')}>
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
}

.header {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.counter {
	font-size: 0.875rem;
	color: #94a3b8;
	white-space: nowrap;
	font-variant-numeric: tabular-nums;
}

.progress-bar {
	flex: 1;
	height: 6px;
	background: #334155;
	border-radius: 3px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #ef4444, #f97316);
	border-radius: 3px;
	transition: width 0.3s ease;
}

.timer {
	font-size: 1rem;
	font-variant-numeric: tabular-nums;
	color: #94a3b8;
	min-width: 4ch;
	text-align: right;
}

.timer.slow {
	color: #ef4444;
}

.scenario-card {
	background: #1e293b;
	border: 1px solid #334155;
	border-radius: 16px;
	padding: 2.5rem 2rem;
	min-height: 140px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.presentation {
	font-size: 1.25rem;
	line-height: 1.6;
	text-align: center;
	font-style: italic;
	color: #f1f5f9;
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

.btn:active {
	transform: scale(0.97);
}

.btn.alarm {
	background: #7f1d1d;
	color: #fca5a5;
	border-color: #dc2626;
}

.btn.alarm:hover {
	background: #991b1b;
}

.btn.safe {
	background: #14532d;
	color: #86efac;
	border-color: #16a34a;
}

.btn.safe:hover {
	background: #166534;
}

.keys-hint {
	text-align: center;
	font-size: 0.75rem;
	color: #475569;
}
</style>
