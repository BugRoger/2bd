# Project Sync Finder

```yaml
name: project-sync-finder
description: Sync project folder structure in Finder (NOT IMPLEMENTED)
status: stub
version: 0.0.0
interface:
  action: string    # "create" | "archive"
  vault: string     # Path to vault
  project: object   # Project frontmatter with slug, due_date, etc.
outputs:
  FINDER_PATH: string  # Path to created/archived folder
```

---

## Status: NOT IMPLEMENTED

This is a placeholder stub documenting the planned interface for Finder project folder synchronization.

## Planned Interface

Receive three arguments: action (create or archive), vault path, and project object containing slug, due_date, and title.

Output the FINDER_PATH showing the absolute path to the created or archived folder.

## Planned Functionality

For create actions, the skill would read `finder_projects_path` from configuration (defaulting to `~/Projects`), then create a folder structure with the pattern `{due_date}-{slug}/` containing Assets and Documents subdirectories.

For archive actions, the skill would move the project folder to a `_Archive/` subdirectory, preserving the internal structure.

## Configuration

Will read from `.claude/config.md`:

```markdown
finder_projects_path: ~/Projects
```

If not specified, defaults to `~/Projects`.

## Implementation Notes

For the future developer implementing this skill:

1. **Path resolution**: Expand `~` to full home directory path
2. **Idempotency**: Check if folder exists before creating; skip if already present
3. **Error handling**: Gracefully handle permission errors, disk full, etc.
4. **Slug sanitization**: Ensure slug is filesystem-safe (no spaces, special chars)
5. **Archive subfolder**: Create `_Archive/` if it doesn't exist
6. **Integration**: This skill will be called by `project-sync` orchestrator alongside `project-sync-vault`

## Example Usage (Future)

```yaml
# In phases.yaml
- name: sync-finder
  skill: _project-sync-finder
  args:
    action: "{{ACTION}}"
    vault: "{{VAULT}}"
    project: "{{PROJECT}}"
  outputs:
    FINDER_PATH: FINDER_PATH
```
