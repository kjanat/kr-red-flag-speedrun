# LIB KNOWLEDGE BASE

## OVERVIEW

`src/lib` is domain core: shared types, dataset, scoring/round engine, and Svelte presentation slices.

## STRUCTURE

```text
src/lib/
├── types.ts               # canonical domain types used everywhere
├── index.ts               # placeholder barrel (currently minimal)
├── data/
│   ├── scenarios.ts       # scenario corpus + import-time validation call
│   ├── validate.ts        # dataset invariant checks
│   └── validate.test.ts   # data guardrail tests
├── engine/
│   ├── game.svelte.ts     # reactive round lifecycle class
│   ├── round.ts           # scenario picking + result aggregation
│   ├── scoring.ts         # score model + weak-category analysis
│   └── *.test.ts          # engine unit tests
└── components/
    ├── Menu.svelte        # difficulty selection
    ├── Playing.svelte     # timer + answer input loop
    └── Results.svelte     # post-round analytics + feedback cards
```

## WHERE TO LOOK

| Task                    | Location                      | Notes                                        |
| ----------------------- | ----------------------------- | -------------------------------------------- |
| Change domain contracts | `src/lib/types.ts`            | update types before engine/UI edits          |
| Tune scoring behavior   | `src/lib/engine/scoring.ts`   | penalties/bonus and weak category thresholds |
| Tune round composition  | `src/lib/engine/round.ts`     | fixed 30 count + fallback fill order         |
| Add/edit scenarios      | `src/lib/data/scenarios.ts`   | keep validator constraints satisfied         |
| Add data invariants     | `src/lib/data/validate.ts`    | throws on invalid bank at import             |
| UI behavior changes     | `src/lib/components/*.svelte` | keep logic thin; push rules into engine/data |

## CONVENTIONS

- `types.ts` is shared source-of-truth; avoid duplicate local type shapes.
- `data` and `engine` stay framework-agnostic TS; Svelte specifics isolated to components and `game.svelte.ts` rune state.
- Test style: behavior-oriented unit tests, co-located, explicit fixtures, no snapshots.

## ANTI-PATTERNS

- Do not embed scoring/selection rules directly in Svelte components.
- Do not import from generated `.svelte-kit/` artifacts.
- Do not bypass scenario validation by exporting unvalidated scenario arrays.
