---
name: get-quarter-content
description: Read and parse Quarter.md content for weekly/monthly planning. Returns structured data including frontmatter, quarterly theme, coaching themes, and key outcomes.
disable-model-invocation: true
allowed-tools: Read, Bash(ls)
---

# Get Quarter Content Sub-Skill

Reads Quarter.md from the Captive folder and parses it into structured data for weekly and monthly planning context, including coaching themes.

## Prerequisites

This sub-skill expects `$VAULT` to be set by the calling skill (via `get-config`).

## File Location

- **Quarter.md:** `$VAULT/00_Brain/Captive/Quarter.md`

## Execution Steps

### 1. Check File Existence

Verify Quarter.md exists:

```bash
ls -la "$VAULT/00_Brain/Captive/Quarter.md"
```

If missing, return error result.

### 2. Read Quarter.md

Read the full content of Quarter.md.

### 3. Parse Frontmatter

Extract YAML frontmatter fields:
- `quarter` - Quarter (YYYY-QN)
- `year` - Year (YYYY)
- `months` - Array of months (YYYY-MM)

### 4. Parse Sections

Extract each section by heading:

**Context From Above:**
- `year_theme` - From Year.md
- `annual_goals` - From Year.md
- `growth_edge` - From Year.md

**Quarter Overview:**
- `key_outcomes[]` - The 3 key outcomes for the quarter
- `quarterly_theme` - The quarter's focus theme

**Coaching Themes:**
- `patterns_to_watch[]` - Self-awareness patterns to notice
- `questions_that_serve_me[]` - Coaching questions for the quarter

### 5. Assess Completeness

Determine which sections have meaningful content vs. just prompts:

- `has_theme`: true if quarterly theme has content beyond placeholder
- `has_outcomes`: true if any key outcome has content beyond prompts
- `has_coaching`: true if patterns or questions have content

Prompts are identified by:
- Starting with `*` (italic)
- Starting with `[` (placeholder)
- Being empty

### 6. Return Structured Result

**Success:**
```json
{
  "success": true,
  "path": "/path/to/vault/00_Brain/Captive/Quarter.md",
  "frontmatter": {
    "quarter": "2026-Q1",
    "year": "2026",
    "months": ["2026-01", "2026-02", "2026-03"]
  },
  "quarterly_theme": "SCI transformation & leadership growth",
  "key_outcomes": [
    "Establish leadership presence in new role",
    "Build team structure clarity",
    "Deliver Q1 strategic initiatives"
  ],
  "context_from_above": {
    "year_theme": "Year of execution",
    "annual_goals": ["Goal 1", "Goal 2", "Goal 3"],
    "growth_edge": "Having difficult conversations early"
  },
  "coaching": {
    "patterns_to_watch": [
      "Tendency to solve problems for people instead of asking questions",
      "Energy drain from context-switching"
    ],
    "questions_that_serve_me": [
      "What are you avoiding?",
      "Who needs to hear something from you?",
      "What would the leader you want to be do right now?"
    ]
  },
  "completeness": {
    "has_theme": true,
    "has_outcomes": true,
    "has_coaching": true
  }
}
```

**File Not Found:**
```json
{
  "success": false,
  "error": "file_not_found",
  "message": "Quarter.md not found at $VAULT/00_Brain/Captive/Quarter.md",
  "suggestion": "Run `/quarterly-planning` to create a quarterly plan first, or create Quarter.md manually."
}
```

For backwards compatibility, also output human-readable summary:
```
Quarter.md loaded for 2026-Q1

Quarterly Theme: SCI transformation & leadership growth
Key Outcomes: 3 defined

Context From Above:
- Year Theme: Year of execution
- Growth Edge: Having difficult conversations early

Coaching Themes:
- Patterns to Watch: 2 defined
- Questions That Serve Me: 3 defined

Completeness: theme=filled, outcomes=filled, coaching=filled
```
