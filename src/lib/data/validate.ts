import type { Difficulty, Scenario, Verdict } from '$lib/types';

const MIN_SCENARIOS_PER_DIFFICULTY = 15;
const MIN_PER_VERDICT_PER_DIFFICULTY = 5;

interface DifficultyCounts {
	total: number;
	alarm: number;
	safe: number;
}

function createCounts(): DifficultyCounts {
	return { total: 0, alarm: 0, safe: 0 };
}

function incrementVerdict(counts: DifficultyCounts, verdict: Verdict): void {
	if (verdict === 'alarm') {
		counts.alarm += 1;
		return;
	}
	counts.safe += 1;
}

function validateDifficultyStats(difficulty: Difficulty, counts: DifficultyCounts): void {
	if (counts.total < MIN_SCENARIOS_PER_DIFFICULTY) {
		throw new Error(
			`Difficulty '${difficulty}' has ${counts.total} scenarios; need at least ${MIN_SCENARIOS_PER_DIFFICULTY}.`,
		);
	}

	if (counts.alarm < MIN_PER_VERDICT_PER_DIFFICULTY) {
		throw new Error(
			`Difficulty '${difficulty}' has ${counts.alarm} alarm scenarios; need at least ${MIN_PER_VERDICT_PER_DIFFICULTY}.`,
		);
	}

	if (counts.safe < MIN_PER_VERDICT_PER_DIFFICULTY) {
		throw new Error(
			`Difficulty '${difficulty}' has ${counts.safe} safe scenarios; need at least ${MIN_PER_VERDICT_PER_DIFFICULTY}.`,
		);
	}
}

export function validateScenarioBank(scenarios: readonly Scenario[]): void {
	const ids = new Set<string>();
	const stats: Record<Difficulty, DifficultyCounts> = {
		intern: createCounts(),
		anios: createCounts(),
		huisarts: createCounts(),
	};

	for (const scenario of scenarios) {
		if (ids.has(scenario.id)) {
			throw new Error(`Duplicate scenario id '${scenario.id}'.`);
		}
		ids.add(scenario.id);

		if (scenario.presentation.trim().length === 0) {
			throw new Error(`Scenario '${scenario.id}' has empty presentation.`);
		}

		if (scenario.explanation.trim().length === 0) {
			throw new Error(`Scenario '${scenario.id}' has empty explanation.`);
		}

		const difficultyCounts = stats[scenario.difficulty];
		difficultyCounts.total += 1;
		incrementVerdict(difficultyCounts, scenario.verdict);
	}

	validateDifficultyStats('intern', stats.intern);
	validateDifficultyStats('anios', stats.anios);
	validateDifficultyStats('huisarts', stats.huisarts);
}
