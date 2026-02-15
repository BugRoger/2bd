---
name: archive-yearly
description: Archive Year.md content to Periodic/Yearly/. Handles the metabolic transition from Captive (volatile) to Periodic (permanent record).
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

# Archive Yearly Sub-Skill

Archives a year's content from Captive to Periodic/Yearly/, transforming it into the archive format.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `year`: Target year in YYYY format (e.g., 2026)
- `content`: Synthesis content from the interactive review (theme, accomplishments, patterns)
- `quarterly_links`: Formatted wikilinks to quarterly archives

## Instructions

### 1. Validate Paths

Verify required directories exist:

```bash
ls -d "$VAULT/00_Brain/Periodic/Yearly/" 2>/dev/null
```

If missing, create it:
```bash
mkdir -p "$VAULT/00_Brain/Periodic/Yearly/"
```

### 2. Check for Existing Archive

Check if `$VAULT/00_Brain/Periodic/Yearly/{year}.md` already exists:

```bash
ls "$VAULT/00_Brain/Periodic/Yearly/{year}.md" 2>/dev/null
```

**If exists:**
- Read existing content
- Compare with new content
- If different: Return error prompting user decision (overwrite/merge/cancel)
- If same: Return success with note "Already archived"

### 3. Read Year.md

Read the current Year.md content from `$VAULT/00_Brain/Captive/Year.md`

### 4. Read Archive Template

Read the archive template from `scaffold/00_Brain/Systemic/Templates/Periodic/yearly.md` (in the engine repo)

### 5. Transform Content

Using the template structure, build the archive:

**Frontmatter:**
```yaml
---
year: {from Year.md}
dates: {from Year.md}
archived: {today's date YYYY-MM-DD}
---
```

**Navigation:**
Update links to point to Periodic archives (not Captive). Year is top of hierarchy, no parent nav:
```markdown
[[00_Brain/✱ Home|✱ Home]]
```

**Header:**
```markdown
# {year}

*Archived from Captive/Year.md on {archived date}*
```

**Year Overview Section:**
Preserve from Year.md:
- Key Outcomes
- Annual Theme
- Strategic Priorities

**Quarterly Summary Section:**
Insert the `quarterly_links` formatted content:
```markdown
## Quarterly Summary

### Quarters This Year
{quarterly_links}
```

**Wins This Year Section:**
Preserve from Year.md:
- Personal wins
- Organisational wins
- Strategic wins

**Reflections Section:**
Preserve from Year.md:
- What Went Well
- What Could Be Better
- Key Learning
- Patterns Observed

**Synthesis Section:**
Add new content from interactive review:
```markdown
## Synthesis

*Added during yearly review ritual*

### Year Theme
{content.theme}

### Key Accomplishments
{content.accomplishments}

### Patterns Observed
{content.patterns}

### Next Year Setup
{content.next_year}
```

### 6. Write Archive

Write the transformed content to `$VAULT/00_Brain/Periodic/Yearly/{year}.md`

### 7. Verify Write

Read back the file to confirm write succeeded:
- Check file exists
- Check content length matches expected

### 8. Update Year.md

Replace Year.md with a minimal placeholder indicating it was archived:

```markdown
---
archived: {year}
---

[[00_Brain/✱ Home|✱ Home]] | [[00_Brain/Captive/Today|Today]] | [[00_Brain/Captive/Quarter|Quarter]]

---

# Archived

This year has been archived to [[00_Brain/Periodic/Yearly/{year}]].

Run `/yearly-planning` to start a new year.
```

## Output

Return structured JSON:

**Success:**
```json
{
  "success": true,
  "archive_path": "/Users/.../00_Brain/Periodic/Yearly/2026.md",
  "bytes_written": 18432,
  "year_cleared": true,
  "quarterly_archives_linked": 4
}
```

**Already exists (same content):**
```json
{
  "success": true,
  "archive_path": "/Users/.../00_Brain/Periodic/Yearly/2026.md",
  "already_existed": true,
  "message": "Archive already exists with matching content."
}
```

**Already exists (different content):**
```json
{
  "success": false,
  "error": "archive_conflict",
  "archive_path": "/Users/.../00_Brain/Periodic/Yearly/2026.md",
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
Year Archived Successfully

Archive: 00_Brain/Periodic/Yearly/2026.md (18432 bytes)
Quarterly Links: 4 quarters linked
Year.md: Cleared with archived placeholder

Link: [[00_Brain/Periodic/Yearly/2026]]
```

## Error Cases

| Condition | Error Message |
|-----------|---------------|
| Vault not found | "Vault directory does not exist: {vault}" |
| Cannot create directory | "Failed to create Periodic/Yearly directory" |
| Year.md not found | "Year.md not found—nothing to archive" |
| Archive conflict | "Archive already exists with different content" |
| Write failed | "Failed to write archive: {system_error}" |
| Verification failed | "Write verification failed: content mismatch" |

## Safety

- Always check for existing archive before writing
- Never overwrite without explicit user confirmation
- Archive is write-only to Periodic/Yearly/ (never to other directories)
- Year.md placeholder preserves a link to the archive
- Original Year.md content is fully captured in the archive before clearing
