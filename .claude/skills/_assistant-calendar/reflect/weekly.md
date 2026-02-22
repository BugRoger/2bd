# Calendar: Reflect Weekly

Review the week's calendar patterns.

## Context to Load

1. Read daily calendar reflections from this week
2. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. Analyze week:
   - Total meeting hours
   - Focus time used
   - Key interactions
   - Energy impact

2. Identify patterns

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-reflect-weekly.md`:

```markdown
# Calendar: reflect(weekly) {date}

## Status
ok

## Section
### Week Calendar Review

**Total meetings:** {X hours}
**Focus time:** {Y hours}

### Key Interactions
- {Person/Meeting} — {Impact/Outcome}

### Patterns
- {What worked}
- {What didn't}

## Observations
- {Calendar patterns, recommendations}

## Timestamp
{ISO timestamp}
```
