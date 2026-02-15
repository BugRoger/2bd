---
name: gather-quarter-context
description: Collect and synthesize all monthly archives for a given quarter. Returns aggregated data including outcomes, wins, insights, patterns, and coaching progress.
disable-model-invocation: true
allowed-tools: Read, Bash(ls, date)
---

# Gather Quarter Context Sub-Skill

Collects all monthly archives for a specified quarter and synthesizes them into structured data for quarterly review.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `quarter`: Target quarter in YYYY-QN format (e.g., 2026-Q1)
- `months`: Array of months in the quarter (YYYY-MM format)
  - Q1: ["YYYY-01", "YYYY-02", "YYYY-03"]
  - Q2: ["YYYY-04", "YYYY-05", "YYYY-06"]
  - Q3: ["YYYY-07", "YYYY-08", "YYYY-09"]
  - Q4: ["YYYY-10", "YYYY-11", "YYYY-12"]

## Instructions

### 1. Check Monthly Archive Existence

For each month in the quarter, check if archive exists:

```bash
ls "$VAULT/00_Brain/Periodic/Monthly/{month}.md" 2>/dev/null
```

Track:
- `existing_archives[]` - Months with archives
- `missing_months[]` - Months without archives (format: "YYYY-MM (Month Name)")

### 2. Read Each Monthly Archive

For each existing archive, read and parse:

**Frontmatter:**
- `month` - The month identifier (YYYY-MM)
- `quarter` - Quarter reference
- `year` - Year reference
- `archived` - Archive date

**Sections:**
- `key_outcomes[]` - Major accomplishments for the month
- `monthly_theme` - Month theme from synthesis section
- `coaching_checkin` - Coaching/leadership data
  - `growth_edge_progress` - Progress on growth edge
  - `avoided_conversations` - Difficult conversations avoided
  - `delegation_patterns` - Delegation successes/failures
- `wins` - personal, organisational, strategic subsections
- `reflections` - What worked, what didn't, patterns observed
- `patterns_trends[]` - Patterns identified across weeks
- `carry_forward[]` - Items marked for next month

### 3. Aggregate Data

Compile across all monthly archives:

**Metrics:**
- `outcome_completion_rate`: Average across months (if tracked)
- `months_archived`: Count of months with archives
- `total_weeks_covered`: Sum of weeks referenced across all months

**Collections:**
- `wins.personal[]`: All personal wins with month references
- `wins.organisational[]`: All org wins with month references
- `wins.strategic[]`: All strategic wins with month references
- `key_outcomes[]`: All key outcomes with month references
- `insights[]`: All key insights with month references
- `what_worked[]`: All positive patterns with month references
- `what_didnt[]`: All friction points with month references

**Entity Aggregates:**
- `unique_people[]`: All person references with total interaction counts
  - **Interaction count**: Number of MONTHS the person appeared in (not total mentions)
- `unique_projects[]`: All project references with total mention counts
  - **Mention count**: Number of MONTHS the project appeared in (not total references)
- `monthly_themes[]`: All monthly themes with month references

Note: This counting is consistent with gather-week-context which counts DAYS, not mentions.

**Coaching Aggregates:**
For quarterly review leadership reflection:
- `growth_edge_progress[]`: Progress on growth edge across months
  - Collect all monthly progress notes as array with month reference
  - Example: `[{ "month": "2026-01", "progress": "Started having difficult conversations" }]`
- `avoided_conversations[]`: Patterns in difficult conversations
  - Collect unique avoided conversations, noting if same one repeats
  - Track trend: if same conversation avoided multiple months, flag as "recurring"
- `delegation_patterns[]`: Evolution of delegation effectiveness
  - Aggregate observations, identify recurring themes
  - Note: "over-involved in X" appearing 2+ months = pattern

**Patterns Observed:**
For quarterly review, identify patterns across months:
- `recurring_wins[]`: Wins that appeared in multiple months
- `recurring_friction[]`: Issues that persisted across months
- `quarterly_trend`: Overall trajectory (improving, stable, declining)

### 4. Generate Monthly Links

Create wikilinks to each monthly archive for the quarterly archive:

```markdown
- [[00_Brain/Periodic/Monthly/2026-01|January]] - [Monthly theme or summary]
- [[00_Brain/Periodic/Monthly/2026-02|February]] - [Monthly theme or summary]
- [[00_Brain/Periodic/Monthly/2026-03|March]] - [Monthly theme or summary]
```

Use the monthly_theme or a summary of key outcomes as the one-liner.

Note: `monthly_links` in the return value is a newline-separated markdown string. Each line is a wikilink with theme summary.

### 5. Return Structured Result

**Success (full quarter):**
```json
{
  "success": true,
  "quarter": "2026-Q1",
  "year": "2026",
  "monthly_archives": [
    {
      "month": "2026-01",
      "month_name": "January",
      "exists": true,
      "path": "/path/to/.../Periodic/Monthly/2026-01.md",
      "monthly_theme": "Foundation building",
      "key_outcomes_count": 5,
      "wins_count": 12,
      "weeks_covered": 5
    },
    {
      "month": "2026-02",
      "month_name": "February",
      "exists": true,
      "path": "/path/to/.../Periodic/Monthly/2026-02.md",
      "monthly_theme": "Execution sprint",
      "key_outcomes_count": 4,
      "wins_count": 10,
      "weeks_covered": 4
    },
    {
      "month": "2026-03",
      "month_name": "March",
      "exists": true,
      "path": "/path/to/.../Periodic/Monthly/2026-03.md",
      "monthly_theme": "Quarter close",
      "key_outcomes_count": 6,
      "wins_count": 15,
      "weeks_covered": 5
    }
  ],
  "missing_months": [],
  "aggregates": {
    "months_archived": 3,
    "total_weeks_covered": 14,
    "outcome_completion_rate": 78,
    "unique_people": [
      { "name": "[[SarahK]]", "interaction_count": 35 },
      { "name": "[[MarcusT]]", "interaction_count": 24 }
    ],
    "unique_projects": [
      { "name": "[[platform-migration]]", "mention_count": 42 },
      { "name": "[[q2-roadmap]]", "mention_count": 28 }
    ],
    "monthly_themes": [
      { "month": "2026-01", "theme": "Foundation building" },
      { "month": "2026-02", "theme": "Execution sprint" },
      { "month": "2026-03", "theme": "Quarter close" }
    ]
  },
  "key_outcomes": [
    { "month": "2026-01", "content": "Platform architecture approved" },
    { "month": "2026-01", "content": "Team OKRs finalized" },
    { "month": "2026-02", "content": "Migration phase 1 complete" },
    { "month": "2026-02", "content": "Stakeholder alignment achieved" },
    { "month": "2026-03", "content": "Q1 targets met" },
    { "month": "2026-03", "content": "Tech lead transition initiated" }
  ],
  "wins": {
    "personal": [
      { "month": "2026-01", "content": "Established morning routine consistency" },
      { "month": "2026-02", "content": "Better boundary setting" },
      { "month": "2026-03", "content": "Delegation becoming natural" }
    ],
    "organisational": [
      { "month": "2026-01", "content": "Team velocity improved 15%" },
      { "month": "2026-02", "content": "Cross-team collaboration strengthened" },
      { "month": "2026-03", "content": "Stakeholder NPS up" }
    ],
    "strategic": [
      { "month": "2026-01", "content": "[[platform-migration]]: Architecture phase complete" },
      { "month": "2026-02", "content": "[[platform-migration]]: Phase 1 shipped" },
      { "month": "2026-03", "content": "[[platform-migration]]: Phase 2 on track" }
    ]
  },
  "insights": [
    { "month": "2026-01", "key_insight": "Foundation work enables velocity later" },
    { "month": "2026-02", "key_insight": "Shipping builds momentum" },
    { "month": "2026-03", "key_insight": "Sustainable pace beats sprinting" }
  ],
  "what_worked": [
    { "month": "2026-01", "content": "Morning deep work blocks" },
    { "month": "2026-02", "content": "Weekly planning rhythm" },
    { "month": "2026-03", "content": "Proactive stakeholder updates" }
  ],
  "what_didnt": [
    { "month": "2026-01", "content": "Too many evening commitments" },
    { "month": "2026-02", "content": "Context switching in afternoons" },
    { "month": "2026-03", "content": "Insufficient recovery time" }
  ],
  "coaching_data": {
    "growth_edge_progress": [
      { "month": "2026-01", "progress": "Starting to recognize avoidance patterns" },
      { "month": "2026-02", "progress": "Had two difficult conversations successfully" },
      { "month": "2026-03", "progress": "Proactive about addressing tensions early" }
    ],
    "avoided_conversations": [
      { "month": "2026-01", "count": 3, "themes": ["performance feedback", "boundary setting"] },
      { "month": "2026-02", "count": 1, "themes": ["resource allocation"] },
      { "month": "2026-03", "count": 0, "themes": [] }
    ],
    "delegation_patterns": [
      { "month": "2026-01", "pattern": "Still holding on to technical decisions" },
      { "month": "2026-02", "pattern": "Delegated API design to Marcus successfully" },
      { "month": "2026-03", "pattern": "Trust built - comfortable delegating critical path work" }
    ]
  },
  "patterns_observed": {
    "recurring_wins": ["Morning focus blocks", "Effective delegation", "Proactive communication"],
    "recurring_friction": ["Afternoon energy dips", "Meeting overload weeks"],
    "quarterly_trend": "improving"
  },
  "people_interactions": [
    {
      "person": "[[SarahK]]",
      "interaction_count": 35,
      "months": ["2026-01", "2026-02", "2026-03"],
      "topics": ["career growth", "tech lead path", "project leadership"],
      "notable_moment": "Finalized tech lead transition plan"
    },
    {
      "person": "[[MarcusT]]",
      "interaction_count": 24,
      "months": ["2026-01", "2026-02", "2026-03"],
      "topics": ["platform migration", "API design", "technical decisions"],
      "notable_moment": "Shipped phase 1 and 2 together"
    }
  ],
  "carry_forward": [
    { "source_month": "2026-03", "item": "Q2 planning finalization" },
    { "source_month": "2026-03", "item": "Tech lead promotion paperwork" }
  ],
  "monthly_links": "- [[00_Brain/Periodic/Monthly/2026-01|January]] - Foundation building\n- [[00_Brain/Periodic/Monthly/2026-02|February]] - Execution sprint\n- [[00_Brain/Periodic/Monthly/2026-03|March]] - Quarter close"
}
```

**Success (partial quarter):**
```json
{
  "success": true,
  "partial": true,
  "quarter": "2026-Q1",
  "monthly_archives": [...],
  "missing_months": ["2026-02 (February)"],
  "message": "2 of 3 months archived. Proceeding with available data.",
  "aggregates": {...},
  "key_outcomes": [...],
  "wins": {...},
  "insights": [...],
  "coaching_data": {...},
  "patterns_observed": {...},
  "people_interactions": [...],
  "carry_forward": [...],
  "monthly_links": "..."
}
```

**No archives found:**
```json
{
  "success": false,
  "error": "no_archives",
  "quarter": "2026-Q1",
  "missing_months": ["2026-01 (January)", "2026-02 (February)", "2026-03 (March)"],
  "message": "No monthly archives found for this quarter.",
  "suggestion": "Run `/monthly-review` for each month, or proceed with Quarter.md content only."
}
```

For backwards compatibility, also output human-readable summary:
```
Monthly Archives for 2026-Q1

Found: 3/3 months archived (Jan-Mar)

Coverage:
- Weeks covered: 14
- Outcome completion: 78%

People: SarahK (35), MarcusT (24)
Projects: platform-migration (42), q2-roadmap (28)

Monthly Themes:
- Jan: Foundation building
- Feb: Execution sprint
- Mar: Quarter close

Key Insights:
- Jan: "Foundation work enables velocity later"
- Feb: "Shipping builds momentum"
- Mar: "Sustainable pace beats sprinting"

Coaching Progress:
- Growth Edge: Started recognizing patterns -> Proactive about tensions
- Avoided Conversations: 3 -> 1 -> 0 (improving!)
- Delegation: Technical decisions -> Critical path work
...
```

## Design for Reuse

This sub-skill is designed to be reusable by:
- **quarterly-review**: Primary consumer for quarterly synthesis
- **yearly-review**: Can call multiple times to gather all quarters in a year
- **coaching-review**: Can analyze coaching data trends across quarters

The structured inputs (vault, quarter, months array) allow flexibility for different time periods.
