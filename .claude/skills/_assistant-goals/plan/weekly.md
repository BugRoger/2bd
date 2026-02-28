# Goals: Plan Weekly

Generate Major Moves draft with placeholders for user input.

## Context to Load

1. Read `vault/00_Brain/Captive/Quarter.md` for Quests
2. Read `vault/00_Brain/Captive/Year.md` for Annual Goals (grounding)
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Draft Generation

1. Extract Quarterly Quests from Quarter.md
2. Show Annual Goals for context
3. Generate draft with placeholders for Quest selection and targets

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/weekly-draft.md`:

```markdown
## Goals

**From Your Quarter:**
- Quest 1: {Extract from Quarter.md}
- Quest 2: {Extract from Quarter.md}
- Quest 3: {Extract from Quarter.md}

**Annual Goals (Context):**
- {Extract from Year.md}

### Major Moves

<!-- ASK:goals-quest-1
Which Quest will you advance as Major Move #1 this week?
-->

<!-- ASK:goals-target-1
What does progress look like by Friday for this Quest?
-->

<!-- ASK:goals-quest-2
Which Quest will you advance as Major Move #2 this week?
-->

<!-- ASK:goals-target-2
What does progress look like by Friday for this Quest?
-->

<!-- ASK:goals-quest-3
(Optional) Any third Quest to advance this week?
-->

<!-- ASK:goals-target-3
If yes, what does progress look like by Friday?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: goals
action: plan
timescale: weekly
timestamp: {ISO timestamp}
---
```
