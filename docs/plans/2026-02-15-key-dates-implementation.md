# Key Dates Surfacing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Key Dates sections to captive templates and create a sub-skill that extracts dates from calendar, projects, and notes for countdown-based surfacing during planning and review rituals.

**Architecture:** New `## Key Dates` section in Week, Month, Quarter, Year captive templates. New `_sub/gather-key-dates` sub-skill extracts dates from three sources (calendar, projects, inline mentions), calculates context-relative urgency, and returns countdown-formatted output. Planning rituals populate Key Dates during planning; review rituals surface countdown alerts mid-cycle.

**Tech Stack:** Markdown templates, YAML phases, existing sub-skills (fetch-calendar, fetch-active-projects)

---

## Task 1: Add Key Dates Section to Week Template

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/week.md:39-52`

**Step 1: Read current template**

Verify current `## Week Overview` section location.

**Step 2: Add Key Dates section after Week Overview**

Insert after line 52 (after Leadership Intention):

```markdown
---

## Key Dates

- [Populated during weekly planning from Month + Quarter]

*Dates within this week's window with countdown urgency*
```

**Step 3: Verify template structure**

Ensure the section fits between Week Overview and Weekly Commitments.

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Captive/week.md
git commit -m "feat(templates): add Key Dates section to week template"
```

---

## Task 2: Add Key Dates Section to Month Template

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/month.md:17-28`

**Step 1: Read current template**

Verify current `## Month Overview` section location.

**Step 2: Add Key Dates section after Month Overview**

Insert after line 28 (after Monthly Theme):

```markdown
---

## Key Dates

- [Populated during monthly planning from Quarter + Year + Calendar + Projects]

*Key deadlines, workshops, conferences, All-Hands for this month*
```

**Step 3: Verify template structure**

Ensure the section fits between Month Overview and Weekly Progress.

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Captive/month.md
git commit -m "feat(templates): add Key Dates section to month template"
```

---

## Task 3: Add Key Dates Section to Quarter Template

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/quarter.md:17-28`

**Step 1: Read current template**

Verify current `## Quarter Overview` section location.

**Step 2: Add Key Dates section after Quarter Overview**

Insert after line 28 (after Quarterly Theme):

```markdown
---

## Key Dates

- [Populated during quarterly planning from Year + Calendar + Projects]

*Major milestones, conferences, strategic events for this quarter*
```

**Step 3: Verify template structure**

Ensure the section fits between Quarter Overview and Coaching Themes.

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Captive/quarter.md
git commit -m "feat(templates): add Key Dates section to quarter template"
```

---

## Task 4: Add Key Dates Section to Year Template

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/year.md:9-20`

**Step 1: Read current template**

Verify current `## Year Overview` section location.

**Step 2: Add Key Dates section after Year Overview**

Insert after line 20 (after Key Annual Goals):

```markdown
---

## Key Dates

- [Populated during yearly planning]

*Annual milestones, major conferences, fiscal deadlines*
```

**Step 3: Verify template structure**

Ensure the section fits between Year Overview and Leadership Development.

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Captive/year.md
git commit -m "feat(templates): add Key Dates section to year template"
```

---

## Task 5: Create gather-key-dates Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/gather-key-dates/SKILL.md`

**Step 1: Create the skill directory**

```bash
mkdir -p .claude/skills/_sub/gather-key-dates
```

**Step 2: Write the sub-skill file**

```markdown
---
name: gather-key-dates
description: Extract key dates from calendar, projects, and captive notes. Returns countdown-formatted list with context-relative urgency.
disable-model-invocation: true
allowed-tools: Read, Bash(ls, date), Glob
argument-hint: "[scope: week|month|quarter|year] [vault: path]"
---

# Gather Key Dates Sub-Skill

Extracts key dates from multiple sources and returns a countdown-formatted list with context-relative urgency for planning and review rituals.

## Prerequisites

- `$VAULT` set by calling skill (via fetch-config)
- Calendar data from `_sub/fetch-calendar` (optional)
- Project data from `_sub/fetch-active-projects` (optional)

## Arguments

| Argument | Values | Default | Description |
|----------|--------|---------|-------------|
| scope | `week`, `month`, `quarter`, `year` | `month` | Time horizon for date collection |
| vault | path | required | Vault path from config |
| calendar | JSON | optional | Pre-fetched calendar data |
| projects | JSON | optional | Pre-fetched project data |

## Execution Steps

### 1. Determine Date Window

Based on scope, calculate the date window:

| Scope | Window |
|-------|--------|
| week | Today + 14 days |
| month | Today + 45 days |
| quarter | Today + 120 days |
| year | Today + 365 days |

### 2. Extract from Calendar

If calendar data provided, filter for significant events:

**Include events matching keywords:**
- `workshop`, `conference`, `All-Hands`, `all hands`
- `offsite`, `travel`, `OOO`
- `talk`, `presentation`, `keynote`
- `deadline`, `due`, `review`

**Include all-day events** (likely significant)

**Exclude:**
- Recurring meetings without keywords
- Events titled "1:1", "standup", "sync", "catch-up"

### 3. Extract from Projects

If project data provided, extract dates from:

**Frontmatter fields:**
- `end_date` — Project deadline
- `deadline` — Explicit deadline field

**Milestones table:**
- Dates from `## Milestones` section where status is not `🟢 Complete`

### 4. Extract from Captive Notes

Scan captive notes based on scope:

| Scope | Scan Files |
|-------|------------|
| week | Month.md, Quarter.md |
| month | Quarter.md, Year.md |
| quarter | Year.md |
| year | (none) |

**Extraction patterns:**

1. **Key Dates section** — Parse `## Key Dates` bullet items
2. **Inline key dates** — Match `**Key dates:**` followed by bullet list
3. **Date + keyword patterns** — Match dates followed by signal words

**Date formats recognized:**
- `Feb 24`, `February 24`, `Feb 24:`
- `2026-02-24`, `2026-02-24:`
- `End of March`, `Mid-April`, `Early June`
- `W08`, `Week 8`

**Signal words that mark key dates:**
- `deadline`, `due`, `launch`, `release`
- `workshop`, `conference`, `offsite`
- `All-Hands`, `all hands`, `town hall`
- `talk`, `presentation`, `keynote`
- `review`, `demo`, `milestone`

### 5. Merge and Deduplicate

1. Combine all extracted dates into single list
2. Normalize date formats to ISO (YYYY-MM-DD)
3. Deduplicate by date + fuzzy event name (Levenshtein distance < 3)
4. Sort by date ascending

### 6. Calculate Urgency

For each date, calculate days remaining and assign urgency:

**Urgency thresholds by event type:**

| Event Type | Detection | 🔴 Urgent | 🟡 Soon | 🟢 Upcoming |
|------------|-----------|-----------|---------|-------------|
| Deadline | "deadline", "due", "launch" | ≤3 days | ≤7 days | >7 days |
| Workshop/Conference | "workshop", "conference", "offsite" | ≤7 days | ≤14 days | >14 days |
| Prep-required | "All-Hands", "talk", "presentation" | ≤3 days | ≤7 days | >7 days |
| Milestone | "milestone", "demo", "review" | ≤7 days | ≤14 days | >14 days |
| Default | (none of above) | ≤3 days | ≤7 days | >7 days |

### 7. Return Output

**Countdown format (for display):**

```
⚠️ Upcoming Key Dates:
- GCO Strategy deadline — in 9 days 🔴
- CE All-Hands Meeting — in 2 days (prep needed)
- Team Workshop — in 12 days 🟡
- Goals 2026 HR deadline — in 6 weeks
```

**Structured format (for populating templates):**

```json
{
  "scope": "month",
  "count": 4,
  "dates": [
    {
      "date": "2026-02-17",
      "event": "CE All-Heads Meeting",
      "type": "prep-required",
      "days_remaining": 2,
      "urgency": "urgent",
      "source": "calendar"
    },
    {
      "date": "2026-02-24",
      "event": "GCO Strategy deadline",
      "type": "deadline",
      "days_remaining": 9,
      "urgency": "urgent",
      "source": "inline"
    }
  ]
}
```

**Bullet format (for writing to Key Dates section):**

```markdown
- **Feb 17:** CE All-Heads Meeting — prep slides
- **Feb 24:** GCO Strategy deadline 🔴
- **End of March:** Goals 2026 HR deadline
```

## Error Handling

| Condition | Behavior |
|-----------|----------|
| No calendar data | Skip calendar extraction, continue with other sources |
| No project data | Skip project extraction, continue with other sources |
| No captive notes found | Return empty result with message |
| Date parsing failure | Skip unparseable date, log warning |
| No dates found | Return empty result with message "No key dates found" |
```

**Step 3: Verify file created**

```bash
cat .claude/skills/_sub/gather-key-dates/SKILL.md | head -20
```

**Step 4: Commit**

```bash
git add .claude/skills/_sub/gather-key-dates/SKILL.md
git commit -m "feat(skills): add gather-key-dates sub-skill

Extracts key dates from calendar, projects, and captive notes.
Returns countdown-formatted list with context-relative urgency."
```

---

## Task 6: Update Weekly Planning phases.yaml

**Files:**
- Modify: `.claude/skills/rituals/planning-weekly/phases.yaml:23-43`

**Step 1: Read current phases.yaml**

Verify the gather phase structure.

**Step 2: Add gather-key-dates to gather phase**

Add new subagent after fetch-active-projects:

```yaml
      - skill: _sub/gather-key-dates
        type: explore
        args: "scope=week vault={{VAULT}} calendar={{CALENDAR}} projects={{PROJECTS}}"
        output: KEY_DATES
        optional: true
        on_error: "Key dates unavailable."
```

**Step 3: Verify YAML syntax**

Ensure proper indentation (2 spaces).

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-weekly/phases.yaml
git commit -m "feat(planning-weekly): integrate gather-key-dates into gather phase"
```

---

## Task 7: Update Weekly Planning SKILL.md

**Files:**
- Modify: `.claude/skills/rituals/planning-weekly/SKILL.md`

**Step 1: Read current SKILL.md**

Find the "Week Overview" and "Generate" sections.

**Step 2: Add Key Dates to planning session**

After "### Week Overview" section (around line 53), add:

```markdown
### Key Dates Preview

Present key dates for the upcoming week from KEY_DATES output:

**Countdown alerts:**
- Show dates within 14 days with urgency indicators
- Highlight prep-required events
- Note any dates cascading from Month/Quarter

Ask: "Any other key dates to add for this week?"

Capture additional dates for inclusion in Week.md Key Dates section.
```

**Step 3: Update Generate section**

In the "## Generate" section, add to the list of sections to fill:

```markdown
- **Key Dates** with dates from KEY_DATES output plus user additions
```

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-weekly/SKILL.md
git commit -m "feat(planning-weekly): add Key Dates section to planning flow"
```

---

## Task 8: Update Monthly Planning phases.yaml

**Files:**
- Modify: `.claude/skills/rituals/planning-monthly/phases.yaml`

**Step 1: Read current phases.yaml**

Verify the gather phase structure.

**Step 2: Add gather-key-dates to gather phase**

Add new subagent to the gather phase:

```yaml
      - skill: _sub/gather-key-dates
        type: explore
        args: "scope=month vault={{VAULT}} calendar={{CALENDAR}} projects={{PROJECTS}}"
        output: KEY_DATES
        optional: true
        on_error: "Key dates unavailable."
```

**Step 3: Verify YAML syntax**

Ensure proper indentation.

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-monthly/phases.yaml
git commit -m "feat(planning-monthly): integrate gather-key-dates into gather phase"
```

---

## Task 9: Update Monthly Planning SKILL.md

**Files:**
- Modify: `.claude/skills/rituals/planning-monthly/SKILL.md`

**Step 1: Read current SKILL.md**

Find appropriate location for Key Dates section.

**Step 2: Add Key Dates to planning session**

After "### Key Outcomes" section, add:

```markdown
### Key Dates Preview

Present key dates for the month from KEY_DATES output:

**Sources surfaced:**
- Calendar (filtered for significant events)
- Projects (deadlines and milestones)
- Quarter/Year cascading dates

**Countdown display:**
- Show dates within 45 days with urgency indicators
- Group by week for overview
- Highlight deadlines and prep-required events

Ask: "Any other key dates to add for this month?"

Capture additional dates for inclusion in Month.md Key Dates section.
```

**Step 3: Update Generate section**

Add Key Dates to the list of sections to fill.

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-monthly/SKILL.md
git commit -m "feat(planning-monthly): add Key Dates section to planning flow"
```

---

## Task 10: Update Daily Review for Key Dates Surfacing

**Files:**
- Modify: `.claude/skills/rituals/review-daily/SKILL.md`

**Step 1: Read current SKILL.md**

Find the "Interactive Review" section.

**Step 2: Add Key Dates reminder to Check-in**

After the energy check-in, add:

```markdown
### Upcoming Key Dates

If KEY_DATES contains dates within 7 days, surface them:

**Countdown reminder:**
```
⚠️ Upcoming Key Dates:
- [Event] — in [N] days [urgency]
```

Note any dates requiring prep this week.
```

**Step 3: Update phases.yaml to include gather-key-dates**

Add to gather phase:

```yaml
      - skill: _sub/gather-key-dates
        type: explore
        args: "scope=week vault={{VAULT}}"
        output: KEY_DATES
        optional: true
        on_error: "Key dates unavailable."
```

**Step 4: Commit**

```bash
git add .claude/skills/rituals/review-daily/SKILL.md .claude/skills/rituals/review-daily/phases.yaml
git commit -m "feat(review-daily): surface key dates countdown during check-in"
```

---

## Task 11: Update Weekly Review for Key Dates Surfacing

**Files:**
- Modify: `.claude/skills/rituals/review-weekly/SKILL.md`

**Step 1: Read current SKILL.md**

Find the "Interactive Review" section.

**Step 2: Add Key Dates review section**

After "### Week Summary", add:

```markdown
### Key Dates Check

Review key dates from the month:

**Status check:**
- Which key dates passed this week?
- Were deadlines met?
- Any dates requiring attention next week?

Surface upcoming dates from Month.md Key Dates section with countdown.
```

**Step 3: Update phases.yaml to include gather-key-dates**

Add to gather phase:

```yaml
      - skill: _sub/gather-key-dates
        type: explore
        args: "scope=month vault={{VAULT}}"
        output: KEY_DATES
        optional: true
        on_error: "Key dates unavailable."
```

**Step 4: Commit**

```bash
git add .claude/skills/rituals/review-weekly/SKILL.md .claude/skills/rituals/review-weekly/phases.yaml
git commit -m "feat(review-weekly): add key dates status check and countdown"
```

---

## Task 12: Update Periodic Archive Templates

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/weekly.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/monthly.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/quarterly.md`
- Modify: `scaffold/00_Brain/Systemic/Templates/Periodic/yearly.md`

**Step 1: Add Key Dates section to weekly archive template**

After Week Overview section:

```markdown
---

## Key Dates

[Preserved from captive note]
```

**Step 2: Add Key Dates section to monthly archive template**

After Month Overview section:

```markdown
---

## Key Dates

[Preserved from captive note]
```

**Step 3: Add Key Dates section to quarterly and yearly archive templates**

Same pattern for each.

**Step 4: Commit**

```bash
git add scaffold/00_Brain/Systemic/Templates/Periodic/*.md
git commit -m "feat(templates): add Key Dates section to periodic archive templates"
```

---

## Task 13: Update Documentation

**Files:**
- Modify: `README.md` (if user-facing feature description needed)
- Modify: `DEVELOPING.md` (sub-skill documentation)

**Step 1: Add gather-key-dates to DEVELOPING.md sub-skills list**

In the sub-skills section, add:

```markdown
| `_sub/gather-key-dates` | Extract key dates from calendar, projects, notes | Planning/Review rituals |
```

**Step 2: Document Key Dates feature in README.md**

Add brief description to the Planning Rituals section if appropriate.

**Step 3: Commit**

```bash
git add README.md DEVELOPING.md
git commit -m "docs: document key dates feature and gather-key-dates sub-skill"
```

---

## Verification

After completing all tasks:

1. **Template check:** Verify all captive templates have `## Key Dates` section
2. **Sub-skill check:** Verify `gather-key-dates` exists and has correct structure
3. **Phase integration check:** Verify phases.yaml files include gather-key-dates
4. **Ritual integration check:** Verify SKILL.md files reference Key Dates in planning flow
5. **Archive check:** Verify periodic templates preserve Key Dates section

```bash
# Quick verification commands
grep -l "## Key Dates" scaffold/00_Brain/Systemic/Templates/Captive/*.md
ls .claude/skills/_sub/gather-key-dates/
grep "gather-key-dates" .claude/skills/rituals/*/phases.yaml
```
