---
name: test-orchestrator
description: Test skill for validating prose-driven orchestration
---

# Test Orchestrator

Minimal test to verify the new orchestrator works end-to-end.

## What I Need

- Calendar events for the day
- Week.md for weekly context

## Test Session

Read memory.md first to see what context is available.

Show what external data files exist (calendar.md, etc.).

Show what vault file references are available (Week.md path).

If calendar.md exists, report how many events were found.

If Week.md path exists, confirm that it's available for loading.

Report on session structure:
- Session directory location
- Files present in session
- Whether dates were resolved correctly

Finally, confirm: "Orchestrator is working - prose-driven context assembly successful!"

---

## Expected Behavior

When this skill runs successfully, you should see:

1. **Session Creation**
   - A temp directory created at `/tmp/2bd-session-test-orchestrator-{timestamp}`
   - Session directory path reported

2. **Date Resolution**
   - dates.md created with target_date (defaults to today)
   - Scope and relative time expression captured

3. **Need Fulfillment**
   - fetch-calendar spawned to get calendar events
   - resolve-references spawned to find Week.md path

4. **Memory Assembly**
   - memory.md created as index
   - Lists calendar.md (external data) if available
   - Lists Week.md full path (vault reference) if available
   - Shows availability status (✓ or ✗)

5. **Inline Execution**
   - This "Test Session" section executes
   - memory.md is read
   - Context is reported
   - Success message displayed

## Testing Notes

This skill is intentionally minimal to isolate orchestration mechanics:

- Uses simple, common needs (calendar, Week.md)
- No complex entity resolution
- No user interaction required
- Clear success/failure indicators

If this works, the orchestrator infrastructure is functional.

## Debugging

If the test fails, check:

- Session directory contents: `ls -la /tmp/2bd-session-test-orchestrator-*`
- memory.md contents: `cat /tmp/2bd-session-test-orchestrator-*/memory.md`
- dates.md contents: `cat /tmp/2bd-session-test-orchestrator-*/dates.md`
- calendar.md existence: `ls /tmp/2bd-session-test-orchestrator-*/calendar.md`

Look for:
- Are sub-skills being spawned?
- Is memory.md being created?
- Are file paths correct?
- Does the inline phase receive session context?
