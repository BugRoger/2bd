# Orchestrator: Conversation History as State

**Date:** 2026-02-15
**Status:** Design
**Context:** Simplify orchestration by eliminating session directories. Use conversation history as global state.

---

## Problem

The current orchestrator design uses temporary session directories (`/tmp/2bd-session-*`) as intermediate state:
- Sub-agents write files (calendar.md, dates.md, memory.md)
- Orchestrator reads files and loads into conversation
- Skills reference session files

This doubles file I/O (write to session, read into conversation) and adds cleanup complexity. Session directories duplicate what already exists in conversation history.

**Goal:** Use conversation history as the single source of truth. Eliminate intermediate files.

---

## Design

### Core Principle

Conversation history is state. Sub-agents return data via Task tool results. Orchestrator loads all context into conversation before executing the skill.

### Architecture Flow

```
User runs skill with orchestrated: true
    ↓
Hook prepends orchestrator SKILL.md
    ↓
Orchestrator reads skill's ## Context section
    ↓
Orchestrator resolves date arguments (tomorrow → 2026-02-16)
    ↓
Orchestrator spawns sub-agents in parallel via Task tool
    ↓
Sub-agents return structured data via tool results
    ↓
Orchestrator loads all context into conversation:
  - Posts sub-agent results (calendar, paths)
  - Reads vault files using Read tool
    ↓
Orchestrator posts context summary message
    ↓
Skill executes with all context in conversation
    ↓
Skill references context naturally
```

### What Changes

**Removed:**
- `/tmp/2bd-session-*` directories
- `memory.md` file (replaced by summary message)
- `dates.md` file (orchestrator resolves dates directly)
- `calendar.md` file (calendar data posted to conversation)
- `create-session` sub-skill (no sessions needed)
- `resolve-dates` sub-skill (orchestrator handles dates)

**Changed:**
- Sub-agents return data via Task results (not files)
- Orchestrator posts summary message (not memory.md file)
- Skills reference "## Context" section (renamed from "What I Need")

**Unchanged:**
- Orchestrator SKILL.md (prose instructions, but rewritten)
- Hook-based injection (`orchestrated: true` frontmatter)
- Sub-agents (fetch-calendar, resolve-references)
- Skills remain pure prose

---

## Orchestrator Flow (Detailed)

### Step 1: Parse Context Section

Read skill's `## Context` section:
```markdown
## Context

- Calendar events for the day
- User's directives and preferences
- Week.md for weekly context
- People files for anyone with 1:1 meetings
- Active project files
```

Orchestrator interprets prose using Claude's natural understanding.

### Step 2: Resolve Date Arguments

Use Claude's date understanding directly:
- Empty → today (2026-02-15)
- "tomorrow" → 2026-02-16
- "next monday" → 2026-02-17
- "YYYY-MM-DD" → exact date

Post to conversation:
```
Target date: 2026-02-16 (tomorrow)
Scope: day
```

### Step 3: Spawn Sub-Agents (Parallel)

Interpret context needs and spawn sub-agents:

**For calendar events:**
```
Task(
  subagent_type: "Explore",
  description: "Fetch calendar events",
  prompt: "Fetch calendar events for 2026-02-16"
)
```

**For vault files, people, projects:**
```
Task(
  subagent_type: "Explore",
  description: "Resolve vault references",
  prompt: "Resolve vault paths for: Week.md, People files from calendar, Active projects"
)
```

Spawn all in parallel (single message, multiple Task calls).

### Step 4: Capture Results

**fetch-calendar returns:**
```markdown
# Calendar Events: 2026-02-16

## 09:00 - 10:00: 1:1 with Sarah Chen
Location: Zoom

## 14:00 - 15:00: Sprint Planning
Attendees: 8 people
```

**resolve-references returns:**
```markdown
## Vault Files
- Week.md: /vault/00_Brain/Captive/Week.md ✓
- Month.md: /vault/00_Brain/Captive/Month.md ✓

## People (from calendar 1:1s)
- Sarah Chen: /vault/02_Areas/People/Sarah Chen.md ✓

## Projects (active)
- quarterly-planning: /vault/01_Projects/2026-03-31-quarterly-planning.md ✓
```

### Step 5: Load Context Into Conversation

1. Post calendar data (from fetch-calendar result)
2. Read vault files using paths from resolve-references
3. Post summary message:

```markdown
## Context Available

**Calendar:** 3 events for 2026-02-16
**Vault files:** Week.md, Month.md (loaded)
**People:** Sarah Chen (loaded)
**Projects:** quarterly-planning (loaded)
```

### Step 6: Execute Skill

Skill prose executes with all context in conversation:
```markdown
## Planning Session

Greet the user.

Review the calendar - what meetings are scheduled?
Check Week.md - what are the weekly goals?
For each 1:1, review the person's file.
```

Skills reference context naturally. All context is present in conversation history.

---

## Sub-Agent Interface Changes

### fetch-calendar

**Before:** Writes to `$SESSION_DIR/calendar.md`

**After:** Returns markdown via output

**Interface:**
- Input: target_date (2026-02-16)
- Output: Markdown with calendar events

**Return format:**
```markdown
# Calendar Events: 2026-02-16

## 09:00 - 10:00: 1:1 with Sarah Chen
Location: Zoom
```

**Error case:**
```markdown
# Calendar Events: Unavailable

Calendar integration not configured. Run `ekctl config` to set up.
```

### resolve-references

**Before:** Reads `$SESSION_DIR/dates.md`, writes paths to session

**After:** Receives prose needs + date, returns structured paths

**Interface:**
- Input: Context prose, target_date, calendar_output (optional)
- Output: Markdown with categorized paths

**Return format:**
```markdown
## Vault Files
- Week.md: /vault/00_Brain/Captive/Week.md ✓
- Month.md: /vault/00_Brain/Captive/Month.md ✗ (not found)

## People (from calendar 1:1s)
- Sarah Chen: /vault/02_Areas/People/Sarah Chen.md ✓

## Projects (active)
- quarterly-planning: /vault/01_Projects/2026-03-31-quarterly-planning.md ✓
```

Status: ✓ (exists) or ✗ (missing)

### resolve-dates

**Removed** - orchestrator resolves dates directly using Claude.

### create-session

**Removed** - no session directories needed.

---

## Error Handling

### Error Categories

**Blocking errors (stop execution):**
- Skill has `orchestrated: true` but no `## Context` section
- Invalid frontmatter syntax
- Orchestrator SKILL.md malformed

**Graceful errors (note in summary, continue):**
- Calendar unavailable
- QMD not configured
- Vault files missing
- People files not found
- Projects not found
- Sub-agent spawn failure

### Graceful Degradation

When sub-agent fails or returns unavailable, orchestrator posts in summary:

```markdown
## Context Available

**Calendar:** ❌ Unavailable (ekctl not configured)
**Vault files:** Week.md (loaded), Month.md ❌ (not found)
**People:** Sarah Chen (loaded), John Doe ❌ (not found)
**Projects:** None active
```

Skills adapt naturally:
```markdown
## Planning Session

Read the context summary.

If calendar is available, review scheduled meetings.
If not, ask what meetings the user has today.
```

Skills check context and adapt conversation flow.

### Sub-Agent Error Returns

**fetch-calendar failure:**
```markdown
# Calendar Events: Unavailable

Error: ekctl not configured.
```

**resolve-references partial failure:**
```markdown
## Vault Files
- Week.md: /vault/00_Brain/Captive/Week.md ✓
- Month.md: /vault/00_Brain/Captive/Month.md ✗ (file not found)
```

Orchestrator reads only files marked ✓. Includes error status in summary.

### Context Loading Failures

If Read tool fails on vault file:
1. Note in summary: "Week.md ❌ (read permission error)"
2. Continue loading remaining context
3. Skill sees summary, adapts

---

## Skill Writing Pattern

### Frontmatter Declaration

```yaml
---
name: planning-daily
description: Morning ritual for planning the day
orchestrated: true
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---
```

### Context Declaration

```markdown
## Context

- Calendar events for the day
- User's directives and preferences
- Week.md for weekly context
- Month.md for monthly context
- People files for anyone with 1:1 meetings
- Active project files
```

Prose, not structured data. Orchestrator interprets using Claude.

### Skill Prose

```markdown
## Planning Session

Read the context summary to see what's available.

Greet the user using their preferred name from directives.

Review the calendar - what meetings are scheduled?
Check Week.md - what are the weekly goals?
For each 1:1 meeting, review that person's file.

Ask the user:
- What's the leadership intention for today?
- What are the top 2-3 priorities?

Write Today.md to Captive with priorities and meeting sections.
```

Skills remain pure prose:
- No orchestration mechanics
- No session directory references
- No manual path resolution
- Natural references to "the calendar", "Week.md", "directives"

### Context References

**Good:**
- "Review the calendar"
- "Check Week.md for weekly goals"
- "For each person in calendar 1:1s, review their file"

**Bad:**
- "Load calendar.md from session"
- "Read $SESSION_DIR/calendar.md"
- "Parse memory.md to find Week.md path"

### Adaptation Pattern

```markdown
## Planning Session

Read the context summary.

If calendar is available:
  - Review scheduled meetings
  - Pre-populate meeting sections

If calendar is unavailable:
  - Ask what meetings the user has today
  - Guide manual entry
```

Natural conditional flow based on context summary.

---

## Migration Strategy

### Phase 1: Update Sub-Agents

1. **fetch-calendar**: Return markdown instead of writing calendar.md
2. **resolve-references**: Return structured paths instead of session files
3. **Remove**: resolve-dates sub-skill
4. **Remove**: create-session sub-skill

Update each independently. Test in isolation.

### Phase 2: Update Orchestrator SKILL.md

1. Rewrite prose for conversation-based orchestration
2. Remove session directory steps
3. Add date resolution instructions
4. Add context loading instructions
5. Update summary format

### Phase 3: Update Skills

1. Rename `## What I Need` → `## Context`
2. Review skill prose for session references
3. Test each skill

Currently only planning-daily uses orchestration.

### Phase 4: Update Documentation

1. **CLAUDE.md**: Update prose-driven orchestration section
2. **DEVELOPING.md**: Update orchestration flow, sub-skill patterns
3. Remove session directory references
4. Add conversation history patterns

### Phase 5: Cleanup

1. Remove session cleanup logic
2. Remove old design documents
3. Verify no `/tmp/2bd-session-*/` references remain

**Backward compatibility:** Skills without `orchestrated: true` work unchanged.

**Rollback:** Disable hook or set `orchestrated: false` in skill frontmatter.

---

## Benefits

| Benefit | Description |
|---------|-------------|
| **Simpler architecture** | No session directories, no cleanup logic |
| **Single source of truth** | Conversation history is state |
| **Easier to debug** | Everything visible in conversation transcript |
| **Less I/O** | No double-write (session then conversation) |
| **Skills stay pure** | No orchestration mechanics in skill prose |
| **Graceful degradation** | Skills adapt to missing context naturally |

---

## Success Criteria

- [ ] Hook triggers on `orchestrated: true`
- [ ] Orchestrator resolves dates directly
- [ ] Sub-agents return data via Task results
- [ ] Orchestrator loads all context into conversation
- [ ] Summary message communicates availability
- [ ] Skills execute with context in conversation
- [ ] Skills remain unaware of orchestration
- [ ] Graceful degradation for missing context
- [ ] No session directories created
- [ ] Documentation reflects conversation-based design

---

## Next Steps

1. Write implementation plan
2. Update fetch-calendar sub-agent
3. Update resolve-references sub-agent
4. Remove resolve-dates and create-session
5. Rewrite orchestrator SKILL.md
6. Test with planning-daily
7. Update documentation
