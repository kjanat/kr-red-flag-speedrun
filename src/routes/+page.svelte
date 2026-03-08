<script lang="ts">
import Menu from '$lib/components/Menu.svelte';
import Playing from '$lib/components/Playing.svelte';
import Results from '$lib/components/Results.svelte';
import { Game } from '$lib/engine/game.svelte';

const game = new Game();
</script>

<main>
	{#if game.state.phase === 'menu'}
		<Menu onstart={(d) => game.startRound(d)} />
	{:else if game.state.phase === 'playing' && game.currentScenario}
		<Playing
			scenario={game.currentScenario}
			index={game.currentIndex}
			total={game.roundScenarios.length}
			onanswer={(choice) => game.answer(choice)}
		/>
	{:else if game.state.phase === 'results'}
		<Results
			result={game.state.result}
			scenarios={game.roundScenarios}
			onrestart={() => game.backToMenu()}
		/>
	{/if}
</main>
