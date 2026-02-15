# Changelog Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add automatic changelog entries to notes when the system updates them, providing transparency into ritual activity.

**Architecture:** New `append-changelog` sub-skill that other write skills call after modifications. Entry format: `- \`2026-02-15 09:32\` **skill-name** — Action on Section1, Section2 sections`

**Tech Stack:** Markdown templates, YAML skill definitions

---

## Task 1: Create append-changelog Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/append-changelog/SKILL.md`

**Step 1: Create directory**

```bash
mkdir -p .claude/skills/_sub/append-changelog
```

**Step 2: Write the sub-skill file**

```markdown
---
name: append-changelog
description: Append a changelog entry to a note. Called by write skills after modifying files.
disable-model-invocation: true
allowed-tools: Read, Write
---

# Append Changelog Sub-Skill

Appends a timestamped changelog entry to a note file. Entries are reverse-chronological (newest first).

## Input Arguments

Arguments are passed as key-value pairs:
- `path`: Full path to the note file
- `skill`: Name of the skill making the change (e.g., "planning-daily")
- `action`: Verb summarizing the action (e.g., "Rewrote", "Added", "Updated")
- `sections`: Comma-separated list of section names affected (optional)
- `summary`: Additional context (optional)

## Instructions

### 1. Generate Timestamp

Get current date and time in format `YYYY-MM-DD HH:mm` (24-hour).

### 2. Build Entry

Format:
```
- `{timestamp}` **{skill}** — {action}{sections_text}{summary_text}
```

Where:
- `{sections_text}` = ` {sections} sections` if sections provided, else empty
- `{summary_text}` = ` ({summary})` if summary provided, else empty

**Examples:**
```
- `2026-02-15 09:32` **planning-daily** — Rewrote Focus, Context From Above sections
- `2026-02-15 18:30` **review-daily** — Added entry to Interactions section (from synthesis)
- `2026-02-15 10:00` **create-project** — Created project
```

### 3. Read File

Read the existing content of the file at `path`.

If file doesn't exist, return error:
```json
{
  "success": false,
  "error": "file_not_found",
  "message": "Cannot append changelog: file does not exist"
}
```

### 4. Locate Changelog Section

Find `## Changelog` heading (case-insensitive).

**If section exists:**
- Find the line immediately after the heading
- Skip any italicized placeholder text (lines starting with `*`)
- Insert entry at the top of the list (before existing entries)

**If section does not exist:**
- Append new section at end of file:
```markdown

## Changelog

{entry}
```

### 5. Write Updated File

Write the modified content back to the file.

### 6. Return Result

**Success:**
```json
{
  "success": true,
  "path": "/path/to/note.md",
  "entry": "- `2026-02-15 09:32` **planning-daily** — Rewrote Focus section",
  "created_section": false
}
```

**Error:**
```json
{
  "success": false,
  "error": "write_failed",
  "message": "Failed to write changelog entry"
}
```

## Safety

- Always read before write to preserve existing content
- Never delete existing changelog entries
- Only append to the Changelog section
```

**Step 3: Verify file created**

```bash
cat .claude/skills/_sub/append-changelog/SKILL.md | head -20
```

**Step 4: Commit**

```bash
git add .claude/skills/_sub/append-changelog/SKILL.md
git commit -m "feat(skills): add append-changelog sub-skill

Appends timestamped changelog entries to notes.
Called by write skills after modifying files."
```

---

## Task 2: Add Changelog to Captive Templates (today.md)

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/today.md`

**Step 1: Read current template**

```bash
tail -10 scaffold/00_Brain/Systemic/Templates/Captive/today.md
```

**Step 2: Append Changelog section**

Add at the end of the file:

```markdown

---

## Changelog

*Rituals append entries here*
```

**Step 3: Verify change**

```bash
tail -10 scaffold/00_Brain/Systemic/Templates/Captive/today.md
```

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Captive/today.md
git commit -m "feat(templates): add Changelog section to today.md"
```

---

## Task 3: Add Changelog to Remaining Captive Templates

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/week.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/month.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/quarter.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/year.md`

**Step 1: Add Changelog to each file**

For each file, append:

```markdown

---

## Changelog

*Rituals append entries here*
```

**Step 2: Verify changes**

```bash
for f in week month quarter year; do
  echo "=== $f.md ===" && tail -5 scaffold/00_Brain/Systemic/Templates/Captive/$f.md
done
```

**Step 3: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Captive/*.md
git commit -m "feat(templates): add Changelog section to remaining Captive templates"
```

---

## Task 4: Add Changelog to Periodic Templates

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/daily.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/monthly.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/quarterly.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/yearly.md`

**Step 1: Add Changelog to each file**

For each file, append:

```markdown

---

## Changelog

*Rituals append entries here*
```

**Step 2: Verify changes**

```bash
for f in daily monthly quarterly yearly; do
  echo "=== $f.md ===" && tail -5 scaffold/00_Brain/Systemic/Templates/Periodic/$f.md
done
```

**Step 3: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Periodic/*.md
git commit -m "feat(templates): add Changelog section to Periodic archive templates"
```

---

## Task 5: Fix weekly.md Changelog Format

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/weekly.md:119-125`

**Step 1: Read current format**

```bash
sed -n '117,125p' scaffold/00_Brain/Systemic/Templates/Periodic/weekly.md
```

Current (table format):
```markdown
## Changelog

*See #17 for implementation*

| Date | Reason | Changes |
|------|--------|---------|
```

**Step 2: Replace with bullet format**

Replace lines 119-125 with:

```markdown
## Changelog

*Rituals append entries here*
```

**Step 3: Verify change**

```bash
tail -10 scaffold/00_Brain/Systemic/Templates/Periodic/weekly.md
```

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Periodic/weekly.md
git commit -m "fix(templates): convert weekly.md Changelog from table to bullet format"
```

---

## Task 6: Add Changelog to person.md Template

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Areas/People/person.md`

**Step 1: Read current template**

```bash
cat scaffold/00_Brain/Systemic/Templates/Areas/People/person.md
```

**Step 2: Append Changelog section**

Add at the end:

```markdown

---

## Changelog

*Rituals append entries here*
```

**Step 3: Verify change**

```bash
tail -10 scaffold/00_Brain/Systemic/Templates/Areas/People/person.md
```

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Areas/People/person.md
git commit -m "feat(templates): add Changelog section to person.md"
```

---

## Task 7: Update write-captive-note to Call append-changelog

**Files:**
- Modify: `.claude/skills/_sub/write-captive-note/SKILL.md`

**Step 1: Read current file**

```bash
cat .claude/skills/_sub/write-captive-note/SKILL.md
```

**Step 2: Add changelog arguments to Input section**

After existing arguments, add:

```markdown
- `changelog_skill`: (optional) Name of skill to record in changelog
- `changelog_action`: (optional) Action verb for changelog entry
- `changelog_sections`: (optional) Comma-separated list of affected sections
```

**Step 3: Add changelog step after "Verify Write"**

Add new section before Output:

```markdown
### 5. Append Changelog (if provided)

If `changelog_skill` argument was provided:

1. Call `append-changelog` sub-skill with:
   - `path`: The file path just written
   - `skill`: Value of `changelog_skill`
   - `action`: Value of `changelog_action` (default: "Updated")
   - `sections`: Value of `changelog_sections` (if provided)

2. Include changelog result in output
```

**Step 4: Update Output section**

Add to the success JSON:

```json
"changelog": {
  "appended": true,
  "entry": "- `2026-02-15 09:32` **planning-daily** — Rewrote Focus section"
}
```

**Step 5: Commit**

```bash
git add .claude/skills/_sub/write-captive-note/SKILL.md
git commit -m "feat(write-captive-note): integrate append-changelog

Accepts optional changelog args and appends entry after write."
```

---

## Task 8: Update update-semantic to Call append-changelog

**Files:**
- Modify: `.claude/skills/_sub/update-semantic/SKILL.md`

**Step 1: Read current file**

```bash
cat .claude/skills/_sub/update-semantic/SKILL.md
```

**Step 2: Add changelog_skill to update format**

In the Input Arguments section, update the JSON example to include:

```json
{
  "type": "person",
  "path": "02_Areas/People/SarahK.md",
  "section": "Interactions",
  "content": "2026-02-14: Discussed career growth goals.",
  "changelog_skill": "review-daily"
}
```

**Step 3: Add changelog step after Write Updated File**

Add after section 2.6:

```markdown
#### 2.7 Append Changelog

If `changelog_skill` provided in update:

Call `append-changelog` sub-skill with:
- `path`: Full path to the note
- `skill`: Value of `changelog_skill`
- `action`: "Added"
- `sections`: The section name from update
```

**Step 4: Update Return Result**

Add changelog info to the applied array:

```json
{
  "applied": [
    {
      "path": "02_Areas/People/SarahK.md",
      "section": "Interactions",
      "status": "appended",
      "changelog": true
    }
  ]
}
```

**Step 5: Commit**

```bash
git add .claude/skills/_sub/update-semantic/SKILL.md
git commit -m "feat(update-semantic): integrate append-changelog

Appends changelog entry after each semantic note update."
```

---

## Task 9: Update archive-daily to Call append-changelog

**Files:**
- Modify: `.claude/skills/_sub/archive-daily/SKILL.md`

**Step 1: Read current file**

```bash
cat .claude/skills/_sub/archive-daily/SKILL.md
```

**Step 2: Add changelog step after archive write**

After the archive file is written, add:

```markdown
### N. Append Changelog to Archive

Call `append-changelog` sub-skill with:
- `path`: Path to the newly created archive file
- `skill`: "review-daily"
- `action`: "Archived"
- `summary`: "from Captive/Today.md"
```

**Step 3: Commit**

```bash
git add .claude/skills/_sub/archive-daily/SKILL.md
git commit -m "feat(archive-daily): append changelog to archive file"
```

---

## Task 10: Update Remaining Archive Skills

**Files:**
- Modify: `.claude/skills/_sub/archive-weekly/SKILL.md`
- Modify: `.claude/skills/_sub/archive-monthly/SKILL.md`
- Modify: `.claude/skills/_sub/archive-quarterly/SKILL.md`
- Modify: `.claude/skills/_sub/archive-yearly/SKILL.md`

**Step 1: Read each file and add changelog step**

For each archive skill, add after archive write:

```markdown
### N. Append Changelog to Archive

Call `append-changelog` sub-skill with:
- `path`: Path to the newly created archive file
- `skill`: "review-{period}" (e.g., "review-weekly")
- `action`: "Archived"
- `summary`: "from Captive/{Source}.md"
```

**Step 2: Commit**

```bash
git add .claude/skills/_sub/archive-*.SKILL.md
git commit -m "feat(archive-skills): append changelog to archive files"
```

---

## Task 11: Update project-sync-vault to Call append-changelog

**Files:**
- Modify: `.claude/skills/_sub/project-sync-vault/SKILL.md`

**Step 1: Read current file**

```bash
cat .claude/skills/_sub/project-sync-vault/SKILL.md
```

**Step 2: Add changelog for create action**

After project file is created, add:

```markdown
### Append Changelog (create)

Call `append-changelog` sub-skill with:
- `path`: Path to the new project file
- `skill`: "create-project"
- `action`: "Created"
```

**Step 3: Add changelog for archive action**

Before project file is moved/archived, add:

```markdown
### Append Changelog (archive)

Call `append-changelog` sub-skill with:
- `path`: Path to the project file
- `skill`: "archive-project"
- `action`: "Archived"
- `summary`: "status: {status}"
```

**Step 4: Commit**

```bash
git add .claude/skills/_sub/project-sync-vault/SKILL.md
git commit -m "feat(project-sync-vault): append changelog on create and archive"
```

---

## Verification

After all tasks complete:

**Step 1: Verify sub-skill exists**

```bash
ls -la .claude/skills/_sub/append-changelog/
cat .claude/skills/_sub/append-changelog/SKILL.md | head -20
```

**Step 2: Verify templates have Changelog section**

```bash
echo "=== Captive templates ===" && grep -l "## Changelog" scaffold/00_Brain/Systemic/Templates/Captive/*.md
echo "=== Periodic templates ===" && grep -l "## Changelog" scaffold/00_Brain/Systemic/Templates/Periodic/*.md
echo "=== People template ===" && grep -l "## Changelog" scaffold/00_Brain/Systemic/Templates/Areas/People/*.md
```

**Step 3: Verify weekly.md format fixed**

```bash
tail -10 scaffold/00_Brain/Systemic/Templates/Periodic/weekly.md
```

Expected: Bullet format, not table

**Step 4: Verify write skills reference append-changelog**

```bash
grep -l "append-changelog" .claude/skills/_sub/*/SKILL.md
```

Expected: write-captive-note, update-semantic, archive-*, project-sync-vault
