# Project Sync Outlook

---
name: project-sync-outlook
description: Sync project lifecycle actions to Outlook mail folders (NOT IMPLEMENTED)
status: stub
---

> **Status: NOT IMPLEMENTED**
>
> This is a placeholder documenting the planned interface for future Outlook integration.

## Interface

Receive three parameters: action (create or archive), vault path, and project name.

## Planned Functionality

For create actions, the skill would create a mail folder for the project under the configured projects folder, setting up any supported folder-level rules.

For archive actions, the skill would move the project mail folder from the projects location to the archive location, preserving all mail within the folder.

The skill would read configuration from `.claude/config.md` to determine if Outlook integration is enabled and identify the projects folder path.

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
