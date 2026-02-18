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

Receive the vault path and project data including name, slug, due_date, purpose, outcomes, and people.

Build the file path as `$VAULT/01_Projects/{due_date}-{slug}.md`. Check for existing projects with the same slug. If a duplicate exists, return an error with the existing file path.

Generate project content using the minimal template with frontmatter, navigation links, title, goal, outcomes as checkboxes, notes section with creation entry, and changelog section placeholder.

Write the generated content to the file path. Read back the file to verify the write succeeded.

Call the `append-changelog` sub-skill with the project file path, skill name "create-project", and action "Created".

Return structured JSON showing success, action, path, project details, and bytes written.

---

## Action: Archive

Receive the vault path and project data including slug and optionally the file path.

Verify the source file exists in `01_Projects/`. If not found, return an error indicating the expected path.

Create the archive directory `$VAULT/04_Archives/Projects/` if it doesn't exist.

Read the current content of the project file. Update the frontmatter to set status to "archived" and add the archived_date with today's date.

If a summary is provided, append an archive entry to the Changelog section showing status, wins, learnings, impact, and follow-ups.

Write the updated content back to the source file.

Call the `append-changelog` sub-skill with the project file path, skill name "archive-project", and action "Archived".

Move the updated file to the archive location using an atomic move operation, preserving the original filename.

Return structured JSON showing success, action, source path, archive path, and project details including archived date.

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
