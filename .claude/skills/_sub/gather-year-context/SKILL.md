---
name: gather-year-context
description: Collect and synthesize all quarterly archives for a given year. Returns aggregated data including outcomes, wins, insights, strategic patterns, and leadership journey evolution.
disable-model-invocation: true
allowed-tools: Read, Bash(ls)
---

# Gather Year Context Sub-Skill

Collects all quarterly archives for a specified year and synthesizes them into structured data for yearly review.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `year`: Target year in YYYY format (e.g., 2026)

## Instructions

### 1. Check Quarterly Archive Existence

For each quarter in the year, check if archive exists:

```bash
ls "$VAULT/00_Brain/Periodic/Quarterly/{year}-Q1.md" 2>/dev/null
ls "$VAULT/00_Brain/Periodic/Quarterly/{year}-Q2.md" 2>/dev/null
ls "$VAULT/00_Brain/Periodic/Quarterly/{year}-Q3.md" 2>/dev/null
ls "$VAULT/00_Brain/Periodic/Quarterly/{year}-Q4.md" 2>/dev/null
```

Track:
- `existing_archives[]` - Quarters with archives (e.g., "2026-Q1", "2026-Q2")
- `missing_quarters[]` - Quarters without archives (format: "YYYY-QN (Quarter Name)")
  - Quarter names: Q1, Q2, Q3, Q4

### 2. Read Each Quarterly Archive

For each existing archive, read and parse:

**Frontmatter:**
- `quarter` - The quarter identifier (YYYY-QN)
- `year` - Year reference
- `archived` - Archive date
- `months_archived` - Count of months with archives
- `total_weeks_covered` - Weeks summarized

**Sections:**
- `key_outcomes[]` - Major accomplishments for the quarter
- `quarterly_theme` - Quarter theme from synthesis section
- `coaching_themes` - Leadership development focus areas
  - `growth_edge_evolution` - How growth edge progressed
  - `key_coaching_moment` - Most significant coaching moment
  - `leadership_growth` - Leadership capabilities developed
- `wins` - personal, organisational, strategic subsections
- `reflections` - What worked, what didn't, patterns observed
- `strategic_patterns[]` - Strategic patterns identified across months
- `carry_forward[]` - Items marked for next quarter

### 3. Aggregate Data

Compile across all quarterly archives:

**Metrics:**
- `quarters_archived`: Count of quarters with archives
- `total_months_covered`: Sum of months_archived across all quarters
- `total_weeks_covered`: Sum of weeks_covered across all quarters

**Counting Methodology:**
- **Quarter count**: Number of QUARTERS the item appeared in (not total mentions)
- **Month count**: Sum of months_archived from each quarter
- This counting is consistent with gather-quarter-context which counts MONTHS, not mentions.

**Collections:**
- `wins.personal[]`: All personal wins with quarter references
- `wins.organisational[]`: All org wins with quarter references
- `wins.strategic[]`: All strategic wins with quarter references
- `key_outcomes[]`: All key outcomes with quarter references
- `insights[]`: All key insights with quarter references
- `what_worked[]`: All positive patterns with quarter references
- `what_didnt[]`: All friction points with quarter references
- `strategic_patterns[]`: All strategic patterns with quarter references

**Entity Aggregates:**
- `unique_people[]`: All person references with total interaction counts
  - **Interaction count**: Number of QUARTERS the person appeared in
- `unique_projects[]`: All project references with total mention counts
  - **Mention count**: Number of QUARTERS the project appeared in
- `quarterly_themes[]`: All quarterly themes with quarter references

**Leadership Journey Aggregation:**
For yearly review, synthesize the full leadership arc:
- `themes_by_quarter[]`: Quarterly themes showing evolution
  - Collect each quarter's theme with quarter reference
  - Example: `[{ "quarter": "2026-Q1", "theme": "Foundation building" }, ...]`
- `coaching_evolution[]`: How coaching focus evolved
  - Aggregate growth_edge_evolution from each quarter
  - Track: starting state, progression milestones, ending state
  - Note recurring themes that persisted across multiple quarters
- `growth_edge_journey[]`: Evolution of growth edge across year
  - Compile growth edge progress from each quarter
  - Identify: initial challenge, breakthroughs, current mastery level
- `key_coaching_moments[]`: Significant coaching moments across year
  - Collect key_coaching_moment from each quarter
  - These form the narrative of leadership development

**Patterns Observed:**
For yearly review, identify patterns across quarters:
- `recurring_wins[]`: Wins that appeared in multiple quarters
- `recurring_friction[]`: Issues that persisted across quarters
- `yearly_trend`: Overall trajectory (improving, stable, declining)
- `seasonal_patterns`: Any patterns tied to specific quarters (e.g., Q4 always heavy)

### 4. Generate Quarterly Links

Create wikilinks to each quarterly archive for the yearly archive:

```markdown
- [[00_Brain/Periodic/Quarterly/2026-Q1|Q1]] - [Quarterly theme or summary]
- [[00_Brain/Periodic/Quarterly/2026-Q2|Q2]] - [Quarterly theme or summary]
- [[00_Brain/Periodic/Quarterly/2026-Q3|Q3]] - [Quarterly theme or summary]
- [[00_Brain/Periodic/Quarterly/2026-Q4|Q4]] - [Quarterly theme or summary]
```

Use the quarterly_theme or a summary of key outcomes as the one-liner.

**Links Format:** `quarterly_links` in the return value is a newline-separated markdown string. Each line is a wikilink with theme summary. Do not return as an array.

### 5. Return Structured Result

**Success (full year):**
```json
{
  "success": true,
  "year": "2026",
  "message": "4 of 4 quarters archived. Full year data available.",
  "quarterly_archives": [
    {
      "quarter": "2026-Q1",
      "exists": true,
      "path": "/path/to/.../Periodic/Quarterly/2026-Q1.md",
      "quarterly_theme": "Foundation building",
      "months_archived": 3,
      "total_weeks_covered": 14,
      "key_outcomes_count": 6,
      "wins_count": 15
    },
    {
      "quarter": "2026-Q2",
      "exists": true,
      "path": "/path/to/.../Periodic/Quarterly/2026-Q2.md",
      "quarterly_theme": "Scaling operations",
      "months_archived": 3,
      "total_weeks_covered": 13,
      "key_outcomes_count": 5,
      "wins_count": 18
    },
    {
      "quarter": "2026-Q3",
      "exists": true,
      "path": "/path/to/.../Periodic/Quarterly/2026-Q3.md",
      "quarterly_theme": "Market expansion",
      "months_archived": 3,
      "total_weeks_covered": 14,
      "key_outcomes_count": 7,
      "wins_count": 20
    },
    {
      "quarter": "2026-Q4",
      "exists": true,
      "path": "/path/to/.../Periodic/Quarterly/2026-Q4.md",
      "quarterly_theme": "Year close and reflection",
      "months_archived": 3,
      "total_weeks_covered": 13,
      "key_outcomes_count": 5,
      "wins_count": 16
    }
  ],
  "missing_quarters": [],
  "aggregates": {
    "quarters_archived": 4,
    "total_months_covered": 12,
    "total_weeks_covered": 54,
    "unique_people": [
      { "name": "[[SarahK]]", "interaction_count": 4 },
      { "name": "[[MarcusT]]", "interaction_count": 4 },
      { "name": "[[JessicaL]]", "interaction_count": 3 }
    ],
    "unique_projects": [
      { "name": "[[platform-migration]]", "mention_count": 4 },
      { "name": "[[market-expansion]]", "mention_count": 3 },
      { "name": "[[team-scaling]]", "mention_count": 2 }
    ],
    "quarterly_themes": [
      { "quarter": "2026-Q1", "theme": "Foundation building" },
      { "quarter": "2026-Q2", "theme": "Scaling operations" },
      { "quarter": "2026-Q3", "theme": "Market expansion" },
      { "quarter": "2026-Q4", "theme": "Year close and reflection" }
    ]
  },
  "key_outcomes": [
    { "quarter": "2026-Q1", "content": "Platform architecture established" },
    { "quarter": "2026-Q1", "content": "Core team hired and onboarded" },
    { "quarter": "2026-Q2", "content": "Platform v2 launched" },
    { "quarter": "2026-Q2", "content": "Operations scaled to handle 3x load" },
    { "quarter": "2026-Q3", "content": "Entered 3 new markets" },
    { "quarter": "2026-Q3", "content": "Revenue targets exceeded by 15%" },
    { "quarter": "2026-Q4", "content": "Annual targets achieved" },
    { "quarter": "2026-Q4", "content": "Leadership team succession plan complete" }
  ],
  "wins": {
    "personal": [
      { "quarter": "2026-Q1", "content": "Established sustainable work rhythm" },
      { "quarter": "2026-Q2", "content": "Delegation becoming natural" },
      { "quarter": "2026-Q3", "content": "Strategic thinking time protected" },
      { "quarter": "2026-Q4", "content": "Work-life balance maintained through crunch" }
    ],
    "organisational": [
      { "quarter": "2026-Q1", "content": "Team velocity improved 25%" },
      { "quarter": "2026-Q2", "content": "Cross-functional collaboration streamlined" },
      { "quarter": "2026-Q3", "content": "New market teams autonomous" },
      { "quarter": "2026-Q4", "content": "Year-end morale at all-time high" }
    ],
    "strategic": [
      { "quarter": "2026-Q1", "content": "[[platform-migration]]: Foundation complete" },
      { "quarter": "2026-Q2", "content": "[[platform-migration]]: Full migration done" },
      { "quarter": "2026-Q3", "content": "[[market-expansion]]: 3 markets launched" },
      { "quarter": "2026-Q4", "content": "[[market-expansion]]: All markets profitable" }
    ]
  },
  "insights": [
    { "quarter": "2026-Q1", "key_insight": "Foundation work enables velocity later" },
    { "quarter": "2026-Q2", "key_insight": "Scaling requires letting go of details" },
    { "quarter": "2026-Q3", "key_insight": "New markets need local autonomy" },
    { "quarter": "2026-Q4", "key_insight": "Sustainable pace beats heroics" }
  ],
  "strategic_patterns": [
    { "quarter": "2026-Q1", "pattern": "Investment phase requires patience" },
    { "quarter": "2026-Q2", "pattern": "Systematic approaches scale better" },
    { "quarter": "2026-Q3", "pattern": "Decentralization enables speed" },
    { "quarter": "2026-Q4", "pattern": "Reflection time compounds learning" }
  ],
  "what_worked": [
    { "quarter": "2026-Q1", "content": "Deep foundation work" },
    { "quarter": "2026-Q2", "content": "Systematic delegation" },
    { "quarter": "2026-Q3", "content": "Empowering local teams" },
    { "quarter": "2026-Q4", "content": "Protected reflection time" }
  ],
  "what_didnt": [
    { "quarter": "2026-Q1", "content": "Underestimated onboarding time" },
    { "quarter": "2026-Q2", "content": "Communication gaps during scaling" },
    { "quarter": "2026-Q3", "content": "Too much travel initially" },
    { "quarter": "2026-Q4", "content": "Year-end planning started late" }
  ],
  "leadership_journey": {
    "themes_by_quarter": [
      { "quarter": "2026-Q1", "theme": "Building trust with new team" },
      { "quarter": "2026-Q2", "theme": "Letting go to scale" },
      { "quarter": "2026-Q3", "theme": "Leading through others" },
      { "quarter": "2026-Q4", "theme": "Strategic leadership" }
    ],
    "coaching_evolution": [
      { "quarter": "2026-Q1", "focus": "Difficult conversations", "progress": "Starting to recognize avoidance" },
      { "quarter": "2026-Q2", "focus": "Difficult conversations", "progress": "Having them proactively" },
      { "quarter": "2026-Q3", "focus": "Strategic delegation", "progress": "Comfortable with ambiguity" },
      { "quarter": "2026-Q4", "focus": "Scaling leadership", "progress": "Building leaders who build leaders" }
    ],
    "growth_edge_journey": {
      "starting_point": "Avoiding difficult conversations",
      "q1_progress": "Recognizing patterns",
      "q2_progress": "Proactive engagement",
      "q3_progress": "Natural skill",
      "q4_progress": "Teaching others",
      "ending_point": "Now coaching others on this skill"
    },
    "key_coaching_moments": [
      { "quarter": "2026-Q1", "moment": "First difficult performance conversation" },
      { "quarter": "2026-Q2", "moment": "Successfully delegated critical project" },
      { "quarter": "2026-Q3", "moment": "Empowered team to make major decision without me" },
      { "quarter": "2026-Q4", "moment": "Coached direct report through their first difficult conversation" }
    ]
  },
  "patterns_observed": {
    "recurring_wins": ["Systematic approaches", "Protected thinking time", "Empowering others"],
    "recurring_friction": ["Communication during transitions", "Balancing detail vs strategy"],
    "yearly_trend": "improving",
    "seasonal_patterns": "Q4 heavier with planning, Q1 foundation work, Q2-Q3 execution"
  },
  "people_interactions": [
    // Note: interaction_count = number of QUARTERS the person appeared in (not total mentions)
    {
      "person": "[[SarahK]]",
      "interaction_count": 4,
      "quarters": ["2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4"],
      "topics": ["career growth", "leadership development", "strategic planning"],
      "notable_moment": "Promoted to senior leadership"
    },
    {
      "person": "[[MarcusT]]",
      "interaction_count": 4,
      "quarters": ["2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4"],
      "topics": ["platform migration", "technical strategy", "team building"],
      "notable_moment": "Led platform v2 launch"
    }
  ],
  "carry_forward": [
    { "source_quarter": "2026-Q4", "item": "2027 strategy finalization" },
    { "source_quarter": "2026-Q4", "item": "New market entry planning" }
  ],
  "quarterly_links": "- [[00_Brain/Periodic/Quarterly/2026-Q1|Q1]] - Foundation building\n- [[00_Brain/Periodic/Quarterly/2026-Q2|Q2]] - Scaling operations\n- [[00_Brain/Periodic/Quarterly/2026-Q3|Q3]] - Market expansion\n- [[00_Brain/Periodic/Quarterly/2026-Q4|Q4]] - Year close and reflection"
}
```

**Success (partial year):**
```json
{
  "success": true,
  "partial": true,
  "year": "2026",
  "quarterly_archives": [...],
  "missing_quarters": ["2026-Q3 (Q3)", "2026-Q4 (Q4)"],
  "message": "2 of 4 quarters archived. Proceeding with available data.",
  "aggregates": {...},
  "key_outcomes": [...],
  "wins": {...},
  "insights": [...],
  "strategic_patterns": [...],
  "leadership_journey": {...},
  "patterns_observed": {...},
  "people_interactions": [...],
  "carry_forward": [...],
  "quarterly_links": "..."
}
```

**No archives found:**
```json
{
  "success": false,
  "error": "no_archives",
  "year": "2026",
  "missing_quarters": ["2026-Q1 (Q1)", "2026-Q2 (Q2)", "2026-Q3 (Q3)", "2026-Q4 (Q4)"],
  "message": "No quarterly archives found for this year.",
  "suggestion": "Run `/quarterly-review` for each quarter, or proceed with Year.md content only."
}
```

For backwards compatibility, also output human-readable summary:
```
Quarterly Archives for 2026

Found: 4/4 quarters archived (Q1-Q4)

Coverage:
- Months covered: 12
- Weeks covered: 54

People: SarahK (4Q), MarcusT (4Q), JessicaL (3Q)
Projects: platform-migration (4Q), market-expansion (3Q)

Quarterly Themes:
- Q1: Foundation building
- Q2: Scaling operations
- Q3: Market expansion
- Q4: Year close and reflection

Key Insights:
- Q1: "Foundation work enables velocity later"
- Q2: "Scaling requires letting go of details"
- Q3: "New markets need local autonomy"
- Q4: "Sustainable pace beats heroics"

Leadership Journey:
- Growth Edge: Avoiding difficult conversations -> Coaching others
- Key Moments: First difficult conversation -> Coaching others through theirs
- Themes: Building trust -> Letting go -> Leading through others -> Strategic leadership
...
```

## Design for Reuse

This sub-skill is designed to be reusable by:
- **yearly-review**: Primary consumer for yearly synthesis
- **multi-year-review**: Can call multiple times to gather multiple years
- **leadership-review**: Can analyze leadership journey across years

The structured inputs (vault, year) allow flexibility for different time periods.
