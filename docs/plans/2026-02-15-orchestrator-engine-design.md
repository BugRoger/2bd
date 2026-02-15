> **DEPRECATED:** This design was superseded by conversation-history-design.md. Session directories were eliminated in favor of conversation history as state.

# Orchestrator Engine: Hook-Based Prose Orchestration

**Date:** 2026-02-15
**Status:** Design (Deprecated)
**Context:** Implementing the orchestrator engine to make prose-driven orchestration functional

---

## Problem

The prose-driven orchestration infrastructure is complete (sub-skills, session patterns, migrated skills), but the orchestrator engine—the coordination logic—doesn't exist yet.

**What we have:**
- ✅ Sub-skills: create-session, resolve-dates, resolve-references, fetch-calendar
- ✅ Migrated skill: planning-daily with "What I Need" pattern
- ✅ Documentation: CLAUDE.md and DEVELOPING.md updated

**What's missing:**
- ❌ Orchestrator engine to read "What I Need" and coordinate sub-skills
- ❌ Integration point to inject orchestration into skill execution

**Core question:** How does orchestration happen automatically when a skill declares `orchestrated: true`?

---

## Design Decisions

### Decision 1: Orchestrator as Prose Instructions for Claude

**Chosen approach:** The orchestrator is **prose instructions for Claude (the LLM)**, not executable code.

**Rationale:**
- Aligns with "pure prose" design philosophy
- Skills remain completely unaware of orchestration mechanics
- Claude naturally interprets prose and spawns sub-skills via Task tool
- No Python/JavaScript dependencies—just markdown

**How it works:**
1. User runs skill with `orchestrated: true` in frontmatter
2. Orchestrator SKILL.md gets prepended to conversation as instructions
3. Claude reads: "You are orchestrating. Create session, spawn sub-skills, build memory.md"
4. Claude follows instructions naturally
5. Skill executes with session context available

---

### Decision 2: Hook-Based Integration

**Chosen approach:** Use `SkillExecution:orchestrate` hook to detect and inject orchestration.

**Rationale:**
- Follows existing hook pattern (SessionStart, etc.)
- Clean separation—hook handles detection, orchestrator handles coordination
- No CLI code complexity
- Easy to disable (remove hook)

**Hook implementation:**
```bash
#!/bin/bash
# .claude/hooks/skill-execution-orchestrate.sh

skill_file="$1"

# Check frontmatter for orchestrated: true
if grep -q "^orchestrated: true" "$skill_file"; then
  # Inject orchestrator instructions as preamble
  cat .claude/skills/_core/orchestrator/SKILL.md
fi

exit 0
```

**Hook trigger:** Before skill execution, after skill file is read
**Hook output:** Prepended to conversation context if `orchestrated: true`

---

### Decision 3: Frontmatter Opt-In

**Detection method:** Frontmatter metadata (not prose markers)

**Skill frontmatter:**
```yaml
---
name: planning-daily
description: Morning ritual for planning the day
orchestrated: true  # ← Enables orchestration
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---
```

**Benefits:**
- ✅ Explicit opt-in
- ✅ Follows existing frontmatter patterns
- ✅ No ambiguity from prose markers
- ✅ Easy to disable (remove or set to `false`)

---

## Architecture

### Flow Diagram

```
User: claude skill run rituals/planning-daily tomorrow
    ↓
Claude Code CLI detects "orchestrated: true" in frontmatter
    ↓
SkillExecution:orchestrate hook triggers
    ↓
Hook prepends orchestrator SKILL.md to conversation
    ↓
Claude reads orchestrator instructions + skill content
    ↓
Claude orchestrates:
  - Creates session via create-session
  - Resolves dates via resolve-dates
  - Spawns sub-skills in parallel (fetch-calendar, resolve-references)
  - Builds memory.md with available context
    ↓
Claude executes planning-daily prose
  - Skill reads memory.md
  - Skill loads session files (calendar.md, etc.)
  - Skill remains unaware of orchestration
    ↓
Session cleanup (keep last N for debugging)
```

---

## Orchestrator SKILL.md Content

**Purpose:** Prose instructions that tell Claude how to orchestrate.

### Section 1: Detection & Context Setup

```markdown
# Orchestrator Instructions

You are orchestrating a skill with context needs. Before executing the skill's main content:

1. Note the skill name and arguments provided
2. Check if the skill has "## What I Need" section
3. If yes, proceed with orchestration setup
```

### Section 2: Session Creation

```markdown
## Create Session

Use the create-session sub-skill:
- Spawn Task with skill: _sub/create-session
- Pass skill name as argument
- Capture session directory path in $SESSION_DIR
- Export SESSION_DIR environment variable for all subsequent operations
```

### Section 3: Date Resolution

```markdown
## Resolve Dates

Use resolve-dates sub-skill with the skill's arguments:
- Spawn Task with skill: _sub/resolve-dates
- Pass original arguments (e.g., "tomorrow", "next monday")
- Sub-skill writes dates.md to session directory
- Contains: target_date, scope, week context if applicable
```

### Section 4: Need Interpretation

```markdown
## Parse Needs

Read the "## What I Need" section. For each bullet, determine strategy:

| Need Pattern | Action |
|--------------|--------|
| "Calendar events" | Spawn _sub/fetch-calendar |
| "Week.md", "Month.md", "Quarter.md" | Resolve vault paths |
| "People files for 1:1s" | Parse calendar, spawn resolve-references |
| "Active project files" | Spawn resolve-references with project scope |
| "QMD search" | Spawn _sub/fetch-resources |
| "User's directives" | Resolve directives path |
```

### Section 5: Parallel Fulfillment

```markdown
## Spawn Sub-Skills

Spawn all sub-skills in parallel using Task tool:
- Set SESSION_DIR environment variable
- Each sub-skill writes output to session
- Wait for all to complete before proceeding
```

### Section 6: Memory Assembly

```markdown
## Build Memory Index

Write memory.md to session summarizing:
- What external data is available (calendar.md, resources.md)
- What vault paths were resolved (with ✓ or ✗ status)
- What's missing or optional

Memory.md is the index—the skill reads it first to see what's available.
```

### Section 7: Execution Handoff

```markdown
## Execute Skill

Now execute the skill's inline prose:
- SESSION_DIR is set and available
- All session files exist
- Skill prose naturally references memory.md and session files
- Skill remains unaware of orchestration mechanics
```

---

## Error Handling

### Error Categories

**Blocking Errors (stop execution):**
- Session creation failed
- Date resolution failed (invalid argument)
- No "What I Need" section when `orchestrated: true`

**Graceful Errors (note in memory.md, continue):**
- Calendar unavailable (ekctl not configured)
- QMD not configured
- Vault files missing (Week.md, People/*.md)
- People/project files not found

### Error Strategy

**Sub-skill failure:** Note in memory.md, continue
```markdown
# Session Memory: planning-daily (2026-02-17)

## External Data Available
### Calendar Events
❌ Unavailable: ekctl not configured

## Vault Files Available
### Working Notes
- **Week.md**: /vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /vault/00_Brain/Captive/Month.md ✗ (not found)
```

**Skill adaptation:** Skill prose checks memory.md and adapts
```markdown
## Planning Session

Read memory.md to see what context is available.

If calendar is unavailable, note that and proceed without it.
If QMD is unavailable, note that and proceed without it.
```

---

## Session Lifecycle

**Creation:**
- Created at skill invocation via create-session
- Path: `/tmp/2bd-session-{skillname}-{timestamp}/`
- Timestamp ensures uniqueness for multiple runs

**Structure:**
```
/tmp/2bd-session-planning-daily-20260215183042/
├── memory.md              # Index of available context
├── dates.md               # Resolved time context (internal)
├── calendar.md            # External: fetched calendar events
└── resources.md           # External: QMD search results
```

**During Execution:**
- Session directory persists
- All sub-skills write to it
- Skill reads from it naturally
- No cleanup during execution

**After Execution:**
- Keep last N sessions for debugging (configurable, default 10)
- Auto-cleanup older sessions
- User can set: `SESSION_RETENTION=20` in config
- Manual cleanup: `claude skill cleanup-sessions`

**Manual Inspection:**
```bash
# List recent sessions
ls -lt /tmp/2bd-session-* | head -10

# Inspect a session
cat /tmp/2bd-session-planning-daily-20260215183042/memory.md
cat /tmp/2bd-session-planning-daily-20260215183042/calendar.md
```

---

## Testing Strategy

**Unit Testing (Sub-skills):**
- Test create-session: verify directory creation
- Test resolve-dates: verify date parsing for all formats
- Test resolve-references: verify path resolution
- Test fetch-calendar: verify session integration

**Integration Testing:**
- Test orchestrator: mock skill with "What I Need"
- Verify session creation, sub-skill spawning, memory.md generation
- Test with planning-daily (real skill)

**Manual Testing:**
```bash
# Test orchestration end-to-end
claude skill run rituals/planning-daily tomorrow

# Verify session files created
ls /tmp/2bd-session-planning-daily-*/

# Check memory.md contents
cat /tmp/2bd-session-planning-daily-*/memory.md
```

---

## Migration Path

### Phase 1: Hook Implementation
1. Implement `SkillExecution:orchestrate` hook in Claude Code CLI
2. Test hook triggers on `orchestrated: true` frontmatter
3. Verify orchestrator SKILL.md gets prepended

### Phase 2: Update planning-daily
1. Add `orchestrated: true` to frontmatter
2. Test with hook enabled
3. Verify it works end-to-end

### Phase 3: Migrate Remaining Skills
1. Update review-daily, planning-weekly, etc.
2. Add `orchestrated: true` to each
3. Remove phases.yaml files

### Phase 4: Cleanup
1. Mark old orchestration approach deprecated
2. Update documentation
3. Consider removing phases.yaml support eventually

---

## Benefits

| Benefit | Description |
|---------|-------------|
| **Skills stay pure prose** | Zero knowledge of orchestration mechanics |
| **No CLI complexity** | Hook is 4 lines of bash |
| **Testable & debuggable** | Sessions persist for inspection |
| **Graceful degradation** | Skills adapt to missing context |
| **Clean separation** | Detection (hook) vs coordination (orchestrator) |
| **Incremental adoption** | Skills opt-in with `orchestrated: true` |

---

## Components Summary

**What needs to be built:**

1. **Hook script** (4 lines)
   - `.claude/hooks/skill-execution-orchestrate.sh`
   - Detects `orchestrated: true`
   - Prepends orchestrator SKILL.md

2. **Orchestrator SKILL.md** (prose)
   - `.claude/skills/_core/orchestrator/SKILL.md`
   - Instructions for Claude on how to orchestrate
   - Already partially documented, needs completion

3. **Hook integration** (CLI changes)
   - Support for `SkillExecution:orchestrate` hook type
   - Inject hook output into conversation context
   - Pass skill file path to hook

4. **planning-daily update**
   - Add `orchestrated: true` to frontmatter
   - Test end-to-end functionality

---

## Success Criteria

- [ ] Hook triggers when `orchestrated: true` present
- [ ] Orchestrator SKILL.md gets prepended to conversation
- [ ] Claude successfully creates session
- [ ] Claude spawns sub-skills in parallel
- [ ] Claude builds memory.md correctly
- [ ] planning-daily executes with session context
- [ ] Skills remain unaware of orchestration
- [ ] Session cleanup works as configured
- [ ] Graceful degradation for missing context

---

## Next Steps

1. Write implementation plan
2. Implement hook support in Claude Code CLI
3. Complete orchestrator SKILL.md prose
4. Test with planning-daily
5. Document hook system for developers
