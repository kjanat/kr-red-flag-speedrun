import { describe, expect, it } from 'vitest';

import type { Answer, Scenario } from '$lib/types';
import {
	chanceAdjustedPct,
	expectedChanceScore,
	findWeakCategories,
	maxScorePerScenario,
	scoreAnswer,
} from './scoring';

const alarmScenario: Scenario = {
	id: 's-alarm',
	difficulty: 'intern',
	category: 'neurological',
	sourceTopic: 'Hoofdpijn',
	presentation: 'test',
	verdict: 'alarm',
	explanation: 'test',
};

const safeScenario: Scenario = {
	id: 's-safe',
	difficulty: 'intern',
	category: 'cardiac',
	sourceTopic: 'Hartkloppingen',
	presentation: 'test',
	verdict: 'safe',
	explanation: 'test',
};

describe('scoreAnswer', () => {
	it('scores fast correct answer with max bonus', () => {
		expect(scoreAnswer(alarmScenario, 'alarm', 1_200)).toBe(150);
	});

	it('scores slow correct answer without bonus', () => {
		expect(scoreAnswer(alarmScenario, 'alarm', 10_000)).toBe(100);
	});

	it('penalizes missed red flags 3x', () => {
		expect(scoreAnswer(alarmScenario, 'safe', 900)).toBe(-300);
	});

	it('penalizes false alarms', () => {
		expect(scoreAnswer(safeScenario, 'alarm', 900)).toBe(-100);
	});
});

describe('maxScorePerScenario', () => {
	it('returns base plus max bonus', () => {
		expect(maxScorePerScenario()).toBe(150);
	});
});

describe('expectedChanceScore', () => {
	it('computes baseline for balanced alarm/safe split', () => {
		// 5 alarm + 5 safe
		const scenarios: Scenario[] = Array.from({ length: 5 }, (_, i) => ({
			...alarmScenario,
			id: `a${i}`,
		})).concat(
			Array.from({ length: 5 }, (_, i) => ({
				...safeScenario,
				id: `s${i}`,
			})),
		);

		// alarm: 0.5 * 100 + 0.5 * (-300) = -100 per scenario
		// safe:  0.5 * 100 + 0.5 * (-100) =    0 per scenario
		// total: 5 * (-100) + 5 * 0 = -500
		expect(expectedChanceScore(scenarios)).toBe(-500);
	});

	it('computes baseline for all-alarm round', () => {
		const scenarios: Scenario[] = Array.from({ length: 10 }, (_, i) => ({
			...alarmScenario,
			id: `a${i}`,
		}));
		// 10 * (-100) = -1000
		expect(expectedChanceScore(scenarios)).toBe(-1000);
	});

	it('computes baseline for all-safe round', () => {
		const scenarios: Scenario[] = Array.from({ length: 10 }, (_, i) => ({
			...safeScenario,
			id: `s${i}`,
		}));
		// 10 * 0 = 0
		expect(expectedChanceScore(scenarios)).toBe(0);
	});
});

describe('chanceAdjustedPct', () => {
	it('returns 100 for perfect score', () => {
		// max=1500, chance=-500 → denom=2000 → (1500 - (-500))/2000 = 100%
		expect(chanceAdjustedPct(1500, 1500, -500)).toBe(100);
	});

	it('returns 0 for score equal to chance baseline', () => {
		expect(chanceAdjustedPct(-500, 1500, -500)).toBe(0);
	});

	it('returns negative for worse-than-guessing score', () => {
		expect(chanceAdjustedPct(-1000, 1500, -500)).toBe(-25);
	});

	it('returns 0 for degenerate denominator', () => {
		expect(chanceAdjustedPct(0, 0, 0)).toBe(0);
	});
});

describe('findWeakCategories', () => {
	it('returns only categories with >=2 errors, sorted desc', () => {
		const scenarios: readonly Scenario[] = [
			alarmScenario,
			safeScenario,
			{
				id: 's-abd',
				difficulty: 'intern',
				category: 'abdominal',
				sourceTopic: 'Acute buikpijn',
				presentation: 'test',
				verdict: 'alarm',
				explanation: 'test',
			},
		];

		const answers: readonly Answer[] = [
			{ scenarioId: 's-alarm', choice: 'safe', correct: false, reactionTimeMs: 2_000 },
			{ scenarioId: 's-alarm', choice: 'safe', correct: false, reactionTimeMs: 2_000 },
			{ scenarioId: 's-safe', choice: 'alarm', correct: false, reactionTimeMs: 2_000 },
			{ scenarioId: 's-safe', choice: 'alarm', correct: false, reactionTimeMs: 2_000 },
			{ scenarioId: 's-safe', choice: 'safe', correct: true, reactionTimeMs: 2_000 },
			{ scenarioId: 's-abd', choice: 'safe', correct: false, reactionTimeMs: 2_000 },
		];

		expect(findWeakCategories(answers, scenarios)).toEqual(['neurological', 'cardiac']);
	});
});
