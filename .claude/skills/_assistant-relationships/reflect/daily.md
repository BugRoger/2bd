# Relationships: Reflect Daily

Generate reflection draft comparing planned touchpoints to actual interactions with placeholders.

## Context to Load

1. Read plan output: `vault/00_Brain/Synthetic/Assistants/relationships/{date}-plan-daily.md` or draft
2. Read capture note `vault/00_Brain/Captive/Today.md` — find relationships content
3. Read `vault/00_Brain/Semantic/Assistants/relationships/memory.md` if exists

## Draft Generation

1. Extract planned touchpoints from plan output
2. Extract actual interactions from capture note if available
3. Generate draft with placeholders for reflection

## Output

Write to `vault/00_Brain/Synthetic/Assistants/relationships/daily-reflect-draft.md`:

```markdown
## Relationships

**Planned Touchpoints:**
{Extract from plan}

**From Today's Note:**
{Extract relationship interactions if available}

### Reflection

<!-- ASK:relationships-interactions
Who did you interact with today? Any meaningful conversations?
-->

<!-- ASK:relationships-quality
How was the quality of your interactions?
-->

<!-- ASK:relationships-missed
Anyone you planned to connect with but didn't?
-->

<!-- ASK:relationships-learnings
Any insights about people or relationships from today?
-->

### Entity Learnings

{Auto-extract people mentioned}

<!-- ASK:relationships-entity-insights
Any specific insights about individual people?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: relationships
action: reflect
timescale: daily
timestamp: {ISO timestamp}
---
```
