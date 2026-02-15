# Ritual Structure Documentation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Document the canonical 6-phase ritual structure and update all rituals to use consistent phase naming.

**Architecture:** Add reference documentation to DEVELOPING.md describing the universal ritual lifecycle, then systematically update all 10 ritual SKILL.md files to use canonical section names (Context, Validate, Session, Compose, Persist, Confirm).

**Tech Stack:** Markdown documentation

---

## Task 1: Add Ritual Structure Section to DEVELOPING.md

**Files:**
- Modify: `DEVELOPING.md`

**Step 1: Read current DEVELOPING.md structure**

Identify where to insert the new "Ritual Structure" section. It should go after "Creating Skills" section (around line 275) and before "Prose-Driven Orchestration" section.

**Step 2: Add Ritual Structure section**

Insert the following section after "Creating Skills" (around line 273):

```markdown
### Ritual Structure

All rituals follow a canonical 6-phase lifecycle. Each phase has a specific purpose and uses a standardized section name.

#### The 6 Phases

| Phase | Section Name | Purpose | Gate? |
|-------|--------------|---------|-------|
| 1 | `## Context` | Declare context needs (orchestrator loads) | No |
| 2 | `## Validate` | Check prerequisites and state | Yes (proceed only when safe) |
| 3 | `## Session` | Interactive guided conversation | No |
| 4 | `## Compose` | Build artifact in memory | No |
| 5 | `## Persist` | Write to vault | No |
| 6 | `## Confirm` | Summarize and suggest next steps | No |

**Phase 1: Context**

Declare what context is needed in natural prose. The orchestrator interprets these needs and pre-loads all context before execution.

```markdown
## Context

- Calendar events for the target period
- User's directives and preferences
- Week.md, Month.md, Quarter.md for hierarchical context
- People files for anyone with 1:1 meetings
- Active project files
```

**Phase 2: Validate**

Check prerequisites and state. Verify dates, check for existing files, warn about risks, offer alternatives. Proceed only when safe.

**Phase 3: Session**

Interactive guided conversation with the user. Personalized greeting, present context, gather input, facilitate reflection. May include subsections to organize conversation flow (subsections are ritual-specific).

**Phase 4: Compose**

Build the complete artifact in memory. Generate content, fill templates, prepare everything for persistence.

**Phase 5: Persist**

Execute file operations. Write to vault, update changelogs. Document what will be written before executing.

**Phase 6: Confirm**

Summarize what was done. Show key outcomes, suggest next steps. This is verification after persistence, not an approval gate.

#### Principles

- **Universal:** All rituals use these exact phase names
- **No variations:** No ritual-specific phase names
- **Subsections allowed:** Within phases (especially Session), use subsections to organize content
- **Separation:** Keep Compose and Persist as separate phases
```

**Step 3: Commit documentation addition**

```bash
git add DEVELOPING.md
git commit -m "docs: add canonical ritual structure reference"
```

---

## Task 2: Update planning-daily Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 1: Read current planning-daily structure**

Check current section names to identify what needs updating.

**Step 2: Rename sections to canonical names**

Update the following sections:

Line 11: Change `## What I Need` → `## Context`

Line 22: Change `## Pre-Flight Check` → `## Validate`

Line 33: Change `## Planning Session` → `## Session`

Line 107-114: Split `## Build and Save Plan` into two sections:

```markdown
## Compose

Build the complete Today.md file using all content from the session above:
- Fill frontmatter with calculated date fields (YYYY-MM-DD, day name, ISO week, month, quarter)
- Include standard navigation links
- Write all sections in template order: Context From Above, Focus, Meetings, Capture (empty), Wins, Insights, Changelog (empty)

## Persist

Write Today.md to Captive.
```

Line 116: Keep `## Confirm` (no change needed)

**Step 3: Test the ritual**

Run: `claude skill run rituals/planning-daily`

Expected: Ritual executes successfully with new section structure

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "refactor(ritual): use canonical phases in planning-daily"
```

---

## Task 3: Update planning-weekly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-weekly/SKILL.md`

**Step 1: Read current planning-weekly structure**

Check current section names.

**Step 2: Rename sections to canonical names**

Expected changes:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- `## Planning Session` or similar → `## Session`
- Split generation and writing into `## Compose` and `## Persist`
- Keep `## Confirm`

**Step 3: Test the ritual**

Run: `claude skill run rituals/planning-weekly`

Expected: Ritual executes successfully

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-weekly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in planning-weekly"
```

---

## Task 4: Update planning-monthly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-monthly/SKILL.md`

**Step 1: Read current planning-monthly structure**

**Step 2: Rename sections to canonical names**

Follow same pattern as planning-weekly:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- Planning session section → `## Session`
- Split generation/writing → `## Compose` and `## Persist`
- Keep `## Confirm`

**Step 3: Test the ritual**

Run: `claude skill run rituals/planning-monthly`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-monthly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in planning-monthly"
```

---

## Task 5: Update planning-quarterly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-quarterly/SKILL.md`

**Step 1: Read current planning-quarterly structure**

**Step 2: Rename sections to canonical names**

Follow canonical pattern:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- Planning session → `## Session`
- Split generation/writing → `## Compose` and `## Persist`
- Keep `## Confirm`

**Step 3: Test the ritual**

Run: `claude skill run rituals/planning-quarterly`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-quarterly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in planning-quarterly"
```

---

## Task 6: Update planning-yearly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-yearly/SKILL.md`

**Step 1: Read current planning-yearly structure**

**Step 2: Rename sections to canonical names**

Follow canonical pattern:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- Planning session → `## Session`
- Split generation/writing → `## Compose` and `## Persist`
- Keep `## Confirm`

**Step 3: Test the ritual**

Run: `claude skill run rituals/planning-yearly`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-yearly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in planning-yearly"
```

---

## Task 7: Update review-daily Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-daily/SKILL.md`

**Step 1: Read current review-daily structure**

**Step 2: Rename sections to canonical names**

Expected changes:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- `## Interactive Review` → `## Session`
- `## Synthesis` → `## Compose`
- `## Write` → `## Persist`
- Keep `## Confirm`

**Step 3: Test the ritual**

Run: `claude skill run rituals/review-daily`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/review-daily/SKILL.md
git commit -m "refactor(ritual): use canonical phases in review-daily"
```

---

## Task 8: Update review-weekly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-weekly/SKILL.md`

**Step 1: Read current review-weekly structure**

**Step 2: Rename sections to canonical names**

Based on earlier analysis:
- Line 11: `## What I Need` → `## Context`
- Line 24: `## Pre-Flight Check` → `## Validate`
- Line 42: `## Interactive Review` → `## Session`
- Line 106: `## Synthesis` → `## Compose`
- Line 133: `## Write` → `## Persist`
- Line 118: Keep `## Confirm` but move it AFTER Persist (currently it's before Write)

The order should be: Context → Validate → Session → Compose → Persist → Confirm

**Step 3: Test the ritual**

Run: `claude skill run rituals/review-weekly`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/review-weekly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in review-weekly"
```

---

## Task 9: Update review-monthly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-monthly/SKILL.md`

**Step 1: Read current review-monthly structure**

**Step 2: Rename sections to canonical names**

Follow same pattern as review-weekly:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- `## Interactive Review` → `## Session`
- `## Synthesis` → `## Compose`
- Ensure Persist and Confirm are in correct order
- `## Write` → `## Persist`
- Keep `## Confirm` after Persist

**Step 3: Test the ritual**

Run: `claude skill run rituals/review-monthly`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/review-monthly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in review-monthly"
```

---

## Task 10: Update review-quarterly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-quarterly/SKILL.md`

**Step 1: Read current review-quarterly structure**

**Step 2: Rename sections to canonical names**

Follow canonical pattern:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- `## Interactive Review` → `## Session`
- `## Synthesis` → `## Compose`
- `## Write` → `## Persist`
- Keep `## Confirm` after Persist

**Step 3: Test the ritual**

Run: `claude skill run rituals/review-quarterly`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/review-quarterly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in review-quarterly"
```

---

## Task 11: Update review-yearly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-yearly/SKILL.md`

**Step 1: Read current review-yearly structure**

**Step 2: Rename sections to canonical names**

Follow canonical pattern:
- `## What I Need` → `## Context`
- `## Pre-Flight Check` → `## Validate`
- `## Interactive Review` → `## Session`
- `## Synthesis` → `## Compose`
- `## Write` → `## Persist`
- Keep `## Confirm` after Persist

**Step 3: Test the ritual**

Run: `claude skill run rituals/review-yearly`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/review-yearly/SKILL.md
git commit -m "refactor(ritual): use canonical phases in review-yearly"
```

---

## Task 12: Update CLAUDE.md Reference

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Find ritual structure reference in CLAUDE.md**

Search for any mentions of ritual phases or "What I Need" pattern around line 275-430.

**Step 2: Update prose-driven orchestration section**

Around line 275-430, update any references to section names:
- Change "What I Need" → "Context"
- Update examples to use canonical phase names

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with canonical ritual phases"
```

---

## Task 13: Update README.md if Needed

**Files:**
- Check: `README.md`

**Step 1: Search for ritual structure references**

Check if README.md mentions ritual phases or internal structure.

**Step 2: Update if found**

If README references ritual structure, update to canonical names.

**Step 3: Commit if changes made**

```bash
git add README.md
git commit -m "docs: update README.md with canonical ritual phases"
```

---

## Task 14: Verification and Final Commit

**Step 1: Verify all files updated**

Run: `grep -r "What I Need" .claude/skills/rituals/`

Expected: No matches (all changed to "Context")

Run: `grep -r "Pre-Flight Check" .claude/skills/rituals/`

Expected: No matches (all changed to "Validate")

**Step 2: Check git status**

Run: `git status`

Expected: All ritual SKILL.md files + DEVELOPING.md + CLAUDE.md + possibly README.md modified and committed

**Step 3: Create summary of changes**

Document:
- 10 ritual files updated with canonical phase names
- DEVELOPING.md updated with ritual structure reference
- CLAUDE.md updated with canonical phase names
- README.md updated if applicable

**Step 4: Final verification**

Test one ritual from each type:
- Planning: `claude skill run rituals/planning-daily`
- Review: `claude skill run rituals/review-weekly`

Expected: Both execute successfully with new structure

---

## Testing Strategy

**Manual Testing:**
- Run each ritual after updating to verify it still executes
- Check that phase transitions are clear
- Verify subsections within phases still work

**Documentation Testing:**
- Review DEVELOPING.md to ensure new section is scannable
- Check that examples match canonical phase names
- Verify cross-references between docs are consistent

---

## Rollback Plan

If issues arise:
- Each ritual updated in separate commit
- Can revert individual ritual commits
- Can revert DEVELOPING.md separately
- Git history maintains full rollback capability

---

## Success Criteria

- [ ] DEVELOPING.md has "Ritual Structure" section with 6 canonical phases
- [ ] All 10 ritual SKILL.md files use canonical section names
- [ ] No remaining instances of "What I Need", "Pre-Flight Check", "Planning Session", "Interactive Review" as section headers
- [ ] All rituals execute successfully after refactoring
- [ ] CLAUDE.md references updated to canonical names
- [ ] Design document committed to docs/plans/
