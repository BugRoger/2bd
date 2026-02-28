# Calendar: Reflect Daily

Generate reflection draft comparing planned meetings to actual outcomes with placeholders for user input.

## Context to Load

1. Read plan output: `vault/00_Brain/Synthetic/Assistants/calendar/{date}-plan-daily.md` or draft
2. Read capture note `vault/00_Brain/Captive/Today.md` — find `## Calendar` section
3. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Draft Generation

1. Extract planned meetings from plan output
2. Extract actual meeting notes from capture note if available
3. Generate variance analysis with placeholders for unknowns
4. Add placeholders for coaching questions about patterns

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/daily-reflect-draft.md`:

```markdown
## Calendar

**Planned Meetings:**
{Extract meetings from plan}

**From Today's Note:**
{Extract meeting notes from Today.md if available}

### Reflection

<!-- ASK:calendar-meetings-happened
How did your meetings go today? Any key outcomes?
-->

<!-- ASK:calendar-prep-effective
Were you adequately prepared for your meetings?
-->

<!-- ASK:calendar-unplanned
Any unplanned meetings or interruptions?
-->

<!-- ASK:calendar-energy
How was your energy across the day? Did the meeting density work?
-->

### Entity Learnings

{Auto-extract any people or projects mentioned}

<!-- ASK:calendar-entity-insights
Any insights about people or projects from today's meetings?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: calendar
action: reflect
timescale: daily
timestamp: {ISO timestamp}
---
```
