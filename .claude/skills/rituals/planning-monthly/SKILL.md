---
name: monthly-planning
description: Plan a month's outcomes, theme, and priorities aligned with quarterly goals.
argument-hint: "[target-month: this month|next month|YYYY-MM]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Monthly Planning

A first-of-month ritual to set monthly theme, outcomes, and priorities aligned with quarterly and annual goals. Designed for planning at month boundaries.

## Flow

1. **Setup** — Load vault config, resolve target month, load directives
2. **Gather** — Fetch quarter/year context, prior month synthesis, active projects, current month state
3. **Pre-flight** — Verify Month.md state, handle existing content
4. **Plan** — Present hierarchical context, review prior month, set outcomes, choose theme, generate coaching prompts
5. **Write** — Generate and save the plan
6. **Confirm** — Summarize outcomes, theme, and focus areas

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
- Patterns to Watch — Self-awareness patterns for coaching
- Questions That Serve Me — Coaching questions

**Annual Context** (from Year.md):
- Vision Theme — What this year is about
- Annual Goals — The three annual goals
- Growth Edge — Leadership stretch area
- Leadership Identity — The leader you aspire to be

**Active Projects** (from 01_Projects/):
- List all active projects with monthly timeline view
- Flag overdue projects with deadlines passed
- Flag due-soon projects with deadlines this month
- Show next milestone for each

If any context is unavailable, note it and continue.

### Prior Month Synthesis

If prior month data is available (from gather-month-context), present:

**Energy Trend:**
- Average energy across weekly archives
- Energy pattern (rising, stable, declining)

**Accomplishments:**
- Key wins by category (personal, organisational, strategic)
- Outcome completion rate
- Major deliverables shipped

**Carryover Candidates:**
- Incomplete outcomes from prior month
- Items marked for continuation
- Patterns observed that need continued attention

**Leadership Development:**
- Growth edge progress noted
- Coaching insights captured
- Key relationships nurtured

### Key Outcomes

Guide the user to three monthly outcomes aligned with the hierarchy:

1. **Personal** — What personal development will you invest in? What habit, boundary, or skill connects to your growth edge?
2. **Organisational** — What team capability will you build? What conversations or decisions will strengthen the team?
3. **Strategic** — What milestone marks this month complete? What deliverable moves the quarter forward?

Frame these as outcomes, not tasks. What will be different by end of month?

### Monthly Theme

Suggest 2-3 themes based on:

**Position in Quarter:**
- Month 1: Foundation, alignment, planning
- Month 2: Execution, momentum, iteration
- Month 3: Delivery, closure, preparation for next quarter

**Context Signals:**
- Quarter theme and how this month contributes
- Project deadlines and urgency
- Prior month patterns and energy trends
- Annual goals and progress

Let the user choose or suggest their own theme.

### Coaching Prompts

Generate personalized prompts connecting to:

**For Coaching Check-in:**
- Growth edge focus for the month
- Patterns to watch from Quarter.md
- Questions that serve me from Quarter.md

**For Wins sections:**
- Monthly outcomes to celebrate
- Project milestones approaching
- Team development opportunities
- Key relationships to nurture

**For Reflections:**
- Anticipated challenges this month
- Prior month patterns to build on or break
- Leadership development opportunities

---

## Generate

Use the Month.md template as the source of truth. Fill:

- **Frontmatter** with month, quarter, year
- **Context From Above** with quarter theme/outcomes and year theme/goals
- **Month Overview** with key outcomes and monthly theme
- **Coaching Check-in** with generated prompts
- **Wins** sections with coaching prompts per category (empty for user to fill)
- **Reflections** sections empty (filled during monthly review)

---

## Confirm

After writing, summarize:
- The three monthly outcomes
- The monthly theme
- Key projects requiring attention this month
- Coaching focus for the month

Suggest strategies for the month ahead if helpful.
