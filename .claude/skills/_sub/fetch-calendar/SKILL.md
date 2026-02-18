---
name: fetch-calendar
description: Fetch calendar events from macOS Calendar using ekctl. Returns natural markdown via Task tool result.
disable-model-invocation: true
argument-hint: "[target_date: YYYY-MM-DD]"
---

# Fetch Calendar

Fetch calendar events from macOS Calendar using ekctl. Returns events as natural markdown.

## Prerequisites

- **ekctl** installed (`/opt/homebrew/bin/ekctl`)
- Calendar access granted
- Calendars configured in `.claude/skills/_sub/fetch-calendar/calendars.json`

## Input

**Argument:** `target_date` (YYYY-MM-DD format)

If no argument provided, default to today.

## Execution

Read the calendar configuration from `.claude/skills/_sub/fetch-calendar/calendars.json`. If the configuration doesn't exist, output a message indicating configuration is not found and suggest creating the file.

Parse the target date argument. If no argument is provided, default to today's date.

Calculate the date range for the target date, from 00:00:00 to 23:59:59.

For each calendar alias in the configuration, fetch events using ekctl with this exact command syntax:

```bash
/opt/homebrew/bin/ekctl list events --calendar CALENDAR_ALIAS --from "YYYY-MM-DDTHH:MM:SS+TZ" --to "YYYY-MM-DDTHH:MM:SS+TZ"
```

**Important:** The command must be:
- `ekctl list events` (not `ekctl list`)
- Use `--from` and `--to` flags (not `--start` and `--end`)
- Include timezone offset in ISO8601 format (e.g., `+01:00` or `+00:00`)
- No `--format` flag needed (JSON is default output)

Example:
```bash
/opt/homebrew/bin/ekctl list events --calendar work --from "2026-02-16T00:00:00+01:00" --to "2026-02-16T23:59:59+01:00"
```

Collect all JSON responses from each calendar.

Format the output as natural markdown showing the count of meetings, details for each meeting including time, title, and location, focus time available between meetings, and a summary line. If no events are found, indicate no meetings are scheduled and show full day focus time available.

Return markdown via stdout. The orchestrator captures this output and loads it into the conversation.

## Error Handling

If ekctl not installed:

```markdown
# Calendar Events: Unavailable

ekctl not found. Install: brew install ekctl
```

If calendar access denied:

```markdown
# Calendar Events: Unavailable

Calendar access denied. Grant permission in System Settings > Privacy & Security > Calendars
```

If calendars.json missing:

```markdown
# Calendar Events: Unavailable

Configuration not found. Create .claude/skills/_sub/fetch-calendar/calendars.json
```

## Output

Returns markdown via stdout. Orchestrator captures this via Task tool result and loads into conversation.
