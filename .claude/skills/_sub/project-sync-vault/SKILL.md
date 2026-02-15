---
name: project-sync-vault
description: Create or archive a project in the vault. Handles creating new project files in 01_Projects/ and archiving completed projects to 04_Archives/Projects/.
disable-model-invocation: true
allowed-tools: Read, Write, Bash(ls, mv, mkdir)
argument-hint: "action=create|archive project={{PROJECT}}"
---

# Project Sync Vault Sub-Skill

Creates new project files or archives completed projects in the vault.

## Input Arguments

Arguments are passed as key-value pairs:

- `action`: Required. Either `create` or `archive`
- `vault`: Path to the vault
- `project`: Object containing project data:
  - `name`: Project title
  - `slug`: URL-friendly identifier (e.g., "hiring-round")
  - `due_date`: Target completion date (YYYY-MM-DD)
  - `purpose`: Why this project exists
  - `outcomes`: Array of expected outcomes
  - `people`: Array of people involved
  - `path`: Full path to project file (required for archive action)

---

## Action: Create

Creates a new project file in `$VAULT/01_Projects/`.

### 1. Build File Path

Construct the file path:

```
$VAULT/01_Projects/{due_date}-{slug}.md
```

Example: `$VAULT/01_Projects/2026-03-15-platform-migration.md`

### 2. Check for Duplicates

Check if a project with the same slug already exists:

```bash
ls "$VAULT/01_Projects/"*-{slug}.md 2>/dev/null
```

If file exists, return error:
```json
{
  "success": false,
  "error": "duplicate_slug",
  "message": "A project with slug '{slug}' already exists",
  "existing_path": "/path/to/existing/file.md"
}
```

### 3. Generate Content

Generate project content using this template structure:

```markdown
---
title: {name}
end_date: {due_date}
status: active
owner: [To be assigned]
tags: []
---

[[03_Resources/Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]

---

# {name}

## Overview

**Goal:** {purpose}

**Why Now:** [Context for why this project matters and why you're doing it now]

**End Date:** {due_date} - [Brief reason for this timeline]

---

## Outcomes

### Must Have
{for each outcome in outcomes}
- [ ] {outcome}
{end for}

### Should Have
- [ ] [Important but not critical outcome]

### Could Have
- [ ] [Nice-to-have if time permits]

---

## Milestones

| Date | Milestone | Status |
|------|-----------|--------|
| [YYYY-MM-DD] | [First milestone] | 🟡 Planned |
| [YYYY-MM-DD] | [Second milestone] | 🟡 Planned |
| {due_date} | Project Completion | 🟡 Planned |

*Status: 🟡 Planned | 🔵 In Progress | 🟢 Complete | 🔴 Blocked*

---

## Updates

*Rituals append chronological updates here. Most recent first.*

### {today_date} - Project Created
- Created via project lifecycle skill
- Initial outcomes defined
- [Key stakeholders involved]

### [YYYY-MM-DD] - [Brief headline]
- [Key progress or decision]
- [Blockers or concerns]
- [Next steps]

---

## Resources

### Links
- [Documentation link]
- [Design files]
- [Project board/tracker]

### Related Projects
- [[related-project-name]] - [How they relate]

### People
{for each person in people}
- [[{person}]] - [Role TBD]
{end for}

---

## Team

| Name | Role | Involvement |
|------|------|-------------|
{for each person in people}
| {person} | [Role] | [Involvement] |
{end for}

---

## Archive Notes

*When project completes, add final summary before moving to Archives:*

**Final Status:** [Success/Partial/Failed]
**Key Learnings:** [What went well, what didn't]
**Impact:** [Actual outcomes achieved]
```

### 4. Write File

Write the generated content to the file path.

### 5. Verify Write

Read back the file to confirm write succeeded.

### 6. Return Result

**Success:**
```json
{
  "success": true,
  "action": "create",
  "path": "/Users/.../01_Projects/2026-03-15-platform-migration.md",
  "project": {
    "name": "Platform Migration",
    "slug": "platform-migration",
    "due_date": "2026-03-15"
  },
  "bytes_written": 2048
}
```

---

## Action: Archive

Archives a completed project from `01_Projects/` to `04_Archives/Projects/`.

### 1. Validate Source

Verify the source file exists:

```bash
ls "$VAULT/01_Projects/"*-{slug}.md 2>/dev/null
```

Or use the provided `project.path` if available.

If source doesn't exist:
```json
{
  "success": false,
  "error": "source_not_found",
  "message": "Project file not found in 01_Projects/",
  "expected_path": "/path/to/01_Projects/*-{slug}.md"
}
```

### 2. Ensure Archive Directory

Create archive directory if needed:

```bash
mkdir -p "$VAULT/04_Archives/Projects/"
```

### 3. Read Current Content

Read the existing project file content.

### 4. Update Frontmatter

Update the frontmatter with archive metadata:

```yaml
---
title: {name}
end_date: {due_date}
status: archived
archived_date: {today_date}
owner: [existing value]
tags: [existing tags]
---
```

Key changes:
- Set `status: archived`
- Add `archived_date: {today_date}` (YYYY-MM-DD format)

### 5. Fill Archive Notes (If Summary Provided)

If a summary is provided in `project.summary`, fill in the Archive Notes section:

```markdown
## Archive Notes

*When project completes, add final summary before moving to Archives:*

**Final Status:** {summary.status or "Completed"}
**Key Learnings:** {summary.learnings or "[To be documented]"}
**Impact:** {summary.impact or "[To be assessed]"}
```

### 6. Update Source File

Write the updated content back to the source file (with updated frontmatter and archive notes).

### 7. Move to Archive

Move the updated file to the archive location:

```bash
mv "$SOURCE_PATH" "$VAULT/04_Archives/Projects/{original_filename}"
```

Use `mv` for an atomic move operation. Preserve the original filename (e.g., `2026-03-15-platform-migration.md`).

### 8. Return Result

**Success:**
```json
{
  "success": true,
  "action": "archive",
  "source_path": "/Users/.../01_Projects/2026-03-15-platform-migration.md",
  "archive_path": "/Users/.../04_Archives/Projects/2026-03-15-platform-migration.md",
  "project": {
    "name": "Platform Migration",
    "slug": "platform-migration",
    "due_date": "2026-03-15",
    "archived_date": "2026-02-15"
  },
  "bytes_written": 2560
}
```

---

## Error Cases

| Condition | Error Code | Message |
|-----------|------------|---------|
| Invalid action | `invalid_action` | "Action must be 'create' or 'archive'" |
| Missing vault | `vault_not_found` | "Vault directory does not exist: {vault}" |
| Missing required fields | `missing_fields` | "Missing required fields: {fields}" |
| Duplicate slug (create) | `duplicate_slug` | "A project with slug '{slug}' already exists" |
| Source not found (archive) | `source_not_found` | "Project file not found in 01_Projects/" |
| Write failed | `write_failed` | "Failed to write file: {system_error}" |
| Move failed | `move_failed` | "Failed to move file to archive: {system_error}" |
| Verification failed | `verification_failed` | "Write verification failed" |

---

## Output Format

Always return structured JSON for both success and error cases.

**Success structure:**
```json
{
  "success": true,
  "action": "create|archive",
  "path": "...",
  "project": { ... },
  "bytes_written": ...
}
```

**Error structure:**
```json
{
  "success": false,
  "error": "error_code",
  "message": "Human-readable message",
  "suggestion": "Optional guidance for resolution"
}
```

---

## Safety

- Validate all paths are within expected directories before any write/move
- For create: Only write to `01_Projects/`
- For archive: Only read from `01_Projects/`, only write to `04_Archives/Projects/`
- Never overwrite existing files without explicit confirmation
- Always verify writes succeeded before confirming success
