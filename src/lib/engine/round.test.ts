import { describe, expect, it } from 'vitest';

import { scenarios } from '$lib/data/scenarios';
import type { Answer, Scenario } from '$lib/types';
import { computeRoundResult, pickScenarios, processAnswer } from './round';

describe('pickScenarios', () => {
	it('always returns 30 unique scenarios', () => {
		const picked = pickScenarios('intern');
		expect(picked).toHaveLength(30);
		expect(new Set(picked.map((scenario) => scenario.id)).size).toBe(30);
	});

	it('includes scenarios from chosen difficulty', () => {
		const picked = pickScenarios('huisarts');
		const expectedCount = scenarios.filter((scenario) => scenario.difficulty === 'huisarts').length;
		const huisartsCount = picked.filter((scenario) => scenario.difficulty === 'huisarts').length;
		expect(huisartsCount).toBe(expectedCount);
	});
});

describe('processAnswer', () => {
	it('marks correctness from scenario verdict', () => {
		const scenario: Scenario = {
			id: 'x1',
			difficulty: 'intern',
			category: 'cardiac',
			sourceTopic: 'Hartkloppingen',
			presentation: 'test',
			verdict: 'alarm',
			explanation: 'test',
		};

		expect(processAnswer(scenario, 'alarm', 123)).toEqual({
			scenarioId: 'x1',
			choice: 'alarm',
			correct: true,
			reactionTimeMs: 123,
		});
	});
});

describe('computeRoundResult', () => {
	it('computes score and max score from answers', () => {
		const roundScenarios = scenarios.slice(0, 2);
		const answers: readonly Answer[] = [
			processAnswer(roundScenarios[0], roundScenarios[0].verdict, 1_000),
			processAnswer(roundScenarios[1], roundScenarios[1].verdict === 'alarm' ? 'safe' : 'alarm', 1_000),
		];

		const result = computeRoundResult('intern', answers, roundScenarios, 12_345);

		expect(result.answers).toHaveLength(2);
		expect(result.maxPossibleScore).toBe(300);
		expect(result.totalTimeMs).toBe(12_345);
		expect(result.score).toBeLessThan(result.maxPossibleScore);
	});

	it('ignores answers that do not map to a known scenario id', () => {
		const roundScenarios = scenarios.slice(0, 1);
		const answers: readonly Answer[] = [
			{ scenarioId: 'does-not-exist', choice: 'alarm', correct: false, reactionTimeMs: 1_000 },
		];

		const result = computeRoundResult('intern', answers, roundScenarios, 999);

		expect(result.score).toBe(0);
		expect(result.maxPossibleScore).toBe(150);
	});
});
