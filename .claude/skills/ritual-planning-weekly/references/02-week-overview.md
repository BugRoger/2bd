# Week Overview

You've checked in. You understand the user's state. Now present the shape of the week ahead.

This is the executive briefing on what the week looks like — present it, don't negotiate it.

## Process

1. Analyze calendar for the week
2. Classify week type from calendar density
3. Extract key dates from hierarchical context
4. Present the overview to user

## Content

### Calendar Density

From calendar analysis:

- **Total meetings** — count for the week
- **Focus hours** — 8am-6pm gaps minus meetings, Monday-Friday
- **1:1 count** — number of 1:1 meetings
- **Full-day events** — travel, offsites, workshops, PTO

Present naturally — "You have a front-loaded week with most meetings Monday-Wednesday" not "Calendar density analysis complete."

### Week Type Classification

Classify and present:

- **meeting-heavy** — >=20 meetings OR <=10 focus hours
- **focus** — >=30 focus hours AND <=10 meetings
- **deadline** — Projects with overdue or due-soon status
- **travel** — Calendar contains travel events or OOO markers
- **balanced** — Default when none of the above apply

Present the detected week type and let the user confirm or override.

### Key Dates Preview

Reference Quarter.md and Year.md to extract key dates.

**Countdown alerts:**
- Show dates within 14 days with urgency indicators
- Highlight prep-required events
- Note any dates cascading from Quarter/Year

Ask: "Any other key dates to add for this week?"

Capture additional dates for inclusion in Week.md Key Dates section.

### Hierarchical Context

Present context from higher-level planning:

**Quarterly Context** (from Quarter.md):
- Quarterly Theme — What this quarter is about
- Key Outcomes — The three quarterly outcomes
- Patterns to Watch — Self-awareness patterns for coaching
- Questions That Serve Me — Coaching questions

**Annual Context** (from Year.md):
- Vision Theme — What this year is about
- Leadership Development — Growth edge, identity, focus areas

**Active Projects** (from active projects):
- List all active projects with timeline urgency
- Flag overdue (!) and due-soon (!) projects
- Show next milestone for each

If any context is unavailable, note it and continue.

## Update Week.md

After presenting the overview:

1. Read `00_Brain/Captive/Week.md`
2. Replace `## Week Overview` section with:
   - Week type
   - Calendar summary (meetings, focus hours)
   - Key dates with countdown
   - Context cascade summary
3. Update frontmatter:
   - `week_type`: detected/confirmed type
4. Write entire file back to `00_Brain/Captive/Week.md`

Proceed to Prior Synthesis.
