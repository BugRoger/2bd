# Key Dates Surfacing — Design

**Date:** 2026-02-15
**Status:** Approved

## Overview

Key dates (deadlines, workshops, conferences, All-Hands, strategic events) surface automatically during planning and review rituals with countdown-based urgency. Dates live in dedicated `## Key Dates` sections at each time horizon and cascade down as they enter relevant windows.

## Sources

Key dates come from three sources, merged during planning:

- **Calendar** — Filtered for significant events (workshops, conferences, All-Hands, offsites, travel). Excludes routine meetings.
- **Projects** — Scanned from `01_Projects/` for deadline frontmatter or inline dates marked with "deadline", "milestone", "due", "launch".
- **Manual** — User input during planning rituals + inline mentions extracted from weekly progress notes.

## Key Dates Hierarchy

Each captive note has a `## Key Dates` section:

| Level | Contains | Example |
|-------|----------|---------|
| Year.md | Annual milestones, conferences, fiscal deadlines | "Jun: Team Offsite" |
| Quarter.md | Quarterly deliverables, major workshops | "Mar 15: Q1 Initiative Demo" |
| Month.md | Monthly deadlines, All-Hands, key meetings | "Feb 24: GCO Strategy deadline" |
| Week.md | This week's prep-required events, imminent deadlines | "Thu: Assessment Center Berlin" |

**Inheritance:** Planning rituals pull dates from parent horizons as they enter the relevant window.

## Template Format

Bullet-based, inline format (no tables):

```markdown
## Key Dates

- **Feb 17:** CE All-Hands Meeting — prep slides
- **Feb 24:** GCO Strategy deadline
- **End of March:** Goals 2026 HR deadline
```

Format: `**Date:** Event description — optional context/urgency`

## Extraction Logic

Flexible pattern matching recognizes key dates from:

- Explicit `## Key Dates` sections (primary)
- `**Key dates:**` inline headings within weekly progress
- Date patterns with signal words: "deadline", "workshop", "All-Hands", "conference", "talk", "offsite", "due"
- Date formats: "Feb 24", "Feb 24:", "2026-02-24", "End of March"

## Cascade During Planning

| Ritual | Pulls from | Window |
|--------|------------|--------|
| Daily planning | Week.md | Today + next 3 days |
| Weekly planning | Month.md + Quarter.md | This week + next 2 weeks |
| Monthly planning | Quarter.md + Year.md | This month + next month |

## Context-Relative Urgency

Urgency depends on event type, not just raw days:

| Event Type | 🔴 Urgent | 🟡 Soon | 🟢 Upcoming |
|------------|-----------|---------|-------------|
| Deadline | ≤3 days | ≤7 days | >7 days |
| Workshop/Conference | ≤7 days | ≤14 days | >14 days |
| All-Hands/Talk (prep) | ≤3 days | ≤7 days | >7 days |
| Milestone | ≤7 days | ≤14 days | >14 days |

## Countdown Display

During reviews, key dates surface as countdown alerts:

```
⚠️ Upcoming Key Dates:
- GCO Strategy deadline — in 9 days 🔴
- CE All-Heads Meeting — in 2 days (prep needed)
- Goals 2026 HR deadline — in 6 weeks
```

## Ritual Integration

**Planning rituals** (populate the section):
- Monthly planning → Asks about key dates, pulls from Quarter/Year, populates Month.md
- Weekly planning → Pulls from Month.md, asks about prep-required events, populates Week.md
- Daily planning → Surfaces countdown alerts from Week.md (no new section in Today.md)

**Review rituals** (surface mid-cycle):
- Daily review → Shows countdown for dates within 7 days
- Weekly review → Shows month's key dates with progress/status check

**Mid-cycle additions:** Inline dates added in weekly progress notes get picked up automatically on next review.

## New Sub-Skill

`gather-key-dates` — Called by planning and review rituals:

- Extracts dates from calendar, projects, and existing notes
- Filters calendar for significant events using keywords
- Calculates context-relative urgency
- Merges and deduplicates across sources
- Returns formatted countdown list

## Implementation Scope

1. Add `## Key Dates` section to captive templates (Week, Month, Quarter, Year)
2. Create `gather-key-dates` sub-skill
3. Integrate into planning rituals (monthly, weekly)
4. Integrate into review rituals (daily, weekly)
5. Update archive templates to preserve Key Dates section
