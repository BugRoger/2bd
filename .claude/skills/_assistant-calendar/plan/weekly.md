# Calendar: Plan Weekly

Generate week shape draft with placeholders for preparation needs.

## Context to Load

1. Fetch this week's calendar events
2. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Draft Generation

1. Analyze week shape:
   - Meeting density by day
   - Focus time availability
   - Key meetings to identify
   - Energy arc prediction

2. Generate draft with context and placeholders for preparation

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/weekly-draft.md`:

```markdown
## Calendar

### Week Shape

**Monday:** {X meetings, Y focus hours}
**Tuesday:** {X meetings, Y focus hours}
**Wednesday:** {X meetings, Y focus hours}
**Thursday:** {X meetings, Y focus hours}
**Friday:** {X meetings, Y focus hours}

**Busiest day:** {Day}
**Best focus day:** {Day}

### Key Meetings

{List important meetings with day and context}

<!-- ASK:calendar-prep-needs
Which meetings need preparation this week?
-->

<!-- ASK:calendar-concerns
Any scheduling concerns or conflicts?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: calendar
action: plan
timescale: weekly
timestamp: {ISO timestamp}
---
```
