# Achievements: Reflect Daily

Generate achievements draft with placeholders for win capture.

## Context to Load

1. Read today's achievement plan if exists
2. Read `vault/00_Brain/Semantic/Assistants/achievements/memory.md` if exists
3. Read capture note `vault/00_Brain/Captive/Today.md` for achievements

## Draft Generation

1. Extract any planned achievement targets
2. Generate draft with placeholders for win capture

## Output

Write to `vault/00_Brain/Synthetic/Assistants/achievements/daily-reflect-draft.md`:

```markdown
## Achievements

**From Today's Plan:**
{Extract achievement targets if planned}

### Today's Wins

<!-- ASK:achievements-accomplished
What did you accomplish today?
-->

<!-- ASK:achievements-impact
Any measurable impact to record?
-->

<!-- ASK:achievements-progress
What moved forward today?
-->

<!-- ASK:achievements-evidence
Any evidence or artifacts to save?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: achievements
action: reflect
timescale: daily
timestamp: {ISO timestamp}
---
```
