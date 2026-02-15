# project-sync-outlook

---
name: project-sync-outlook
description: Sync project lifecycle actions to Outlook mail folders (NOT IMPLEMENTED)
status: stub
---

> **Status: NOT IMPLEMENTED**
>
> This is a placeholder documenting the planned interface for future Outlook integration.

## Interface

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | yes | `create` or `archive` |
| `vault` | path | yes | Path to the vault root |
| `project` | string | yes | Project name |

## Planned Functionality

### Create Action

Create a mail folder for the project under the configured projects folder.

- Creates folder at `Projects/{project-name}/`
- Sets up any folder-level rules if supported

### Archive Action

Move the project mail folder to the archive location.

- Moves folder from `Projects/{project-name}/` to `Projects/Archive/{project-name}/`
- Preserves all mail within the folder

## Configuration

Will read from `.claude/config.md`:

```markdown
outlook_enabled: true
outlook_projects_folder: Projects
```

| Setting | Default | Description |
|---------|---------|-------------|
| `outlook_enabled` | `false` | Enable Outlook integration |
| `outlook_projects_folder` | `Projects` | Root folder for project mail folders |

## Implementation Options

### Option 1: Microsoft Graph API (Recommended)

- **Pros:** Cross-platform, official API, rich functionality
- **Cons:** Requires OAuth setup, Azure app registration
- **Auth:** OAuth 2.0 with delegated permissions
- **Permissions needed:** `Mail.ReadWrite`, `MailboxSettings.ReadWrite`

### Option 2: AppleScript (macOS only)

- **Pros:** No external dependencies, simple setup
- **Cons:** macOS only, limited to local Outlook app, fragile
- **Requirements:** Microsoft Outlook for Mac installed

## Implementation Notes

When implementing this skill:

1. **Check `outlook_enabled`** — Skip silently if disabled
2. **Handle missing Outlook gracefully** — Warn but don't fail
3. **Idempotent operations** — Create should no-op if folder exists
4. **Error messages** — Provide actionable guidance for auth issues

### Graph API Skeleton

```bash
# Future implementation will use Microsoft Graph
# Endpoint: POST /me/mailFolders/{parent-id}/childFolders
# Body: { "displayName": "project-name" }
```

### Testing Considerations

- Mock Graph API responses for unit tests
- Integration tests require test tenant or personal account
- Consider dry-run mode for validation without side effects
