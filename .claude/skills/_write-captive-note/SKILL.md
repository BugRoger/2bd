---
name: captive-note
description: Write content to a Captive note (Today.md, Week.md, etc.) with validation and backup.
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

<HARD-GATE>
Before writing prose to any file, pass the content through the `apply-writing-style` sub-skill. Invoke it with the draft content, receive polished version, then proceed with the write.
</HARD-GATE>

# Write Captive Note

This sub-skill writes content to a Captive note in the vault, with validation to prevent accidental data loss.

## Input Arguments

Arguments are passed as key-value pairs:
- `path`: Full path to the note (e.g., `{{VAULT}}/00_Brain/Captive/Today.md`)
- `content`: Markdown content to write
- `changelog_skill`: (optional) Name of skill to record in changelog
- `changelog_action`: (optional) Action verb for changelog entry (default: "Updated")
- `changelog_sections`: (optional) Comma-separated list of affected sections

## Instructions

Receive the vault path, target filename, and content to write. The path must be within the Captive directory (`$VAULT/00_Brain/Captive/`). If the path is outside Captive, return an error indicating the path must be within the Captive directory.

If the file already exists, read the current content. If content is non-empty and different from the new content, create a backup at `{filename}.backup.md` in the same directory.

Write the new content to the specified path. After writing, read back the file to confirm the write succeeded.

If a `changelog_skill` argument was provided, call the `append-changelog` sub-skill with the file path, skill name, action (defaulting to "Updated"), and sections if provided. Include the changelog result in the output.

## Output

Return structured JSON:

```json
{
  "success": true,
  "path": "/Users/.../00_Brain/Captive/Today.md",
  "backup_created": true,
  "backup_path": "/Users/.../00_Brain/Captive/Today.backup.md",
  "bytes_written": 2048,
  "changelog": {
    "appended": true,
    "entry": "- `2026-02-15 09:32` **planning-daily** — Rewrote Focus section"
  }
}
```

Or on error:

```json
{
  "success": false,
  "error": "Description of what went wrong",
  "path": "/Users/.../00_Brain/Captive/Today.md"
}
```

## Error Cases

| Condition | Error Message |
|-----------|---------------|
| Path outside Captive | "Path must be within Captive directory" |
| Vault not found | "Vault directory does not exist: {vault}" |
| Write failed | "Failed to write file: {system_error}" |
| Verification failed | "Write verification failed: content mismatch" |

## Safety

- Always validate path is within Captive before writing
- Always backup existing non-empty content before overwriting
- Never write to Periodic or Semantic directories (use archive sub-skills for those)
