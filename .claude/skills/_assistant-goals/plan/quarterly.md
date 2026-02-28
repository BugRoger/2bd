# Goals: Plan Quarterly

Generate Quests draft with placeholders for user input.

## Context to Load

1. Read `vault/00_Brain/Captive/Year.md` for Annual Goals
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Draft Generation

1. Extract Annual Goals from Year.md
2. Show Vision for grounding
3. Generate draft with placeholders for Quest selection and theme

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/quarterly-draft.md`:

```markdown
## Goals

**From Your Year:**
{Extract Annual Goals from Year.md}

**Vision for Context:**
{Extract Vision from Year.md if available}

### Quarterly Quests

<!-- ASK:goals-quarter-theme
What's the theme for this quarter?
-->

<!-- ASK:goals-quest-1
Which Annual Goal will you advance as Quest #1? What would meaningful progress look like?
-->

<!-- ASK:goals-quest-2
Which Annual Goal will you advance as Quest #2? What would meaningful progress look like?
-->

<!-- ASK:goals-quest-3
Which Annual Goal will you advance as Quest #3? What would meaningful progress look like?
-->

<!-- ASK:goals-quest-4
(Optional) Any 4th or 5th Quest for this quarter?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: goals
action: plan
timescale: quarterly
timestamp: {ISO timestamp}
---
```
