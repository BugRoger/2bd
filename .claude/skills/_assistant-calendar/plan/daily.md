# Calendar: Plan Daily

Prepare draft with today's meetings and placeholders for unknowns.

## Context to Load

1. Fetch today's calendar events using [Fetch Events](../SKILL.md#fetch-events)
2. Read person dossiers for key attendees from `vault/00_Brain/Semantic/People/`
3. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Draft Generation

1. Analyze meetings:
   - List all meetings with times
   - Identify important meetings (1:1s, critical decisions)
   - Calculate focus time available

2. For important meetings, gather context:
   - Read attendee dossiers if available
   - Check for related project files
   - Review previous meeting notes

3. Generate draft section with placeholders for unknowns

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/daily-draft.md`:

```markdown
## Calendar

**Today's Meetings**

9:00am - Sprint Planning
- Attendees: Team (5 people)
- Context: Weekly sprint planning session

<!-- ASK:calendar-sprint-prep
Do you need to prepare anything specific for Sprint Planning?
-->

2:00pm - 1:1 with Sarah
- Attendees: Sarah (Engineering Manager)
- Context: Regular 1:1 check-in

<!-- ASK:calendar-sarah-topics
What do you want to discuss with Sarah today?
-->

**Focus Time:** 4 hours available (10am-12pm, 3pm-5pm)

<!-- ASK:calendar-focus-block
What will you work on during focus time?
-->
```

## Status

Write status to draft frontmatter:
```
---
status: ok
assistant: calendar
action: plan
timescale: daily
timestamp: {ISO timestamp}
---
```

## Observations

Track patterns in draft under `## Observations` section:
- Meeting density trends
- Focus time availability
- Recurring meeting patterns
