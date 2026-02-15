# Pluggable Calendar Providers Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor fetch-calendar skill to support pluggable calendar providers with shared processing logic

**Architecture:** Extract current ekctl implementation into a provider file, create general dispatcher logic in SKILL.md that reads provider files and applies shared processing (1:1 detection, focus time calculation), move configuration to config.md

**Tech Stack:** Markdown prose-driven skills, ekctl CLI, bash date commands

---

## Task 1: Create Provider Directory Structure

**Files:**
- Create: `.claude/skills/_sub/fetch-calendar/providers/ekctl.md`

**Step 1: Create providers directory**

```bash
mkdir -p .claude/skills/_sub/fetch-calendar/providers
```

**Step 2: Extract ekctl implementation to provider file**

Read the current SKILL.md, extract all ekctl-specific logic (steps 1-3: config reading, date calculation, ekctl fetching), and write to `providers/ekctl.md`:

```markdown
---
name: ekctl-provider
description: Fetch calendar events from macOS Calendar using ekctl
---

# ekctl Calendar Provider

Fetches events from macOS Calendar using the ekctl CLI tool.

## Prerequisites

- ekctl installed at `/opt/homebrew/bin/ekctl`
- Calendar access granted to Terminal/Claude
- Calendar aliases configured in `.claude/config.md`

## Configuration

Read from `.claude/config.md`:
- `calendar_ekctl_aliases`: Array of calendar names to fetch from (e.g., ["work", "personal"])

## Execution

### 1. Read Configuration

```bash
# Read config.md and extract calendar_ekctl_aliases
cat .claude/config.md | grep -A 10 "### Calendar"
```

If no aliases configured, return error: "No calendar aliases configured. Add calendar_ekctl_aliases to .claude/config.md"

### 2. Fetch Events

For each alias in calendar_ekctl_aliases, run:

```bash
ekctl list events --calendar "$ALIAS" --from "$FROM" --to "$TO"
```

Example:
```bash
ekctl list events --calendar "work" --from "2026-02-15T00:00:00+0100" --to "2026-02-15T23:59:59+0100"
```

Collect JSON responses from all calendars.

### 3. Normalize Events

Merge events from all calendars into single array. For each event, extract:

```json
{
  "title": "string",
  "start": "ISO8601 datetime",
  "end": "ISO8601 datetime",
  "location": "string | null",
  "is_all_day": boolean,
  "attendees": ["email@example.com"] | null
}
```

Sort by start time (earliest first).

### 4. Return Event Array

Output the normalized event array as JSON to stdout.

## Error Handling

| Error | Response |
|-------|----------|
| ekctl not found | "ekctl not found. Install: brew install ekctl" |
| Calendar access denied | "Calendar access denied. Grant in System Settings > Privacy & Security > Calendars" |
| Calendar alias not found | Skip that alias, log warning |
```

**Step 3: Verify file created**

```bash
ls -la .claude/skills/_sub/fetch-calendar/providers/
cat .claude/skills/_sub/fetch-calendar/providers/ekctl.md | head -20
```

Expected: providers directory exists, ekctl.md contains provider implementation

**Step 4: Commit**

```bash
git add .claude/skills/_sub/fetch-calendar/providers/
git commit -m "feat(calendar): add ekctl provider implementation"
```

---

## Task 2: Refactor SKILL.md to Dispatcher

**Files:**
- Modify: `.claude/skills/_sub/fetch-calendar/SKILL.md`

**Step 1: Update frontmatter**

Replace the frontmatter in SKILL.md:

```yaml
---
name: fetch-calendar
description: Fetch calendar events using configured provider. Returns events with 1:1 detection and focus time calculation.
disable-model-invocation: true
allowed-tools: Read, Bash(*)
argument-hint: "[scope: today|tomorrow|week|month|YYYY-MM-DD] [format: json|markdown] [provider: ekctl]"
---
```

**Step 2: Write dispatcher logic**

Replace SKILL.md content with:

```markdown
# Fetch Calendar Sub-Skill

Fetches calendar events from the configured provider and applies processing logic (1:1 detection, focus time calculation, formatting).

## Arguments

Parse from `$ARGUMENTS`:

| Argument | Values | Default | Description |
|----------|--------|---------|-------------|
| scope | `today`, `tomorrow`, `week`, `month`, `YYYY-MM-DD` | `today` | Time range |
| format | `json`, `markdown` | `json` | Output format |
| provider | `ekctl`, etc. | from config | Provider override |

## Execution Steps

### 1. Determine Provider

Read `.claude/config.md`:

```bash
cat .claude/config.md | grep "calendar_provider:"
```

Extract the provider name (default: `ekctl`). If `provider` argument provided, use that instead.

### 2. Calculate Date Range

Based on scope argument, calculate FROM and TO timestamps:

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

**For `YYYY-MM-DD`:**
```bash
FROM=$(date -j -f "%Y-%m-%d" "$SCOPE" +"%Y-%m-%dT00:00:00%z")
TO=$(date -j -f "%Y-%m-%d" "$SCOPE" +"%Y-%m-%dT23:59:59%z")
```

### 3. Execute Provider

Read the provider implementation file:

```bash
cat .claude/skills/_sub/fetch-calendar/providers/${PROVIDER}.md
```

If file not found, return error: "Provider not found: ${PROVIDER}"

Follow the provider's instructions to fetch events. Provider returns normalized event array as JSON.

### 4. Process Events

Apply processing logic to the event array:

#### 4a. Detect 1:1 Meetings

For each event, set `is_one_on_one: true` if:
- Title contains "1:1", "1-1", or "one on one" (case-insensitive), OR
- Event has exactly one external attendee (not you)

#### 4b. Calculate Focus Blocks

Find gaps between meetings that are 30 minutes or longer. These are focus blocks.

Calculate total focus hours available.

#### 4c. Generate Summary

Count:
- `total_events`: All events
- `meetings`: Events that are not all-day
- `one_on_ones`: Events with `is_one_on_one: true`
- `all_day_events`: Events with `is_all_day: true`
- `focus_hours`: Total hours in focus blocks

### 5. Format Output

**JSON format:**

```json
{
  "scope": "today",
  "date_range": {
    "from": "2026-02-15T00:00:00+0100",
    "to": "2026-02-15T23:59:59+0100"
  },
  "events": [
    {
      "title": "Team Standup",
      "start": "2026-02-15T10:00:00+0100",
      "end": "2026-02-15T10:30:00+0100",
      "location": null,
      "is_all_day": false,
      "is_one_on_one": false,
      "attendees": ["team@example.com"]
    }
  ],
  "summary": {
    "total_events": 1,
    "meetings": 1,
    "one_on_ones": 0,
    "all_day_events": 0,
    "focus_hours": 7.5
  }
}
```

**Markdown format:**

```markdown
## Calendar: 2026-02-15 (Saturday)

### Meetings (1)
- **10:00-10:30** Team Standup

### All-Day Events
(none)

### Focus Time Available
- 09:00-10:00 (1h)
- 10:30-18:00 (7.5h)

**Summary:** 1 meeting, 0 one-on-ones, 0 all-day events, 8.5h focus time
```

### 6. Return Result

Output the formatted result.

## Error Handling

- Provider not found → "Provider not found: {name}"
- Provider execution fails → return error with context
- No events found → return empty array (not an error)
```

**Step 3: Verify file updated**

```bash
cat .claude/skills/_sub/fetch-calendar/SKILL.md | head -50
```

Expected: SKILL.md contains dispatcher logic, references provider files

**Step 4: Commit**

```bash
git add .claude/skills/_sub/fetch-calendar/SKILL.md
git commit -m "refactor(calendar): convert SKILL.md to provider dispatcher"
```

---

## Task 3: Update Configuration Format

**Files:**
- Read: `.claude/config.md`
- Delete: `.claude/skills/_sub/fetch-calendar/calendars.json`

**Step 1: Read current config**

```bash
cat .claude/config.md
```

Check if calendar configuration already exists.

**Step 2: Add calendar configuration**

Add to `.claude/config.md` (or update if exists):

```markdown
### Calendar
calendar_provider: ekctl
calendar_ekctl_aliases:
  - work
```

**Step 3: Verify calendars.json contents**

```bash
cat .claude/skills/_sub/fetch-calendar/calendars.json
```

Note any settings that should be preserved (aliases, patterns, etc.).

**Step 4: Delete calendars.json**

```bash
rm .claude/skills/_sub/fetch-calendar/calendars.json
```

**Step 5: Verify deletion**

```bash
ls -la .claude/skills/_sub/fetch-calendar/
```

Expected: calendars.json no longer exists

**Step 6: Commit**

```bash
git add .claude/config.md .claude/skills/_sub/fetch-calendar/calendars.json
git commit -m "refactor(calendar): move config to config.md, remove calendars.json"
```

---

## Task 4: Test with Daily Planning Ritual

**Files:**
- Test: `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 1: Run planning-daily**

```bash
cd ~/Code/2bd-engine
claude skill run rituals/planning-daily
```

Expected: Skill runs, fetches calendar using new provider architecture

**Step 2: Verify calendar.md generated**

Check if calendar events were fetched and processed correctly. Look for:
- Events listed with times
- 1:1 detection working
- Focus blocks calculated
- Summary generated

**Step 3: Check for errors**

If errors occur:
- Read error message
- Check provider file loaded correctly
- Verify config.md has calendar_ekctl_aliases
- Verify ekctl is installed and accessible

**Step 4: Run with different scopes**

```bash
claude skill run rituals/planning-daily "tomorrow"
claude skill run rituals/planning-daily "2026-02-20"
```

Expected: Each scope correctly calculates date range and fetches events

---

## Task 5: Update Documentation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `DEVELOPING.md`

**Step 1: Update CLAUDE.md**

Find the section about calendar configuration and update:

```markdown
### Calendar Provider

The system uses a pluggable calendar provider architecture. Configure in `.claude/config.md`:

```markdown
### Calendar
calendar_provider: ekctl
calendar_ekctl_aliases:
  - work
  - personal
```

**Adding providers:** Create a new file in `.claude/skills/_sub/fetch-calendar/providers/{provider}.md` following the provider contract.
```

**Step 2: Update README.md**

Find calendar setup instructions and update to reference `.claude/config.md` instead of `calendars.json`.

**Step 3: Update DEVELOPING.md**

Add section about creating calendar providers:

```markdown
### Creating Calendar Providers

To add a new calendar provider:

1. Create `.claude/skills/_sub/fetch-calendar/providers/{name}.md`
2. Implement the provider contract (fetch events, return normalized JSON)
3. Add provider-specific config keys to `.claude/config.md` as `calendar_{name}_*`
4. Update documentation

See `providers/ekctl.md` for reference implementation.
```

**Step 4: Verify documentation changes**

```bash
grep -n "calendar" CLAUDE.md
grep -n "calendar" README.md
grep -n "Calendar Provider" DEVELOPING.md
```

Expected: All references updated to new architecture

**Step 5: Commit**

```bash
git add CLAUDE.md README.md DEVELOPING.md
git commit -m "docs: update calendar provider documentation"
```

---

## Task 6: Final Verification

**Files:**
- Test: All calendar-dependent skills

**Step 1: Run weekly planning**

```bash
claude skill run rituals/planning-weekly
```

Expected: Calendar fetched successfully for week scope

**Step 2: Verify provider isolation**

Check that ekctl-specific logic only exists in `providers/ekctl.md`:

```bash
grep -r "ekctl" .claude/skills/_sub/fetch-calendar/SKILL.md
```

Expected: No matches (or only in comments/examples)

**Step 3: Test with provider override**

Test provider selection override (if time permits):

```bash
# In skill invocation, pass provider argument
# This tests the provider argument parsing
```

**Step 4: Check ritual dependencies**

Verify planning/review rituals that use fetch-calendar still work:

```bash
grep -r "fetch-calendar" .claude/skills/rituals/
```

All should continue working without changes.

**Step 5: Final commit**

```bash
git status
```

Expected: Working tree clean, all changes committed

---

## Success Criteria

- [ ] Provider directory structure created
- [ ] ekctl implementation in providers/ekctl.md
- [ ] SKILL.md refactored to dispatcher
- [ ] calendars.json deleted
- [ ] Configuration in .claude/config.md
- [ ] Daily planning ritual works
- [ ] Documentation updated
- [ ] All changes committed

---

## Future Work

- Add Outlook provider (providers/outlook.md)
- Add Google Calendar provider
- Support multiple active providers
- Add provider-specific settings validation
