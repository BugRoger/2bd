# ritual-planning-daily No-Orchestrator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite ritual-planning-daily to remove orchestrator dependency, using explicit procedural steps instead.

**Architecture:** Replace prose-driven `## Context` with explicit `## Setup` containing numbered steps. Keep `_fetch-calendar` and `_resolve-dates` sub-skills. Hardcode vault paths relative to skill location.

**Tech Stack:** Claude Code skills (markdown), Glob for People file discovery

---

## Task 1: Update SKILL.md Frontmatter

**Files:**
- Modify: `.claude/skills/ritual-planning-daily/SKILL.md:1-7`

**Step 1: Remove orchestrated metadata**

Change frontmatter from:

```yaml
---
name: planning-daily
description: Morning ritual for planning the day. Use when starting work to set priorities, prepare for meetings, and establish leadership intention.
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
metadata:
  orchestrated: true
---
```

To:

```yaml
---
name: planning-daily
description: Morning ritual for planning the day. Use when starting work to set priorities, prepare for meetings, and establish leadership intention.
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---
```

**Step 2: Verify change**

Run: `head -10 .claude/skills/ritual-planning-daily/SKILL.md`
Expected: No `metadata:` or `orchestrated:` lines

**Step 3: Commit**

Run: `git add .claude/skills/ritual-planning-daily/SKILL.md && git commit -m "chore(ritual-planning-daily): remove orchestrated metadata"`

---

## Task 2: Add Paths Section

**Files:**
- Modify: `.claude/skills/ritual-planning-daily/SKILL.md`

**Step 1: Add Paths section after intro paragraph**

Insert after line 11 (`Help the user plan their day...`):

```markdown

## Paths

This skill runs from the vault. Resolve vault root from skill location (parent of `.claude/skills/`).

All paths below are relative to vault root.
```

**Step 2: Verify change**

Run: `grep -A 4 "## Paths" .claude/skills/ritual-planning-daily/SKILL.md`
Expected: Shows the Paths section with vault root explanation

**Step 3: Commit**

Run: `git add .claude/skills/ritual-planning-daily/SKILL.md && git commit -m "chore(ritual-planning-daily): add Paths section for vault root convention"`

---

## Task 3: Replace Context Section with Setup

**Files:**
- Modify: `.claude/skills/ritual-planning-daily/SKILL.md`

**Step 1: Replace the Context section**

Replace:

```markdown
## Context

- Calendar events for the day
- User's directives and preferences
- Today.md file for this day (may not exist yet)
- Week.md for weekly context
- Month.md for monthly context
- Quarter.md for coaching context
- People files for anyone with 1:1 meetings
- Active project files
```

With:

```markdown
## Setup

Load context before starting the session:

1. **Resolve date** — Invoke `_resolve-dates` with argument (default: today)
2. **Fetch calendar** — Invoke `_fetch-calendar` for target date
3. **Load hierarchical context:**
   - `00_Brain/Captive/Week.md`
   - `00_Brain/Captive/Month.md`
   - `00_Brain/Captive/Quarter.md`
4. **Load directives:**
   - `00_Brain/Systemic/Directives/user-profile.md`
   - `00_Brain/Systemic/Directives/ai-personality.md`
5. **Find People for 1:1s** — Parse calendar for 1:1 meetings, Glob `02_Areas/People/*.md` for matching names
6. **Check existing Today.md** — `00_Brain/Captive/Today.md`

Graceful degradation: If any file doesn't exist, note it and continue.
```

**Step 2: Verify change**

Run: `grep -A 20 "## Setup" .claude/skills/ritual-planning-daily/SKILL.md`
Expected: Shows Setup section with numbered steps and explicit paths

**Step 3: Commit**

Run: `git add .claude/skills/ritual-planning-daily/SKILL.md && git commit -m "refactor(ritual-planning-daily): replace Context with explicit Setup steps"`

---

## Task 4: Update Compose Section

**Files:**
- Modify: `.claude/skills/ritual-planning-daily/SKILL.md`

**Step 1: Update Compose to use vault template**

Replace:

```markdown
## Compose

Build the complete Today.md file using [today-template.md](references/today-template.md) as structure guide:
- Fill frontmatter with calculated date fields (YYYY-MM-DD, day name, ISO week, month, quarter)
- Include standard navigation links
- Write all sections in template order
```

With:

```markdown
## Compose

Build Today.md:
- Load template from `00_Brain/Systemic/Templates/Captive/today.md`
- Fill frontmatter with date fields from resolved date
- Write all sections from session
```

**Step 2: Verify change**

Run: `grep -A 5 "## Compose" .claude/skills/ritual-planning-daily/SKILL.md`
Expected: Shows vault template path, not references/today-template.md

**Step 3: Commit**

Run: `git add .claude/skills/ritual-planning-daily/SKILL.md && git commit -m "refactor(ritual-planning-daily): load template from vault instead of references"`

---

## Task 5: Update Persist Section

**Files:**
- Modify: `.claude/skills/ritual-planning-daily/SKILL.md`

**Step 1: Make output path explicit**

Replace:

```markdown
## Persist

Write Today.md to Captive.
```

With:

```markdown
## Persist

Write to `00_Brain/Captive/Today.md`.
```

**Step 2: Verify change**

Run: `grep -A 2 "## Persist" .claude/skills/ritual-planning-daily/SKILL.md`
Expected: Shows explicit path `00_Brain/Captive/Today.md`

**Step 3: Commit**

Run: `git add .claude/skills/ritual-planning-daily/SKILL.md && git commit -m "refactor(ritual-planning-daily): make Persist path explicit"`

---

## Task 6: Remove today-template.md Reference File

**Files:**
- Delete: `.claude/skills/ritual-planning-daily/references/today-template.md`

**Step 1: Delete the file**

Run: `rm .claude/skills/ritual-planning-daily/references/today-template.md`

**Step 2: Verify deletion**

Run: `ls .claude/skills/ritual-planning-daily/references/`
Expected: Lists 4 files (session-flow.md, context-summary.md, priorities-framework.md, meeting-templates.md), NOT today-template.md

**Step 3: Commit**

Run: `git add -A .claude/skills/ritual-planning-daily/references/ && git commit -m "chore(ritual-planning-daily): remove today-template.md (now loaded from vault)"`

---

## Task 7: Final Verification

**Files:**
- Verify: `.claude/skills/ritual-planning-daily/SKILL.md`

**Step 1: Verify complete structure**

Run: `grep "^## " .claude/skills/ritual-planning-daily/SKILL.md`

Expected output:
```
## Paths
## Setup
## Validate
## Session
## Compose
## Persist
## Confirm
```

**Step 2: Verify no orchestrator references**

Run: `grep -i "orchestrat" .claude/skills/ritual-planning-daily/SKILL.md`
Expected: No output (no matches)

**Step 3: Verify no $VAULT in prose**

Run: `grep '\$VAULT' .claude/skills/ritual-planning-daily/SKILL.md`
Expected: No output (no matches)

**Step 4: Review final file**

Run: `cat .claude/skills/ritual-planning-daily/SKILL.md`
Verify manually that structure matches design doc.

---

## Summary

| Task | Description | Commit Message |
|------|-------------|----------------|
| 1 | Remove orchestrated metadata | `chore: remove orchestrated metadata` |
| 2 | Add Paths section | `chore: add Paths section` |
| 3 | Replace Context with Setup | `refactor: replace Context with explicit Setup` |
| 4 | Update Compose section | `refactor: load template from vault` |
| 5 | Update Persist section | `refactor: make Persist path explicit` |
| 6 | Delete today-template.md | `chore: remove today-template.md` |
| 7 | Final verification | (no commit) |
