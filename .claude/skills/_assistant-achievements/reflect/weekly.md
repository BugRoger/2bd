# Achievements: Reflect Weekly

Compare planned win tracking to actual accomplishments and return findings to Ada.

## Context to Load

1. Read own template from `vault/00_Brain/Systemic/Templates/Assistants/achievements/weekly.md`
2. Read plan output: `vault/00_Brain/Synthetic/Assistants/achievements/{date}-plan-weekly.md`
3. Read capture note `vault/00_Brain/Captive/Week.md` — find `## Wins This Week` section by H2 header
4. Read `vault/00_Brain/Semantic/Assistants/achievements/memory.md` if exists

## Process

1. Extract planned achievement focus from plan output (what was intended)
2. Extract actual wins from capture note section (what happened)
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
- Planned: [Summary of achievement focus from plan]
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

After coaching, write to `vault/00_Brain/Synthetic/Assistants/achievements/{date}-reflect-weekly.md`:

```markdown
# Achievements: reflect(weekly) {date}

## Status
ok

## Section
### Week Accomplishments

[Variance narrative from coaching conversation]

## Entity Learnings
- [[Entity]]: [Confirmed insight]

## Observations
- [Patterns for achievements memory]

## Timestamp
{ISO timestamp}
```
