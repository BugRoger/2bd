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

### 1. Read Configuration

```bash
config_file=".claude/skills/_sub/fetch-calendar/calendars.json"

if [[ ! -f "$config_file" ]]; then
    echo "# Calendar Events: Unavailable"
    echo ""
    echo "Configuration not found. Create $config_file with calendar aliases."
    exit 0
fi

calendars=$(jq -r '.calendars[]' "$config_file")
```

### 2. Parse Target Date

```bash
if [[ -n "$ARGUMENTS" ]]; then
    target_date="$ARGUMENTS"
else
    target_date=$(date +"%Y-%m-%d")
fi
```

### 3. Calculate Date Range

```bash
FROM=$(date -j -f "%Y-%m-%d" "$target_date" +"%Y-%m-%dT00:00:00%z")
TO=$(date -j -f "%Y-%m-%d" "$target_date" +"%Y-%m-%dT23:59:59%z")
```

### 4. Fetch Events

For each calendar alias:

```bash
for calendar in $calendars; do
    ekctl list events --calendar "$calendar" --from "$FROM" --to "$TO"
done
```

Collect JSON responses.

### 5. Format Output

Output natural markdown to stdout:

```markdown
# Calendar Events: 2026-02-16

You have 3 meetings scheduled:

**09:00-09:30** Team standup
- Conference Room A

**14:00-15:00** 1:1 with Sarah Chen
- This is a one-on-one meeting
- Zoom link: https://...

**16:00-17:00** Design review
- Conference Room B

**Focus time available:**
- 09:30-14:00 (4.5 hours)
- 15:00-16:00 (1 hour)

Total: 3 meetings, 1 one-on-one, 5.5 hours focus time
```

If no events:

```markdown
# Calendar Events: 2026-02-16

You have no meetings scheduled.

Focus time available: Full day (9 hours)
```

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
