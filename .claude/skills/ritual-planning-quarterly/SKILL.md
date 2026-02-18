---
name: quarterly-planning
description: Plan a quarter's outcomes, theme, and coaching focus aligned with annual goals.
argument-hint: "[target-quarter: this quarter|next quarter|YYYY-QN]"
metadata:
  orchestrated: true
---

# Quarterly Planning

A start-of-quarter ritual to set quarterly theme, key outcomes, and coaching focus aligned with annual goals. Designed for planning at quarter boundaries.

## Context

- Year.md with annual goals and leadership development focus
- Prior quarter archive (if exists)
- Active project files
- Current Quarter.md state (if exists)
- User directives and preferences

---

## Validate

Before overwriting the current Quarter.md, verify its state:

- If Quarter.md contains a different quarter and hasn't been archived, block and suggest running quarterly-review first
- If planning for a past quarter, warn that this is unusual
- Only proceed with explicit confirmation when there's unarchived work

---

## Session

### Annual Context

Present context from Year.md:

**Year Theme** — What this year is about and why it matters
**Annual Goals** — The three annual goals:
- Personal leadership growth
- Organisational capability
- Strategic achievement

**Leadership Development** — From Year.md:
- Leadership Identity — The leader you aspire to be
- Growth Edge — Where discomfort lives (the stretch area)
- Current Focus — Primary and secondary leadership competencies

If annual context is unavailable, note it and suggest running yearly-planning first.

### Prior Quarter Synthesis

If prior quarter data is available (from gather-quarter-context), present:

**Monthly Themes:**
- Progression across the three months
- What themes emerged organically

**Accomplishments:**
- Key wins by category (personal, organisational, strategic)
- Outcome completion rate
- Major deliverables shipped

**Carryover Candidates:**
- Incomplete outcomes from prior quarter
- Items marked for continuation
- Patterns observed that need continued attention

**Leadership Development Progress:**
- Growth edge progress across months
- Coaching insights captured
- Avoided conversations trend (improving or recurring)
- Delegation pattern evolution
- Key relationships nurtured

### Active Projects

Present all active projects with quarterly timeline view:

- List all active projects from 01_Projects/
- Flag overdue projects with deadlines passed
- Flag due-soon projects with deadlines this quarter
- Show next milestone for each
- Note which projects span multiple quarters

### Key Outcomes

Guide the user to three quarterly outcomes aligned with annual goals:

1. **Personal** — What personal leadership skill will you level up this quarter? How does this connect to your growth edge and leadership identity?
2. **Organisational** — What organisational capability will you establish? What team structures, processes, or cultural elements will you build?
3. **Strategic** — What strategic outcome demonstrates quarter success? What deliverable or milestone moves annual goals forward?

Frame these as outcomes, not activities. What will be measurably different by end of quarter?

### Quarterly Theme

Suggest 2-3 themes based on:

**Position in Year:**
- Q1: Foundation, alignment, planning — Setting direction and building infrastructure
- Q2: Execution, momentum, iteration — Delivering on plans and adjusting course
- Q3: Growth, expansion, deepening — Scaling what works and strengthening foundations
- Q4: Completion, harvest, reflection — Finishing strong and preparing for next year

**Context Signals:**
- Annual theme and how this quarter contributes
- Prior quarter patterns and trajectory
- Project deadlines and urgency
- Leadership development opportunities
- Energy trends from prior quarter

Let the user choose or suggest their own theme.

### Coaching Themes

This section establishes self-awareness and coaching focus for the quarter. These appear in Quarter.md and cascade to monthly and weekly planning.

**Patterns to Watch:**
Generate 2-3 patterns based on:
- Growth edge from Year.md — What behaviors to notice
- Prior quarter insights — What friction points recurred
- Leadership identity — What habits support or undermine
- User's patterns_to_watch directive

Example patterns:
- "Tendency to solve problems for people instead of asking questions"
- "Energy drain from context-switching between strategic and tactical work"
- "Avoiding difficult conversations until they become urgent"

**Questions That Serve Me:**
Generate 3-5 coaching questions based on:
- Growth edge — Questions that surface avoidance
- Leadership identity — Questions that invoke the leader you want to be
- Quarter theme — Questions that keep focus on what matters
- User's questions_that_serve_me directive

Example questions:
- "What are you avoiding?"
- "Who needs to hear something from you?"
- "What would the leader you want to be do right now?"
- "Is this moving the quarter forward or just staying busy?"

---

## Compose

Use the Quarter.md template as the source of truth. Fill:

- **Frontmatter** with quarter, year, months array
- **Context From Above** with year theme, annual goals, growth edge
- **Quarter Overview** with key outcomes and quarterly theme
- **Coaching Themes** with patterns to watch and questions that serve me
- **Monthly Progress** sections empty (filled during monthly reviews)
- **Wins** sections empty (filled during quarterly review)
- **Reflections** sections empty (filled during quarterly review)

---

## Persist

Write Quarter.md to Captive.

---

## Confirm

After writing, summarize:
- The three quarterly outcomes
- The quarterly theme
- Coaching themes (patterns and questions)
- Key projects requiring attention this quarter
- Leadership development focus for the quarter

Suggest strategies for the quarter ahead if helpful.
