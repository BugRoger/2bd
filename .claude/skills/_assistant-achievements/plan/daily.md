# Achievements: Plan Daily

Generate win capture draft.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for weekly achievements
2. Read `vault/00_Brain/Semantic/Assistants/achievements/memory.md`

## Output

Write to `vault/00_Brain/Synthetic/Assistants/achievements/daily-draft.md`:

```markdown
## Achievements

**Yesterday's Wins:**
{Extract from yesterday's note if exists}

<!-- ASK:achievements-capture
Any wins from yesterday to capture?
-->
```
