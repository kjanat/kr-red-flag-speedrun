/** Clinical category for weakness tracking */
export type ClinicalCategory =
	| 'cardiac'
	| 'neurological'
	| 'respiratory'
	| 'abdominal'
	| 'musculoskeletal'
	| 'psychiatric'
	| 'pediatric'
	| 'obstetric'
	| 'infectious'
	| 'vascular';

/** Difficulty level */
export type Difficulty = 'intern' | 'anios' | 'huisarts';

/** Whether the scenario is truly dangerous */
export type Verdict = 'alarm' | 'safe';

/** A single patient scenario */
export interface Scenario {
	readonly id: string;
	readonly difficulty: Difficulty;
	readonly category: ClinicalCategory;
	/** The one-liner shown to the player */
	readonly presentation: string;
	/** The correct answer */
	readonly verdict: Verdict;
	/** Shown in post-round feedback */
	readonly explanation: string;
}

/** Player's answer to a single scenario */
export interface Answer {
	readonly scenarioId: string;
	readonly choice: Verdict;
	readonly correct: boolean;
	/** Milliseconds taken to decide */
	readonly reactionTimeMs: number;
}

/** Result of a completed round */
export interface RoundResult {
	readonly difficulty: Difficulty;
	readonly answers: readonly Answer[];
	readonly score: number;
	readonly maxPossibleScore: number;
	/** Categories the player most often got wrong */
	readonly weakCategories: readonly ClinicalCategory[];
	readonly totalTimeMs: number;
}

/** Discriminated union for game screen state */
export type GameState =
	| { readonly phase: 'menu' }
	| { readonly phase: 'playing'; readonly difficulty: Difficulty }
	| { readonly phase: 'results'; readonly result: RoundResult };
