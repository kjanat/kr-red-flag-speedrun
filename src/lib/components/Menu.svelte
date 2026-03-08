<script lang="ts">
import type { Difficulty } from '$lib/types';

interface Props {
	onstart: (difficulty: Difficulty) => void;
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
</script>

<div class="menu">
	<h1 class="title">Red Flag Speedrun</h1>
	<p class="subtitle">Herken alarmsignalen onder tijdsdruk</p>

	<div class="levels" role="group" aria-label="Kies moeilijkheidsgraad">
		{#each levels as level}
			<button class="level-btn" onclick={() => onstart(level.id)}>
				<span class="level-name">{level.label}</span>
				<span class="level-desc">{level.description}</span>
			</button>
		{/each}
	</div>

	<p class="hint">30 scenario's per ronde. Snelheid telt.</p>
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
	background: linear-gradient(135deg, #ef4444, #f97316);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.subtitle {
	color: #94a3b8;
	margin-bottom: 2.5rem;
	font-size: 1.1rem;
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
	border: 2px solid #334155;
	border-radius: 12px;
	background: #1e293b;
	color: #e2e8f0;
	cursor: pointer;
	transition: all 0.15s ease;
	text-align: left;
}

.level-btn:hover {
	border-color: #ef4444;
	background: #1e293b;
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
	color: #94a3b8;
}

.hint {
	margin-top: 2rem;
	font-size: 0.8rem;
	color: #64748b;
}
</style>
