# ekctl Provider

Fetch calendar events using ekctl (macOS Calendar CLI).

## Prerequisites

- `/opt/homebrew/bin/ekctl` installed
- Calendar access granted in System Settings > Privacy & Security > Calendars

## Fetch Events

**Input:**
- `target_date` — YYYY-MM-DD format (default: today)
- `calendars` — list from config.yaml

**Command per calendar:**

```bash
/opt/homebrew/bin/ekctl list events \
  --calendar CALENDAR_ALIAS \
  --from "YYYY-MM-DDTHH:MM:SS+TZ" \
  --to "YYYY-MM-DDTHH:MM:SS+TZ"
```

**Example:**

```bash
/opt/homebrew/bin/ekctl list events --calendar work --from "2026-02-22T00:00:00+01:00" --to "2026-02-22T23:59:59+01:00"
```

**Output:** JSON array of events

**Important:**
- Use `--from` and `--to` (not `--start`/`--end`)
- Include timezone offset in ISO8601 format (e.g., `+01:00`)
- No `--format` flag needed (JSON is default)

## Error Handling

**ekctl not found:**
```markdown
# Calendar Events: Unavailable

ekctl not found. Install: brew install ekctl
```

**Calendar access denied:**
```markdown
# Calendar Events: Unavailable

Calendar access denied. Grant permission in System Settings > Privacy & Security > Calendars
```

**Config missing:**
```markdown
# Calendar Events: Unavailable

Configuration not found. Ensure config.yaml exists in $VAULT/00_Brain/Systemic/Config/
```
