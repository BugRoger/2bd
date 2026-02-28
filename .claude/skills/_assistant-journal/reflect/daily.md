# Journal: Reflect Daily

Generate reflection draft with placeholders for evening reflection.

## Context to Load

1. Read plan output: `vault/00_Brain/Synthetic/Assistants/journal/{date}-plan-daily.md` or draft
2. Read capture note `vault/00_Brain/Captive/Today.md` — find `## Journal` section
3. Read `vault/00_Brain/Semantic/Assistants/journal/memory.md` if exists

## Draft Generation

1. Extract planned reflection prompts from plan output
2. Extract actual journal content from capture note if available
3. Generate draft with placeholders for evening reflection

## Output

Write to `vault/00_Brain/Synthetic/Assistants/journal/daily-reflect-draft.md`:

```markdown
## Journal

**Morning Intention:**
{Extract from plan if available}

**From Today's Note:**
{Extract journal content from Today.md if available}

### Evening Reflection

<!-- ASK:journal-how-was-day
How was your day overall?
-->

<!-- ASK:journal-what-went-well
What went well today?
-->

<!-- ASK:journal-what-was-hard
What was hard or challenging?
-->

<!-- ASK:journal-learned
What did you learn today?
-->

<!-- ASK:journal-grateful
What are you grateful for from today?
-->

### Entity Learnings

{Auto-extract any people or projects mentioned}

<!-- ASK:journal-entity-insights
Any insights about people or projects from today's reflection?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: journal
action: reflect
timescale: daily
timestamp: {ISO timestamp}
---
```
