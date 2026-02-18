---
name: archive-project
description: Archive a completed project. Captures final summary and moves to archives across synced tools.
argument-hint: "[project-slug]"
metadata:
  orchestrated: true
---

# Archive Project Command

Interactive workflow for archiving completed projects with summary capture and vault sync.

## Context

- Vault configuration and path
- Active projects list
- User directives and preferences

---

## Select Phase

Present the list of active projects for the user to choose from.

### With Argument

If a project slug was provided via `--args`, look up the project:

```bash
claude skill run commands/archive-project --args "platform-migration"
```

If found, confirm with user:
> Found project "Platform Migration" (due: 2026-03-31). Archive this project?

If not found, show available projects and ask user to select.

### Without Argument

Display numbered list of active projects:

```
Select a project to archive:

1. Assessment Center Hiring [hiring-round]
   Due: 2026-02-20 (5 days) | Status: active

2. Q2 Roadmap Planning [quarterly-planning]
   Due: 2026-03-31 (44 days) | Status: active

3. Platform Migration [platform-migration]
   Due: 2026-04-15 (59 days) | Status: active

Enter project number or slug:
```

Wait for user selection before proceeding.

---

## Interactive Summary

Guide the user through capturing a final summary with **one question at a time**. Wait for each answer before proceeding.

### Question Flow

#### 1. Final Status (required)

> What's the final status of this project?

Present options:
- **Completed** - All objectives met, project successful
- **Partial** - Some objectives met, acceptable outcome
- **Cancelled** - Project stopped before completion
- **On-hold** - Project paused indefinitely (will archive but note status)

Accept status selection and confirm.

---

#### 2. Key Wins (required)

> What were the key wins or successes from this project?

Encourage bullet-point format. These populate the "Key Learnings" positive outcomes.

Examples:
- "Successfully hired 2 senior engineers"
- "Completed migration with zero downtime"
- "Delivered 3 weeks ahead of schedule"

---

#### 3. Key Learnings (required)

> What did you learn? What would you do differently next time?

Capture lessons learned, both positive and areas for improvement.

Examples:
- "Should have involved stakeholders earlier"
- "The new testing framework saved significant time"
- "Communication cadence was too infrequent"

---

#### 4. Impact (required)

> What was the actual impact of this project?

Focus on measurable outcomes and business value.

Examples:
- "Reduced deployment time from 4 hours to 15 minutes"
- "Team capacity increased by 40%"
- "Customer satisfaction improved from 3.2 to 4.1"

---

#### 5. Follow-ups (optional)

> Are there any follow-up actions or future projects that came out of this? (Press Enter to skip)

Capture items that should be tracked separately.

Examples:
- "Need to document the new process"
- "Consider Phase 2 expansion in Q3"
- "Schedule retrospective with broader team"

If skipped, leave follow-ups as empty array `[]`.

---

## Generate Phase

After collecting all inputs, build the archive data object:

```json
{
  "name": "Platform Migration",
  "slug": "platform-migration",
  "due_date": "2026-03-31",
  "path": "/path/to/01_Projects/2026-03-31-platform-migration.md",
  "summary": {
    "status": "completed",
    "wins": [
      "Zero downtime migration achieved",
      "All services running on Kubernetes",
      "Documentation completed"
    ],
    "learnings": [
      "Should have involved DevOps team earlier",
      "Canary deployments reduced risk significantly"
    ],
    "impact": "Reduced deployment time from 4 hours to 15 minutes. Infrastructure costs reduced by 30%.",
    "followups": [
      "Document runbook for common issues",
      "Plan Phase 2: migrate remaining legacy services"
    ]
  }
}
```

Display the generated data to the user for confirmation before syncing.

---

## Sync Sequence

Execute sync operations in order. Required syncs must succeed; optional syncs log warnings on failure.

### 1. Vault Sync (required)

Call `project-sync-vault` with:
- `action`: `archive`
- `vault`: `{{VAULT}}`
- `project`: The generated project object with summary

This:
1. Updates the project file frontmatter with `status: archived` and `archived_date`
2. Appends an archive summary entry to the Changelog section
3. Moves the file from `$VAULT/01_Projects/` to `$VAULT/04_Archives/Projects/`

**On failure:** Stop and report error to user.

### 2. Finder Sync (optional, future)

*Not yet implemented. Placeholder for macOS Finder folder archival.*

When enabled, would:
- Move project folder to `~/Archives/Projects/`
- Update any symlinks

### 3. Outlook Sync (optional, future)

*Not yet implemented. Placeholder for Outlook calendar cleanup.*

When enabled, would:
- Mark project-related calendar events as completed
- Remove recurring project meetings

---

## Confirm Phase

Present summary of archived artifacts:

```
Project Archived: Platform Migration

  From:     $VAULT/01_Projects/2026-03-31-platform-migration.md
  To:       $VAULT/04_Archives/Projects/2026-03-31-platform-migration.md
  Archived: February 15, 2026

Summary:
  Status:    Completed

  Key Wins:
  - Zero downtime migration achieved
  - All services running on Kubernetes
  - Documentation completed

  Key Learnings:
  - Should have involved DevOps team earlier
  - Canary deployments reduced risk significantly

  Impact:    Reduced deployment time from 4 hours to 15 minutes. Infrastructure costs reduced by 30%.

  Follow-ups:
  - Document runbook for common issues
  - Plan Phase 2: migrate remaining legacy services

Next steps:
1. Review archived project in $VAULT/04_Archives/Projects/
2. Create follow-up tasks or projects as needed
3. Share learnings with your team
```

---

## Error Handling

| Phase | Error | Behavior |
|-------|-------|----------|
| Setup | Config not found | Suggest running `/init` |
| Setup | Vault not accessible | Report error, abort |
| Setup | No active projects | Report "No active projects to archive", abort |
| Select | Invalid selection | Show options again, retry |
| Select | Project not found | Show available projects, retry |
| Interact | User cancels | Exit gracefully |
| Generate | Invalid data | Show validation errors, retry |
| Sync (vault) | Source not found | Report error, abort |
| Sync (vault) | Move failed | Report error, abort |
| Sync (optional) | Any failure | Log warning, continue |

---

## Usage Examples

**With argument:**
```bash
claude skill run commands/archive-project --args "platform-migration"
```
Pre-selects project, confirms with user before proceeding.

**Without argument:**
```bash
claude skill run commands/archive-project
```
Shows list of active projects for selection.

---

## Output Variables

After successful execution:

| Variable | Content |
|----------|---------|
| `PROJECT` | Selected project data with summary |
| `VAULT_RESULT` | Result from vault sync (paths, success) |
| `ARCHIVED_PATH` | Full path to archived project file |
