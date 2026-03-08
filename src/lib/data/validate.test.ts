import { describe, expect, it } from 'vitest';

import type { Scenario } from '$lib/types';
import { scenarios } from './scenarios';
import { validateScenarioBank } from './validate';

function replaceScenario(index: number, updater: (scenario: Scenario) => Scenario): Scenario[] {
	return scenarios.map((scenario, currentIndex) => {
		if (currentIndex !== index) return scenario;
		return updater(scenario);
	});
}

function withVerdict(scenario: Scenario, verdict: Scenario['verdict']): Scenario {
	return { ...scenario, verdict };
}

describe('validateScenarioBank', () => {
	it('accepts current scenario bank', () => {
		expect(() => validateScenarioBank(scenarios)).not.toThrow();
	});

	it('rejects duplicate scenario ids', () => {
		const duplicate = [scenarios[0], scenarios[0], ...scenarios.slice(1)];
		expect(() => validateScenarioBank(duplicate)).toThrow("Duplicate scenario id 'i01'.");
	});

	it('rejects empty presentation', () => {
		const invalid = replaceScenario(0, (scenario) => ({ ...scenario, presentation: '   ' }));
		expect(() => validateScenarioBank(invalid)).toThrow("Scenario 'i01' has empty presentation.");
	});

	it('rejects empty explanation', () => {
		const invalid = replaceScenario(1, (scenario) => ({ ...scenario, explanation: '   ' }));
		expect(() => validateScenarioBank(invalid)).toThrow("Scenario 'i02' has empty explanation.");
	});

	it('rejects difficulty with fewer than 15 scenarios', () => {
		const reducedIntern = scenarios.filter((scenario) => {
			if (scenario.difficulty !== 'intern') return true;
			const numericId = Number.parseInt(scenario.id.slice(1), 10);
			return numericId <= 14;
		});

		expect(() => validateScenarioBank(reducedIntern)).toThrow(
			"Difficulty 'intern' has 14 scenarios; need at least 15.",
		);
	});

	it('rejects difficulty with fewer than 5 alarm scenarios', () => {
		const tooFewAlarms = scenarios.map((scenario) => {
			if (scenario.difficulty !== 'intern') return scenario;
			return withVerdict(scenario, 'safe');
		});

		expect(() => validateScenarioBank(tooFewAlarms)).toThrow(
			"Difficulty 'intern' has 0 alarm scenarios; need at least 5.",
		);
	});

	it('rejects difficulty with fewer than 5 safe scenarios', () => {
		let safeBudget = 4;
		const tooFewSafes = scenarios.map((scenario) => {
			if (scenario.difficulty !== 'intern') return scenario;
			if (scenario.verdict === 'safe' && safeBudget > 0) {
				safeBudget -= 1;
				return scenario;
			}
			return withVerdict(scenario, 'alarm');
		});

		expect(() => validateScenarioBank(tooFewSafes)).toThrow(
			"Difficulty 'intern' has 4 safe scenarios; need at least 5.",
		);
	});
});
