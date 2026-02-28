# Goals: Plan Yearly

Generate Annual Goals draft with placeholders for user input.

## Context to Load

1. Read previous year's reflection if exists
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Draft Generation

1. Review previous year's reflection if available
2. Extract key learnings and patterns
3. Generate draft with placeholders for theme and goals

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/yearly-draft.md`:

```markdown
## Goals

**From Last Year:**
{Extract key learnings from previous year's reflection if exists}

### Annual Goals

<!-- ASK:goals-year-theme
What's your theme for this year?
-->

<!-- ASK:goals-annual-1
What's your first major goal for this year? Why does this matter?
-->

<!-- ASK:goals-annual-2
What's your second major goal? Why does this matter?
-->

<!-- ASK:goals-annual-3
What's your third major goal? Why does this matter?
-->

<!-- ASK:goals-annual-4
What's your fourth major goal? Why does this matter?
-->

<!-- ASK:goals-annual-5
What's your fifth major goal? Why does this matter?
-->

<!-- ASK:goals-annual-more
(Optional) Any 6th or 7th goals for this year?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: goals
action: plan
timescale: yearly
timestamp: {ISO timestamp}
---
```
