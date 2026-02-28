# Goals: Reflect Daily

Generate reflection draft comparing planned 1-3-5 to actual completion with placeholders for user input.

## Context to Load

1. Read plan output: `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-daily.md` or draft
2. Read capture note `vault/00_Brain/Captive/Today.md` — find `## Goals` section
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Draft Generation

1. Extract planned 1-3-5 from plan output (what was intended)
2. Extract actual 1-3-5 from capture note if available
3. Generate variance analysis with placeholders for unknowns
4. Add placeholders for coaching questions about patterns

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/daily-reflect-draft.md`:

```markdown
## Goals

**Planned Today:**
{Extract 1-3-5 from plan}

**From Today's Note:**
{Extract completed goals from Today.md if available}

### Reflection

<!-- ASK:goals-completed
What did you complete from your 1-3-5?
-->

<!-- ASK:goals-incomplete
What didn't get done? What got in the way?
-->

<!-- ASK:goals-unplanned
What did you work on that wasn't planned?
-->

<!-- ASK:goals-patterns
Any patterns worth noting about your goal-setting or execution?
-->

### Entity Learnings

{Auto-extract any people or projects mentioned in variance}

<!-- ASK:goals-entity-insights
Any insights about people or projects from today's goals work?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: goals
action: reflect
timescale: daily
timestamp: {ISO timestamp}
---
```
