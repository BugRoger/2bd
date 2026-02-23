# Goals: Reflect Daily

Compare planned 1-3-5 to actual completion and return findings to Ada.

## Context to Load

1. Read own template from `vault/00_Brain/Systemic/Templates/Assistants/goals/daily.md`
2. Read plan output: `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-daily.md`
3. Read capture note `vault/00_Brain/Captive/Today.md` — find `## 1-3-5` section by H2 header
4. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Extract planned 1-3-5 from plan output (what was intended)
2. Extract actual 1-3-5 from capture note section (what happened)
3. Generate variance narrative:
   - What was completed as planned
   - What was planned but not done (and blockers if noted)
   - What was done that wasn't planned
4. Identify entity learnings (people, projects mentioned with insights)
5. Generate coaching questions based on patterns

## Return to Ada

Return findings for coaching conversation:

```markdown
## Findings

### Variance
- Planned: [Summary of 1-3-5 from plan]
- Actual: [What was completed]
- Gap: [What shifted, notable patterns]

### Coaching Questions
- [Question exploring the variance]
- [Question about patterns worth examining]

### Entity Learnings
- [[Person]]: [Insight discovered]
- [[Project]]: [Insight discovered]
```

## Output

After coaching, write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-reflect-daily.md`:

```markdown
# Goals: reflect(daily) {date}

## Status
ok

## Section
### Planned vs Actual

[Variance narrative from coaching conversation]

## Entity Learnings
- [[Entity]]: [Confirmed insight]

## Observations
- [Patterns for goals memory]

## Timestamp
{ISO timestamp}
```
