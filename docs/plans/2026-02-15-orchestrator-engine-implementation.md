# Orchestrator Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement hook-based prose orchestration engine to make `orchestrated: true` skills functional.

**Architecture:** Hook detects `orchestrated: true` in skill frontmatter, prepends orchestrator SKILL.md as prose instructions for Claude, Claude interprets and coordinates sub-skills naturally.

**Tech Stack:** Bash (hook script), Markdown (orchestrator instructions), existing sub-skills

---

## Context

**What exists:**
- Sub-skills: create-session, resolve-dates, resolve-references, fetch-calendar (all functional)
- Migrated skill: planning-daily with "What I Need" pattern
- Design document: [orchestrator-engine-design.md](2026-02-15-orchestrator-engine-design.md)

**What's missing:**
- Hook script to detect and inject orchestration
- Complete orchestrator SKILL.md prose
- Hook integration in Claude Code CLI (external dependency)
- Testing and validation

**Important:** Tasks 1-3 can be implemented in this repo. Task 4 (CLI integration) requires changes to Claude Code CLI and is documented but not implemented here.

---

## Task 1: Create Hook Script

**Files:**
- Create: `.claude/hooks/skill-execution-orchestrate.sh`

**What it does:** Detects `orchestrated: true` in skill frontmatter and outputs orchestrator SKILL.md.

**Step 1: Create hook script**

```bash
#!/bin/bash
# .claude/hooks/skill-execution-orchestrate.sh
#
# Hook: SkillExecution:orchestrate
# Triggers before skill execution when orchestrated: true in frontmatter
#
# Usage: Called by Claude Code CLI with skill file path as $1
# Output: Orchestrator SKILL.md content (prepended to conversation)

skill_file="$1"

# Check frontmatter for orchestrated: true
if grep -q "^orchestrated: true" "$skill_file"; then
  # Inject orchestrator instructions as preamble
  cat .claude/skills/_core/orchestrator/SKILL.md
fi

exit 0
```

**Step 2: Make script executable**

Run: `chmod +x .claude/hooks/skill-execution-orchestrate.sh`

**Step 3: Test hook script manually**

Create test skill file:
```bash
cat > /tmp/test-orchestrated.md <<'EOF'
---
name: test
orchestrated: true
---
# Test
EOF
```

Run hook:
```bash
.claude/hooks/skill-execution-orchestrate.sh /tmp/test-orchestrated.md
```

Expected: Outputs orchestrator SKILL.md content

Test without `orchestrated: true`:
```bash
cat > /tmp/test-normal.md <<'EOF'
---
name: test
---
# Test
EOF

.claude/hooks/skill-execution-orchestrate.sh /tmp/test-normal.md
```

Expected: No output (silent)

**Step 4: Commit**

```bash
git add .claude/hooks/skill-execution-orchestrate.sh
git commit -m "feat(hooks): add skill-execution-orchestrate hook script"
```

---

## Task 2: Complete Orchestrator SKILL.md

**Files:**
- Modify: `.claude/skills/_core/orchestrator/SKILL.md`

**What it does:** Provides comprehensive prose instructions for Claude on how to orchestrate.

**Current state:** Read existing file to see what's already documented

**Step 1: Read current orchestrator SKILL.md**

Run: `cat .claude/skills/_core/orchestrator/SKILL.md`

**Step 2: Write complete orchestrator instructions**

Replace content with comprehensive prose instructions:

```markdown
---
name: orchestrator
description: Internal orchestrator for prose-driven context assembly
internal: true
---

# Orchestrator Instructions

You are orchestrating a skill that has declared context needs. This skill has `orchestrated: true` in its frontmatter, which triggered this preamble.

**Your job:** Set up the session, spawn sub-skills to fulfill needs, build memory index, then execute the skill naturally.

---

## Step 1: Verify Orchestration Needed

Check if the skill has a "## What I Need" section.

If no "What I Need" section exists, skip orchestration and execute the skill normally (the skill will handle its own context).

If "What I Need" exists, proceed with orchestration.

---

## Step 2: Create Session Directory

Use the create-session sub-skill to create a temporary session directory.

Spawn Task tool:
```
skill: _sub/create-session
args: [skill name from frontmatter]
subagent_type: general-purpose
```

The sub-skill will:
- Create `/tmp/2bd-session-{skillname}-{timestamp}/`
- Return the session directory path

**Capture the session path** and set it as `SESSION_DIR` for all subsequent operations.

---

## Step 3: Resolve Time Arguments

Use the resolve-dates sub-skill to parse the time argument into concrete dates.

Spawn Task tool:
```
skill: _sub/resolve-dates
args: [the arguments passed to this skill]
env: SESSION_DIR=[session path from step 2]
subagent_type: general-purpose
```

The sub-skill will:
- Parse flexible time expressions (today, tomorrow, "next monday", YYYY-MM-DD, etc.)
- Write `dates.md` to session directory with:
  - target_date: YYYY-MM-DD
  - scope: day/week/month
  - Additional week context if applicable

Example dates.md output:
```yaml
target_date: 2026-02-17
scope: day
relative: tomorrow
day_of_week: Monday
```

---

## Step 4: Parse "What I Need" Section

Read the skill's "## What I Need" section and identify what context needs to be fulfilled.

For each bullet point in that section, determine the fulfillment strategy:

| Need Pattern | Fulfillment Action |
|--------------|-------------------|
| "Calendar events" | Spawn _sub/fetch-calendar |
| "Week.md", "Month.md", "Quarter.md", "Today.md" | Resolve vault path from config |
| "People files for 1:1 meetings" / "People files for 1:1s" | Spawn _sub/resolve-references with people scope |
| "Active project files" / "Project files" | Spawn _sub/resolve-references with project scope |
| "QMD search" / "Document search" / "Search results" | Spawn _sub/fetch-resources (if available) |
| "User's directives" / "Directives" | Resolve directives path from vault config |

**Build a fulfillment plan** listing which sub-skills to spawn and which vault paths to resolve.

---

## Step 5: Spawn Sub-Skills in Parallel

Spawn all required sub-skills simultaneously using Task tool.

**For external data (calendar, QMD):**

Spawn each sub-skill with:
```
env: SESSION_DIR=[session path]
subagent_type: general-purpose or Explore
```

Each sub-skill will write its output to the session directory:
- `_sub/fetch-calendar` writes `calendar.md`
- `_sub/fetch-resources` writes `resources.md`

**Mark sub-skills as optional** - if they fail, note in memory.md but continue.

**For vault references (Week.md, People files, Projects):**

Spawn resolve-references sub-skill:
```
skill: _sub/resolve-references
args: [prose needs from "What I Need" section]
env: SESSION_DIR=[session path]
subagent_type: Explore
```

The sub-skill will:
- Read dates.md to get target_date
- Resolve static vault paths (Week.md, Month.md, etc.)
- Parse calendar.md (if exists) to find people for 1:1 meetings
- Scan vault for active project files
- Write results showing which files exist (✓) or are missing (✗)

**Wait for all sub-skills to complete** before proceeding.

---

## Step 6: Build Memory Index

Write `memory.md` to the session directory summarizing what context is available.

Use bash to write the file:
```bash
cat > "$SESSION_DIR/memory.md" <<EOF
# Session Memory: [skill name] ([target date from dates.md])

Planning for: [target date with relative description]

## External Data Available

[List what was fetched]

### Calendar Events (calendar.md)
[Status: ✓ available with N events, or ✗ unavailable with reason]

### QMD Resources (resources.md)
[Status: ✓ available with N documents, or ✗ unavailable with reason]

## Vault Files Available

[List all resolved vault paths with status]

### Configuration & Directives
- **Directives**: /full/path/to/directives.md [✓ or ✗]

### Working Notes
- **Today.md**: /full/path/to/Today.md [(new - will create) or ✓ or ✗]
- **Week.md**: /full/path/to/Week.md [✓ or ✗]
- **Month.md**: /full/path/to/Month.md [✓ or ✗]
- **Quarter.md**: /full/path/to/Quarter.md [✓ or ✗]

### People (from calendar 1:1s)
[List each person with file path and status]
- **Person Name**: /full/path/to/Person.md [✓ or ✗]

### Projects (active)
[List active projects with paths and status]
- **project-name**: /full/path/to/project.md [✓ or ✗]

## Summary
- Found: N external data sources, M vault references
- Missing: [list missing items]
- Ready for execution
EOF
```

**Include full paths** for all vault files so the skill can read them directly.

**Mark status clearly:** Use ✓ for available, ✗ for missing, (new - will create) for files that don't exist yet but will be written.

---

## Step 7: Execute Skill

Now execute the skill's main content naturally.

The skill prose will:
- Read `memory.md` first to see what's available
- Load external data from session (`calendar.md`, `resources.md`)
- Load vault files using full paths from memory.md
- Adapt gracefully if context is missing

**Environment variables available to skill:**
- `SESSION_DIR` - path to session directory
- All sub-skills have already written their output

**The skill remains completely unaware of orchestration mechanics.** It just reads files naturally as instructed by its prose.

---

## Error Handling

**Blocking errors (stop execution, report to user):**
- Session creation failed → "Could not create session directory: [error]"
- Date resolution failed → "Could not resolve '[argument]' to a date. Use: today, tomorrow, next monday, or YYYY-MM-DD"
- No "What I Need" section when orchestrated: true → "Skill declares orchestrated: true but has no '## What I Need' section"

**Graceful errors (note in memory.md, continue):**
- Calendar sub-skill failed → memory.md shows "Calendar: ✗ unavailable (ekctl not configured)"
- QMD sub-skill failed → memory.md shows "QMD: ✗ unavailable (not configured)"
- Vault files missing → memory.md shows each file's status (✓ or ✗)
- People/project files not found → memory.md lists them as ✗

**The skill prose is responsible for graceful degradation** - it should check memory.md and adapt.

---

## Session Cleanup

After skill execution completes:

**Keep recent sessions for debugging:**
- Default: Keep last 10 sessions
- User configurable: Check for `SESSION_RETENTION` in config
- Auto-cleanup older sessions: `find /tmp/2bd-session-* -mtime +1 -exec rm -rf {} \;`

**Manual cleanup command** (if user wants to clean all):
- Skill: `_dev/cleanup-sessions`
- Or bash: `rm -rf /tmp/2bd-session-*`

---

## Debugging

**Session files are inspectable:**

List recent sessions:
```bash
ls -lt /tmp/2bd-session-* | head -10
```

Inspect session:
```bash
cat /tmp/2bd-session-[skillname]-[timestamp]/memory.md
cat /tmp/2bd-session-[skillname]-[timestamp]/calendar.md
cat /tmp/2bd-session-[skillname]-[timestamp]/dates.md
```

**If orchestration seems wrong:**
1. Check memory.md - does it reflect what was requested?
2. Check dates.md - is target_date correct?
3. Check if sub-skills wrote their output files
4. Check sub-skill logs in session directory (if available)

---

## Summary

You've now orchestrated the skill:
- ✅ Created session directory
- ✅ Resolved time arguments
- ✅ Spawned sub-skills to fulfill needs
- ✅ Built memory.md index
- ✅ Ready to execute skill prose

The skill will now run naturally with all context available via session files.
```

**Step 3: Verify file is valid markdown**

Run: `cat .claude/skills/_core/orchestrator/SKILL.md | head -50`

Expected: Shows markdown content with proper structure

**Step 4: Commit**

```bash
git add .claude/skills/_core/orchestrator/SKILL.md
git commit -m "feat(orchestrator): complete prose instructions for orchestration"
```

---

## Task 3: Update planning-daily Frontmatter

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md`

**What it does:** Enables orchestration for planning-daily by adding `orchestrated: true`.

**Step 1: Read current planning-daily frontmatter**

Run: `head -10 .claude/skills/rituals/planning-daily/SKILL.md`

**Step 2: Add `orchestrated: true` to frontmatter**

Update lines 1-5:
```yaml
---
name: planning-daily
description: Morning ritual for planning the day
orchestrated: true
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---
```

**Step 3: Verify "What I Need" section exists**

Run: `grep -n "## What I Need" .claude/skills/rituals/planning-daily/SKILL.md`

Expected: Shows line number where section exists

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "feat(planning-daily): enable prose orchestration"
```

---

## Task 4: Document Hook Integration Requirements

**Files:**
- Create: `docs/hook-integration-requirements.md`

**What it does:** Documents what Claude Code CLI needs to implement for hook support.

**Note:** This task documents requirements but doesn't implement CLI changes (those are in Claude Code repo).

**Step 1: Write integration requirements document**

```markdown
# Hook Integration Requirements for Claude Code CLI

This document specifies what Claude Code CLI needs to implement to support the `SkillExecution:orchestrate` hook.

---

## Hook Type: SkillExecution:orchestrate

**Purpose:** Inject orchestration instructions before executing skills with `orchestrated: true`.

**Hook Location:** `.claude/hooks/skill-execution-orchestrate.sh`

**Hook Trigger:** Before skill execution, after skill SKILL.md is read, before conversation starts

---

## CLI Implementation Requirements

### 1. Hook Detection

When loading a skill for execution:

1. Read skill SKILL.md file
2. Parse frontmatter (YAML between `---` markers)
3. Check if `orchestrated: true` is present
4. If yes, proceed with hook execution

### 2. Hook Execution

Execute hook script:

```bash
.claude/hooks/skill-execution-orchestrate.sh [path-to-skill-SKILL.md]
```

**Input:** Absolute path to skill's SKILL.md file
**Output:** Markdown content to prepend (stdout)
**Exit code:** 0 = success, non-zero = error (abort skill execution)

### 3. Hook Output Injection

Take hook stdout and prepend to conversation context:

```
[Hook output]
---
[Skill SKILL.md content]
[User message]
```

The hook output becomes "instructions for Claude" that appear before the skill content.

### 4. Environment Variables

Pass to hook (optional, for future extension):
- `SKILL_NAME` - skill name from frontmatter
- `SKILL_ARGS` - arguments passed by user
- `SKILL_PATH` - absolute path to skill directory

### 5. Error Handling

**If hook fails (non-zero exit):**
- Capture stderr
- Show error to user: "Hook failed: [stderr]"
- Abort skill execution

**If hook succeeds but returns no output:**
- Continue normally (hook decided not to inject)

---

## Testing Hook Integration

Create test skill:
```yaml
---
name: test-orchestrated
orchestrated: true
---

# Test

## What I Need
- Test data
```

Run: `claude skill run _dev/test-orchestrated`

**Expected behavior:**
1. CLI detects `orchestrated: true`
2. CLI executes hook script
3. Hook outputs orchestrator SKILL.md
4. Claude sees orchestrator instructions + test skill
5. Claude follows orchestration steps

**Verify:**
- Session directory created
- Sub-skills spawned
- memory.md generated
- Skill executes with context

---

## Implementation Checklist

- [ ] Frontmatter parser handles `orchestrated: true` field
- [ ] Hook script located and executable check
- [ ] Hook executed with correct arguments
- [ ] Hook output captured and prepended to context
- [ ] Error handling for hook failures
- [ ] Hook timeout (recommend 5 seconds max)
- [ ] Hook logging/debugging support

---

## Backward Compatibility

**Skills without `orchestrated: true`:**
- No change in behavior
- Hook is not executed
- Skills run as before

**Skills with `orchestrated: true` but CLI doesn't support hooks yet:**
- Skill runs but orchestration doesn't happen
- Skill prose will try to read session files that don't exist
- Graceful degradation should still work (skill adapts to missing context)

---

## Future Extensions

**Additional hook types** (not part of this implementation):
- `SkillExecution:pre` - Run before any skill
- `SkillExecution:post` - Run after skill completes
- `SkillExecution:error` - Run on skill error

**Hook configuration** (future):
- `.claude/hooks/config.yaml` to enable/disable hooks
- Hook-specific settings
- Hook execution order
```

**Step 2: Commit**

```bash
git add docs/hook-integration-requirements.md
git commit -m "docs: add hook integration requirements for Claude Code CLI"
```

---

## Task 5: Create Test Orchestrated Skill

**Files:**
- Create: `.claude/skills/_dev/test-orchestrated/SKILL.md`

**What it does:** Minimal test skill to validate orchestration without requiring CLI changes.

**Step 1: Create test skill**

```markdown
---
name: test-orchestrated
description: Test skill for validating prose orchestration
orchestrated: true
internal: true
---

# Test Orchestrated Skill

This skill tests prose-driven orchestration.

## What I Need

- Calendar events for the day
- Week.md for weekly context

## Test Session

Read memory.md to see what context is available.

**Expected in memory.md:**
- Calendar events (may be unavailable if ekctl not configured)
- Week.md path with status

**Report findings:**

If calendar.md exists in session:
- Read it and count events
- Report: "Found N calendar events"

If Week.md path is in memory.md:
- Note the path
- Report: "Week.md available at [path]"

If neither are available:
- Report: "No context available (expected when orchestration not working)"

**Confirmation:**

If memory.md exists and contains the expected sections:
- "✅ Orchestration is working! Session directory: [SESSION_DIR]"

If memory.md doesn't exist:
- "❌ Orchestration not working. Expected session files not found."
- "This is expected if hook integration isn't implemented yet in Claude Code CLI."

## Debug Info

Show session directory path if SESSION_DIR is set:
```bash
echo "Session directory: $SESSION_DIR"
ls -la "$SESSION_DIR"
```

If session doesn't exist, explain:
- "Hook integration not yet implemented in Claude Code CLI"
- "See docs/hook-integration-requirements.md for implementation details"
```

**Step 2: Test with manual orchestration (without CLI support)**

For now, we can't test the hook since CLI support doesn't exist yet.

Create manual test:
```bash
# Simulate what hook would do
cat .claude/skills/_core/orchestrator/SKILL.md
echo "---"
cat .claude/skills/_dev/test-orchestrated/SKILL.md
```

Expected: Shows orchestrator instructions followed by test skill

**Step 3: Commit**

```bash
git add .claude/skills/_dev/test-orchestrated/SKILL.md
git commit -m "feat(test): add test-orchestrated skill for validation"
```

---

## Task 6: Update Implementation Status

**Files:**
- Modify: `docs/plans/2026-02-15-orchestrator-redesign-implementation.md`

**What it does:** Update migration status to reflect new state.

**Step 1: Read current migration status section**

Run: `tail -50 docs/plans/2026-02-15-orchestrator-redesign-implementation.md`

**Step 2: Add orchestrator engine status**

Append to migration status section:

```markdown

### Orchestrator Engine (2026-02-15)

**Implemented:**
- ✅ Hook script: `.claude/hooks/skill-execution-orchestrate.sh`
- ✅ Orchestrator SKILL.md: Complete prose instructions
- ✅ planning-daily: Updated with `orchestrated: true`
- ✅ Test skill: `_dev/test-orchestrated` for validation
- ✅ Documentation: Hook integration requirements

**Blocked (external dependency):**
- ⏳ Claude Code CLI hook support - requires CLI changes
  - See: `docs/hook-integration-requirements.md`
  - Need: Frontmatter detection, hook execution, output injection

**Ready for Testing (when CLI support exists):**
- All components in place
- Hook script tested manually
- Orchestrator prose complete
- planning-daily ready to test

**Next Steps:**
1. Implement hook support in Claude Code CLI (external)
2. Test with planning-daily: `claude skill run rituals/planning-daily tomorrow`
3. Verify session creation, sub-skill spawning, memory.md generation
4. Debug any issues
5. Migrate remaining skills
```

**Step 3: Commit**

```bash
git add docs/plans/2026-02-15-orchestrator-redesign-implementation.md
git commit -m "docs: update implementation status for orchestrator engine"
```

---

## Task 7: Update CLAUDE.md with Hook Information

**Files:**
- Modify: `CLAUDE.md`

**What it does:** Document hook-based orchestration for Claude (the LLM) to understand.

**Step 1: Find Prose-Driven Orchestration section**

Run: `grep -n "### Prose-Driven Orchestration" CLAUDE.md`

**Step 2: Add hook section**

After the Prose-Driven Orchestration section, add:

```markdown

### Hook Integration

**Current Status:** Hook-based orchestration implemented, awaiting Claude Code CLI support.

**When implemented, orchestration will work automatically:**

1. User runs skill with `orchestrated: true` in frontmatter
2. Claude Code CLI detects the flag
3. CLI executes `.claude/hooks/skill-execution-orchestrate.sh`
4. Hook outputs orchestrator SKILL.md as preamble
5. You (Claude) see orchestrator instructions + skill content
6. You follow orchestration steps naturally

**Until CLI support exists:**
- Skills with `orchestrated: true` won't trigger orchestration
- Orchestration must be done manually by reading orchestrator SKILL.md first
- All components are ready, just need CLI integration

**To test manually:**
```bash
# Simulate orchestration
cat .claude/skills/_core/orchestrator/SKILL.md
cat .claude/skills/rituals/planning-daily/SKILL.md
```

**See:** `docs/hook-integration-requirements.md` for CLI implementation details.
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE.md): add hook integration status"
```

---

## Testing Plan

### Manual Testing (without CLI support)

**Test 1: Hook script execution**

```bash
# Create test skill
cat > /tmp/test-orch.md <<'EOF'
---
orchestrated: true
---
# Test
## What I Need
- Test data
EOF

# Run hook
.claude/hooks/skill-execution-orchestrate.sh /tmp/test-orch.md
```

Expected: Outputs orchestrator SKILL.md content

**Test 2: Hook script with non-orchestrated skill**

```bash
cat > /tmp/test-normal.md <<'EOF'
---
name: test
---
# Test
EOF

.claude/hooks/skill-execution-orchestrate.sh /tmp/test-normal.md
```

Expected: No output (exit 0)

**Test 3: Manual orchestration simulation**

```bash
# Simulate what Claude would see with hook
cat .claude/skills/_core/orchestrator/SKILL.md
echo "---"
cat .claude/skills/rituals/planning-daily/SKILL.md
```

Expected: Full orchestration instructions followed by planning-daily content

### Integration Testing (requires CLI support)

**Test 4: End-to-end orchestration**

```bash
claude skill run rituals/planning-daily tomorrow
```

Expected:
1. Session created: `/tmp/2bd-session-planning-daily-[timestamp]/`
2. Sub-skills spawned (create-session, resolve-dates, resolve-references, fetch-calendar)
3. memory.md generated with available context
4. Skill executes and reads session files
5. Session cleanup after execution

**Test 5: Verify session files**

```bash
ls /tmp/2bd-session-planning-daily-*/
cat /tmp/2bd-session-planning-daily-*/memory.md
```

Expected: Shows memory.md, dates.md, calendar.md (if available), references

**Test 6: Test with missing context**

Rename Week.md temporarily:
```bash
mv "$VAULT/00_Brain/Captive/Week.md" "$VAULT/00_Brain/Captive/Week.md.backup"
claude skill run rituals/planning-daily
```

Expected:
- memory.md shows Week.md as ✗ missing
- Skill adapts gracefully (proceeds without weekly context)
- No errors

Restore:
```bash
mv "$VAULT/00_Brain/Captive/Week.md.backup" "$VAULT/00_Brain/Captive/Week.md"
```

---

## Success Criteria

- [ ] Hook script created and executable
- [ ] Hook script detects `orchestrated: true` correctly
- [ ] Hook script outputs orchestrator SKILL.md when triggered
- [ ] Hook script is silent when not triggered
- [ ] Orchestrator SKILL.md prose is complete and comprehensive
- [ ] planning-daily has `orchestrated: true` in frontmatter
- [ ] Test skill created for validation
- [ ] Documentation complete (requirements, status)
- [ ] Manual testing passes
- [ ] Ready for CLI integration

---

## Implementation Notes

**Repository boundary:**
- This plan implements everything in the 2bd repo
- Hook script: ✅ In our repo
- Orchestrator prose: ✅ In our repo
- Skill updates: ✅ In our repo
- CLI hook support: ❌ In Claude Code repo (external)

**Claude Code CLI work required:**
1. Add frontmatter parser for `orchestrated: true`
2. Execute hook script before skill
3. Inject hook output into conversation
4. Handle hook errors
5. Test integration

**Timeline:**
- This plan: Can be completed immediately
- CLI integration: Depends on Claude Code development
- End-to-end testing: After CLI integration

---

## Next Steps

After this plan is implemented:

1. **Submit request to Claude Code team:**
   - Share `docs/hook-integration-requirements.md`
   - Request `SkillExecution:orchestrate` hook support
   - Provide test-orchestrated skill for validation

2. **When CLI support lands:**
   - Test end-to-end with planning-daily
   - Debug any issues
   - Document any findings

3. **After validation:**
   - Migrate remaining rituals (review-daily, planning-weekly, etc.)
   - Add `orchestrated: true` to each
   - Remove old phases.yaml files
   - Update all documentation

4. **Finalize:**
   - Deprecate phases.yaml approach
   - Update tutorials and examples
   - Celebrate prose-driven orchestration! 🎉
