import { scenarios } from '$lib/data/scenarios';
import type { Answer, Difficulty, RoundResult, Scenario, StatKrTopic, Verdict } from '$lib/types';
import { findWeakCategories, maxScorePerScenario, scoreAnswer } from './scoring';

/** Valid round-length options */
export const ROUND_LENGTHS = [10, 20, 30] as const;
export type RoundLength = (typeof ROUND_LENGTHS)[number];
export const DEFAULT_ROUND_LENGTH: RoundLength = 10;

/** Fisher-Yates shuffle (returns new array) */
function shuffle<T>(arr: readonly T[]): T[] {
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/** Optional filters narrowing which scenarios are eligible for a round */
export interface RoundFilter {
	readonly topics?: readonly StatKrTopic[];
}

/**
 * Pick scenarios for a round.
 * Uses all scenarios from the chosen difficulty (optionally narrowed by
 * sourceTopic), then fills remaining slots from adjacent difficulties.
 */
export function pickScenarios(
	difficulty: Difficulty,
	filter?: RoundFilter,
	count: RoundLength = DEFAULT_ROUND_LENGTH,
): Scenario[] {
	const topicSet = filter?.topics && filter.topics.length > 0 ? new Set(filter.topics) : null;
	const matchesTopic = (s: Scenario): boolean => !topicSet || topicSet.has(s.sourceTopic);

	const primary = scenarios.filter((s) => s.difficulty === difficulty && matchesTopic(s));
	const shuffled = shuffle(primary);

	if (shuffled.length >= count) {
		return shuffled.slice(0, count);
	}

	// Fill remaining from other difficulties (prefer adjacent)
	const fillOrder: Record<Difficulty, readonly Difficulty[]> = {
		intern: ['anios', 'huisarts'],
		anios: ['intern', 'huisarts'],
		huisarts: ['anios', 'intern'],
	};

	const extras = shuffle(
		scenarios.filter(
			(s) => fillOrder[difficulty].includes(s.difficulty) && matchesTopic(s),
		),
	);
	const combined = [...shuffled, ...extras];
	return combined.slice(0, count);
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
	const scenarioById = new Map(roundScenarios.map((scenario) => [scenario.id, scenario]));
	let score = 0;
	for (const answer of answers) {
		const scenario = scenarioById.get(answer.scenarioId);
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
