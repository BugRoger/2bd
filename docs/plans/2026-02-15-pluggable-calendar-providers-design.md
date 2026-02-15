# Pluggable Calendar Provider Architecture

**Date:** 2026-02-15
**Status:** Design
**Context:** Make calendar fetching provider-agnostic to support multiple calendar sources

---

## Problem

The current fetch-calendar skill couples tightly to ekctl and macOS Calendar. Adding Outlook or other providers requires duplicating all processing logic.

---

## Solution

Refactor fetch-calendar into a provider-agnostic dispatcher with pluggable backends.

---

## Architecture

### Structure

```
_sub/fetch-calendar/
  ├─ SKILL.md          # Dispatch + processing logic (prose)
  └─ providers/
      └─ ekctl.md      # ekctl fetch implementation
```

### Flow

1. Parse arguments (scope, format, provider)
2. Determine active provider from config or argument
3. Calculate date range from scope
4. Read and execute provider file
5. Normalize provider response to event array
6. Process events (detect 1:1s, calculate focus time)
7. Format output (markdown or JSON)
8. Return result

### Provider Selection

The orchestrator reads `.claude/config.md` to determine which provider to use. Skills declare "Calendar events for the day" in their needs. The orchestrator spawns the configured provider.

---

## Configuration

### In `.claude/config.md`

```markdown
### Calendar
calendar_provider: ekctl
calendar_ekctl_aliases:
  - work
```

Provider-specific settings live under `calendar_{provider}_*` keys.

### General Processing (prose in SKILL.md)

- **1:1 detection:** Title contains "1:1", "1-1", or "one on one", OR single external attendee
- **Focus blocks:** Gaps between meetings ≥30 minutes
- **Summary:** Count total events, meetings, 1:1s, all-day events, focus hours

### Migration

Delete `calendars.json`. Read settings from config.md instead.

---

## Provider Contract

Providers return an array of events:

```json
{
  "title": "Meeting name",
  "start": "2026-02-15T10:00:00+0100",
  "end": "2026-02-15T11:00:00+0100",
  "location": "Conference Room A" | null,
  "is_all_day": false,
  "attendees": ["person@example.com"] | null
}
```

SKILL.md processes this standard format into the final output.

---

## Error Handling

- Provider not found → clear error message
- Provider execution fails → return error with context
- No events found → return empty array (not an error)
- Providers handle their own specific errors

---

## Benefits

- Add providers by creating a new .md file
- Processing logic written once in prose
- Easy to adjust behavior (edit SKILL.md prose)
- Minimal provider-specific config
- Orchestrator handles provider selection automatically

---

## Implementation Scope

**Included:**
- Refactor fetch-calendar to provider architecture
- Extract ekctl logic to providers/ekctl.md
- Move calendars.json settings to config.md
- Update documentation

**Not included:**
- Outlook provider (future work)
- Other calendar providers

---

## Next Steps

1. Create implementation plan
2. Refactor SKILL.md with general logic
3. Create providers/ekctl.md
4. Update config.md format
5. Delete calendars.json
6. Test with existing rituals
7. Update CLAUDE.md and README.md
