# Calendar: Plan Daily

Prepare for today's meetings.

## Context to Load

1. Fetch today's calendar events using [Fetch Events](../SKILL.md#fetch-events)
2. Read person dossiers for key attendees from `vault/00_Brain/Semantic/People/`
3. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. List today's meetings with times

2. For important meetings:
   - Who's attending?
   - What's the purpose?
   - What prep is needed?
   - What's your goal for this meeting?

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-plan-daily.md`:

```markdown
# Calendar: plan(daily) {date}

## Status
ok

## Section
### Today's Meetings

**{Time} - {Meeting Title}**
- Attendees: {List}
- Purpose: {Why meeting}
- Prep: {What to prepare}
- Goal: {What you want from it}

(etc.)

**Focus Time:** {Hours available}

## Observations
- {Calendar patterns}

## Timestamp
{ISO timestamp}
```
