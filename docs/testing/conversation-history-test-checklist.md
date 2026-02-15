# Conversation History Refactoring - Test Checklist

## Overview

This checklist validates the conversation history refactoring that eliminated session directories in favor of using conversation history as state.

**Date Created:** 2026-02-15
**Related Design:** `docs/plans/2026-02-15-conversation-history-design.md`

---

## Pre-Testing Setup

- [ ] Verify you're on the main branch (not in a worktree)
- [ ] Ensure vault path is configured in `.claude/config.md`
- [ ] Ensure calendar integration is configured (if testing planning-daily)
- [ ] Run `git status` to confirm clean working directory

---

## Unit Tests: Sub-Skills

### fetch-calendar

**Test 1: Basic Fetch**
```bash
claude skill run orchestration/fetch-calendar --args "2026-02-17"
```

**Expected:**
- [ ] Returns calendar events for the specified date
- [ ] No SESSION_DIR references in output
- [ ] No creation of `/tmp/2bd-session-*` directories
- [ ] Events formatted correctly

**Test 2: No Events**
```bash
claude skill run orchestration/fetch-calendar --args "2099-01-01"
```

**Expected:**
- [ ] Gracefully handles no events found
- [ ] Returns appropriate message or empty result
- [ ] No errors or crashes

---

### resolve-references

**Test 1: Directives Resolution**
```bash
claude skill run orchestration/resolve-references
```

**Expected:**
- [ ] Finds and reads directives from vault
- [ ] Returns absolute paths
- [ ] No SESSION_DIR references
- [ ] Gracefully handles missing directives

**Test 2: Week.md Resolution**
```bash
claude skill run orchestration/resolve-references --args "Week.md"
```

**Expected:**
- [ ] Finds Week.md in Captive directory
- [ ] Returns absolute path
- [ ] Reads content if file exists

**Test 3: People Files Resolution**
```bash
claude skill run orchestration/resolve-references --args "people:Sarah Chen,John Doe"
```

**Expected:**
- [ ] Searches for people files in vault
- [ ] Returns paths for found people
- [ ] Gracefully handles missing people files

---

## Integration Tests: Orchestrator

### Test 1: Context Assembly

Create a test skill that requests multiple context types:

```bash
# Manual test: Check orchestrator loads all requested context
# Expected: orchestrator spawns sub-skills, loads context into conversation
```

**Expected:**
- [ ] Orchestrator identifies needs from "What I Need" section
- [ ] Spawns appropriate sub-skills (fetch-calendar, resolve-references)
- [ ] All context loaded into conversation history
- [ ] No session directory created
- [ ] No memory.md file created

---

## End-to-End Tests: planning-daily

**Test 1: Basic Morning Planning**
```bash
claude skill run rituals/planning-daily
```

**Expected:**
- [ ] Orchestrator pre-loads all context
- [ ] Calendar events appear in conversation
- [ ] Week.md content appears in conversation
- [ ] Directives applied throughout
- [ ] Today.md created in Captive directory
- [ ] Today.md has correct structure (events, priorities, notes)
- [ ] No `/tmp/2bd-session-*` directories created
- [ ] No SESSION_DIR references in output
- [ ] Skill references context naturally ("Review the calendar")

**Test 2: Planning with People Files**
```bash
# Ensure you have 1:1 meetings scheduled with people who have files
claude skill run rituals/planning-daily
```

**Expected:**
- [ ] People files loaded for 1:1 meetings
- [ ] Context from people files used in planning
- [ ] No manual file loading in output
- [ ] Natural references to people context

**Test 3: Planning without Calendar**
```bash
# Temporarily disable calendar integration
claude skill run rituals/planning-daily
```

**Expected:**
- [ ] Gracefully handles missing calendar
- [ ] Still creates Today.md
- [ ] Suggests manual event entry or calendar setup
- [ ] No errors or crashes

---

## Regression Tests: Verify No Session References

### File System Check
```bash
# After running planning-daily, verify no session artifacts
ls /tmp/ | grep 2bd-session
```

**Expected:**
- [ ] No `/tmp/2bd-session-*` directories found

### Code Check
```bash
grep -r "SESSION_DIR" .claude/skills/
grep -r "memory.md" .claude/skills/
grep -r "/tmp/2bd-session" .claude/skills/
```

**Expected:**
- [ ] No SESSION_DIR references in skills
- [ ] No memory.md references in skills (except deprecation docs)
- [ ] No /tmp/2bd-session references

---

## Performance Tests

**Test 1: Multiple Runs**
```bash
# Run planning-daily 3 times in succession
claude skill run rituals/planning-daily
claude skill run rituals/planning-daily
claude skill run rituals/planning-daily
```

**Expected:**
- [ ] Each run completes successfully
- [ ] No accumulated state between runs
- [ ] Performance consistent across runs

---

## Documentation Verification

### README.md
- [ ] No references to session directories
- [ ] Orchestration section describes conversation history approach
- [ ] Examples show natural language context references

### DEVELOPING.md
- [ ] Prose-driven orchestration section updated
- [ ] No session directory references
- [ ] Examples show conversation history pattern

### CLAUDE.md
- [ ] Orchestration guidance updated
- [ ] No session directory references
- [ ] Context pre-loading pattern documented

---

## Cleanup Verification

### Old Sub-Skills Removed
- [ ] `orchestration/resolve-dates` deleted
- [ ] `orchestration/create-session` deleted
- [ ] No references to these skills in code or docs

### Old Design Docs Deprecated
- [ ] `docs/plans/2026-02-15-orchestrator-engine-design.md` has deprecation notice
- [ ] `docs/plans/2026-02-15-orchestrator-engine-implementation.md` has deprecation notice
- [ ] `docs/plans/2026-02-15-orchestrator-redesign-design.md` has deprecation notice
- [ ] `docs/plans/2026-02-15-orchestrator-redesign-implementation.md` has deprecation notice
- [ ] `docs/plans/2026-02-15-orchestrator-redesign-implementation-revised.md` has deprecation notice

---

## Testing Notes

**Testing in Worktree:**
- Most integration and end-to-end tests cannot run in worktree
- Unit tests (fetch-calendar, resolve-references) can be validated in worktree
- Full testing requires main branch with configured vault

**Completed in Worktree:**
- Code structure validation
- Documentation updates
- Regression checks (grep for old patterns)

**Requires Main Branch:**
- Full planning-daily execution
- Calendar integration tests
- Vault file resolution tests

---

## Test Results

**Date Tested:** _____________

**Tested By:** _____________

### Summary
- [ ] All unit tests passed
- [ ] All integration tests passed
- [ ] All end-to-end tests passed
- [ ] All regression tests passed
- [ ] All documentation verified
- [ ] All cleanup verified

### Issues Found
1. _____________
2. _____________
3. _____________

### Resolution
_____________
