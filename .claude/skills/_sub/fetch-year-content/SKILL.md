---
name: get-year-content
description: Read and parse Year.md content for quarterly/weekly planning. Returns structured data including frontmatter, vision theme, and leadership development context.
disable-model-invocation: true
allowed-tools: Read, Bash(ls)
---

# Get Year Content Sub-Skill

Reads Year.md from the Captive folder and parses it into structured data for quarterly and weekly planning context, including leadership development guidance.

## Prerequisites

This sub-skill expects `$VAULT` to be set by the calling skill (via `get-config`).

## File Location

- **Year.md:** `$VAULT/00_Brain/Captive/Year.md`

## Execution Steps

### 1. Check File Existence

Verify Year.md exists:

```bash
ls -la "$VAULT/00_Brain/Captive/Year.md"
```

If missing, return error result.

### 2. Read Year.md

Read the full content of Year.md.

### 3. Parse Frontmatter

Extract YAML frontmatter fields:
- `year` - Year (YYYY)
- `quarters` - Array of quarters (YYYY-QN)

### 4. Parse Sections

Extract each section by heading:

**Year Overview:**
- `vision_theme` - The year's theme or vision
- `annual_goals[]` - The 3 key annual goals

**Leadership Development:**
- `current_focus` - Object with primary and secondary focus areas
- `leadership_identity` - The leader identity statement
- `growth_edge` - Where discomfort lives (the stretch area)

### 5. Assess Completeness

Determine which sections have meaningful content vs. just prompts:

- `has_theme`: true if vision theme has content beyond placeholder
- `has_goals`: true if any annual goal has content beyond prompts
- `has_leadership`: true if leadership development section has content

Prompts are identified by:
- Starting with `*` (italic)
- Starting with `[` (placeholder)
- Being empty

### 6. Return Structured Result

**Success:**
```json
{
  "success": true,
  "path": "/path/to/vault/00_Brain/Captive/Year.md",
  "frontmatter": {
    "year": "2026",
    "quarters": ["2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4"]
  },
  "vision_theme": "Year of execution",
  "annual_goals": [
    "Step into director role with confidence",
    "Build high-performing team structure",
    "Deliver strategic initiatives on time"
  ],
  "leadership_development": {
    "current_focus": {
      "primary": "Listening deeply before responding",
      "secondary": "Delegating with trust, not micromanaging"
    },
    "leadership_identity": "I am a leader who creates clarity, develops people, and builds sustainable high-performing teams.",
    "growth_edge": "Having difficult conversations early instead of avoiding them"
  },
  "completeness": {
    "has_theme": true,
    "has_goals": true,
    "has_leadership": true
  }
}
```

**File Not Found:**
```json
{
  "success": false,
  "error": "file_not_found",
  "message": "Year.md not found at $VAULT/00_Brain/Captive/Year.md",
  "suggestion": "Run `/yearly-planning` to create an annual plan first, or create Year.md manually."
}
```

For backwards compatibility, also output human-readable summary:
```
Year.md loaded for 2026

Vision Theme: Year of execution
Annual Goals: 3 defined

Leadership Development:
- Primary Focus: Listening deeply before responding
- Secondary Focus: Delegating with trust, not micromanaging
- Identity: I am a leader who creates clarity...
- Growth Edge: Having difficult conversations early

Completeness: theme=filled, goals=filled, leadership=filled
```
