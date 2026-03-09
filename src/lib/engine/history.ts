import type { ClinicalCategory, Difficulty, RoundResult } from '$lib/types';

const STORAGE_KEY = 'rf-history';
const MAX_ROUNDS = 50;

/** Persisted summary of a completed round (no raw answers/scenarios) */
export interface SavedRound {
	readonly difficulty: Difficulty;
	readonly score: number;
	readonly maxPossible: number;
	readonly correctCount: number;
	readonly totalCount: number;
	readonly totalTimeMs: number;
	readonly weakCategories: readonly ClinicalCategory[];
	/** ISO 8601 */
	readonly timestamp: string;
}

/** Aggregated stats computed from history */
export interface HistoryStats {
	readonly highScores: Readonly<Record<Difficulty, number | null>>;
	readonly totalRoundsPlayed: number;
	/** 0-100 percentage, null if no rounds played */
	readonly overallAccuracy: number | null;
}

const DIFFICULTIES: readonly Difficulty[] = ['intern', 'anios', 'huisarts'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSavedRound(result: RoundResult): SavedRound {
	return {
		difficulty: result.difficulty,
		score: result.score,
		maxPossible: result.maxPossibleScore,
		correctCount: result.answers.filter((a) => a.correct).length,
		totalCount: result.answers.length,
		totalTimeMs: result.totalTimeMs,
		weakCategories: result.weakCategories,
		timestamp: new Date().toISOString(),
	};
}

function isSavedRound(value: unknown): value is SavedRound {
	if (typeof value !== 'object' || value === null) return false;
	const r = value as Record<string, unknown>;
	return (
		typeof r['difficulty'] === 'string'
		&& typeof r['score'] === 'number'
		&& typeof r['maxPossible'] === 'number'
		&& typeof r['correctCount'] === 'number'
		&& typeof r['totalCount'] === 'number'
		&& typeof r['totalTimeMs'] === 'number'
		&& typeof r['timestamp'] === 'string'
		&& Array.isArray(r['weakCategories'])
	);
}

function readStorage(): SavedRound[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === null) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isSavedRound);
	} catch {
		return [];
	}
}

function writeStorage(rounds: readonly SavedRound[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
	} catch {
		// quota exceeded or disabled — silently drop
	}
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Append round result to localStorage history (FIFO eviction at 50). */
export function saveRound(result: RoundResult): void {
	const history = readStorage();
	history.push(toSavedRound(result));
	// evict oldest when over capacity
	while (history.length > MAX_ROUNDS) {
		history.shift();
	}
	writeStorage(history);
}

/** Load persisted history. Returns empty array on missing/corrupt data. */
export function loadHistory(): readonly SavedRound[] {
	return readStorage();
}

/** Compute aggregate stats from saved history. */
export function getStats(): HistoryStats {
	const history = readStorage();
	const highScores = Object.fromEntries(
		DIFFICULTIES.map((d) => {
			const scores = history.filter((r) => r.difficulty === d).map((r) => r.score);
			return [d, scores.length > 0 ? Math.max(...scores) : null];
		}),
	) as Record<Difficulty, number | null>;

	const totalCorrect = history.reduce((sum, r) => sum + r.correctCount, 0);
	const totalQuestions = history.reduce((sum, r) => sum + r.totalCount, 0);

	return {
		highScores,
		totalRoundsPlayed: history.length,
		overallAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null,
	};
}

/** Wipe all saved history from localStorage. */
export function clearHistory(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// noop
	}
}

/** Best score for a given difficulty (optionally scoped to round length), or null if none recorded. */
export function getHighScore(difficulty: Difficulty, roundLength?: number): number | null {
	const history = readStorage();
	const scores = history
		.filter((r) => r.difficulty === difficulty && (roundLength === undefined || r.totalCount === roundLength))
		.map((r) => r.score);
	return scores.length > 0 ? Math.max(...scores) : null;
}
