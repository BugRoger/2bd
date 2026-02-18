---
name: extract-to-areas
description: Extract synthesized content to semantic Area notes (People, Projects, Insights). Prepares structured updates for review rituals to apply via update-semantic.
disable-model-invocation: true
allowed-tools: Read, Bash(ls)
---

# Extract to Areas Sub-Skill

Analyzes review synthesis data and prepares semantic note updates for People, Projects, and Insights files.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `scope`: "day" or "week" (affects summary depth)
- `people`: Array of `[[PersonName]]` references to process
- `projects`: Array of `[[project-name]]` references to process
- `insights`: Synthesized insights from the review
- `context`: Full context data (daily or weekly aggregates)

## Instructions

Receive the vault path, scope (day/week), people array, projects array, insights, and context data.

For each person in the people array, search for their file in `02_Areas/People/`. If not found, add to skipped with a suggestion to create the file. If found, gather all interactions with this person from the context, including meeting dates and topics, notable moments, and follow-up items. Prepare an update for the `update-semantic` sub-skill targeting the Interactions section, formatted according to the scope (weekly scope provides summarized date ranges, daily scope provides specific dates).

For each project in the projects array, search for their file in `01_Projects/`. If not found, add to skipped. If found, gather all progress mentions from the context, including strategic wins, priority completions, and blockers. Prepare an update targeting the Progress section, formatted according to the scope.

For each insight, determine if it connects to an existing Insight note by searching `02_Areas/Insights/` for matching themes. If a match is found, prepare an update targeting the Evidence section. If no match is found, flag it as a new insight suggestion with a suggested filename and reason.

Return structured JSON showing updates prepared, files skipped, and new insight suggestions. For backwards compatibility, also output a human-readable summary.

**Success:**
```json
{
  "success": true,
  "scope": "week",
  "date_range": "2026-W07",
  "updates": [
    {
      "type": "person",
      "path": "02_Areas/People/SarahK.md",
      "section": "Interactions",
      "content": "2026-W07 (Feb 9-13): 3 conversations about career growth. Key moment: discussed tech lead path. She's energized about Q2 opportunities."
    }
  ],
  "skipped": [],
  "new_insights": [],
  "summary": {
    "people_updates": 1,
    "project_updates": 0,
    "insight_updates": 0,
    "skipped": 0,
    "new_suggestions": 0
  }
}
```

## Design for Reuse

This sub-skill is designed to be called by:
- **daily-review**: Extract daily learnings to semantic notes (scope=day)
- **weekly-review**: Extract weekly synthesis to semantic notes (scope=week)
- **monthly-review**: Extract monthly patterns to semantic notes (scope=month)

The `scope` parameter controls the granularity of generated summaries:
- `day`: Specific dated entry
- `week`: Summarized with date range
- `month`: High-level themes and patterns

## Section Targeting

Updates target specific sections in semantic notes:

| Note Type | Target Section | Expected Format |
|-----------|----------------|-----------------|
| People | `## Interactions` | Dated entries with context |
| Projects | `## Progress` | Dated milestone/status entries |
| Insights | `## Evidence` | Dated observations supporting the insight |

If the target section doesn't exist, the update will be flagged for manual review.
