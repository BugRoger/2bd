# Calendar: Reflect Daily

Review today's meetings.

## Context to Load

1. Read morning calendar prep from today
2. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. For each significant meeting:
   - What happened?
   - Any action items?
   - Any follow-ups needed?
   - Update person notes?

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-reflect-daily.md`:

```markdown
# Calendar: reflect(daily) {date}

## Status
ok

## Section
### Meeting Review

**{Meeting Title}**
- Outcome: {What happened}
- Actions: {Any follow-ups}
- Notes: {Key points to remember}

(etc.)

## Observations
- {Meeting patterns}

## Timestamp
{ISO timestamp}
```
