# Project Lifecycle Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement create-project and archive-project commands with vault sync, scaffolded for future tool integrations.

**Architecture:** Orchestrated skills with sequential sync phases. Each tool sync is a sub-skill following a shared interface. MVP implements vault only; Finder/Outlook are stubs.

**Tech Stack:** Claude skills (SKILL.md + phases.yaml), markdown templates, YAML frontmatter.

---

## Task 1: fetch-projects Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/fetch-projects/SKILL.md`

**Step 1: Create the sub-skill directory**

```bash
mkdir -p .claude/skills/_sub/fetch-projects
```

**Step 2: Write the SKILL.md**

Create `.claude/skills/_sub/fetch-projects/SKILL.md`:

```markdown
---
name: fetch-projects
description: List projects from 01_Projects/ and 04_Archives/Projects/. Returns structured data with title, deadline, status, and timeline urgency.
disable-model-invocation: true
allowed-tools: Read, Bash(ls), Glob
argument-hint: "[scope: active|archived|all]"
---

# Fetch Projects Sub-Skill

Lists projects from the vault for selection in create/archive workflows.

## Prerequisites

This sub-skill expects `$VAULT` to be set by the calling skill (via `fetch-config`).

## Arguments

- `scope` - Optional. `active` (default), `archived`, or `all`

## File Locations

- **Active projects:** `$VAULT/01_Projects/`
- **Archived projects:** `$VAULT/04_Archives/Projects/`
- **Hub file (excluded):** `✱ Projects.md`

## Execution Steps

### 1. List Project Files

For active projects:
```bash
ls -1 "$VAULT/01_Projects/"*.md 2>/dev/null | grep -v "✱ Projects.md"
```

For archived projects (if scope includes):
```bash
ls -1 "$VAULT/04_Archives/Projects/"*.md 2>/dev/null
```

### 2. For Each Project File

Read the file and parse:

**Frontmatter Fields:**
- `title` - Project name
- `end_date` - Deadline (YYYY-MM-DD)
- `status` - `active`, `completed`, `on-hold`, `archived`
- `owner` - Project owner
- `tags` - Array of tags

**Extract from filename:**
- `slug` - The slug portion (e.g., `quarterly-planning` from `2026-03-31-quarterly-planning.md`)
- `file_date` - The date prefix (e.g., `2026-03-31`)

### 3. Calculate Timeline Urgency

For active projects, calculate relative to today:

- `days_remaining` = end_date - today
- `timeline_urgency`:
  - `overdue` if `end_date < today`
  - `due_soon` if `end_date < today + 14 days`
  - `on_track` otherwise

### 4. Sort Results

Sort by `end_date` ascending (earliest deadlines first).

### 5. Return Structured Result

**Success:**
```json
{
  "success": true,
  "active_count": 3,
  "archived_count": 5,
  "projects": [
    {
      "file": "2026-02-20-hiring-round.md",
      "path": "/path/to/vault/01_Projects/2026-02-20-hiring-round.md",
      "slug": "hiring-round",
      "title": "Assessment Center Hiring",
      "end_date": "2026-02-20",
      "days_remaining": 5,
      "timeline_urgency": "due_soon",
      "status": "active",
      "location": "active"
    }
  ]
}
```

**No Projects:**
```json
{
  "success": true,
  "active_count": 0,
  "archived_count": 0,
  "projects": [],
  "message": "No projects found"
}
```

For backwards compatibility, also output human-readable list:
```
Active Projects: 3 found

1. Assessment Center Hiring
   Slug: hiring-round
   Due: 2026-02-20 (5 days) ⚠️ Due Soon

2. Platform Migration
   Slug: platform-migration
   Due: 2026-03-15 (28 days) ✅ On Track
```
```

**Step 3: Verify file created**

```bash
head -20 .claude/skills/_sub/fetch-projects/SKILL.md
```

Expected: See the frontmatter and first section.

**Step 4: Commit**

```bash
git add .claude/skills/_sub/fetch-projects/SKILL.md
git commit -m "feat(sub-skill): add fetch-projects for project lifecycle"
```

---

## Task 2: project-sync-vault Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/project-sync-vault/SKILL.md`

**Step 1: Create the sub-skill directory**

```bash
mkdir -p .claude/skills/_sub/project-sync-vault
```

**Step 2: Write the SKILL.md**

Create `.claude/skills/_sub/project-sync-vault/SKILL.md`:

```markdown
---
name: project-sync-vault
description: Create or archive a project in the vault. Handles markdown file creation/movement and frontmatter updates.
disable-model-invocation: true
allowed-tools: Read, Write, Bash(ls, mv, mkdir)
argument-hint: "action=create|archive project={{PROJECT}}"
---

# Project Sync Vault Sub-Skill

Handles project lifecycle operations in the vault (markdown files).

## Prerequisites

This sub-skill expects:
- `$VAULT` to be set by the calling skill
- `project` data object passed via args

## Arguments

- `action` - Required. `create` or `archive`
- `vault` - Required. Path to vault
- `project` - Required. Project data object:
  - `name` - Display name
  - `slug` - URL-safe identifier
  - `due_date` - YYYY-MM-DD
  - `purpose` - Goal statement
  - `outcomes[]` - Key outcomes (optional)
  - `people[]` - Related people (optional)
  - `path` - Existing file path (for archive action)

---

## Action: Create

### 1. Build File Path

```
$VAULT/01_Projects/{due_date}-{slug}.md
```

Example: `$VAULT/01_Projects/2026-03-31-quarterly-planning.md`

### 2. Check for Duplicates

```bash
ls "$VAULT/01_Projects/"*-{slug}.md 2>/dev/null
```

If exists, return error with suggestion to use different name.

### 3. Generate Content

Use project template structure:

```markdown
---
title: {name}
end_date: {due_date}
status: active
owner:
tags: []
---

[[00_Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]

---

# {name}

## Overview

**Goal:** {purpose}

**Why Now:** [To be filled]

**End Date:** {due_date}

---

## Outcomes

### Must Have
{for each outcome: - [ ] {outcome}}

### Should Have
- [ ] [To be defined]

### Could Have
- [ ] [To be defined]

---

## Milestones

| Date | Milestone | Status |
|------|-----------|--------|
| {due_date} | Project Complete | 🟡 Planned |

*Status: 🟡 Planned | 🔵 In Progress | 🟢 Complete | 🔴 Blocked*

---

## Updates

### {today} - Project Created
- Goal: {purpose}
{if people: - Key people: {people as wikilinks}}

---

## Resources

### Links
- [Add relevant links]

### Related Projects
- [Add related projects]

### People
{for each person: - [[02_Areas/People/{person}|{person}]]}

---

## Team

| Name | Role | Involvement |
|------|------|-------------|
| [Name] | Project Lead | [Time commitment] |

---

## Archive Notes

*When project completes, add final summary before moving to Archives:*

**Final Status:**
**Key Learnings:**
**Impact:**
```

### 4. Write File

Write the generated content to the file path.

### 5. Return Result

**Success:**
```json
{
  "success": true,
  "action": "create",
  "path": "/path/to/vault/01_Projects/2026-03-31-quarterly-planning.md",
  "slug": "quarterly-planning",
  "message": "Project created successfully"
}
```

**Error (duplicate):**
```json
{
  "success": false,
  "action": "create",
  "error": "duplicate_slug",
  "message": "Project with slug 'quarterly-planning' already exists",
  "existing_path": "/path/to/existing.md",
  "suggestion": "Use a different project name or archive the existing project first"
}
```

---

## Action: Archive

### 1. Verify Source Exists

Check that `project.path` exists and is in `01_Projects/`.

### 2. Build Archive Path

```
$VAULT/04_Archives/Projects/{filename}
```

### 3. Ensure Archive Directory Exists

```bash
mkdir -p "$VAULT/04_Archives/Projects"
```

### 4. Read Current Content

Read the project file to update frontmatter.

### 5. Update Frontmatter

Change `status: active` to `status: archived`.

Add archive date: `archived_date: {today}`.

### 6. Update Archive Notes Section

If archive summary provided in project data, fill:
- Final Status
- Key Learnings
- Impact

### 7. Move File

```bash
mv "$VAULT/01_Projects/{filename}" "$VAULT/04_Archives/Projects/{filename}"
```

### 8. Return Result

**Success:**
```json
{
  "success": true,
  "action": "archive",
  "source_path": "/path/to/01_Projects/file.md",
  "archive_path": "/path/to/04_Archives/Projects/file.md",
  "message": "Project archived successfully"
}
```

**Error:**
```json
{
  "success": false,
  "action": "archive",
  "error": "source_not_found",
  "message": "Project file not found at {path}"
}
```
```

**Step 3: Verify and commit**

```bash
git add .claude/skills/_sub/project-sync-vault/SKILL.md
git commit -m "feat(sub-skill): add project-sync-vault for vault operations"
```

---

## Task 3: project-sync-finder Stub

**Files:**
- Create: `.claude/skills/_sub/project-sync-finder/SKILL.md`

**Step 1: Create the stub**

```bash
mkdir -p .claude/skills/_sub/project-sync-finder
```

**Step 2: Write minimal SKILL.md**

Create `.claude/skills/_sub/project-sync-finder/SKILL.md`:

```markdown
---
name: project-sync-finder
description: "[NOT IMPLEMENTED] Create or archive project folders in Finder. Mirrors PARA structure in file system.
disable-model-invocation: true
allowed-tools: Bash(mkdir, mv, ls)
argument-hint: "action=create|archive project={{PROJECT}}"
---

# Project Sync Finder Sub-Skill

**Status:** Not implemented. This is a placeholder for future development.

## Planned Functionality

### Action: Create

Create folder structure at `~/Projects/{due_date}-{slug}/`:
- `Assets/` - Images, diagrams, etc.
- `Documents/` - Working documents

### Action: Archive

Move project folder to `~/Projects/_Archive/`.

## Interface

Same as `project-sync-vault`:
- Input: `action`, `vault`, `project` object
- Output: `success`, `path`, `error`

## Configuration

Will read from `.claude/config.md`:
```markdown
finder_projects_path: ~/Projects
```

## Implementation Notes

When implementing:
1. Check if Finder integration is enabled in config
2. Handle path expansion (`~` to full path)
3. Create with proper permissions
4. Handle existing folders gracefully
```

**Step 3: Commit**

```bash
git add .claude/skills/_sub/project-sync-finder/SKILL.md
git commit -m "feat(sub-skill): add project-sync-finder stub"
```

---

## Task 4: project-sync-outlook Stub

**Files:**
- Create: `.claude/skills/_sub/project-sync-outlook/SKILL.md`

**Step 1: Create the stub**

```bash
mkdir -p .claude/skills/_sub/project-sync-outlook
```

**Step 2: Write minimal SKILL.md**

Create `.claude/skills/_sub/project-sync-outlook/SKILL.md`:

```markdown
---
name: project-sync-outlook
description: "[NOT IMPLEMENTED] Create or archive project mail folders in Outlook365. PARA-aligned email organization."
disable-model-invocation: true
allowed-tools: Bash
argument-hint: "action=create|archive project={{PROJECT}}"
---

# Project Sync Outlook Sub-Skill

**Status:** Not implemented. This is a placeholder for future development.

## Planned Functionality

### Action: Create

Create mail folder under `Projects/` in Outlook:
- `Projects/{due_date}-{slug}/`

### Action: Archive

Move mail folder to `Projects/Archive/`.

## Interface

Same as `project-sync-vault`:
- Input: `action`, `vault`, `project` object
- Output: `success`, `folder_path`, `error`

## Configuration

Will read from `.claude/config.md`:
```markdown
outlook_enabled: true
outlook_projects_folder: Projects
```

## Implementation Options

1. **Microsoft Graph API** - Cross-platform, requires OAuth setup
2. **AppleScript** - macOS only, simpler auth

## Implementation Notes

When implementing:
1. Check if Outlook integration is enabled in config
2. Authenticate with chosen method
3. Handle folder creation/movement via API
4. Return folder ID or path for reference
```

**Step 3: Commit**

```bash
git add .claude/skills/_sub/project-sync-outlook/SKILL.md
git commit -m "feat(sub-skill): add project-sync-outlook stub"
```

---

## Task 5: create-project Command Skill

**Files:**
- Create: `.claude/skills/commands/create-project/SKILL.md`
- Create: `.claude/skills/commands/create-project/phases.yaml`

**Step 1: Create directory**

```bash
mkdir -p .claude/skills/commands/create-project
```

**Step 2: Write SKILL.md**

Create `.claude/skills/commands/create-project/SKILL.md`:

```markdown
---
name: create-project
description: Create a new project with guided setup. Syncs to vault (and future: Finder, Outlook).
argument-hint: "[project-name]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Create Project

Guided wizard to create a new project across synced tools.

## Flow

1. **Setup** — Load vault config, fetch existing projects (duplicate detection)
2. **Interact** — Guided wizard: name, due date, purpose, outcomes, people
3. **Generate** — Build project data object with slug
4. **Sync** — Sequential sync to each enabled tool
5. **Confirm** — Summary of created artifacts

---

## Interactive Wizard

Ask questions one at a time. Use AskUserQuestion for structured choices where applicable.

### Question 1: Project Name (required)

"What's the project name?"

Accept natural language. Generate slug from name:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Max 50 characters

Example: "Q2 Platform Migration" → `q2-platform-migration`

### Question 2: Due Date (required)

"When is this project due?"

Accept flexible formats:
- Exact: `2026-03-31`, `March 31`
- Relative: `in 2 weeks`, `end of month`, `end of Q1`
- Named: `end of March`, `mid April`

Parse to YYYY-MM-DD format.

### Question 3: Purpose (required)

"In one sentence, what's the goal?"

This becomes the Goal statement in the project file.

### Question 4: Key Outcomes (optional)

"What are the must-have outcomes? (Enter to skip)"

Accept 1-3 bullet points. These populate the Must Have section.

### Question 5: Related People (optional)

"Who are the key people involved? (Enter to skip)"

Accept comma-separated names. Creates wikilinks to `02_Areas/People/`.

---

## Generate

Build project data object:

```json
{
  "name": "Q2 Platform Migration",
  "slug": "q2-platform-migration",
  "due_date": "2026-03-31",
  "purpose": "Complete migration of all services to new platform",
  "outcomes": ["API migration", "Data migration", "Testing complete"],
  "people": ["Alice", "Bob"]
}
```

---

## Sync Sequence

Execute sync sub-skills in sequence. If one fails, report but continue to next.

1. **sync-vault** (required) — Create markdown file
2. **sync-finder** (optional, future) — Create folder structure
3. **sync-outlook** (optional, future) — Create mail folder

---

## Confirm

After all syncs complete, summarize:

```
Project created: Q2 Platform Migration

✅ Vault: 01_Projects/2026-03-31-q2-platform-migration.md
⏭️ Finder: Not enabled
⏭️ Outlook: Not enabled

Next steps:
- Open the project file to add milestones
- Link related documents and resources
```
```

**Step 3: Write phases.yaml**

Create `.claude/skills/commands/create-project/phases.yaml`:

```yaml
# Orchestration phases for create-project command

phases:
  # Phase 0: Setup (parallel, read-only)
  - name: setup
    parallel: true
    subagents:
      - skill: _sub/fetch-config
        type: explore
        output: VAULT
      - skill: _sub/fetch-projects
        type: explore
        args: "scope=active"
        output: EXISTING_PROJECTS

  # Phase 1: Interactive Wizard (inline)
  - name: interact
    depends_on: [setup]
    inline: true

  # Phase 2: Generate Project Data (inline)
  - name: generate
    depends_on: [interact]
    inline: true

  # Phase 3: Sync to Vault (required)
  - name: sync-vault
    depends_on: [generate]
    subagents:
      - skill: _sub/project-sync-vault
        type: general-purpose
        args: "action=create vault={{VAULT}} project={{PROJECT}}"
        output: VAULT_RESULT

  # Phase 4: Sync to Finder (future, optional)
  - name: sync-finder
    depends_on: [sync-vault]
    optional: true
    enabled: false  # Enable when implemented
    subagents:
      - skill: _sub/project-sync-finder
        type: general-purpose
        args: "action=create project={{PROJECT}}"
        output: FINDER_RESULT
        on_error: "Finder sync skipped."

  # Phase 5: Sync to Outlook (future, optional)
  - name: sync-outlook
    depends_on: [sync-finder]
    optional: true
    enabled: false  # Enable when implemented
    subagents:
      - skill: _sub/project-sync-outlook
        type: general-purpose
        args: "action=create project={{PROJECT}}"
        output: OUTLOOK_RESULT
        on_error: "Outlook sync skipped."

  # Phase 6: Confirm (inline)
  - name: confirm
    depends_on: [sync-vault]
    inline: true
```

**Step 4: Verify and commit**

```bash
git add .claude/skills/commands/create-project/
git commit -m "feat(command): add create-project with vault sync"
```

---

## Task 6: archive-project Command Skill

**Files:**
- Create: `.claude/skills/commands/archive-project/SKILL.md`
- Create: `.claude/skills/commands/archive-project/phases.yaml`

**Step 1: Create directory**

```bash
mkdir -p .claude/skills/commands/archive-project
```

**Step 2: Write SKILL.md**

Create `.claude/skills/commands/archive-project/SKILL.md`:

```markdown
---
name: archive-project
description: Archive a completed project. Captures final summary and moves to archives across synced tools.
argument-hint: "[project-slug]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Archive Project

Guided workflow to archive a completed project across synced tools.

## Flow

1. **Setup** — Load vault config, fetch active projects
2. **Select** — Choose project to archive
3. **Interact** — Capture final summary (wins, learnings, impact)
4. **Generate** — Build archive data
5. **Sync** — Sequential sync to each enabled tool
6. **Confirm** — Summary of archived artifacts

---

## Select Project

Present list of active projects. If project slug provided as argument, validate it exists.

```
Active Projects:

1. Q2 Platform Migration (due 2026-03-31) ✅ On Track
2. Assessment Center Hiring (due 2026-02-20) ⚠️ Due Soon
3. Team Offsite Planning (due 2026-04-15) ✅ On Track

Which project to archive? [1-3 or slug]:
```

---

## Interactive Summary

Ask questions one at a time to capture archive summary.

### Question 1: Final Status

"How did the project end?"

Options:
- Completed successfully
- Partially completed
- Cancelled
- On hold indefinitely

### Question 2: Key Wins

"What went well? What are you proud of?"

Accept free text. 2-3 bullet points.

### Question 3: Key Learnings

"What would you do differently next time?"

Accept free text. 2-3 bullet points.

### Question 4: Impact

"What was the actual outcome or impact?"

Accept free text. Brief statement.

### Question 5: Follow-ups

"Any follow-up tasks or related projects? (Enter to skip)"

Accept free text for items to carry forward.

---

## Generate

Build archive data:

```json
{
  "path": "/path/to/01_Projects/2026-03-31-q2-platform-migration.md",
  "slug": "q2-platform-migration",
  "archive_summary": {
    "final_status": "Completed successfully",
    "key_wins": ["Finished ahead of schedule", "Zero downtime migration"],
    "key_learnings": ["Start testing earlier", "Document as you go"],
    "impact": "All services now running on new platform with 40% cost reduction",
    "follow_ups": ["Monitor performance for 30 days", "Schedule retrospective"]
  }
}
```

---

## Sync Sequence

Execute sync sub-skills in sequence.

1. **sync-vault** (required) — Move file, update frontmatter
2. **sync-finder** (optional, future) — Move folder to archive
3. **sync-outlook** (optional, future) — Move mail folder to archive

---

## Confirm

After all syncs complete, summarize:

```
Project archived: Q2 Platform Migration

✅ Vault: Moved to 04_Archives/Projects/2026-03-31-q2-platform-migration.md
⏭️ Finder: Not enabled
⏭️ Outlook: Not enabled

Final status: Completed successfully
Key impact: All services now running on new platform with 40% cost reduction

Follow-ups to consider:
- Monitor performance for 30 days
- Schedule retrospective
```
```

**Step 3: Write phases.yaml**

Create `.claude/skills/commands/archive-project/phases.yaml`:

```yaml
# Orchestration phases for archive-project command

phases:
  # Phase 0: Setup (parallel, read-only)
  - name: setup
    parallel: true
    subagents:
      - skill: _sub/fetch-config
        type: explore
        output: VAULT
      - skill: _sub/fetch-projects
        type: explore
        args: "scope=active"
        output: ACTIVE_PROJECTS

  # Phase 1: Select Project (inline)
  - name: select
    depends_on: [setup]
    inline: true

  # Phase 2: Interactive Summary (inline)
  - name: interact
    depends_on: [select]
    inline: true

  # Phase 3: Generate Archive Data (inline)
  - name: generate
    depends_on: [interact]
    inline: true

  # Phase 4: Sync to Vault (required)
  - name: sync-vault
    depends_on: [generate]
    subagents:
      - skill: _sub/project-sync-vault
        type: general-purpose
        args: "action=archive vault={{VAULT}} project={{PROJECT}}"
        output: VAULT_RESULT

  # Phase 5: Sync to Finder (future, optional)
  - name: sync-finder
    depends_on: [sync-vault]
    optional: true
    enabled: false
    subagents:
      - skill: _sub/project-sync-finder
        type: general-purpose
        args: "action=archive project={{PROJECT}}"
        output: FINDER_RESULT
        on_error: "Finder sync skipped."

  # Phase 6: Sync to Outlook (future, optional)
  - name: sync-outlook
    depends_on: [sync-finder]
    optional: true
    enabled: false
    subagents:
      - skill: _sub/project-sync-outlook
        type: general-purpose
        args: "action=archive project={{PROJECT}}"
        output: OUTLOOK_RESULT
        on_error: "Outlook sync skipped."

  # Phase 7: Confirm (inline)
  - name: confirm
    depends_on: [sync-vault]
    inline: true
```

**Step 4: Verify and commit**

```bash
git add .claude/skills/commands/archive-project/
git commit -m "feat(command): add archive-project with vault sync"
```

---

## Task 7: Update Issue #2

**Files:**
- Modify: GitHub issue #2

**Step 1: Update issue body**

Update issue #2 to reflect the redesigned scope:

1. Update the summary to reference the design doc
2. Mark Phase 1 sub-issues as the current scope
3. Move Finder (#6) and Outlook (#7) to Phase 2/3 section
4. Add link to design doc

**Step 2: Update sub-issue checkboxes**

Phase 1 (MVP):
- [ ] #3 - Implement create-project → covered by Task 5
- [ ] #4 - Implement archive-project → covered by Task 6
- [ ] #5 - Implement fetch-projects → covered by Task 1
- [ ] #8 - Update documentation → Task 8

Phase 2+ (Future):
- [ ] #6 - Finder integration (stub created)
- [ ] #7 - Outlook integration (stub created)

---

## Task 8: Update Documentation

**Files:**
- Modify: `CLAUDE.md` (add commands to quick reference)
- Modify: `README.md` (add project commands to usage)

**Step 1: Update CLAUDE.md quick reference**

Add to the Quick Reference section:

```markdown
claude skill run commands/create-project    # new project
claude skill run commands/archive-project   # archive completed project
```

**Step 2: Update README.md**

Add project commands to the usage documentation, explaining:
- How to create a new project
- How to archive a completed project
- Future: Finder and Outlook integrations

**Step 3: Commit documentation**

```bash
git add CLAUDE.md README.md
git commit -m "docs: add project lifecycle commands to documentation"
```

---

## Task 9: Final Verification

**Step 1: List all new skills**

```bash
find .claude/skills -name "SKILL.md" | grep -E "(fetch-projects|project-sync|create-project|archive-project)" | sort
```

Expected output:
```
.claude/skills/_sub/fetch-projects/SKILL.md
.claude/skills/_sub/project-sync-finder/SKILL.md
.claude/skills/_sub/project-sync-outlook/SKILL.md
.claude/skills/_sub/project-sync-vault/SKILL.md
.claude/skills/commands/archive-project/SKILL.md
.claude/skills/commands/create-project/SKILL.md
```

**Step 2: Verify phases.yaml files**

```bash
find .claude/skills -name "phases.yaml" | grep -E "(create-project|archive-project)" | sort
```

Expected:
```
.claude/skills/commands/archive-project/phases.yaml
.claude/skills/commands/create-project/phases.yaml
```

**Step 3: Verify git history**

```bash
git log --oneline -10
```

Verify commits for:
- fetch-projects sub-skill
- project-sync-vault sub-skill
- project-sync-finder stub
- project-sync-outlook stub
- create-project command
- archive-project command
- documentation updates

---

## Summary

**Sub-skills created (4):**
- `_sub/fetch-projects` — List projects for selection
- `_sub/project-sync-vault` — Create/archive in vault (implemented)
- `_sub/project-sync-finder` — Finder integration (stub)
- `_sub/project-sync-outlook` — Outlook integration (stub)

**Commands created (2):**
- `commands/create-project` — Interactive wizard + sequential sync
- `commands/archive-project` — Project selection + archive summary + sequential sync

**Architecture:**
- Sequential sync phases for partial success
- Shared interface across all sync sub-skills
- Optional phases for future tools (no main skill changes needed)
- `enabled: false` flag for unimplemented sync phases

**Total commits: 8**
