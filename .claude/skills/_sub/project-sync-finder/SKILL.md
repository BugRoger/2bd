# project-sync-finder

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

**Arguments:**
- `action`: `"create"` or `"archive"`
- `vault`: Path to the vault root
- `project`: Project frontmatter object containing at minimum:
  - `slug`: Project identifier (e.g., `acme-launch`)
  - `due_date`: Target completion date (e.g., `2026-Q1`)
  - `title`: Human-readable project name

**Outputs:**
- `FINDER_PATH`: Absolute path to the created or archived folder

## Planned Functionality

### Create Action

When `action: create`:

1. Read `finder_projects_path` from `.claude/config.md` (default: `~/Projects`)
2. Create folder structure:
   ```
   ~/Projects/{due_date}-{slug}/
   ├── Assets/
   └── Documents/
   ```
3. Example: `~/Projects/2026-Q1-acme-launch/Assets/`

### Archive Action

When `action: archive`:

1. Move project folder to archive:
   ```
   mv ~/Projects/{due_date}-{slug} ~/Projects/_Archive/
   ```
2. Preserve internal structure

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
  skill: _sub/project-sync-finder
  args:
    action: "{{ACTION}}"
    vault: "{{VAULT}}"
    project: "{{PROJECT}}"
  outputs:
    FINDER_PATH: FINDER_PATH
```
