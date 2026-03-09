import type { Answer, Difficulty, GameState, RoundResult, Scenario, Verdict } from '$lib/types';
import { computeRoundResult, pickScenarios, processAnswer, type RoundFilter } from './round';

/**
 * Reactive game state manager using Svelte 5 runes.
 * Handles the full lifecycle: menu -> playing -> results -> menu.
 */
export class Game {
	/** Current screen / phase */
	state: GameState = $state({ phase: 'menu' });

	/** Scenarios for the current round */
	roundScenarios: Scenario[] = $state([]);

	/** Index of current scenario within the round */
	currentIndex: number = $state(0);

	/** Accumulated answers for this round */
	answers: Answer[] = $state([]);

	/** Timestamp when the current scenario was shown */
	private scenarioStartTime: number = 0;

	/** Timestamp when the round started */
	private roundStartTime: number = 0;

	/** Current scenario (derived) */
	get currentScenario(): Scenario | undefined {
		return this.roundScenarios[this.currentIndex];
	}

	/** How many scenarios remain */
	get remaining(): number {
		return this.roundScenarios.length - this.currentIndex;
	}

	/** Progress as fraction 0-1 */
	get progress(): number {
		if (this.roundScenarios.length === 0) return 0;
		return this.currentIndex / this.roundScenarios.length;
	}

	/** Start a new round with the given difficulty and optional topic filter */
	startRound(difficulty: Difficulty, filter?: RoundFilter): void {
		this.roundScenarios = pickScenarios(difficulty, filter);
		this.currentIndex = 0;
		this.answers = [];
		this.roundStartTime = performance.now();
		this.scenarioStartTime = performance.now();
		this.state = { phase: 'playing', difficulty };
	}

	/** Record the player's choice without advancing. Returns the Answer for feedback UI. */
	recordAnswer(choice: Verdict): Answer | undefined {
		if (this.state.phase !== 'playing') return undefined;
		const scenario = this.currentScenario;
		if (!scenario) return undefined;

		const reactionTimeMs = performance.now() - this.scenarioStartTime;
		return processAnswer(scenario, choice, reactionTimeMs);
	}

	/** Commit a recorded answer and advance to next scenario or results. */
	advance(answer: Answer): void {
		if (this.state.phase !== 'playing') return;

		this.answers = [...this.answers, answer];

		if (this.currentIndex + 1 >= this.roundScenarios.length) {
			const totalTimeMs = performance.now() - this.roundStartTime;
			const result = computeRoundResult(
				this.state.difficulty,
				this.answers,
				this.roundScenarios,
				totalTimeMs,
			);
			this.state = { phase: 'results', result };
		} else {
			this.currentIndex++;
			this.scenarioStartTime = performance.now();
		}
	}

	/** Record + advance in one step (convenience for tests). */
	answer(choice: Verdict): void {
		const a = this.recordAnswer(choice);
		if (a) this.advance(a);
	}

	/** Return to the main menu */
	backToMenu(): void {
		this.state = { phase: 'menu' };
		this.roundScenarios = [];
		this.currentIndex = 0;
		this.answers = [];
	}
}
