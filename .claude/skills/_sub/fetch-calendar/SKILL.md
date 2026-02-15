---
name: get-calendar
description: Fetch calendar events from macOS Calendar using ekctl. Session mode reads from dates.md and writes natural markdown to calendar.md. Legacy mode accepts scope argument.
disable-model-invocation: true
allowed-tools: Read, Bash(*)
argument-hint: "[scope: today|tomorrow|week|month|YYYY-MM-DD] (only in legacy mode)"
---

# Get Calendar Sub-Skill

Fetches calendar events from macOS Calendar using the `ekctl` CLI tool. Returns structured data suitable for consumption by planning rituals.

## Prerequisites

This sub-skill requires:
1. **ekctl** installed (typically at `/opt/homebrew/bin/ekctl`)
2. Calendar access granted to Terminal/Claude
3. Aliases configured for calendars to fetch (see Setup in CLAUDE.md)

## Session Integration

This sub-skill integrates with orchestrated skills via session directory.

**Input:** Reads `${SESSION_DIR}/dates.md` to get:
- `target_date`: The date to fetch events for (YYYY-MM-DD)
- `scope`: The time scope (day/week/month)

**Output:** Writes `${SESSION_DIR}/calendar.md` with natural markdown format.

The orchestrator provides SESSION_DIR environment variable.

## Arguments

**Legacy mode (when SESSION_DIR not set):**

| Argument | Values | Default | Description |
|----------|--------|---------|-------------|
| scope | `today`, `tomorrow`, `week`, `month`, `monday`-`sunday`, `YYYY-MM-DD` | `today` | Time range to fetch |

Parse arguments from `$ARGUMENTS` if provided.

**Scope Resolution:**
- `today`, `tomorrow`, `week`, `month` - Relative to current date
- `monday`, `tuesday`, etc. - Next occurrence of that weekday (including today if it matches)
- `YYYY-MM-DD` - Specific date (e.g., `2026-02-14`)

**Session mode (when SESSION_DIR is set):**
No arguments needed. Reads target_date and scope from `${SESSION_DIR}/dates.md`.

## Execution Steps

### 1. Read Configuration

Read the skill's configuration file:

```bash
cat .claude/skills/_sub/fetch-calendar/calendars.json
```

Extract:
- `calendars`: Array of ekctl alias names to fetch from
- `settings.work_hours`: For focus time calculation
- `settings.one_on_one_patterns`: Patterns to identify 1:1s

If the config file doesn't exist or has no calendars configured, return an error with setup instructions.

### 2. Read Session Context

Check if running in session mode:

```bash
if [ -n "$SESSION_DIR" ] && [ -f "$SESSION_DIR/dates.md" ]; then
  # Session mode: read from dates.md
  target_date=$(grep "^target_date:" "$SESSION_DIR/dates.md" | cut -d' ' -f2)
  scope=$(grep "^scope:" "$SESSION_DIR/dates.md" | cut -d' ' -f2)
else
  # Legacy mode: use argument or default
  scope="${ARGUMENTS:-today}"
  # target_date will be calculated based on scope
fi
```

If SESSION_DIR is not set or dates.md doesn't exist, fall back to using argument directly (for backwards compatibility).

### 3. Calculate Date Range

Use the target_date (from session) or scope (from arguments) to calculate FROM/TO times for ekctl:

**If target_date is set (session mode):**
```bash
FROM=$(date -j -f "%Y-%m-%d" "$target_date" +"%Y-%m-%dT00:00:00%z")
TO=$(date -j -f "%Y-%m-%d" "$target_date" +"%Y-%m-%dT23:59:59%z")
```

For week/month scopes in session mode, adjust the date range:
- `week`: FROM = target_date, TO = target_date + 7 days
- `month`: FROM = first day of target_date's month, TO = last day of that month

**If using scope argument (legacy mode):**

**For `today`:**
```bash
FROM=$(date -v0H -v0M -v0S +"%Y-%m-%dT%H:%M:%S%z")
TO=$(date -v23H -v59M -v59S +"%Y-%m-%dT%H:%M:%S%z")
```

**For `tomorrow`:**
```bash
FROM=$(date -v+1d -v0H -v0M -v0S +"%Y-%m-%dT%H:%M:%S%z")
TO=$(date -v+1d -v23H -v59M -v59S +"%Y-%m-%dT%H:%M:%S%z")
```

**For `week`:**
```bash
FROM=$(date -v0H -v0M -v0S +"%Y-%m-%dT%H:%M:%S%z")
TO=$(date -v+7d -v23H -v59M -v59S +"%Y-%m-%dT%H:%M:%S%z")
```

**For `month`:**
```bash
FROM=$(date -v1d -v0H -v0M -v0S +"%Y-%m-%dT%H:%M:%S%z")
TO=$(date -v1d -v+1m -v-1d -v23H -v59M -v59S +"%Y-%m-%dT%H:%M:%S%z")
```

**For weekday (`monday`, `tuesday`, etc.):**

Calculate the next occurrence of that weekday (including today if it matches). Use the weekday name to determine the target date, then calculate FROM/TO for that single day:
```bash
# Example for "monday" - find next Monday's date, then use single-day range
FROM=$(date -v+Xd -v0H -v0M -v0S +"%Y-%m-%dT%H:%M:%S%z")  # where X = days until target weekday
TO=$(date -v+Xd -v23H -v59M -v59S +"%Y-%m-%dT%H:%M:%S%z")
```

**For specific date (`YYYY-MM-DD`):**

Parse the provided date and calculate the range for that single day:
```bash
# Example for "2026-02-14"
FROM=$(date -j -f "%Y-%m-%d" "2026-02-14" +"%Y-%m-%dT00:00:00%z")
TO=$(date -j -f "%Y-%m-%d" "2026-02-14" +"%Y-%m-%dT23:59:59%z")
```

### 3. Fetch Events from Each Calendar

For each calendar alias in the config, run:

```bash
ekctl list events --calendar "$ALIAS" --from "$FROM" --to "$TO"
```

Example:
```bash
ekctl list events --calendar "work" --from "2026-02-08T00:00:00+0100" --to "2026-02-08T23:59:59+0100"
```

Collect the JSON responses from each calendar.

### 4. Process and Transform

1. **Merge all events** from different calendars into a single array
2. **Sort by start time** (earliest first)
3. **Tag each event** with its source calendar alias
4. **Identify 1:1 meetings** by checking:
   - Title contains patterns from `one_on_one_patterns` (e.g., "1:1", "1-1")
   - Single external attendee
5. **Calculate focus blocks** (gaps between meetings of 30+ minutes within work hours)
6. **Generate summary** with counts and focus time

### 5. Write Output to Session

Generate natural markdown format and write to session (when SESSION_DIR is set):

```bash
cat > "${SESSION_DIR}/calendar.md" <<EOF
# Calendar Events: ${target_date}

$(generate_markdown_from_events)

EOF
```

**Markdown format** (natural prose for Claude):

```markdown
# Calendar Events: 2026-02-17

You have 3 meetings scheduled:

**09:00-09:30** Team standup
- Conference Room A

**14:00-15:00** 1:1 with Sarah Chen
- This is a one-on-one meeting

**16:00-17:00** Design review
- Conference Room B

**Focus time available:**
- 09:30-14:00 (4.5 hours)
- 15:00-16:00 (1 hour)

Total: 3 meetings, 1 one-on-one, 5.5 hours focus time
```

The format should be natural prose that Claude can easily read and understand, not structured JSON.

**If no events:**

```markdown
# Calendar Events: 2026-02-17

You have no meetings scheduled today.

Focus time available: Full day (9 hours)
```

**Legacy mode (when SESSION_DIR not set):**

Output to stdout in the same markdown format for backwards compatibility.

## Error Handling

| Error | Response |
|-------|----------|
| ekctl not installed | Return error with: "ekctl not found. Install with: brew install ekctl" |
| Calendar alias not found | Skip calendar, include warning in output |
| No calendars configured | Return error with setup instructions pointing to CLAUDE.md |
| Calendar access denied | Return error with: "Calendar access denied. Grant permission in System Settings > Privacy & Security > Calendars" |
| No events in range | Return empty events array with summary showing 0 counts |

## Usage by Other Skills

**Session-based orchestration (recommended):**

Orchestrated skills specify calendar needs in "What I Need" prose. The orchestrator automatically:
1. Creates session directory
2. Resolves dates to target_date
3. Invokes fetch-calendar with SESSION_DIR
4. Calendar output appears in `${SESSION_DIR}/calendar.md`

Example from a planning skill's phases.yaml:

```yaml
- name: gather
  type: explore
  subagents:
    - skill: _sub/fetch-calendar
      args: ""  # No args needed, reads from session
```

**Legacy direct invocation:**

```markdown
**Use sub-skill: `_sub/fetch-calendar`**
- Scope: today

Use the calendar events to:
1. Pre-populate the Meetings section with scheduled meetings
2. Identify 1:1s and use the 1:1 template format
3. Calculate focus blocks for deep work planning
4. Set the `meetings` count in frontmatter
```
