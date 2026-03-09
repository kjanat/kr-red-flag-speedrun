import type { Answer, ClinicalCategory, Scenario } from '$lib/types';

/** Points awarded for a correct answer at baseline speed */
const BASE_CORRECT = 100;
/** Penalty for false alarm (called alarm on safe patient) */
const FALSE_ALARM_PENALTY = -100;
/** Penalty for missed red flag (called safe on dangerous patient) -- 3x worse */
const MISSED_RED_FLAG_PENALTY = -300;
/** Bonus ceiling for fast answers (ms). Answers faster than this get max speed bonus. */
const FAST_THRESHOLD_MS = 2_000;
/** No speed bonus above this time (ms) */
const SLOW_THRESHOLD_MS = 10_000;
/** Maximum speed bonus points */
const MAX_SPEED_BONUS = 50;

/**
 * Score a single answer.
 * Correct answers earn BASE + speed bonus.
 * Wrong answers: false alarm = -1x, missed red flag = -3x.
 */
export function scoreAnswer(scenario: Scenario, choice: Answer['choice'], reactionTimeMs: number): number {
	const correct = choice === scenario.verdict;

	if (correct) {
		return BASE_CORRECT + speedBonus(reactionTimeMs);
	}

	// Wrong answer: was the patient actually dangerous?
	if (scenario.verdict === 'alarm') {
		// Player said safe, but it was alarm -> missed red flag
		return MISSED_RED_FLAG_PENALTY;
	}
	// Player said alarm, but it was safe -> false alarm
	return FALSE_ALARM_PENALTY;
}

/** Speed bonus: linear interpolation between thresholds */
function speedBonus(reactionTimeMs: number): number {
	if (reactionTimeMs <= FAST_THRESHOLD_MS) return MAX_SPEED_BONUS;
	if (reactionTimeMs >= SLOW_THRESHOLD_MS) return 0;

	const ratio = (SLOW_THRESHOLD_MS - reactionTimeMs) / (SLOW_THRESHOLD_MS - FAST_THRESHOLD_MS);
	return Math.round(MAX_SPEED_BONUS * ratio);
}

/** Max possible score for a single scenario */
export function maxScorePerScenario(): number {
	return BASE_CORRECT + MAX_SPEED_BONUS;
}

/**
 * Expected score from random 50/50 guessing on the actual scenarios played.
 * Accounts for the real alarm/safe ratio and asymmetric penalties.
 * Speed bonus excluded — a random guesser doesn't "know" fast.
 */
export function expectedChanceScore(scenarios: readonly Scenario[]): number {
	let expected = 0;
	for (const s of scenarios) {
		if (s.verdict === 'alarm') {
			// 50% correct (+BASE), 50% missed red flag (MISSED_RED_FLAG_PENALTY)
			expected += 0.5 * BASE_CORRECT + 0.5 * MISSED_RED_FLAG_PENALTY;
		} else {
			// 50% correct (+BASE), 50% false alarm (FALSE_ALARM_PENALTY)
			expected += 0.5 * BASE_CORRECT + 0.5 * FALSE_ALARM_PENALTY;
		}
	}
	return expected;
}

/**
 * Chance-adjusted performance percentage.
 *   0% = random guesser baseline
 * 100% = perfect score
 *  <0% = worse than guessing
 */
export function chanceAdjustedPct(
	actualScore: number,
	maxScore: number,
	chanceScore: number,
): number {
	const denominator = maxScore - chanceScore;
	if (denominator <= 0) return 0;
	return Math.round(((actualScore - chanceScore) / denominator) * 100);
}

/**
 * Find the categories the player most often got wrong.
 * Returns categories with >= 2 errors, sorted by error count descending.
 */
export function findWeakCategories(
	answers: readonly Answer[],
	scenarios: readonly Scenario[],
): readonly ClinicalCategory[] {
	const scenarioMap = new Map(scenarios.map((s) => [s.id, s]));
	const errorCounts = new Map<ClinicalCategory, number>();

	for (const answer of answers) {
		if (!answer.correct) {
			const scenario = scenarioMap.get(answer.scenarioId);
			if (scenario) {
				errorCounts.set(scenario.category, (errorCounts.get(scenario.category) ?? 0) + 1);
			}
		}
	}

	return [...errorCounts.entries()]
		.filter(([, count]) => count >= 2)
		.sort((a, b) => b[1] - a[1])
		.map(([category]) => category);
}
