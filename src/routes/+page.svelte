<script lang="ts">
import Menu from '$lib/components/Menu.svelte';
import Playing from '$lib/components/Playing.svelte';
import Results from '$lib/components/Results.svelte';
import { Game } from '$lib/engine/game.svelte';
import { saveRound } from '$lib/engine/history';
import { withViewTransition } from '$lib/transitions';
import type { Answer } from '$lib/types';

const game = new Game();

function handleAdvance(answer: Answer) {
	const answerType = answer.choice === 'alarm' ? 'answer-alarm' : 'answer-safe';
	withViewTransition(
		() => {
			game.advance(answer);
			if (game.state.phase === 'results') {
				saveRound(game.state.result);
			}
		},
		'forwards',
		[answerType],
	);
}
</script>

<main>
	{#if game.state.phase === 'menu'}
		<Menu
			onstart={(d, f, c) => withViewTransition(() => game.startRound(d, f, c), 'forwards')}
		/>
	{:else if game.state.phase === 'playing' && game.currentScenario}
		<Playing
			scenario={game.currentScenario}
			index={game.currentIndex}
			total={game.roundScenarios.length}
			onrecord={(choice) => game.recordAnswer(choice)}
			onadvance={handleAdvance}
		/>
	{:else if game.state.phase === 'results'}
		<Results
			result={game.state.result}
			scenarios={game.roundScenarios}
			onrestart={() => withViewTransition(() => game.backToMenu(), 'backwards')}
		/>
	{/if}
</main>

<style>
main {
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: clip;
}
</style>
