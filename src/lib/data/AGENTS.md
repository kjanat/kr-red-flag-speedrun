# DATA KNOWLEDGE BASE

## OVERVIEW

`src/lib/data` stores the scenario corpus and enforces hard dataset validity before gameplay can run.

## STRUCTURE

```text
src/lib/data/
├── scenarios.ts      # full scenario bank (readonly literal array)
├── validate.ts       # invariant checks and error messages
└── validate.test.ts  # guardrails for validator behavior
```

## WHERE TO LOOK

| Task                        | Location                        | Notes                                                   |
| --------------------------- | ------------------------------- | ------------------------------------------------------- |
| Edit/add scenario entries   | `src/lib/data/scenarios.ts`     | large literal bank grouped by difficulty                |
| Import-time validation hook | `src/lib/data/scenarios.ts`     | `validateScenarioBank(scenarios)` must remain           |
| Invariant definitions       | `src/lib/data/validate.ts`      | minimum counts, verdict balance, duplicate/empty checks |
| Validation regression tests | `src/lib/data/validate.test.ts` | exact thrown error messages are asserted                |

## CONVENTIONS

- Difficulty buckets are `intern`, `anios`, `huisarts`; validator checks each bucket independently.
- Minimums: >=15 scenarios per difficulty, >=5 `alarm`, >=5 `safe` each difficulty.
- Scenario `presentation` and `explanation` are trimmed/non-empty by validator.
- IDs are expected unique; tests currently rely on prefix+number style (`i01`, `a01`, `h01`).

## ANTI-PATTERNS

- Do not remove or conditionalize `validateScenarioBank(scenarios)` call.
- Do not change validator error text casually; tests assert exact messages.
- Do not add placeholder empty strings to pass compile-time checks.
