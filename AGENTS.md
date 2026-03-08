# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-08T16:32:59\
**Commit:** dc32359\
**Branch:** master

## OVERVIEW

SvelteKit + Svelte 5 + TypeScript speed-triage game.
Domain core in framework-agnostic TS (`src/lib/data`, `src/lib/engine`); route layer thin.

## STRUCTURE

```text
./
├── src/
│   ├── routes/           # page shell + phase switching
│   └── lib/
│       ├── data/         # scenario bank + hard validation gate
│       ├── engine/       # round selection, scoring, state transitions
│       └── components/   # Menu/Playing/Results UI slices
├── static/               # static assets (currently sparse)
└── specs/                # reserved; currently empty
```

## WHERE TO LOOK

| Task              | Location                        | Notes                                      |
| ----------------- | ------------------------------- | ------------------------------------------ |
| Game phase flow   | `src/lib/engine/game.svelte.ts` | menu -> playing -> results state machine   |
| Round assembly    | `src/lib/engine/round.ts`       | 30 scenarios, adjacent-difficulty fallback |
| Scoring semantics | `src/lib/engine/scoring.ts`     | missed red flag = 3x penalty               |
| Scenario corpus   | `src/lib/data/scenarios.ts`     | large literal dataset, validated at import |
| Data invariants   | `src/lib/data/validate.ts`      | min counts + duplicate/empty checks        |
| UI composition    | `src/routes/+page.svelte`       | wires Game to Menu/Playing/Results         |

## CODE MAP

| Symbol                 | Type      | Location                        | Refs              | Role                              |
| ---------------------- | --------- | ------------------------------- | ----------------- | --------------------------------- |
| `Game`                 | class     | `src/lib/engine/game.svelte.ts` | route-level       | round lifecycle orchestration     |
| `pickScenarios`        | function  | `src/lib/engine/round.ts`       | game + tests      | selects 30 scenarios for round    |
| `scoreAnswer`          | function  | `src/lib/engine/scoring.ts`     | round + tests     | per-answer score with speed bonus |
| `validateScenarioBank` | function  | `src/lib/data/validate.ts`      | scenarios + tests | blocks invalid dataset at load    |
| `Scenario`             | interface | `src/lib/types.ts`              | cross-cutting     | shared domain contract            |

## CONVENTIONS

- Bun pinned (`packageManager: bun@1.3.10`); prefer bun for local/CI parity.
- Tests co-located, `*.test.ts` naming, Vitest defaults (no custom config file).
- Strict TS posture (`strict`, `checkJs`, bundler module resolution).
- Vite plugins generate robots and favicon ICO from `src/lib/assets/favicon.svg`.

## ANTI-PATTERNS (THIS PROJECT)

- Do not bypass `validateScenarioBank(scenarios)` import-time guard.
- Do not change scoring asymmetry casually; risk model depends on it.
- Do not rely on generated `.svelte-kit/` output for authored logic changes.
- Do not remove README data link (`STOP REMOVING THIS LINK ...` marker).

## UNIQUE STYLES

- Clinical Dutch copy; scenario text/explanations intentionally concise.
- UI kept thin; business rules concentrated in TS modules.
- Difficulty labels are educational roles (`intern`, `anios`, `huisarts`), not generic easy/medium/hard.

## COMMANDS

```bash
bun run dev
bun run test
bun run check
bun run build
bun run fmt
```

## NOTES

- `prepare` script swallows sync failure (`svelte-kit sync || echo ''`); check logs if type artifacts look stale.
- `specs/` and `static/` exist but currently minimal; avoid assuming active ownership there.
