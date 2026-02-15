---
name: create-project
description: Create a new project with guided setup. Syncs to vault (and future: Finder, Outlook).
argument-hint: "[project-name]"
metadata:
  orchestrated: true
---

# Create Project Command

Interactive wizard for creating new projects with full lifecycle support.

## Context

- Vault configuration and path
- Existing active projects
- User directives and preferences

---

## Interactive Wizard

Guide the user through project creation with **one question at a time**. Wait for each answer before proceeding.

### Question Flow

#### 1. Project Name (required)

> What's the name of your project?

Accept the project name and generate a URL-friendly slug:

| Input | Slug |
|-------|------|
| "Platform Migration" | `platform-migration` |
| "Q2 2026 Roadmap" | `q2-2026-roadmap` |
| "Hiring: Assessment Center" | `hiring-assessment-center` |

**Slug rules:**
- Lowercase
- Replace spaces with hyphens
- Remove special characters except hyphens
- Collapse multiple hyphens

If a project argument was provided via `--args`, pre-fill the name and confirm with user.

**Duplicate check:** If slug matches an existing project, warn user and suggest alternatives.

---

#### 2. Due Date (required)

> When should this project be complete?

Accept flexible date formats and normalize to YYYY-MM-DD:

| Input | Normalized |
|-------|------------|
| "end of March" | `2026-03-31` |
| "in 2 weeks" | `2026-03-01` |
| "March 15" | `2026-03-15` |
| "2026-04-01" | `2026-04-01` |
| "Q2" | `2026-06-30` |

Confirm the interpreted date with the user before proceeding.

---

#### 3. Purpose (required)

> In one sentence, what's the goal of this project?

Capture the primary objective. This becomes the project's `purpose` field and drives the "Goal" section.

Examples:
- "Successfully hire 2 senior engineers through assessment center process"
- "Migrate all services from legacy platform to Kubernetes"
- "Define and align on Q2 roadmap with all stakeholders"

---

#### 4. Key Outcomes (optional)

> What are 1-3 key outcomes you want to achieve? (Press Enter to skip)

Accept a bullet list or comma-separated outcomes.

Format as array:
```json
["Hire 2 senior engineers", "Complete onboarding by April", "Document hiring process"]
```

If skipped, leave outcomes as empty array `[]`.

---

#### 5. Related People (optional)

> Who's involved in this project? (comma-separated names, or Enter to skip)

Accept comma-separated names. These will be mentioned inline in the Notes section.

Format as array:
```json
["Sarah", "Marcus", "Engineering Team"]
```

If skipped, leave people as empty array `[]`.

---

## Generate Phase

After collecting all inputs, build the project data object:

```json
{
  "name": "Platform Migration",
  "slug": "platform-migration",
  "due_date": "2026-03-31",
  "purpose": "Migrate all services from legacy platform to Kubernetes",
  "outcomes": [
    "All services running on Kubernetes",
    "Zero downtime migration",
    "Documentation complete"
  ],
  "people": ["Sarah", "Marcus", "DevOps Team"]
}
```

Display the generated data to the user for confirmation before syncing.

---

## Sync Sequence

Execute sync operations in order. Required syncs must succeed; optional syncs log warnings on failure.

### 1. Vault Sync (required)

Call `project-sync-vault` with:
- `action`: `create`
- `vault`: `{{VAULT}}`
- `project`: The generated project object

This creates the project file at `$VAULT/01_Projects/{due_date}-{slug}.md`.

**On failure:** Stop and report error to user.

### 2. Finder Sync (optional, future)

*Not yet implemented. Placeholder for macOS Finder folder creation.*

When enabled, would create:
- `~/Projects/{slug}/` folder structure
- Symlink to vault project file

### 3. Outlook Sync (optional, future)

*Not yet implemented. Placeholder for Outlook calendar integration.*

When enabled, would:
- Create calendar event for due date
- Add milestone reminders

---

## Confirm Phase

Present summary of created artifacts:

```
✓ Project Created: Platform Migration

  Vault:    $VAULT/01_Projects/2026-03-31-platform-migration.md
  Due:      March 31, 2026 (44 days)
  Purpose:  Migrate all services from legacy platform to Kubernetes

  Outcomes:
  - All services running on Kubernetes
  - Zero downtime migration
  - Documentation complete

  People:   Sarah, Marcus, DevOps Team

Next steps:
1. Open the project file to add milestones and details
2. Link project to relevant Area pages
3. Reference [[platform-migration]] in your daily plans
```

---

## Error Handling

| Phase | Error | Behavior |
|-------|-------|----------|
| Setup | Config not found | Suggest running `/init` |
| Setup | Vault not accessible | Report error, abort |
| Interact | User cancels | Exit gracefully |
| Generate | Invalid data | Show validation errors, retry |
| Sync (vault) | Duplicate slug | Suggest alternative name |
| Sync (vault) | Write failed | Report error, abort |
| Sync (optional) | Any failure | Log warning, continue |

---

## Usage Examples

**With argument:**
```bash
claude skill run commands/create-project --args "Platform Migration"
```
Pre-fills project name, confirms with user.

**Without argument:**
```bash
claude skill run commands/create-project
```
Starts wizard from the beginning.

---

## Output Variables

After successful execution:

| Variable | Content |
|----------|---------|
| `PROJECT` | Generated project data object |
| `VAULT_RESULT` | Result from vault sync (path, success) |
| `CREATED_PATH` | Full path to created project file |
