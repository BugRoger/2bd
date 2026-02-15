---
name: weekly-planning
description: Plan a week's priorities, leadership intention, and key commitments.
argument-hint: "[target-week: this week|next week|YYYY-Www]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Weekly Planning

A Friday ritual to set weekly priorities, leadership intentions, and commitments aligned with higher-level goals. Designed for planning the upcoming week.

## Flow

1. **Setup** — Load vault config, resolve target week, load directives
2. **Gather** — Fetch calendar, prior week synthesis, month/quarter/year context, active projects
3. **Pre-flight** — Verify Week.md state, handle existing content
4. **Plan** — Present week overview, review prior week, set priorities, choose leadership intention, generate coaching prompts
5. **Write** — Generate and save the plan

---

## Pre-flight

Before overwriting the current Week.md, verify its state:

- If Week.md contains a different week and hasn't been archived, block and suggest running weekly-review first
- If planning for a past week, warn that this is unusual
- Only proceed with explicit confirmation when there's unarchived work

---

## Planning Session

### Week Overview

Present the target week's shape based on calendar analysis:

**Calendar Density:**
- Total meetings count
- Focus hours available (8am-6pm minus meetings)
- 1:1 count
- Full-day events (travel, offsites, workshops)

**Week Type Classification:**
- **meeting-heavy** — ≥20 meetings OR ≤10 focus hours
- **focus** — ≥30 focus hours AND ≤10 meetings
- **deadline** — Projects with overdue or due-soon status
- **travel** — Calendar contains travel events or OOO markers
- **balanced** — Default when none of the above apply

Present the detected week type and let the user confirm or override.

### Prior Week Synthesis

If prior week data is available (from gather-week-context), present:

**Energy Trend:**
- Average energy across daily archives
- Energy pattern (rising, stable, declining)

**Accomplishments:**
- Completed priorities from prior week
- Notable wins (personal, organisational, strategic)

**Carryover Candidates:**
- Incomplete priorities from prior Week.md
- Items marked "Carry Forward" in prior week's Next Week Setup
- Patterns observed that need continued attention

**Leadership Development:**
- Which intentions were used
- Growth edge progress noted

### Hierarchical Context

Present context from higher-level planning:

**Monthly Context** (from Month.md):
- Monthly Theme — What this month is about
- Key Outcomes — The three monthly outcomes

**Quarterly Context** (from Quarter.md):
- Quarterly Theme — What this quarter is about
- Key Outcomes — The three quarterly outcomes
- Patterns to Watch — Self-awareness patterns for coaching
- Questions That Serve Me — Coaching questions

**Annual Context** (from Year.md):
- Vision Theme — What this year is about
- Leadership Development — Growth edge, identity, focus areas

**Active Projects** (from 01_Projects/):
- List all active projects with timeline urgency
- Flag overdue (❗️) and due-soon (⚠️) projects
- Show next milestone for each

If any context is unavailable, note it and continue.

### Priority Setting

Guide the user to three weekly outcomes aligned with the hierarchy:

1. **Personal** — What personal habit, boundary, or leadership skill will you strengthen? Connect to growth edge.
2. **Organisational** — What team conversation, decision, or collaboration is needed? Align with monthly/quarterly themes.
3. **Strategic** — What deliverable moves the month/quarter forward? Reference active projects with urgency.

Frame these as outcomes, not tasks. What will be different by end of week?

### Leadership Intention

Suggest 2-3 intentions based on week type:

**meeting-heavy:**
- Present — Fully engaged in every conversation
- Listening — Asking more than telling
- Patient — Not rushing decisions
- Boundaries — Protecting recovery time

**focus:**
- Deep — Extended concentration on important work
- Creative — Space for new ideas
- Ambitious — Tackling the hard thing
- Uninterruptible — Protecting focus blocks

**deadline:**
- Decisive — Making calls quickly
- Clear — No ambiguity in communication
- Urgent — Appropriate pace without panic
- Focused — Saying no to distractions

**travel:**
- Flexible — Adapting to disruption
- Async — Effective written communication
- Prepared — Ready for key moments

**balanced:**
- Strategic — Working on the right things
- Intentional — Purposeful time allocation
- Sustainable — Maintaining energy reserves

Let the user choose or suggest their own.

### Coaching Prompts

Generate personalized prompts connecting to:

**For Coaching Check-in:**
- Patterns to watch from Quarter.md
- Growth edge from Year.md
- Week type implications

**For Wins sections:**
- Weekly outcomes to celebrate
- Leadership intention to demonstrate
- Project milestones approaching
- Key relationships to nurture

**For Reflections:**
- Week type challenges to anticipate
- Prior week patterns to build on or break
- Growth edge opportunities

---

## Generate

Use the Week.md template as the source of truth. Fill:

- **Frontmatter** with week, dates, month, quarter, year, week_type, energy_trend, leadership_intention
- **Context From Above** with month theme/outcomes and quarter theme
- **Synthesis from Prior Week** with carryover priorities, patterns observed, leadership development progress, key relationships
- **Week Overview** with key outcomes, focus theme, leadership intention
- **Weekly Commitments** with key decisions, people to connect with, boundaries, growth challenge
- **People & Relationships** with 1:1 highlights from calendar
- **Coaching Check-in** with generated prompts
- **Wins** sections with coaching prompts per category
- **Next Week Setup** left empty (filled during weekly review)

---

## Confirm

After writing, summarize:
- The three weekly outcomes
- The leadership intention
- The week type and key challenges
- Number of meetings and focus hours

Suggest strategies for the week type if helpful.
