# Goals: Plan Daily

Generate 1-3-5 goals draft with placeholders for user input.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for weekly Major Moves
2. Read `vault/00_Brain/Captive/Quarter.md` for Quests (if exists)
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` for patterns

## Draft Generation

1. Identify potential priorities from weekly context:
   - Extract Major Moves from Week.md
   - Note any urgent items or deadlines
   - Consider energy and capacity

2. Suggest 1-3-5 structure:
   - 1 Big: Most impactful priority
   - 3 Medium: Supporting tasks
   - 5 Small: Quick wins

3. Generate draft with placeholders for unknowns

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/daily-draft.md`:

```markdown
## Goals

**From Your Week:**
- Major Move 1: Launch feature
- Major Move 2: Hire senior engineer

**Suggested Focus:**

<!-- ASK:goals-big-one
What's your ONE big priority for today? (2-4 hours of deep work)
-->

**Three Medium Tasks:**

<!-- ASK:goals-medium-1
Medium task 1?
-->

<!-- ASK:goals-medium-2
Medium task 2?
-->

<!-- ASK:goals-medium-3
Medium task 3?
-->

**Five Small Wins:**

<!-- ASK:goals-small-1
Quick win 1?
-->

<!-- ASK:goals-small-2
Quick win 2?
-->

<!-- ASK:goals-small-3
Quick win 3?
-->

<!-- ASK:goals-small-4
Quick win 4?
-->

<!-- ASK:goals-small-5
Quick win 5?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: goals
action: plan
timescale: daily
timestamp: {ISO timestamp}
---
```
