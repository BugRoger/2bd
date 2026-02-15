---
name: append-changelog
description: Append a changelog entry to a note. Called by write skills after modifying files.
disable-model-invocation: true
allowed-tools: Read, Write
---

# Append Changelog Sub-Skill

Appends a timestamped changelog entry to a note file. Entries are reverse-chronological (newest first).

## Input Arguments

Arguments are passed as key-value pairs:
- `path`: Full path to the note file
- `skill`: Name of the skill making the change (e.g., "planning-daily")
- `action`: Verb summarizing the action (e.g., "Rewrote", "Added", "Updated")
- `sections`: Comma-separated list of section names affected (optional)
- `summary`: Additional context (optional)

## Instructions

### 1. Generate Timestamp

Get current date and time in format `YYYY-MM-DD HH:mm` (24-hour).

### 2. Build Entry

Format:
```
- `{timestamp}` **{skill}** — {action}{sections_text}{summary_text}
```

Where:
- `{sections_text}` = ` {sections} sections` if sections provided, else empty
- `{summary_text}` = ` ({summary})` if summary provided, else empty

**Examples:**
```
- `2026-02-15 09:32` **planning-daily** — Rewrote Focus, Context From Above sections
- `2026-02-15 18:30` **review-daily** — Added entry to Interactions section (from synthesis)
- `2026-02-15 10:00` **create-project** — Created project
```

### 3. Read File

Read the existing content of the file at `path`.

If file doesn't exist, return error:
```json
{
  "success": false,
  "error": "file_not_found",
  "message": "Cannot append changelog: file does not exist"
}
```

### 4. Locate Changelog Section

Find `## Changelog` heading (case-insensitive).

**If section exists:**
- Find the line immediately after the heading
- Skip any italicized placeholder text (lines starting with `*`)
- Insert entry at the top of the list (before existing entries)

**If section does not exist:**
- Append new section at end of file:
```markdown

## Changelog

{entry}
```

### 5. Write Updated File

Write the modified content back to the file.

### 6. Return Result

**Success:**
```json
{
  "success": true,
  "path": "/path/to/note.md",
  "entry": "- `2026-02-15 09:32` **planning-daily** — Rewrote Focus section",
  "created_section": false
}
```

**Error:**
```json
{
  "success": false,
  "error": "write_failed",
  "message": "Failed to write changelog entry"
}
```

## Safety

- Always read before write to preserve existing content
- Never delete existing changelog entries
- Only append to the Changelog section
