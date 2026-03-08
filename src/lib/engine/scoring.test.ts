import { describe, expect, it } from 'vitest';

import type { Answer, Scenario } from '$lib/types';
import { findWeakCategories, maxScorePerScenario, scoreAnswer } from './scoring';

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
