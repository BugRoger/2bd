---
name: archive-quarterly
description: Archive Quarter.md content to Periodic/Quarterly/. Handles the metabolic transition from Captive (volatile) to Periodic (permanent record).
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

# Archive Quarterly Sub-Skill

Archives a quarter's content from Captive to Periodic/Quarterly/, transforming it into the archive format.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `quarter`: Target quarter in YYYY-QN format (e.g., 2026-Q1)
- `content`: Synthesis content from the interactive review (theme, accomplishments, patterns)
- `monthly_links`: Formatted wikilinks to monthly archives

## Instructions

### 1. Validate Paths

Verify required directories exist:

```bash
ls -d "$VAULT/00_Brain/Periodic/Quarterly/" 2>/dev/null
```

If missing, create it:
```bash
mkdir -p "$VAULT/00_Brain/Periodic/Quarterly/"
```

### 2. Check for Existing Archive

Check if `$VAULT/00_Brain/Periodic/Quarterly/{quarter}.md` already exists:

```bash
ls "$VAULT/00_Brain/Periodic/Quarterly/{quarter}.md" 2>/dev/null
```

**If exists:**
- Read existing content
- Compare with new content
- If different: Return error prompting user decision (overwrite/merge/cancel)
- If same: Return success with note "Already archived"

### 3. Read Quarter.md

Read the current Quarter.md content from `$VAULT/00_Brain/Captive/Quarter.md`

### 4. Read Archive Template

Read the archive template from `scaffold/00_Brain/Systemic/Templates/Periodic/quarterly.md` (in the engine repo)

### 5. Transform Content

Using the template structure, build the archive:

**Frontmatter:**
```yaml
---
quarter: {from Quarter.md}
dates: {from Quarter.md}
year: {from Quarter.md}
archived: {today's date YYYY-MM-DD}
---
```

**Navigation:**
Update links to point to Periodic archives (not Captive):
```markdown
[[00_Brain/✱ Home|✱ Home]] | [[00_Brain/Periodic/Yearly/{year}|Year]]
```

**Header:**
```markdown
# {quarter-name} {year}

*Archived from Captive/Quarter.md on {archived date}*
```

**Quarter Overview Section:**
Preserve from Quarter.md:
- Key Outcomes
- Focus Theme
- Strategic Priorities

**Monthly Summary Section:**
Insert the `monthly_links` formatted content:
```markdown
## Monthly Summary

### Months This Quarter
{monthly_links}
```

**Wins This Quarter Section:**
Preserve from Quarter.md:
- Personal wins
- Organisational wins
- Strategic wins

**Reflections Section:**
Preserve from Quarter.md:
- What Went Well
- What Could Be Better
- Key Learning
- Patterns Observed

**Synthesis Section:**
Add new content from interactive review:
```markdown
## Synthesis

*Added during quarterly review ritual*

### Quarter Theme
{content.theme}

### Key Accomplishments
{content.accomplishments}

### Patterns Observed
{content.patterns}

### Next Quarter Setup
{content.next_quarter}
```

### 6. Write Archive

Write the transformed content to `$VAULT/00_Brain/Periodic/Quarterly/{quarter}.md`

### 7. Verify Write

Read back the file to confirm write succeeded:
- Check file exists
- Check content length matches expected

### 8. Update Quarter.md

Replace Quarter.md with a minimal placeholder indicating it was archived:

```markdown
---
archived: {quarter}
---

[[00_Brain/✱ Home|✱ Home]] | [[00_Brain/Captive/Today|Today]] | [[00_Brain/Captive/Month|Month]]

---

# Archived

This quarter has been archived to [[00_Brain/Periodic/Quarterly/{quarter}]].

Run `/quarterly-planning` to start a new quarter.
```

## Output

Return structured JSON:

**Success:**
```json
{
  "success": true,
  "archive_path": "/Users/.../00_Brain/Periodic/Quarterly/2026-Q1.md",
  "bytes_written": 15360,
  "quarter_cleared": true,
  "monthly_archives_linked": 3
}
```

**Already exists (same content):**
```json
{
  "success": true,
  "archive_path": "/Users/.../00_Brain/Periodic/Quarterly/2026-Q1.md",
  "already_existed": true,
  "message": "Archive already exists with matching content."
}
```

**Already exists (different content):**
```json
{
  "success": false,
  "error": "archive_conflict",
  "archive_path": "/Users/.../00_Brain/Periodic/Quarterly/2026-Q1.md",
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
Quarter Archived Successfully

Archive: 00_Brain/Periodic/Quarterly/2026-Q1.md (15360 bytes)
Monthly Links: 3 months linked
Quarter.md: Cleared with archived placeholder

Link: [[00_Brain/Periodic/Quarterly/2026-Q1]]
```

## Error Cases

| Condition | Error Message |
|-----------|---------------|
| Vault not found | "Vault directory does not exist: {vault}" |
| Cannot create directory | "Failed to create Periodic/Quarterly directory" |
| Quarter.md not found | "Quarter.md not found—nothing to archive" |
| Archive conflict | "Archive already exists with different content" |
| Write failed | "Failed to write archive: {system_error}" |
| Verification failed | "Write verification failed: content mismatch" |

## Safety

- Always check for existing archive before writing
- Never overwrite without explicit user confirmation
- Archive is write-only to Periodic/Quarterly/ (never to other directories)
- Quarter.md placeholder preserves a link to the archive
- Original Quarter.md content is fully captured in the archive before clearing
