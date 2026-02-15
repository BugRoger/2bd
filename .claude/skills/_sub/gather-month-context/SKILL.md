---
name: gather-month-context
description: Collect and synthesize all weekly archives for a given month. Returns aggregated data including outcomes, wins, insights, and completeness status.
disable-model-invocation: true
allowed-tools: Read, Bash(ls, date)
---

# Gather Month Context Sub-Skill

Collects all weekly archives for a specified month and synthesizes them into structured data for monthly review.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `month`: Target month in YYYY-MM format
- `month_start`: First day of month (YYYY-MM-DD)
- `month_end`: Last day of month (YYYY-MM-DD)

## Instructions

### 1. Determine Overlapping ISO Weeks

Calculate all ISO weeks that overlap with the target month:

```bash
# For month_start and month_end, find all weeks
# A week overlaps if any day Mon-Sun falls within the month
# Use: date -j -f "%Y-%m-%d" "$date" "+%G-W%V" on macOS
```

Generate list of weeks in YYYY-Www format (e.g., 2026-W05, 2026-W06, 2026-W07, 2026-W08, 2026-W09).

Note: First and last weeks of month may be partial (some days in adjacent months).

### 2. Check Weekly Archive Existence

For each overlapping week, check if archive exists:

```bash
ls "$VAULT/00_Brain/Periodic/Weekly/{week}.md" 2>/dev/null
```

Track:
- `existing_archives[]` - Weeks with archives
- `missing_weeks[]` - Weeks without archives (format: "YYYY-Www")

### 3. Read Each Weekly Archive

For each existing archive, read and parse:

**Frontmatter:**
- `week` - The ISO week identifier
- `week_start` - First day (Monday)
- `week_end` - Last day (Sunday)
- `focus_theme` - Weekly theme/intention
- `total_meetings` - Sum of meetings across week
- `total_focus_hours` - Sum of focus hours
- `avg_energy` - Average energy level
- `priority_completion_rate` - Percentage of priorities completed

**Sections:**
- `key_outcomes[]` - 3-5 most important outcomes
- `wins` - personal, organisational, strategic subsections
- `reflections` - what_worked, what_didnt, key_insight
- `carry_forward[]` - Items marked for next week
- `people_interactions[]` - Notable interactions with people
- `projects_touched[]` - Projects worked on

### 4. Aggregate Data

Compile across all weekly archives:

**Metrics:**
- `total_meetings`: Sum of all weekly meeting counts
- `total_focus_hours`: Sum of all weekly focus hours
- `avg_energy`: Average of weekly energy averages (weighted by days archived)
- `energy_trend`: "increasing", "stable", or "decreasing" across weeks
- `outcome_completion_rate`: Average of weekly priority completion rates

**Collections:**
- `wins.personal[]`: All personal wins with week references
- `wins.organisational[]`: All org wins with week references
- `wins.strategic[]`: All strategic wins with week references
- `key_outcomes[]`: All key outcomes with week references
- `insights[]`: All key insights with week references
- `what_worked[]`: All positive patterns with week references
- `what_didnt[]`: All friction points with week references
- `carry_forward[]`: All incomplete items from final week

**Entity Aggregates:**
- `unique_people[]`: All person references with total interaction counts
- `unique_projects[]`: All project references with total mention counts
- `focus_themes[]`: All weekly themes with week references

**Patterns Observed:**
For monthly review, identify patterns across weeks:
- `recurring_wins[]`: Wins that appeared in multiple weeks
- `recurring_friction[]`: Issues that persisted across weeks
- `energy_patterns`: Trend analysis across the month

### 5. Generate Weekly Links

Create wikilinks to each weekly archive for the monthly archive:

```markdown
- [[00_Brain/Periodic/Weekly/2026-W05|Week 5]] - [Focus theme or summary]
- [[00_Brain/Periodic/Weekly/2026-W06|Week 6]] - [Focus theme or summary]
...
```

Use the focus_theme or a summary of key outcomes as the one-liner.

### 6. Return Structured Result

**Success (full month):**
```json
{
  "success": true,
  "month": "2026-02",
  "month_start": "2026-02-01",
  "month_end": "2026-02-28",
  "weekly_archives": [
    {
      "week": "2026-W05",
      "week_start": "2026-01-26",
      "week_end": "2026-02-01",
      "exists": true,
      "path": "/path/to/.../Periodic/Weekly/2026-W05.md",
      "partial_overlap": true,
      "days_in_month": 1,
      "focus_theme": "Platform foundation",
      "total_meetings": 18,
      "total_focus_hours": 15,
      "avg_energy": 2.4,
      "priority_completion_rate": 73,
      "key_outcomes_count": 4,
      "wins_count": 8
    },
    {
      "week": "2026-W06",
      "week_start": "2026-02-02",
      "week_end": "2026-02-08",
      "exists": true,
      "path": "/path/to/.../Periodic/Weekly/2026-W06.md",
      "partial_overlap": false,
      "days_in_month": 7,
      "focus_theme": "Team alignment",
      "total_meetings": 22,
      "total_focus_hours": 12,
      "avg_energy": 2.2,
      "priority_completion_rate": 80,
      "key_outcomes_count": 5,
      "wins_count": 10
    }
  ],
  "missing_weeks": [],
  "aggregates": {
    "total_meetings": 85,
    "total_focus_hours": 58,
    "avg_energy": 2.3,
    "energy_trend": "stable",
    "outcome_completion_rate": 76,
    "unique_people": [
      { "name": "[[SarahK]]", "interaction_count": 12 },
      { "name": "[[MarcusT]]", "interaction_count": 8 }
    ],
    "unique_projects": [
      { "name": "[[platform-migration]]", "mention_count": 18 },
      { "name": "[[q2-roadmap]]", "mention_count": 10 }
    ],
    "focus_themes": [
      { "week": "2026-W05", "theme": "Platform foundation" },
      { "week": "2026-W06", "theme": "Team alignment" },
      { "week": "2026-W07", "theme": "Execution sprint" },
      { "week": "2026-W08", "theme": "Stakeholder reviews" },
      { "week": "2026-W09", "theme": "Month close" }
    ]
  },
  "key_outcomes": [
    { "week": "2026-W05", "content": "Platform API v2 design finalized" },
    { "week": "2026-W06", "content": "Team OKRs aligned with company strategy" },
    { "week": "2026-W07", "content": "Migration phase 1 complete" }
  ],
  "wins": {
    "personal": [
      { "week": "2026-W05", "content": "Established morning routine" },
      { "week": "2026-W07", "content": "Delegated effectively to Marcus" }
    ],
    "organisational": [
      { "week": "2026-W06", "content": "Team velocity up 20%" },
      { "week": "2026-W08", "content": "Stakeholder satisfaction high" }
    ],
    "strategic": [
      { "week": "2026-W05", "content": "[[platform-migration]]: Architecture approved" },
      { "week": "2026-W07", "content": "[[platform-migration]]: Phase 1 shipped" }
    ]
  },
  "insights": [
    { "week": "2026-W05", "key_insight": "Foundation work enables velocity later" },
    { "week": "2026-W06", "key_insight": "Alignment reduces friction" },
    { "week": "2026-W07", "key_insight": "Shipping builds momentum" }
  ],
  "what_worked": [
    { "week": "2026-W05", "content": "Deep work mornings" },
    { "week": "2026-W06", "content": "Clear communication in standups" }
  ],
  "what_didnt": [
    { "week": "2026-W06", "content": "Too many evening meetings" },
    { "week": "2026-W08", "content": "Context switching in afternoons" }
  ],
  "patterns_observed": {
    "recurring_wins": ["Morning focus blocks", "Effective delegation"],
    "recurring_friction": ["Afternoon energy dips", "Meeting overload"],
    "energy_patterns": "Consistent mid-week energy dips, strong Monday starts"
  },
  "people_interactions": [
    {
      "person": "[[SarahK]]",
      "interaction_count": 12,
      "weeks": ["2026-W05", "2026-W06", "2026-W07", "2026-W08"],
      "topics": ["career growth", "tech lead path", "project leadership"],
      "notable_moment": "Agreed on tech lead transition plan"
    },
    {
      "person": "[[MarcusT]]",
      "interaction_count": 8,
      "weeks": ["2026-W05", "2026-W07", "2026-W08"],
      "topics": ["platform migration", "API design", "technical decisions"],
      "notable_moment": "Shipped phase 1 together"
    }
  ],
  "carry_forward": [
    { "source_week": "2026-W09", "item": "Finalize Q1 budget review" },
    { "source_week": "2026-W09", "item": "Schedule quarterly planning session" }
  ],
  "weekly_links": "- [[00_Brain/Periodic/Weekly/2026-W05|Week 5]] - Platform foundation\n- [[00_Brain/Periodic/Weekly/2026-W06|Week 6]] - Team alignment\n- [[00_Brain/Periodic/Weekly/2026-W07|Week 7]] - Execution sprint\n- [[00_Brain/Periodic/Weekly/2026-W08|Week 8]] - Stakeholder reviews\n- [[00_Brain/Periodic/Weekly/2026-W09|Week 9]] - Month close"
}
```

**Success (partial month):**
```json
{
  "success": true,
  "partial": true,
  "month": "2026-02",
  "weekly_archives": [...],
  "missing_weeks": ["2026-W06", "2026-W08"],
  "message": "3 of 5 weeks archived. Proceeding with available data.",
  "aggregates": {...},
  "key_outcomes": [...],
  "wins": {...},
  "insights": [...],
  "patterns_observed": {...},
  "people_interactions": [...],
  "carry_forward": [...],
  "weekly_links": "..."
}
```

**No archives found:**
```json
{
  "success": false,
  "error": "no_archives",
  "month": "2026-02",
  "missing_weeks": ["2026-W05", "2026-W06", "2026-W07", "2026-W08", "2026-W09"],
  "message": "No weekly archives found for this month.",
  "suggestion": "Run `/weekly-review` for each week, or proceed with Month.md content only."
}
```

For backwards compatibility, also output human-readable summary:
```
Weekly Archives for 2026-02

Found: 5/5 weeks archived (W05-W09)

Totals:
- Meetings: 85
- Focus Hours: 58h
- Energy: 2.3 avg (stable)
- Outcome Completion: 76%

People: SarahK (12), MarcusT (8)
Projects: platform-migration (18), q2-roadmap (10)

Focus Themes:
- W05: Platform foundation
- W06: Team alignment
- W07: Execution sprint
- W08: Stakeholder reviews
- W09: Month close

Key Insights:
- W05: "Foundation work enables velocity later"
- W06: "Alignment reduces friction"
- W07: "Shipping builds momentum"
...
```

## Design for Reuse

This sub-skill is designed to be reusable by:
- **monthly-review**: Primary consumer for monthly synthesis
- **quarterly-review**: Can call multiple times to gather all months in a quarter
- **yearly-review**: Can aggregate monthly data for annual patterns

The date range inputs allow flexibility for different time periods.
