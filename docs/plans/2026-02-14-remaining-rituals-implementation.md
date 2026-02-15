# Remaining Rituals Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 6 remaining rituals (monthly, quarterly, yearly planning/review pairs) and supporting sub-skills.

**Architecture:** Each ritual follows the established orchestrated skill pattern with phases.yaml for subagent orchestration. Planning rituals prepare Captive notes, review rituals archive to Periodic and extract to semantic notes.

**Tech Stack:** Claude skills (SKILL.md + phases.yaml), markdown templates, YAML frontmatter parsing.

---

## Task 1: gather-month-context Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/synthesis/gather-month-context/SKILL.md`

**Step 1: Create the sub-skill directory**

```bash
mkdir -p .claude/skills/_sub/synthesis/gather-month-context
```

**Step 2: Write the SKILL.md**

Create `.claude/skills/_sub/synthesis/gather-month-context/SKILL.md`:

```markdown
---
name: gather-month-context
description: Collect and synthesize all weekly archives for a given month. Returns aggregated data including wins, insights, patterns, and completeness status.
disable-model-invocation: true
allowed-tools: Read, Bash(ls, date)
---

# Gather Month Context Sub-Skill

Collects all weekly archives for a specified month and synthesizes them into structured data for monthly review.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `month`: Target month in YYYY-MM format
- `month_start`: First day of month (YYYY-MM-01)
- `month_end`: Last day of month (YYYY-MM-DD)

## Instructions

### 1. Determine Weeks in Month

Calculate all ISO weeks that overlap with the target month. A week belongs to the month if its Monday falls within the month OR if more than half its days are in the month.

### 2. Check Weekly Archive Existence

For each week, check if archive exists:

```bash
ls "$VAULT/00_Brain/Periodic/Weekly/{week}.md" 2>/dev/null
```

Track:
- `existing_archives[]` - Weeks with archives
- `missing_weeks[]` - Weeks without archives (format: "YYYY-Www")

### 3. Read Each Weekly Archive

For each existing archive, read and parse:

**Frontmatter:**
- `week` - ISO week (YYYY-Www)
- `dates` - Date range
- `energy_trend` - Weekly energy trend
- `week_type` - meeting-heavy, focus, deadline, travel, balanced

**Sections:**
- `key_outcomes[]` - The 3 weekly outcomes with completion status
- `focus_theme` - Weekly focus
- `leadership_intention` - Weekly intention
- `wins` - Personal, organisational, strategic subsections
- `reflections` - what_went_well, what_could_be_better, key_learning, patterns_observed
- `carry_forward[]` - Items marked for next week

### 4. Aggregate Data

Compile across all weekly archives:

**Metrics:**
- `total_meetings`: Sum from all weeks
- `total_focus_hours`: Sum from all weeks
- `avg_energy`: Average energy trend
- `energy_pattern`: Overall monthly energy pattern
- `outcome_completion_rate`: Percentage of weekly outcomes completed

**Collections:**
- `wins.personal[]`: All personal wins with weeks
- `wins.organisational[]`: All org wins with weeks
- `wins.strategic[]`: All strategic wins with weeks
- `insights[]`: All key learnings with weeks
- `patterns_observed[]`: All patterns with weeks
- `carry_forward[]`: Incomplete items from final week

**Entity Aggregates:**
- `unique_people[]`: All person references with interaction counts
- `unique_projects[]`: All project references with mention counts
- `leadership_intentions[]`: All weekly intentions

### 5. Generate Weekly Links

Create wikilinks to each weekly archive:

```markdown
- [[00_Brain/Periodic/Weekly/2026-W05|Week 5]] - [Focus theme summary]
- [[00_Brain/Periodic/Weekly/2026-W06|Week 6]] - [Focus theme summary]
...
```

### 6. Return Structured Result

**Success:**
```json
{
  "success": true,
  "month": "2026-02",
  "weekly_archives": [...],
  "missing_weeks": [],
  "aggregates": {
    "total_meetings": 72,
    "total_focus_hours": 60,
    "avg_energy": 2.3,
    "energy_pattern": "stable",
    "outcome_completion_rate": 75,
    "unique_people": [...],
    "unique_projects": [...],
    "leadership_intentions": [...]
  },
  "wins": {...},
  "insights": [...],
  "patterns_observed": [...],
  "carry_forward": [...],
  "weekly_links": "..."
}
```

**Partial/No archives:** Return with appropriate success/partial flags and suggestions.
```

**Step 3: Verify file created**

```bash
cat .claude/skills/_sub/synthesis/gather-month-context/SKILL.md | head -20
```

Expected: See the frontmatter and first section of the skill.

**Step 4: Commit**

```bash
git add .claude/skills/_sub/synthesis/gather-month-context/SKILL.md
git commit -m "feat(sub-skill): add gather-month-context for monthly review"
```

---

## Task 2: gather-quarter-context Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/synthesis/gather-quarter-context/SKILL.md`

**Step 1: Create the sub-skill directory**

```bash
mkdir -p .claude/skills/_sub/synthesis/gather-quarter-context
```

**Step 2: Write the SKILL.md**

Create `.claude/skills/_sub/synthesis/gather-quarter-context/SKILL.md`:

```markdown
---
name: gather-quarter-context
description: Collect and synthesize all monthly archives for a given quarter. Returns aggregated data including wins, strategic patterns, leadership progress, and completeness status.
disable-model-invocation: true
allowed-tools: Read, Bash(ls, date)
---

# Gather Quarter Context Sub-Skill

Collects all monthly archives for a specified quarter and synthesizes them into structured data for quarterly review.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `quarter`: Target quarter in YYYY-QN format
- `months`: Array of months in the quarter (YYYY-MM)

## Instructions

### 1. Determine Months in Quarter

Q1 = Jan, Feb, Mar; Q2 = Apr, May, Jun; Q3 = Jul, Aug, Sep; Q4 = Oct, Nov, Dec

### 2. Check Monthly Archive Existence

For each month, check if archive exists:

```bash
ls "$VAULT/00_Brain/Periodic/Monthly/{month}.md" 2>/dev/null
```

Track:
- `existing_archives[]` - Months with archives
- `missing_months[]` - Months without archives

### 3. Read Each Monthly Archive

For each existing archive, read and parse:

**Frontmatter:**
- `month` - Month (YYYY-MM)
- `quarter` - Quarter (YYYY-QN)

**Sections:**
- `key_outcomes[]` - The 3 monthly outcomes with completion status
- `monthly_theme` - Monthly focus
- `coaching_checkin` - Growth edge progress, avoided conversations, delegation patterns
- `wins` - Personal, organisational, strategic subsections
- `reflections` - what_went_well, what_could_be_better, key_insights
- `patterns_trends` - Recurring themes across weeks

### 4. Aggregate Data

Compile across all monthly archives:

**Collections:**
- `wins.personal[]`: All personal wins with months
- `wins.organisational[]`: All org wins with months
- `wins.strategic[]`: All strategic wins with months
- `insights[]`: All key insights with months
- `patterns[]`: All patterns and trends with months

**Coaching Aggregates:**
- `growth_edge_progress[]`: Progress notes per month
- `avoided_conversations[]`: Things avoided
- `delegation_patterns[]`: Delegation observations

**Entity Aggregates:**
- `unique_people[]`: All person references
- `unique_projects[]`: All project references

### 5. Generate Monthly Links

Create wikilinks to each monthly archive:

```markdown
- [[00_Brain/Periodic/Monthly/2026-01|January]] - [Monthly theme summary]
- [[00_Brain/Periodic/Monthly/2026-02|February]] - [Monthly theme summary]
- [[00_Brain/Periodic/Monthly/2026-03|March]] - [Monthly theme summary]
```

### 6. Return Structured Result

**Success:**
```json
{
  "success": true,
  "quarter": "2026-Q1",
  "monthly_archives": [...],
  "missing_months": [],
  "aggregates": {
    "outcome_completion_rate": 70,
    "unique_people": [...],
    "unique_projects": [...]
  },
  "wins": {...},
  "insights": [...],
  "patterns": [...],
  "coaching": {
    "growth_edge_progress": [...],
    "avoided_conversations": [...],
    "delegation_patterns": [...]
  },
  "monthly_links": "..."
}
```
```

**Step 3: Verify and commit**

```bash
git add .claude/skills/_sub/synthesis/gather-quarter-context/SKILL.md
git commit -m "feat(sub-skill): add gather-quarter-context for quarterly review"
```

---

## Task 3: gather-year-context Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/synthesis/gather-year-context/SKILL.md`

**Step 1: Create the sub-skill directory**

```bash
mkdir -p .claude/skills/_sub/synthesis/gather-year-context
```

**Step 2: Write the SKILL.md**

Create `.claude/skills/_sub/synthesis/gather-year-context/SKILL.md`:

```markdown
---
name: gather-year-context
description: Collect and synthesize all quarterly archives for a given year. Returns aggregated data including wins, strategic patterns, leadership journey, and completeness status.
disable-model-invocation: true
allowed-tools: Read, Bash(ls)
---

# Gather Year Context Sub-Skill

Collects all quarterly archives for a specified year and synthesizes them into structured data for yearly review.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `year`: Target year in YYYY format

## Instructions

### 1. Determine Quarters in Year

Q1, Q2, Q3, Q4 for the given year.

### 2. Check Quarterly Archive Existence

For each quarter, check if archive exists:

```bash
ls "$VAULT/00_Brain/Periodic/Quarterly/{year}-Q{n}.md" 2>/dev/null
```

### 3. Read Each Quarterly Archive

For each existing archive, read and parse:

**Sections:**
- `key_outcomes[]` - The 3 quarterly outcomes with completion status
- `quarterly_theme` - Quarterly focus
- `coaching_themes` - Patterns to watch, questions that served
- `wins` - Personal, organisational, strategic
- `reflections` - what_went_well, what_could_be_better, key_insights, strategic_patterns

### 4. Aggregate Data

Compile across all quarterly archives:

**Collections:**
- `wins.personal[]`: All personal wins with quarters
- `wins.organisational[]`: All org wins with quarters
- `wins.strategic[]`: All strategic wins with quarters
- `insights[]`: All key insights with quarters
- `strategic_patterns[]`: All strategic patterns with quarters

**Leadership Journey:**
- `themes_by_quarter[]`: Focus theme per quarter
- `coaching_evolution[]`: How coaching themes evolved
- `growth_edge_journey[]`: Growth edge progress across quarters

**Entity Aggregates:**
- `unique_people[]`: Key relationships for the year
- `unique_projects[]`: Major projects and outcomes

### 5. Generate Quarterly Links

Create wikilinks to each quarterly archive:

```markdown
- [[00_Brain/Periodic/Quarterly/2026-Q1|Q1]] - [Quarterly theme]
- [[00_Brain/Periodic/Quarterly/2026-Q2|Q2]] - [Quarterly theme]
- [[00_Brain/Periodic/Quarterly/2026-Q3|Q3]] - [Quarterly theme]
- [[00_Brain/Periodic/Quarterly/2026-Q4|Q4]] - [Quarterly theme]
```

### 6. Return Structured Result

```json
{
  "success": true,
  "year": "2026",
  "quarterly_archives": [...],
  "missing_quarters": [],
  "aggregates": {...},
  "wins": {...},
  "insights": [...],
  "strategic_patterns": [...],
  "leadership_journey": {...},
  "quarterly_links": "..."
}
```
```

**Step 3: Verify and commit**

```bash
git add .claude/skills/_sub/synthesis/gather-year-context/SKILL.md
git commit -m "feat(sub-skill): add gather-year-context for yearly review"
```

---

## Task 4: archive-monthly Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/write/archive-monthly/SKILL.md`

**Step 1: Create the sub-skill directory**

```bash
mkdir -p .claude/skills/_sub/write/archive-monthly
```

**Step 2: Write the SKILL.md**

Create `.claude/skills/_sub/write/archive-monthly/SKILL.md`:

```markdown
---
name: archive-monthly
description: Archive Month.md content to Periodic/Monthly/ and update Month.md with archived placeholder.
disable-model-invocation: true
allowed-tools: Read, Write, Bash(ls, mkdir)
---

# Archive Monthly Sub-Skill

Handles the Captive → Periodic transition for monthly notes.

## Input Arguments

- `vault`: Path to the vault
- `month`: Target month (YYYY-MM)
- `content`: Finalized archive content (markdown)
- `weekly_links`: Generated weekly archive links

## Instructions

### 1. Verify Archive Doesn't Exist

Check if archive already exists:

```bash
ls "$VAULT/00_Brain/Periodic/Monthly/{month}.md" 2>/dev/null
```

If exists, return error with suggestion to view existing archive.

### 2. Ensure Directory Exists

```bash
mkdir -p "$VAULT/00_Brain/Periodic/Monthly"
```

### 3. Write Archive File

Write to `$VAULT/00_Brain/Periodic/Monthly/{month}.md`:

- Include full content with weekly links section
- Use monthly.md template structure from Periodic templates

### 4. Update Month.md

Replace Month.md content with archived placeholder:

```markdown
---
month: {month}
archived: true
archived_date: {today}
---

This month has been archived.

View archive: [[00_Brain/Periodic/Monthly/{month}|{month}]]
```

### 5. Return Result

```json
{
  "success": true,
  "archive_path": "/path/to/Periodic/Monthly/2026-02.md",
  "month_updated": true
}
```
```

**Step 3: Verify and commit**

```bash
git add .claude/skills/_sub/write/archive-monthly/SKILL.md
git commit -m "feat(sub-skill): add archive-monthly for monthly review"
```

---

## Task 5: archive-quarterly Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/write/archive-quarterly/SKILL.md`

**Step 1: Create directory and write SKILL.md**

Follow same pattern as archive-monthly, targeting `$VAULT/00_Brain/Periodic/Quarterly/{quarter}.md`.

**Step 2: Commit**

```bash
git add .claude/skills/_sub/write/archive-quarterly/SKILL.md
git commit -m "feat(sub-skill): add archive-quarterly for quarterly review"
```

---

## Task 6: archive-yearly Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/write/archive-yearly/SKILL.md`

**Step 1: Create directory and write SKILL.md**

Follow same pattern as archive-monthly, targeting `$VAULT/00_Brain/Periodic/Yearly/{year}.md`.

**Step 2: Commit**

```bash
git add .claude/skills/_sub/write/archive-yearly/SKILL.md
git commit -m "feat(sub-skill): add archive-yearly for yearly review"
```

---

## Task 7: monthly-planning Ritual

**Files:**
- Create: `.claude/skills/rituals/planning/monthly-planning/SKILL.md`
- Create: `.claude/skills/rituals/planning/monthly-planning/phases.yaml`

**Step 1: Create directory**

```bash
mkdir -p .claude/skills/rituals/planning/monthly-planning
```

**Step 2: Write SKILL.md**

Create `.claude/skills/rituals/planning/monthly-planning/SKILL.md`:

```markdown
---
name: monthly-planning
description: Plan a month's priorities, theme, and key outcomes.
argument-hint: "[target-month: this month|next month|YYYY-MM]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Monthly Planning

A first-of-month ritual to set monthly theme, outcomes, and priorities aligned with quarterly goals.

## Flow

1. **Setup** — Load vault config, resolve target month, load directives
2. **Gather** — Fetch quarter context, year context, prior month archive, active projects
3. **Pre-flight** — Verify Month.md state, handle existing content
4. **Plan** — Present hierarchical context, review prior month, set outcomes, choose theme
5. **Write** — Generate and save the plan

---

## Pre-flight

Before overwriting the current Month.md, verify its state:

- If Month.md contains a different month and hasn't been archived, block and suggest running monthly-review first
- If planning for a past month, warn that this is unusual
- Only proceed with explicit confirmation when there's unarchived work

---

## Planning Session

### Hierarchical Context

Present context from higher-level planning:

**Quarterly Context** (from Quarter.md):
- Quarterly Theme — What this quarter is about
- Key Outcomes — The three quarterly outcomes
- Patterns to Watch — Self-awareness patterns

**Annual Context** (from Year.md):
- Vision Theme — What this year is about
- Annual Goals — The three annual goals
- Growth Edge — Leadership stretch area

**Active Projects** (from 01_Projects/):
- List all active projects with monthly timeline view
- Flag overdue (❗️) and due-soon (⚠️) projects
- Show next milestone for each

### Prior Month Synthesis

If prior month archive is available, present:

- Key wins by category
- Patterns observed
- Carryover items
- Coaching check-in highlights

### Key Outcomes

Guide the user to three monthly outcomes:

1. **Personal** — What personal development will you invest in?
2. **Organisational** — What team capability will you build?
3. **Strategic** — What milestone marks this month complete?

Frame as outcomes, not tasks. What will be different by end of month?

### Monthly Theme

Suggest 2-3 themes based on:
- Quarter focus and position in quarter (month 1/2/3)
- Project deadlines and urgency
- Prior month patterns

### Coaching Prompts

Generate prompts for the Coaching Check-in section:
- Growth edge focus for the month
- Conversations to have
- Delegation opportunities

---

## Generate

Use the Month.md template as source of truth. Fill:

- **Frontmatter** with month, quarter, year
- **Context From Above** with quarter/year themes and outcomes
- **Month Overview** with key outcomes and monthly theme
- **Coaching Check-in** with generated prompts
- **Wins** sections empty for user to fill
- **Reflections** sections empty for end of month

---

## Confirm

After writing, summarize:
- The three monthly outcomes
- The monthly theme
- Key projects to focus on
- Coaching focus for the month
```

**Step 3: Write phases.yaml**

Create `.claude/skills/rituals/planning/monthly-planning/phases.yaml`:

```yaml
# Orchestration phases for monthly-planning ritual

phases:
  # Phase 0: Setup (parallel, read-only)
  - name: setup
    parallel: true
    subagents:
      - skill: _sub/fetch/get-config
        type: explore
        output: VAULT
      - skill: _sub/fetch/get-dates
        type: explore
        args: "target={{ARGUMENTS}} scope=month"
        output: DATES
      - skill: _sub/fetch/get-directives
        type: explore
        output: DIRECTIVES
        optional: true
        on_error: "Directives not found. Using defaults."

  # Phase 1: Gather Context (parallel, read-only)
  - name: gather
    depends_on: [setup]
    parallel: true
    subagents:
      - skill: _sub/fetch/get-quarter-content
        type: explore
        output: QUARTER
        optional: true
        on_error: "Quarter.md not found. Quarterly context unavailable."
      - skill: _sub/fetch/get-year-content
        type: explore
        output: YEAR
        optional: true
        on_error: "Year.md not found. Annual context unavailable."
      - skill: _sub/synthesis/gather-month-context
        type: explore
        args: "vault={{VAULT}} month={{DATES.prior_month}} month_start={{DATES.prior_month_start}} month_end={{DATES.prior_month_end}}"
        output: PRIOR_MONTH
        optional: true
        on_error: "Prior month context unavailable."
      - skill: _sub/fetch/get-active-projects
        type: explore
        args: "filter=all"
        output: PROJECTS
        optional: true
        on_error: "No active projects found."
      - skill: _sub/fetch/get-month-content
        type: explore
        output: CURRENT_MONTH
        optional: true
        on_error: "Current Month.md not found."

  # Phase 2: Pre-flight Check (inline)
  - name: preflight
    depends_on: [gather]
    inline: true

  # Phase 3: Interactive Planning (inline - requires user)
  - name: interact
    depends_on: [preflight]
    inline: true

  # Phase 4: Generate Plan (inline)
  - name: generate
    depends_on: [interact]
    inline: true

  # Phase 5: Write Output (write-capable subagent)
  - name: write
    depends_on: [generate]
    subagents:
      - skill: _sub/write/captive-note
        type: general-purpose
        args: "path={{VAULT}}/00_Brain/Captive/Month.md content={{PLAN}}"
        output: WRITE_RESULT
```

**Step 4: Verify and commit**

```bash
git add .claude/skills/rituals/planning/monthly-planning/
git commit -m "feat(ritual): add monthly-planning"
```

---

## Task 8: monthly-review Ritual

**Files:**
- Create: `.claude/skills/rituals/review/monthly-review/SKILL.md`
- Create: `.claude/skills/rituals/review/monthly-review/phases.yaml`
- Create: `.claude/skills/rituals/review/monthly-review/coaching.md`

**Step 1: Create directory**

```bash
mkdir -p .claude/skills/rituals/review/monthly-review
```

**Step 2: Write SKILL.md**

Create `.claude/skills/rituals/review/monthly-review/SKILL.md`:

```markdown
---
name: monthly-review
description: Review and archive a month's work. Synthesizes weekly archives into monthly patterns, guides reflection on coaching themes, extracts insights to semantic notes, and archives to Periodic/Monthly/.
argument-hint: "[target-month: this month|last month|YYYY-MM]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Monthly Review

End-of-month ritual for synthesizing weekly archives, reflecting on coaching themes, extracting learnings to semantic notes, and archiving to Periodic/Monthly/.

## Flow

1. **Setup** — Load config, dates, directives
2. **Load** — Parse Month.md content
3. **Gather** — Collect weekly archives for the month
4. **Pre-flight** — Verify month state, check for conflicts
5. **Interact** — Guide reflection (see [coaching.md](coaching.md))
6. **Synthesize** — Prepare semantic note updates (parallel)
7. **Confirm** — Present changes for approval
8. **Write** — Archive to Periodic, update semantic notes

---

## Pre-flight

Verify the month state before reviewing:

- Check date alignment between Month.md frontmatter and target review month
- Check if an archive already exists for this month in Periodic/Monthly/
- Check for an archived marker in Month.md frontmatter
- Check which weeks have archives. If incomplete, offer to proceed with partial data

---

## Interactive Review

### Month Summary

Present synthesized overview: weeks reviewed, total meetings, focus hours, energy trend, outcome completion rate. Ask if this feels accurate.

### Outcome Review

Review each key outcome from Month.md:
- State the outcome and current status
- Ask: "How did this go? Completed / Partial / Deferred?"
- Capture context for incomplete items

### Coaching Check-in

Apply coaching guidance from [coaching.md](coaching.md):

- Growth edge progress this month
- Conversations avoided
- Delegation patterns
- Self-care reflection

### Wins Synthesis

Guide through wins from weekly archives, grouped by category:
- Personal: growth, boundaries, habits
- Organisational: team success, culture
- Strategic: project progress, milestones

Identify standout win and monthly theme across all wins.

### Patterns & Trends

Review patterns from weekly archives. Look for:
- Recurring themes across weeks
- Energy patterns
- Relationship patterns
- Strategic momentum

### Forward Setup

Review carry-forward items. Ask:
- Which are still relevant?
- What themes should carry to next month?
- What to let go?

---

## Synthesis

Parallel subagents prepare semantic note updates:
- People — from key relationships this month
- Projects — from strategic wins and progress
- Insights — from key learnings and patterns

---

## Confirm

Present all proposed changes for approval:
- Archive destination and month summary
- Each semantic note update with preview

Options: Proceed all, Archive only, Review each, Cancel

---

## Write

Execute confirmed writes:
- Archive Month.md to Periodic/Monthly/
- Apply semantic note updates
- Update Month.md with archived placeholder

Suggest next steps: monthly planning, quarterly review if end of quarter.
```

**Step 3: Write phases.yaml**

Create `.claude/skills/rituals/review/monthly-review/phases.yaml`:

```yaml
# Orchestration phases for monthly-review ritual

phases:
  # Phase 0: Setup (parallel, read-only)
  - name: setup
    parallel: true
    subagents:
      - skill: _sub/fetch/get-config
        type: explore
        output: VAULT
      - skill: _sub/fetch/get-dates
        type: explore
        args: "target={{ARGUMENTS}} scope=month"
        output: DATES
      - skill: _sub/fetch/get-directives
        type: explore
        output: DIRECTIVES
        optional: true
        on_error: "Directives not found. Using defaults."

  # Phase 1: Load Month.md (read-only)
  - name: load
    depends_on: [setup]
    subagents:
      - skill: _sub/fetch/get-month-content
        type: explore
        args: "vault={{VAULT}}"
        output: MONTH_CONTENT

  # Phase 2: Gather Weekly Archives (read-only)
  - name: gather
    depends_on: [setup]
    subagents:
      - skill: _sub/synthesis/gather-month-context
        type: explore
        args: "vault={{VAULT}} month={{DATES.month}} month_start={{DATES.month_start}} month_end={{DATES.month_end}}"
        output: MONTH_CONTEXT

  # Phase 3: Pre-flight Check (inline)
  - name: preflight
    depends_on: [load, gather]
    inline: true

  # Phase 4: Interactive Review (inline)
  - name: interact
    depends_on: [preflight]
    inline: true

  # Phase 5: Parallel Synthesis
  - name: synthesize
    depends_on: [interact]
    subagents:
      - skill: _sub/synthesis/extract-to-areas
        type: explore
        args: "vault={{VAULT}} scope=month context={{MONTH_CONTEXT}}"
        output: SEMANTIC_UPDATES
        optional: true
        on_error: "No semantic updates generated."

  # Phase 6: Confirm Updates (inline)
  - name: confirm
    depends_on: [synthesize]
    inline: true

  # Phase 7: Write Archive and Semantic Updates
  - name: write
    depends_on: [confirm]
    parallel: true
    subagents:
      - skill: _sub/write/archive-monthly
        type: general-purpose
        args: "vault={{VAULT}} month={{DATES.month}} content={{ARCHIVE}} weekly_links={{MONTH_CONTEXT.weekly_links}}"
        output: ARCHIVE_RESULT
      - skill: _sub/write/update-semantic
        type: general-purpose
        args: "vault={{VAULT}} updates={{SEMANTIC_UPDATES}}"
        output: SEMANTIC_RESULT
        optional: true
        on_error: "Semantic updates skipped."
```

**Step 4: Write coaching.md**

Create `.claude/skills/rituals/review/monthly-review/coaching.md`:

```markdown
# Monthly Review Coaching Guide

Coaching questions and prompts for the monthly review ritual.

## Coaching Check-in Questions

### Growth Edge Progress
- "How did you work on your growth edge this month?"
- "What specific situation challenged you to grow?"
- "Where did you step outside your comfort zone?"

### Avoided Conversations
- "What conversation did you avoid this month?"
- "Who needs to hear something from you that you haven't said?"
- "What would happen if you had that conversation next month?"

### Delegation Patterns
- "Where did you take on work instead of delegating?"
- "What stopped you from delegating?"
- "What could you delegate next month?"

### Self-Care Reflection
- "How well did you protect your energy this month?"
- "What boundaries served you well?"
- "What boundary do you need to strengthen?"

## Synthesis Prompts

### Pattern Recognition
- "What pattern repeated across weeks?"
- "What's the throughline of this month?"
- "If this month had a title, what would it be?"

### Looking Forward
- "What do you want to do more of next month?"
- "What do you want to stop doing?"
- "What one change would have the biggest impact?"
```

**Step 5: Verify and commit**

```bash
git add .claude/skills/rituals/review/monthly-review/
git commit -m "feat(ritual): add monthly-review"
```

---

## Task 9: quarterly-planning Ritual

**Files:**
- Create: `.claude/skills/rituals/planning/quarterly-planning/SKILL.md`
- Create: `.claude/skills/rituals/planning/quarterly-planning/phases.yaml`

Follow the pattern from monthly-planning, adapting for quarterly scope:
- Gather: Year.md, prior quarter archive, active projects
- Context: Annual goals, growth edge, leadership identity
- Outcomes: 3 quarterly outcomes aligned to annual goals
- Special: Coaching Themes (Patterns to Watch, Questions That Serve Me)

**Commit:**

```bash
git add .claude/skills/rituals/planning/quarterly-planning/
git commit -m "feat(ritual): add quarterly-planning"
```

---

## Task 10: quarterly-review Ritual

**Files:**
- Create: `.claude/skills/rituals/review/quarterly-review/SKILL.md`
- Create: `.claude/skills/rituals/review/quarterly-review/phases.yaml`
- Create: `.claude/skills/rituals/review/quarterly-review/coaching.md`

Follow the pattern from monthly-review, adapting for quarterly scope:
- Gather: Monthly archives for the quarter
- Review: Quarterly outcomes, coaching themes, leadership reflection
- Special: Annual checkpoint (on track for annual goals?)
- Coaching questions focused on strategic and leadership themes

**Commit:**

```bash
git add .claude/skills/rituals/review/quarterly-review/
git commit -m "feat(ritual): add quarterly-review"
```

---

## Task 11: yearly-planning Ritual

**Files:**
- Create: `.claude/skills/rituals/planning/yearly-planning/SKILL.md`
- Create: `.claude/skills/rituals/planning/yearly-planning/phases.yaml`

Follow the pattern, adapting for yearly scope:
- Gather: Prior year archive (if exists)
- Context: Life context check-in (what's changing?)
- Outcomes: 3 annual goals (Personal → Organisational → Strategic)
- Special: Leadership Development (focus, identity, growth edge), quarterly sketch

**Commit:**

```bash
git add .claude/skills/rituals/planning/yearly-planning/
git commit -m "feat(ritual): add yearly-planning"
```

---

## Task 12: yearly-review Ritual

**Files:**
- Create: `.claude/skills/rituals/review/yearly-review/SKILL.md`
- Create: `.claude/skills/rituals/review/yearly-review/phases.yaml`
- Create: `.claude/skills/rituals/review/yearly-review/coaching.md`

Follow the pattern, adapting for yearly scope:
- Gather: Quarterly archives for the year
- Review: Annual goals, leadership journey
- Special: "What defined this year" narrative, looking ahead
- Coaching questions focused on defining moments and gratitude

**Commit:**

```bash
git add .claude/skills/rituals/review/yearly-review/
git commit -m "feat(ritual): add yearly-review"
```

---

## Task 13: Update get-dates Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/fetch/get-dates/SKILL.md`

The get-dates sub-skill needs to support `scope=month`, `scope=quarter`, and `scope=year` in addition to existing `scope=daily` and `scope=week`.

Add date calculations for:
- Month: `month`, `month_start`, `month_end`, `prior_month`, `quarter`, `year`
- Quarter: `quarter`, `quarter_start`, `quarter_end`, `prior_quarter`, `months[]`, `year`
- Year: `year`, `year_start`, `year_end`, `prior_year`, `quarters[]`

**Commit:**

```bash
git add .claude/skills/_sub/fetch/get-dates/SKILL.md
git commit -m "feat(sub-skill): extend get-dates for month/quarter/year scopes"
```

---

## Task 14: Final Verification

**Step 1: List all new skills**

```bash
find .claude/skills -name "SKILL.md" | sort
```

Verify all 12 new skills exist.

**Step 2: Verify git history**

```bash
git log --oneline -15
```

Verify all commits are present.

**Step 3: Update documentation**

If needed, update README.md rituals table to include new rituals.

---

## Summary

**New sub-skills created (6):**
- `_sub/synthesis/gather-month-context`
- `_sub/synthesis/gather-quarter-context`
- `_sub/synthesis/gather-year-context`
- `_sub/write/archive-monthly`
- `_sub/write/archive-quarterly`
- `_sub/write/archive-yearly`

**New rituals created (6):**
- `rituals/planning/monthly-planning`
- `rituals/review/monthly-review`
- `rituals/planning/quarterly-planning`
- `rituals/review/quarterly-review`
- `rituals/planning/yearly-planning`
- `rituals/review/yearly-review`

**Modified sub-skills (1):**
- `_sub/fetch/get-dates` (extended for new scopes)

**Total commits: 14**
