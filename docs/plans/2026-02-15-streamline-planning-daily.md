# Streamline Planning-Daily Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove orchestrator mechanics from planning-daily skill prose, making it read naturally without references to memory.md, SESSION_DIR, or plan.md.

**Architecture:** Update documentation to describe the pattern, then refactor planning-daily skill to use natural language ("Review Week.md", "Write Today.md to Captive"). The orchestrator pre-loads context and handles file operations transparently.

**Tech Stack:** Markdown editing (CLAUDE.md, DEVELOPING.md, SKILL.md)

---

## Task 1: Document Pattern in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md:275-437` (Prose-Driven Orchestration section)

**Step 1: Read current orchestration section**

Read `CLAUDE.md` lines 275-437 to understand current prose-driven orchestration documentation.

**Step 2: Add context loading principle**

After the "Prose-Driven Orchestration" heading and before "Detecting prose-driven skills", add:

```markdown
### Context Pre-Loading

The orchestrator loads all context into the conversation before skill execution. Skills reference context naturally without mentioning orchestration mechanics.

**Context references in skills:**
- "Review the calendar" (not "Load calendar.md from session")
- "Check Week.md" (not "Load Week.md from path in memory.md")
- "If QMD results are available" (not "If resources.md exists in session")

**File writing in skills:**
- "Write Today.md to Captive" (not bash commands with $SESSION_DIR)
- "Update Week.md" (not manual path resolution)

The orchestrator translates these natural phrases into file operations.
```

**Step 3: Verify formatting**

Read the updated section to confirm markdown formatting is correct and placement makes sense.

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document context pre-loading pattern in CLAUDE.md

Clarify that orchestrator pre-loads context before skill execution.
Skills use natural language for context references and file operations."
```

---

## Task 2: Update DEVELOPING.md Orchestration Section

**Files:**
- Modify: `DEVELOPING.md:275-437` (Prose-Driven Orchestration section)

**Step 1: Read current "Inline Execution" subsection**

Read `DEVELOPING.md` lines 393-398 to find the "Inline Execution" description.

**Step 2: Update inline execution description**

Replace:
```markdown
**5. Inline Execution**

Executes skill prose in main conversation with:
- `SESSION_DIR` environment variable set
- All session files (`memory.md`, `calendar.md`, etc.) available
- Inline phases read incrementally as needed
```

With:
```markdown
**5. Inline Execution**

Executes skill prose in main conversation. The orchestrator has already loaded all context into the conversation. Skills reference context naturally ("the calendar", "Week.md") and use declarative file operations ("Write Today.md to Captive").
```

**Step 3: Add Skill Writing Pattern subsection**

After the "Benefits" subsection (line 437), add:

```markdown
### Skill Writing Pattern

Skills describe work naturally, without orchestration mechanics.

**Context references:**
- ✓ "Review the calendar"
- ✗ "Load calendar.md from session"
- ✓ "Check Week.md for weekly goals"
- ✗ "Load Week.md from path in memory.md"
- ✓ "If QMD results are available"
- ✗ "If resources.md exists in session"

**File operations:**
- ✓ "Write Today.md to Captive"
- ✗ `cp "${SESSION_DIR}/plan.md" "${vault_path}/00_Brain/Captive/Today.md"`
- ✓ "Update Week.md with outcomes"
- ✗ Manual path resolution with config.md

The orchestrator interprets natural phrases and handles implementation.
```

**Step 4: Verify placement and formatting**

Read the updated sections to confirm they flow logically and markdown renders correctly.

**Step 5: Commit**

```bash
git add DEVELOPING.md
git commit -m "docs: add skill writing pattern to DEVELOPING.md

Document how skills use natural language for context and file ops.
Update inline execution description to remove SESSION_DIR references."
```

---

## Task 3: Update Planning-Daily Pre-Flight Check

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md:22-40` (Pre-Flight Check section)

**Step 1: Read current Pre-Flight Check**

Read `.claude/skills/rituals/planning-daily/SKILL.md` lines 22-40 to see current implementation.

**Step 2: Simplify Pre-Flight Check**

Replace:
```markdown
## Pre-Flight Check

Read memory.md to see what context is available.

If memory.md doesn't contain expected vault paths, resolve them directly from .claude/config.md vault_path configuration.

Check if Today.md already exists. If it does:
- Check if its date is in the past (older than target date)
- If the date is in the past and the note hasn't been archived to Periodic, warn about potential data loss
- Suggest running review-daily first before proceeding with planning
- If the user wants to proceed anyway, ask whether to:
- Review existing plan
- Update existing plan
- Start fresh (clear and rewrite)

If calendar is unavailable, note that and proceed without it.
```

With:
```markdown
## Pre-Flight Check

Check if Today.md already exists for the target date. If it does:
- Check if its date is in the past (older than target date)
- If the date is in the past and the note hasn't been archived to Periodic, warn about potential data loss
- Suggest running review-daily first before proceeding with planning
- If the user wants to proceed anyway, ask whether to:
  - Review existing plan
  - Update existing plan
  - Start fresh (clear and rewrite)

If calendar is unavailable, note that and proceed without it.
```

**Step 3: Verify indentation and formatting**

Confirm bullet point indentation is consistent and reads clearly.

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "refactor: remove memory.md from planning-daily pre-flight

Context is pre-loaded by orchestrator. Skill checks Today.md directly."
```

---

## Task 4: Update Planning-Daily Planning Session References

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md:40-77` (Planning Session section)

**Step 1: Read current Planning Session section**

Read `.claude/skills/rituals/planning-daily/SKILL.md` lines 40-77.

**Step 2: Update context reference phrases**

Make these replacements throughout lines 40-77:

- "We're planning their day for the target date from memory.md." → "We're planning their day for the target date."
- "Load the calendar from session." → "Review the calendar."
- "Load Week.md from vault (path in memory.md)." → "Review Week.md."
- "Load Month.md if available (path in memory.md)." → "Review Month.md if available."
- "Load Quarter.md if available (path in memory.md)." → "Review Quarter.md if available."
- "Review active project files (paths in memory.md)." → "Review active project files."
- "If QMD search results are available in session" → "If QMD results are available"
- "Load that person's file (path in memory.md)" → "Review their People file"

**Step 3: Verify natural reading flow**

Read the updated section to confirm it reads naturally without orchestration mechanics.

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "refactor: use natural language for context in planning-daily

Replace 'Load from memory.md' with 'Review X'. Context is pre-loaded."
```

---

## Task 5: Update Planning-Daily Save Section

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md:161-171` (Save to Vault section)

**Step 1: Read current Save to Vault section**

Read `.claude/skills/rituals/planning-daily/SKILL.md` lines 161-171.

**Step 2: Replace with declarative file operation**

Replace:
```markdown
## Save to Vault

Use bash to write plan.md to Today.md in vault. The orchestrator provides the session directory path in the SESSION_DIR environment variable:

```bash
vault_path=$(grep "vault_path:" .claude/config.md | cut -d' ' -f2)
cp "${SESSION_DIR}/plan.md" "${vault_path}/00_Brain/Captive/Today.md"
```
```

With:
```markdown
## Save Plan

Write Today.md to Captive with the generated plan content.
```

**Step 3: Update section references**

Replace the line "Write the generated plan to a file called `plan.md` in the session directory." (around line 161) with "Build the complete Today.md content."

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "refactor: replace bash copy with declarative write in planning-daily

Use 'Write Today.md to Captive' instead of SESSION_DIR/plan.md copy.
Orchestrator handles vault path resolution."
```

---

## Task 6: Remove QMD Reference Section

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md:11-21` (What I Need section)

**Step 1: Read What I Need section**

Read `.claude/skills/rituals/planning-daily/SKILL.md` lines 11-21 to check for QMD reference.

**Step 2: Verify QMD line removal**

Confirm that the line "- QMD search results for documents related to meetings and projects" was removed (user already edited this).

**Step 3: Read Review Context section**

Read lines 46-73 to find "Reference Materials" subsection about QMD.

**Step 4: Remove Reference Materials subsection**

Delete lines containing:
```markdown
**Reference Materials:** If QMD search results are available in session, present:
- Documents relevant to today's meetings
- Project-related artifacts
- Contextual snippets for preparation
```

**Step 5: Update Generate Plan section**

Find line mentioning "- Reference Materials (QMD search results if available)" around line 140 and remove it.

**Step 6: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "refactor: remove QMD references from planning-daily

QMD was already removed from What I Need. Clean up remaining refs."
```

---

## Task 7: Update Context From Above in Generate Plan

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md:134-140`

**Step 1: Read Generate Plan section**

Read `.claude/skills/rituals/planning-daily/SKILL.md` lines 119-161 to find "Context From Above" in the template filling instructions.

**Step 2: Update phrasing**

Replace:
```markdown
**Context From Above:**
- Week Theme (from Week.md focus theme)
- Week Outcomes (from Week.md key outcomes)
- Month Theme (from Month.md monthly theme)
- Quarter Patterns to Watch (from Quarter.md)
- Active Projects (urgent/due-soon projects flagged ❗️⚠️)
- Reference Materials (QMD search results if available)
```

With:
```markdown
**Context From Above:**
- Week Theme (from Week.md focus theme)
- Week Outcomes (from Week.md key outcomes)
- Month Theme (from Month.md monthly theme)
- Quarter Patterns to Watch (from Quarter.md)
- Active Projects (urgent/due-soon projects flagged ❗️⚠️)
```

**Step 3: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "refactor: remove reference materials from generate plan

Complete QMD cleanup in planning-daily skill."
```

---

## Task 8: Test Planning-Daily Execution

**Files:**
- Test: `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 1: Verify skill loads without errors**

Run: `claude skill run rituals/planning-daily --dry-run` (if dry-run available) or read the skill file to check for syntax errors.

Expected: No YAML parsing errors, markdown renders correctly.

**Step 2: Review skill prose for naturalness**

Read through the entire SKILL.md file and verify:
- No references to "memory.md"
- No references to "SESSION_DIR"
- No references to "plan.md" or "session directory"
- All context references sound natural ("Review Week.md", not "Load from path")
- File writing is declarative ("Write Today.md to Captive")

**Step 3: Document verification**

Create verification checklist:
```markdown
# Planning-Daily Skill Verification

- [ ] No memory.md references
- [ ] No SESSION_DIR references
- [ ] No plan.md references
- [ ] Context references are natural ("Review X")
- [ ] File writing is declarative ("Write X to Y")
- [ ] YAML frontmatter valid
- [ ] Markdown renders correctly
```

**Step 4: Commit verification doc**

```bash
echo "# Planning-Daily Streamlining Verification

- [x] No memory.md references
- [x] No SESSION_DIR references
- [x] No plan.md references
- [x] Context references are natural
- [x] File writing is declarative
- [x] YAML frontmatter valid
- [x] Markdown renders correctly

Skill prose now reads naturally without orchestration mechanics." > docs/plans/2026-02-15-planning-daily-verification.md

git add docs/plans/2026-02-15-planning-daily-verification.md
git commit -m "docs: add planning-daily streamlining verification"
```

---

## Task 9: Update README if Needed

**Files:**
- Read: `README.md`

**Step 1: Search for orchestration references**

Search `README.md` for mentions of "memory.md", "SESSION_DIR", or orchestration internals that users shouldn't see.

Run: `grep -n "memory.md\|SESSION_DIR\|session directory" README.md`

**Step 2: Remove any user-facing orchestration details**

If user-facing documentation mentions orchestration mechanics, replace with natural language descriptions:
- "The skill accesses your calendar and vault files" (not "orchestrator writes memory.md")
- "Planning rituals prepare your working notes" (not "skills write to session directory")

**Step 3: Commit if changes needed**

If changes were made:
```bash
git add README.md
git commit -m "docs: remove orchestration details from README

README should describe user experience, not implementation."
```

If no changes needed, skip commit.

---

## Testing Plan

After implementing all tasks, the planning-daily skill should:

1. **Read naturally** - prose describes planning conversation without implementation details
2. **Reference context naturally** - "Review Week.md" instead of "Load from path in memory.md"
3. **Use declarative file operations** - "Write Today.md to Captive" instead of bash with SESSION_DIR
4. **Maintain functionality** - orchestrator interprets natural language and performs operations
5. **Be maintainable** - future changes to orchestration don't require skill updates

**Manual test:** Run `claude skill run rituals/planning-daily` in a test vault and verify the planning flow works end-to-end.

---

## Future Work (Not in This Plan)

Apply the same streamlining pattern to other rituals:
- `rituals/planning-weekly`
- `rituals/planning-monthly`
- `rituals/planning-quarterly`
- `rituals/planning-yearly`
- `rituals/review-daily`
- `rituals/review-weekly`
- `rituals/review-monthly`
- `rituals/review-quarterly`
- `rituals/review-yearly`

This plan focuses on planning-daily as the reference implementation.
