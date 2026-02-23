# Calendar: Reflect Weekly

Compare planned calendar rhythm to actual patterns and return findings to Ada.

## Context to Load

1. Read own template from `vault/00_Brain/Systemic/Templates/Assistants/calendar/weekly.md`
2. Read plan output: `vault/00_Brain/Synthetic/Assistants/calendar/{date}-plan-weekly.md`
3. Read capture note `vault/00_Brain/Captive/Week.md` — find `## Key Dates` section by H2 header
4. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. Extract planned calendar focus from plan output (what was intended)
2. Extract actual calendar patterns from capture note section (what happened)
3. Generate variance narrative:
   - What was completed as planned
   - What was planned but not done
   - What emerged that wasn't planned
4. Identify entity learnings (people, projects mentioned with insights)
5. Generate coaching questions based on patterns

## Return to Ada

Return findings for coaching conversation:

```markdown
## Findings

### Variance
- Planned: [Summary of calendar focus from plan]
- Actual: [What happened]
- Gap: [What shifted, notable patterns]

### Coaching Questions
- [Question exploring the variance]
- [Question about patterns worth examining]

### Entity Learnings
- [[Person]]: [Insight discovered]
- [[Project]]: [Insight discovered]
```

## Output

After coaching, write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-reflect-weekly.md`:

```markdown
# Calendar: reflect(weekly) {date}

## Status
ok

## Section
### Week Calendar Review

[Variance narrative from coaching conversation]

## Entity Learnings
- [[Entity]]: [Confirmed insight]

## Observations
- [Patterns for calendar memory]

## Timestamp
{ISO timestamp}
```
