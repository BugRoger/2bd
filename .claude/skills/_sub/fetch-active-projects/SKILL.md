---
name: get-active-projects
description: Scan 01_Projects/ for active projects. Returns structured data with title, deadline, next milestone, and timeline urgency.
disable-model-invocation: true
allowed-tools: Read, Bash(ls), Glob
argument-hint: "[filter: all|due-soon] [days: 14]"
---

# Get Active Projects Sub-Skill

Scans the Projects folder for active projects and returns structured data for planning context.

## Prerequisites

This sub-skill expects `$VAULT` to be set by the calling skill (via `get-config`).

## Arguments

- `filter` - Optional. `all` (default) or `due-soon` to limit to projects due within threshold
- `days` - Optional. Number of days for "due-soon" threshold (default: 14)

## File Location

- **Projects folder:** `$VAULT/01_Projects/`
- **Hub file (excluded):** `$VAULT/01_Projects/✱ Projects.md`

## Execution Steps

### 1. List Project Files

List all `.md` files in the Projects folder:

```bash
ls -1 "$VAULT/01_Projects/"*.md 2>/dev/null | grep -v "✱ Projects.md"
```

If folder is empty or missing, return empty result.

### 2. For Each Project File

Read the file and parse:

#### Frontmatter Fields
- `title` - Project name
- `end_date` - Deadline (YYYY-MM-DD)
- `status` - `active`, `completed`, or `on-hold`
- `owner` - Project owner
- `tags` - Array of tags

Skip files where `status != "active"`.

#### Milestones Table

Parse the `## Milestones` section table:

```markdown
| Date | Milestone | Status |
|------|-----------|--------|
| 2026-02-15 | Phase 1 | 🔵 In Progress |
| 2026-03-01 | Phase 2 | 🟡 Planned |
```

Extract the first milestone where status is NOT `🟢 Complete`.

### 3. Calculate Timeline Urgency

For each active project, calculate relative to today's date:

- `days_remaining` = end_date - today
- `timeline_urgency`:
  - `overdue` if `end_date < today`
  - `due_soon` if `end_date < today + 14 days`
  - `on_track` otherwise

### 4. Apply Filter

If `filter=due-soon`, include only projects where:
- `timeline_urgency` is `overdue` or `due_soon`

### 5. Sort Results

Sort by `end_date` ascending (earliest deadlines first).

### 6. Return Structured Result

**Success (with projects):**
```json
{
  "success": true,
  "count": 3,
  "filter": "all",
  "projects": [
    {
      "file": "2026-02-20-hiring-round.md",
      "path": "/path/to/vault/01_Projects/2026-02-20-hiring-round.md",
      "title": "Assessment Center Hiring",
      "end_date": "2026-02-20",
      "days_remaining": 6,
      "timeline_urgency": "due_soon",
      "owner": "Michael",
      "tags": ["hiring", "Q1"],
      "next_milestone": {
        "date": "2026-02-18",
        "name": "Final Interviews",
        "status": "🔵 In Progress"
      }
    },
    {
      "file": "2026-03-15-platform-migration.md",
      "path": "/path/to/vault/01_Projects/2026-03-15-platform-migration.md",
      "title": "Platform Migration",
      "end_date": "2026-03-15",
      "days_remaining": 29,
      "timeline_urgency": "on_track",
      "owner": "Michael",
      "tags": ["infrastructure"],
      "next_milestone": {
        "date": "2026-02-28",
        "name": "API Migration Complete",
        "status": "🔵 In Progress"
      }
    }
  ]
}
```

**Success (no active projects):**
```json
{
  "success": true,
  "count": 0,
  "filter": "all",
  "projects": [],
  "message": "No active projects found in 01_Projects/"
}
```

**Folder Not Found:**
```json
{
  "success": false,
  "error": "folder_not_found",
  "message": "Projects folder not found at $VAULT/01_Projects/",
  "suggestion": "Create the 01_Projects/ folder and add project files."
}
```

For backwards compatibility, also output human-readable summary:
```
Active Projects: 3 found

1. Assessment Center Hiring
   Due: 2026-02-20 (6 days) ⚠️ Due Soon
   Next: Final Interviews (2026-02-18) 🔵 In Progress

2. Platform Migration
   Due: 2026-03-15 (29 days) ✅ On Track
   Next: API Migration Complete (2026-02-28) 🔵 In Progress

3. Q2 Roadmap Planning
   Due: 2026-03-31 (45 days) ✅ On Track
   Next: Draft Review (2026-03-01) 🟡 Planned
```

## Timeline Urgency Indicators

| Urgency | Condition | Display |
|---------|-----------|---------|
| `overdue` | end_date < today | ❗️ Overdue |
| `due_soon` | end_date < today + 14 days | ⚠️ Due Soon |
| `on_track` | otherwise | ✅ On Track |
