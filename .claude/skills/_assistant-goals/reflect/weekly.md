# Goals: Reflect Weekly

Generate reflection draft comparing planned Major Moves to actual progress with placeholders.

## Context to Load

1. Read plan output: `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-weekly.md` or draft
2. Read capture note `vault/00_Brain/Captive/Week.md`
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Draft Generation

1. Extract planned Major Moves from plan output
2. Extract actual progress from Week.md
3. Generate draft with variance analysis and placeholders

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/weekly-reflect-draft.md`:

```markdown
## Goals

**Planned Major Moves:**
{Extract from plan}

**From Week.md:**
{Extract progress}

### Reflection

<!-- ASK:goals-major-moves-progress
How did you progress on your Major Moves this week?
-->

<!-- ASK:goals-incomplete-moves
Which Major Moves didn't get the attention you planned? Why?
-->

<!-- ASK:goals-unplanned-work
What unplanned work took priority this week?
-->

<!-- ASK:goals-weekly-patterns
Any patterns in your goal-setting or execution this week?
-->

### Entity Learnings

<!-- ASK:goals-weekly-entity-insights
Any insights about people or projects from this week's goals work?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: goals
action: reflect
timescale: weekly
timestamp: {ISO timestamp}
---
```

## Context to Load

1. Read own template from `vault/00_Brain/Systemic/Templates/Assistants/goals/weekly.md`
2. Read plan output: `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-weekly.md`
3. Read capture note `vault/00_Brain/Captive/Week.md` — find `## Week Overview` and `## Weekly Commitments` sections by H2 header
4. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Extract planned Major Moves from plan output (what was intended)
2. Extract actual progress from capture note section (what happened)
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
- Planned: [Summary of Major Moves from plan]
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

After coaching, write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-reflect-weekly.md`:

```markdown
# Goals: reflect(weekly) {date}

## Status
ok

## Section
### Major Moves Review

[Variance narrative from coaching conversation]

## Entity Learnings
- [[Entity]]: [Confirmed insight]

## Observations
- [Patterns for goals memory]

## Timestamp
{ISO timestamp}
```
