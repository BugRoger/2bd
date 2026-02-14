---
name: get-month-content
description: Read and parse Month.md content for daily/weekly planning. Returns structured data including frontmatter, monthly theme, and key outcomes.
disable-model-invocation: true
allowed-tools: Read, Bash(ls)
---

# Get Month Content Sub-Skill

Reads Month.md from the Captive folder and parses it into structured data for daily and weekly planning context.

## Prerequisites

This sub-skill expects `$VAULT` to be set by the calling skill (via `get-config`).

## File Location

- **Month.md:** `$VAULT/00_Brain/Captive/Month.md`

## Execution Steps

### 1. Check File Existence

Verify Month.md exists:

```bash
ls -la "$VAULT/00_Brain/Captive/Month.md"
```

If missing, return error result.

### 2. Read Month.md

Read the full content of Month.md.

### 3. Parse Frontmatter

Extract YAML frontmatter fields:
- `month` - Month (YYYY-MM)
- `quarter` - Quarter (YYYY-QN)
- `year` - Year (YYYY)

### 4. Parse Sections

Extract each section by heading:

**Context From Above:**
- `quarter_theme` - From Quarter.md
- `quarter_outcomes` - From Quarter.md
- `year_theme` - From Year.md

**Month Overview:**
- `key_outcomes[]` - The 3 key outcomes for the month
- `monthly_theme` - The month's focus theme

### 5. Assess Completeness

Determine which sections have meaningful content vs. just prompts:

- `has_theme`: true if monthly theme has content beyond placeholder
- `has_outcomes`: true if any key outcome has content beyond prompts

Prompts are identified by:
- Starting with `*` (italic)
- Starting with `[` (placeholder)
- Being empty

### 6. Return Structured Result

**Success:**
```json
{
  "success": true,
  "path": "/path/to/vault/00_Brain/Captive/Month.md",
  "frontmatter": {
    "month": "2026-02",
    "quarter": "2026-Q1",
    "year": "2026"
  },
  "monthly_theme": "Initiative Delivery",
  "key_outcomes": [
    "Complete Assessment Center hiring rounds",
    "SCI/SCOS/Pegasus initiative delivery — tangible progress",
    "LT team structure clarity"
  ],
  "context_from_above": {
    "quarter_theme": "SCI transformation & leadership growth",
    "quarter_outcomes": ["Q1 deliverable 1", "Q1 deliverable 2"],
    "year_theme": "Year of execution"
  },
  "completeness": {
    "has_theme": true,
    "has_outcomes": true
  }
}
```

**File Not Found:**
```json
{
  "success": false,
  "error": "file_not_found",
  "message": "Month.md not found at $VAULT/00_Brain/Captive/Month.md",
  "suggestion": "Run `/monthly-planning` to create a monthly plan first, or create Month.md manually."
}
```

For backwards compatibility, also output human-readable summary:
```
Month.md loaded for 2026-02

Monthly Theme: Initiative Delivery
Key Outcomes: 3 defined

Context From Above:
- Quarter Theme: SCI transformation & leadership growth
- Year Theme: Year of execution

Completeness: theme=filled, outcomes=filled
```
