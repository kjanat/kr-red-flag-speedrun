# ENGINE KNOWLEDGE BASE

## OVERVIEW

`src/lib/engine` owns gameplay semantics: scenario selection, answer scoring, result aggregation, phase transitions.

## WHERE TO LOOK

| Task                     | Location                        | Notes                                                |
| ------------------------ | ------------------------------- | ---------------------------------------------------- |
| State machine updates    | `src/lib/engine/game.svelte.ts` | authoritative `GameState` transitions                |
| Per-question handling    | `src/lib/engine/game.svelte.ts` | `answer()` computes reaction time and advances round |
| Round scenario selection | `src/lib/engine/round.ts`       | `pickScenarios()` fixed 30 with adjacent fallback    |
| Final result assembly    | `src/lib/engine/round.ts`       | `computeRoundResult()` maps answers to scenario ids  |
| Scoring model edits      | `src/lib/engine/scoring.ts`     | speed bonus + asymmetric penalties                   |
| Weak category logic      | `src/lib/engine/scoring.ts`     | categories only included from >=2 mistakes           |
| Engine regression checks | `src/lib/engine/*.test.ts`      | behavior expectations for round/scoring invariants   |

## CONVENTIONS

- Keep pure calculations in `round.ts`/`scoring.ts`; `game.svelte.ts` orchestrates state/time only.
- `SCENARIOS_PER_ROUND` is currently fixed at 30; tests assume this.
- Missed red flag penalty is intentionally harsher than false alarm (`-300` vs `-100`).
- `computeRoundResult()` ignores answers without matching scenario id by design.

## ANTI-PATTERNS

- Do not weaken missed-red-flag penalty without updating risk rationale and tests.
- Do not mutate answer/scenario objects in-place; current flow assumes immutable append semantics.
- Do not let `Game` transition to results without full result object (`phase: 'results'` must carry `result`).
