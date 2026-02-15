---
name: archive-monthly
description: Archive Month.md content to Periodic/Monthly/. Handles the metabolic transition from Captive (volatile) to Periodic (permanent record).
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

# Archive Monthly Sub-Skill

Archives a month's content from Captive to Periodic/Monthly/, transforming it into the archive format.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `month`: Target month in YYYY-MM format
- `content`: Synthesis content from the interactive review (theme, accomplishments, patterns)
- `weekly_links`: Formatted wikilinks to weekly archives

## Instructions

### 1. Validate Paths

Verify required directories exist:

```bash
ls -d "$VAULT/00_Brain/Periodic/Monthly/" 2>/dev/null
```

If missing, create it:
```bash
mkdir -p "$VAULT/00_Brain/Periodic/Monthly/"
```

### 2. Check for Existing Archive

Check if `$VAULT/00_Brain/Periodic/Monthly/{month}.md` already exists:

```bash
ls "$VAULT/00_Brain/Periodic/Monthly/{month}.md" 2>/dev/null
```

**If exists:**
- Read existing content
- Compare with new content
- If different: Return error prompting user decision (overwrite/merge/cancel)
- If same: Return success with note "Already archived"

### 3. Read Month.md

Read the current Month.md content from `$VAULT/00_Brain/Captive/Month.md`

### 4. Read Archive Template

Read the archive template from `scaffold/00_Brain/Systemic/Templates/Periodic/monthly.md` (in the engine repo)

### 5. Transform Content

Using the template structure, build the archive:

**Frontmatter:**
```yaml
---
month: {from Month.md}
dates: {from Month.md}
quarter: {from Month.md}
year: {from Month.md}
archived: {today's date YYYY-MM-DD}
---
```

**Navigation:**
Update links to point to Periodic archives (not Captive):
```markdown
[[00_Brain/✱ Home|✱ Home]] | [[00_Brain/Periodic/Quarterly/{quarter}|Quarter]] | [[00_Brain/Periodic/Yearly/{year}|Year]]
```

**Header:**
```markdown
# {month-name} {year}

*Archived from Captive/Month.md on {archived date}*
```

**Month Overview Section:**
Preserve from Month.md:
- Key Outcomes
- Focus Theme

**Weekly Summary Section:**
Insert the `weekly_links` formatted content:
```markdown
## Weekly Summary

### Weeks This Month
{weekly_links}
```

**Wins This Month Section:**
Preserve from Month.md:
- Personal wins
- Organisational wins
- Strategic wins

**Reflections Section:**
Preserve from Month.md:
- What Went Well
- What Could Be Better
- Key Learning
- Patterns Observed

**Synthesis Section:**
Add new content from interactive review:
```markdown
## Synthesis

*Added during monthly review ritual*

### Month Theme
{content.theme}

### Key Accomplishments
{content.accomplishments}

### Patterns Observed
{content.patterns}

### Next Month Setup
{content.next_month}
```

### 6. Write Archive

Write the transformed content to `$VAULT/00_Brain/Periodic/Monthly/{month}.md`

### 7. Verify Write

Read back the file to confirm write succeeded:
- Check file exists
- Check content length matches expected

### 8. Append Changelog to Archive

Call `append-changelog` sub-skill with:
- `path`: Path to the newly created archive file
- `skill`: "review-monthly"
- `action`: "Archived"
- `summary`: "from Captive/Month.md"

### 9. Update Month.md

Replace Month.md with a minimal placeholder indicating it was archived:

```markdown
---
archived: {month}
---

[[00_Brain/✱ Home|✱ Home]] | [[00_Brain/Captive/Today|Today]] | [[00_Brain/Captive/Week|Week]]

---

# Archived

This month has been archived to [[00_Brain/Periodic/Monthly/{month}]].

Run `/monthly-planning` to start a new month.
```

## Output

Return structured JSON:

**Success:**
```json
{
  "success": true,
  "archive_path": "/Users/.../00_Brain/Periodic/Monthly/2026-02.md",
  "bytes_written": 12288,
  "month_cleared": true,
  "weekly_archives_linked": 4
}
```

**Already exists (same content):**
```json
{
  "success": true,
  "archive_path": "/Users/.../00_Brain/Periodic/Monthly/2026-02.md",
  "already_existed": true,
  "message": "Archive already exists with matching content."
}
```

**Already exists (different content):**
```json
{
  "success": false,
  "error": "archive_conflict",
  "archive_path": "/Users/.../00_Brain/Periodic/Monthly/2026-02.md",
  "message": "Archive already exists with different content.",
  "suggestion": "Review existing archive or confirm overwrite."
}
```

**Error:**
```json
{
  "success": false,
  "error": "write_failed",
  "message": "Failed to write archive: {system_error}"
}
```

For backwards compatibility, also output human-readable summary:
```
Month Archived Successfully

Archive: 00_Brain/Periodic/Monthly/2026-02.md (12288 bytes)
Weekly Links: 4 weeks linked
Month.md: Cleared with archived placeholder

Link: [[00_Brain/Periodic/Monthly/2026-02]]
```

## Error Cases

| Condition | Error Message |
|-----------|---------------|
| Vault not found | "Vault directory does not exist: {vault}" |
| Cannot create directory | "Failed to create Periodic/Monthly directory" |
| Month.md not found | "Month.md not found—nothing to archive" |
| Archive conflict | "Archive already exists with different content" |
| Write failed | "Failed to write archive: {system_error}" |
| Verification failed | "Write verification failed: content mismatch" |

## Safety

- Always check for existing archive before writing
- Never overwrite without explicit user confirmation
- Archive is write-only to Periodic/Monthly/ (never to other directories)
- Month.md placeholder preserves a link to the archive
- Original Month.md content is fully captured in the archive before clearing
