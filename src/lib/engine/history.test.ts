import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoundResult } from '$lib/types';
import { clearHistory, getHighScore, getStats, loadHistory, saveRound } from './history';

// ---------------------------------------------------------------------------
// localStorage stub
// ---------------------------------------------------------------------------

const store = new Map<string, string>();

beforeEach(() => {
	store.clear();
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => store.set(key, value),
		removeItem: (key: string) => store.delete(key),
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function fakeResult(overrides: Partial<RoundResult> = {}): RoundResult {
	return {
		difficulty: 'intern',
		answers: [
			{ scenarioId: 's1', choice: 'alarm', correct: true, reactionTimeMs: 3_000 },
			{ scenarioId: 's2', choice: 'safe', correct: false, reactionTimeMs: 4_000 },
		],
		score: 200,
		maxPossibleScore: 300,
		weakCategories: [],
		totalTimeMs: 7_000,
		...overrides,
	};
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('saveRound + loadHistory', () => {
	it('round-trips a saved round', () => {
		saveRound(fakeResult());

		const history = loadHistory();
		expect(history).toHaveLength(1);
		expect(history[0].difficulty).toBe('intern');
		expect(history[0].score).toBe(200);
		expect(history[0].maxPossible).toBe(300);
		expect(history[0].correctCount).toBe(1);
		expect(history[0].totalCount).toBe(2);
		expect(history[0].totalTimeMs).toBe(7_000);
		expect(history[0].timestamp).toBeTruthy();
	});

	it('accumulates multiple rounds', () => {
		saveRound(fakeResult());
		saveRound(fakeResult({ score: 400 }));

		expect(loadHistory()).toHaveLength(2);
	});
});

describe('FIFO eviction', () => {
	it('evicts oldest entries beyond 50', () => {
		for (let i = 0; i < 55; i++) {
			saveRound(fakeResult({ score: i }));
		}

		const history = loadHistory();
		expect(history).toHaveLength(50);
		// oldest 5 (scores 0-4) should be evicted; first remaining = score 5
		expect(history[0].score).toBe(5);
		expect(history[49].score).toBe(54);
	});
});

describe('corrupt data handling', () => {
	it('returns empty array for invalid JSON', () => {
		store.set('rf-history', '{{not json}}');
		expect(loadHistory()).toEqual([]);
	});

	it('returns empty array for non-array JSON', () => {
		store.set('rf-history', '{"a":1}');
		expect(loadHistory()).toEqual([]);
	});

	it('filters out entries with wrong shape', () => {
		const good = {
			difficulty: 'intern',
			score: 100,
			maxPossible: 300,
			correctCount: 1,
			totalCount: 2,
			totalTimeMs: 5_000,
			weakCategories: [],
			timestamp: '2026-01-01T00:00:00.000Z',
		};
		const bad = { difficulty: 42, garbage: true };
		store.set('rf-history', JSON.stringify([good, bad]));

		const history = loadHistory();
		expect(history).toHaveLength(1);
		expect(history[0].score).toBe(100);
	});

	it('returns empty array when localStorage is absent', () => {
		vi.stubGlobal('localStorage', {
			getItem: () => {
				throw new Error('disabled');
			},
			setItem: () => {
				throw new Error('disabled');
			},
			removeItem: () => {
				throw new Error('disabled');
			},
		});
		expect(loadHistory()).toEqual([]);
	});
});

describe('getHighScore', () => {
	it('returns null when no rounds for that difficulty', () => {
		expect(getHighScore('huisarts')).toBeNull();
	});

	it('returns correct per-difficulty max', () => {
		saveRound(fakeResult({ difficulty: 'intern', score: 100 }));
		saveRound(fakeResult({ difficulty: 'intern', score: 250 }));
		saveRound(fakeResult({ difficulty: 'anios', score: 400 }));

		expect(getHighScore('intern')).toBe(250);
		expect(getHighScore('anios')).toBe(400);
		expect(getHighScore('huisarts')).toBeNull();
	});
});

describe('getStats', () => {
	it('returns zero/null defaults on empty history', () => {
		const stats = getStats();
		expect(stats.totalRoundsPlayed).toBe(0);
		expect(stats.overallAccuracy).toBeNull();
		expect(stats.highScores.intern).toBeNull();
		expect(stats.highScores.anios).toBeNull();
		expect(stats.highScores.huisarts).toBeNull();
	});

	it('aggregates across rounds', () => {
		// round 1: 1/2 correct
		saveRound(fakeResult({ difficulty: 'intern', score: 200 }));
		// round 2: 2/2 correct
		saveRound(
			fakeResult({
				difficulty: 'anios',
				score: 300,
				answers: [
					{ scenarioId: 's1', choice: 'alarm', correct: true, reactionTimeMs: 3_000 },
					{ scenarioId: 's2', choice: 'safe', correct: true, reactionTimeMs: 4_000 },
				],
			}),
		);

		const stats = getStats();
		expect(stats.totalRoundsPlayed).toBe(2);
		// 3 correct out of 4 = 75%
		expect(stats.overallAccuracy).toBe(75);
		expect(stats.highScores.intern).toBe(200);
		expect(stats.highScores.anios).toBe(300);
	});
});

describe('clearHistory', () => {
	it('removes all saved data', () => {
		saveRound(fakeResult());
		expect(loadHistory()).toHaveLength(1);

		clearHistory();
		expect(loadHistory()).toEqual([]);
	});

	it('is safe to call on empty/missing storage', () => {
		expect(() => clearHistory()).not.toThrow();
	});
});
