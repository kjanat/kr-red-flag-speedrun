import { scenarios } from '$lib/data/scenarios';
import type { Answer, Difficulty, RoundResult, Scenario, Verdict } from '$lib/types';
import { findWeakCategories, maxScorePerScenario, scoreAnswer } from './scoring';

const SCENARIOS_PER_ROUND = 30;

/** Fisher-Yates shuffle (returns new array) */
function shuffle<T>(arr: readonly T[]): T[] {
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/**
 * Pick scenarios for a round.
 * Uses all scenarios from the chosen difficulty, then fills remaining
 * slots from adjacent difficulties if needed.
 */
export function pickScenarios(difficulty: Difficulty): Scenario[] {
	const primary = scenarios.filter((s) => s.difficulty === difficulty);
	const shuffled = shuffle(primary);

	if (shuffled.length >= SCENARIOS_PER_ROUND) {
		return shuffled.slice(0, SCENARIOS_PER_ROUND);
	}

	// Fill remaining from other difficulties (prefer adjacent)
	const fillOrder: Record<Difficulty, readonly Difficulty[]> = {
		intern: ['anios', 'huisarts'],
		anios: ['intern', 'huisarts'],
		huisarts: ['anios', 'intern'],
	};

	const extras = shuffle(
		scenarios.filter((s) => fillOrder[difficulty].includes(s.difficulty)),
	);
	const combined = [...shuffled, ...extras];
	return combined.slice(0, SCENARIOS_PER_ROUND);
}

/** Process a player's choice and return the Answer */
export function processAnswer(
	scenario: Scenario,
	choice: Verdict,
	reactionTimeMs: number,
): Answer {
	return {
		scenarioId: scenario.id,
		choice,
		correct: choice === scenario.verdict,
		reactionTimeMs,
	};
}

/** Compute final round results from all answers */
export function computeRoundResult(
	difficulty: Difficulty,
	answers: readonly Answer[],
	roundScenarios: readonly Scenario[],
	totalTimeMs: number,
): RoundResult {
	let score = 0;
	for (const answer of answers) {
		const scenario = roundScenarios.find((s) => s.id === answer.scenarioId);
		if (scenario) {
			score += scoreAnswer(scenario, answer.choice, answer.reactionTimeMs);
		}
	}

	return {
		difficulty,
		answers,
		score,
		maxPossibleScore: answers.length * maxScorePerScenario(),
		weakCategories: findWeakCategories(answers, roundScenarios),
		totalTimeMs,
	};
}
