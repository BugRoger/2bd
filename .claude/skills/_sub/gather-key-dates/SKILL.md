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
- Project data from `_sub/fetch-projects-vault` (optional)

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
