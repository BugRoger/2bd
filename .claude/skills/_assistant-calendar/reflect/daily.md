# Calendar: Reflect Daily

Compare planned meetings to actual outcomes and return findings to Ada.

## Context to Load

1. Read own template from `vault/00_Brain/Systemic/Templates/Assistants/calendar/daily.md`
2. Read plan output: `vault/00_Brain/Synthetic/Assistants/calendar/{date}-plan-daily.md`
3. Read capture note `vault/00_Brain/Captive/Today.md` — find `## Meetings` section by H2 header
4. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. Extract planned meetings from plan output (what was intended)
2. Extract actual meeting notes from capture note section (what happened)
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
- Planned: [Summary of meetings from plan]
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

After coaching, write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-reflect-daily.md`:

```markdown
# Calendar: reflect(daily) {date}

## Status
ok

## Section
### Meeting Review

[Variance narrative from coaching conversation]

## Entity Learnings
- [[Entity]]: [Confirmed insight]

## Observations
- [Patterns for calendar memory]

## Timestamp
{ISO timestamp}
```
