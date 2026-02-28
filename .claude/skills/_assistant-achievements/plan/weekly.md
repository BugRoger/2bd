# Achievements: Plan Weekly

Generate achievement targets draft with placeholders.

## Context to Load

1. Read this week's Major Moves from Week.md
2. Read `vault/00_Brain/Semantic/Assistants/achievements/memory.md` if exists

## Draft Generation

1. Extract Major Moves for context
2. Generate draft with placeholders for milestone and impact identification

## Output

Write to `vault/00_Brain/Synthetic/Assistants/achievements/weekly-draft.md`:

```markdown
## Achievements

**From Your Week:**
- {Extract Major Moves from Week.md}

### Achievement Targets

<!-- ASK:achievements-milestones
What milestones could you hit this week?
-->

<!-- ASK:achievements-impact
What impact can you create this week?
-->

<!-- ASK:achievements-celebrate
What would be worth celebrating by Friday?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: achievements
action: plan
timescale: weekly
timestamp: {ISO timestamp}
---
```
