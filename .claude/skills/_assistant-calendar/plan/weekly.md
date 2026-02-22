# Calendar: Plan Weekly

Analyze the week's calendar shape.

## Context to Load

1. Fetch this week's calendar events
2. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. Analyze week shape:
   - Meeting density by day
   - Focus time availability
   - Key meetings to prepare for
   - Energy arc prediction

2. Identify preparation needs

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-plan-weekly.md`:

```markdown
# Calendar: plan(weekly) {date}

## Status
ok

## Section
### Week Shape

**Monday:** {X meetings, Y focus hours}
**Tuesday:** {X meetings, Y focus hours}
**Wednesday:** {X meetings, Y focus hours}
**Thursday:** {X meetings, Y focus hours}
**Friday:** {X meetings, Y focus hours}

**Busiest day:** {Day}
**Best focus day:** {Day}

### Key Meetings
- {Meeting 1} — {Day} — {Why important}
- {Meeting 2} — {Day} — {Why important}

## Observations
- {Calendar patterns, concerns}

## Timestamp
{ISO timestamp}
```
