---
name: fetch-projects-vault
description: List projects from vault 01_Projects/ (active by default) and 04_Archives/Projects/ (archived). Returns structured data with title, deadline, status, and timeline urgency.
disable-model-invocation: true
allowed-tools: Read, Bash(ls), Glob
argument-hint: "[scope: active|archived|all (default: active)]"
---

# Fetch Projects Vault Sub-Skill

Scans vault project folders and returns structured data for project lifecycle management. Defaults to active projects only.

## Prerequisites

This sub-skill expects `$VAULT` to be set by the calling skill (via `fetch-config`).

## Arguments

- `scope` - Optional. Filter by project location (default: `active`):
  - `active` - Only projects in `01_Projects/` (default)
  - `archived` - Only projects in `04_Archives/Projects/`
  - `all` - Both active and archived projects

## File Locations

- **Active projects:** `$VAULT/01_Projects/`
- **Archived projects:** `$VAULT/04_Archives/Projects/`
- **Hub files (excluded):** `✱ Projects.md` in either folder

## Execution Steps

### 1. Determine Folders to Scan

Based on `scope` argument:

| Scope | Folders |
|-------|---------|
| `active` | `$VAULT/01_Projects/` |
| `archived` | `$VAULT/04_Archives/Projects/` |
| `all` | Both folders |

### 2. List Project Files

For each folder, list all `.md` files:

```bash
ls -1 "$VAULT/01_Projects/"*.md 2>/dev/null | grep -v "✱ Projects.md"
ls -1 "$VAULT/04_Archives/Projects/"*.md 2>/dev/null | grep -v "✱ Projects.md"
```

If a folder is empty or missing, continue with other folders (don't fail).

### 3. For Each Project File

Read the file and parse:

#### Extract Slug from Filename

Parse the filename to extract the project slug:

| Filename Pattern | Slug |
|------------------|------|
| `2026-03-31-quarterly-planning.md` | `quarterly-planning` |
| `2026-02-15-hiring-round.md` | `hiring-round` |
| `platform-migration.md` | `platform-migration` |

**Rules:**
1. Remove `.md` extension
2. Remove leading date pattern (`YYYY-MM-DD-`) if present
3. Remainder is the slug

#### Frontmatter Fields

- `title` - Project name
- `end_date` - Deadline (YYYY-MM-DD)
- `status` - `active`, `completed`, `on-hold`, or `archived`
- `owner` - Project owner
- `tags` - Array of tags

#### Milestones Table (Optional)

Parse the `## Milestones` section table if present:

```markdown
| Date | Milestone | Status |
|------|-----------|--------|
| 2026-02-15 | Phase 1 | 🔵 In Progress |
| 2026-03-01 | Phase 2 | 🟡 Planned |
```

Extract the first milestone where status is NOT `🟢 Complete`.

### 4. Determine Source Location

For each project, set `source`:

| Folder | Source Value |
|--------|--------------|
| `01_Projects/` | `active` |
| `04_Archives/Projects/` | `archived` |

### 5. Calculate Timeline Urgency

For each project with an `end_date`, calculate relative to today:

- `days_remaining` = end_date - today (can be negative if overdue)
- `timeline_urgency`:
  - `overdue` if `end_date < today`
  - `due_soon` if `end_date < today + 14 days`
  - `on_track` otherwise

For archived projects, timeline_urgency is always `null` (historical).

### 6. Sort Results

Sort by `end_date` ascending (earliest deadlines first). Projects without `end_date` appear last.

### 7. Return Structured Result

**Success (with projects):**
```json
{
  "success": true,
  "count": 4,
  "scope": "all",
  "active_count": 2,
  "archived_count": 2,
  "projects": [
    {
      "file": "2026-02-20-hiring-round.md",
      "path": "/path/to/vault/01_Projects/2026-02-20-hiring-round.md",
      "slug": "hiring-round",
      "source": "active",
      "title": "Assessment Center Hiring",
      "end_date": "2026-02-20",
      "days_remaining": 5,
      "timeline_urgency": "due_soon",
      "status": "active",
      "owner": "Michael",
      "tags": ["hiring", "Q1"],
      "next_milestone": {
        "date": "2026-02-18",
        "name": "Final Interviews",
        "status": "🔵 In Progress"
      }
    },
    {
      "file": "2026-03-31-quarterly-planning.md",
      "path": "/path/to/vault/01_Projects/2026-03-31-quarterly-planning.md",
      "slug": "quarterly-planning",
      "source": "active",
      "title": "Q2 Roadmap Planning",
      "end_date": "2026-03-31",
      "days_remaining": 44,
      "timeline_urgency": "on_track",
      "status": "active",
      "owner": "Michael",
      "tags": ["planning", "Q1"],
      "next_milestone": null
    },
    {
      "file": "2025-12-31-platform-migration.md",
      "path": "/path/to/vault/04_Archives/Projects/2025-12-31-platform-migration.md",
      "slug": "platform-migration",
      "source": "archived",
      "title": "Platform Migration",
      "end_date": "2025-12-31",
      "days_remaining": null,
      "timeline_urgency": null,
      "status": "completed",
      "owner": "Michael",
      "tags": ["infrastructure"],
      "next_milestone": null
    }
  ]
}
```

**Success (no projects found):**
```json
{
  "success": true,
  "count": 0,
  "scope": "active",
  "active_count": 0,
  "archived_count": 0,
  "projects": [],
  "message": "No projects found in 01_Projects/"
}
```

**Folder Not Found (all folders missing):**
```json
{
  "success": false,
  "error": "folders_not_found",
  "message": "No project folders found at $VAULT/01_Projects/ or $VAULT/04_Archives/Projects/",
  "suggestion": "Create the 01_Projects/ folder and add project files."
}
```

### 8. Human-Readable Summary

For backwards compatibility, also output human-readable summary:

```
Projects: 4 found (2 active, 2 archived)

Active Projects:
1. Assessment Center Hiring [hiring-round]
   Due: 2026-02-20 (5 days) ⚠️ Due Soon
   Status: active | Owner: Michael
   Next: Final Interviews (2026-02-18) 🔵 In Progress

2. Q2 Roadmap Planning [quarterly-planning]
   Due: 2026-03-31 (44 days) ✅ On Track
   Status: active | Owner: Michael

Archived Projects:
3. Platform Migration [platform-migration]
   Ended: 2025-12-31
   Status: completed | Owner: Michael
```

## Timeline Urgency Indicators

| Urgency | Condition | Display |
|---------|-----------|---------|
| `overdue` | end_date < today | ❗ Overdue |
| `due_soon` | end_date < today + 14 days | ⚠️ Due Soon |
| `on_track` | otherwise | ✅ On Track |
| `null` | archived project | (no indicator) |

## Error Handling

| Error Code | Condition | Behavior |
|------------|-----------|----------|
| `folders_not_found` | Neither folder exists | Return error |
| `parse_error` | Single file can't be parsed | Log warning, skip file, continue |
| `no_frontmatter` | File has no frontmatter | Skip file, continue |

## Notes

- This skill supersedes `fetch-active-projects` for project lifecycle workflows
- The `slug` field enables linking projects across documents (e.g., `[[quarterly-planning]]`)
- Archived projects have `timeline_urgency: null` since deadlines are historical
- Files without `end_date` are sorted to the end of the list
