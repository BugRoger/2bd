# Remaining Rituals Design

Design for the 6 remaining rituals: monthly, quarterly, and yearly planning/review pairs.

**Date:** 2026-02-14
**Status:** Approved

---

## Overview

Complete the ritual system by implementing the remaining timescales. Each ritual follows the established orchestrated skill pattern from daily/weekly.

**Existing rituals (4):**
- daily-planning, daily-review
- weekly-planning, weekly-review

**New rituals (6):**
- monthly-planning, monthly-review
- quarterly-planning, quarterly-review
- yearly-planning, yearly-review

---

## Shared Architecture

### Planning Rituals Flow

```
Setup → Gather → Pre-flight → Plan (interactive) → Write → Confirm
```

### Review Rituals Flow

```
Setup → Load → Pre-flight → Interact (coached) → Synthesize → Confirm → Write
```

### File Structure

```
.claude/skills/rituals/
├── planning/
│   ├── monthly-planning/
│   │   ├── SKILL.md
│   │   └── phases.yaml
│   ├── quarterly-planning/
│   │   ├── SKILL.md
│   │   └── phases.yaml
│   └── yearly-planning/
│       ├── SKILL.md
│       └── phases.yaml
└── review/
    ├── monthly-review/
    │   ├── SKILL.md
    │   ├── phases.yaml
    │   └── coaching.md
    ├── quarterly-review/
    │   ├── SKILL.md
    │   ├── phases.yaml
    │   └── coaching.md
    └── yearly-review/
        ├── SKILL.md
        ├── phases.yaml
        └── coaching.md
```

### New Sub-skills

| Sub-skill | Category | Purpose |
|-----------|----------|---------|
| `get-month-content` | fetch | Parse Month.md structure |
| `get-quarter-content` | fetch | Parse Quarter.md structure |
| `get-year-content` | fetch | Parse Year.md structure |
| `gather-month-context` | synthesis | Collect weekly archives for a month |
| `gather-quarter-context` | synthesis | Collect monthly archives for a quarter |
| `gather-year-context` | synthesis | Collect quarterly archives for a year |

---

## Monthly Rituals

### monthly-planning

Prepares Month.md at the start of each month.

| Aspect | Detail |
|--------|--------|
| Trigger | `claude skill run rituals/planning/monthly-planning` |
| Argument | `[target-month: this month\|next month\|YYYY-MM]` |
| Input | Quarter.md, Year.md, prior month archive, active projects |
| Output | Month.md populated from template |

**Planning flow:**

1. **Hierarchical context** — Show Quarter theme/outcomes, Year theme/goals, Growth Edge
2. **Prior month synthesis** — Wins, patterns, carryover from last month's archive
3. **Active projects** — Flag overdue/due-soon with monthly milestones
4. **Key outcomes** — Guide 3 outcomes (Personal → Organisational → Strategic)
5. **Monthly theme** — Suggest theme based on quarter focus and project deadlines
6. **Coaching prompts** — Generate prompts for Coaching Check-in section

### monthly-review

Archives Month.md to Periodic/Monthly/ at end of month.

| Aspect | Detail |
|--------|--------|
| Trigger | `claude skill run rituals/review/monthly-review` |
| Argument | `[target-month: this month\|last month\|YYYY-MM]` |
| Input | Month.md, weekly archives (4-5 weeks), Quarter.md |
| Output | Periodic/Monthly/YYYY-MM.md, semantic note updates |

**Review flow:**

1. **Month summary** — Synthesize weekly archives: wins, energy trends, priority completion
2. **Outcome review** — Check each key outcome: Completed / Partial / Deferred
3. **Coaching check-in** — Growth edge progress, avoided conversations, delegation patterns
4. **Wins synthesis** — Aggregate weekly wins by category, identify standout
5. **Patterns & trends** — Look for recurring themes across weeks
6. **Forward setup** — Carryover items, themes for next month

**Coaching questions (coaching.md):**
- "What conversation did you avoid this month?"
- "Where did you take on work instead of delegating?"
- "What pattern repeated across weeks?"

---

## Quarterly Rituals

### quarterly-planning

Prepares Quarter.md at the start of each quarter.

| Aspect | Detail |
|--------|--------|
| Trigger | `claude skill run rituals/planning/quarterly-planning` |
| Argument | `[target-quarter: this quarter\|next quarter\|YYYY-QN]` |
| Input | Year.md, prior quarter archive, active projects |
| Output | Quarter.md populated from template |

**Planning flow:**

1. **Annual context** — Show Year theme, annual goals, Leadership Development (focus, identity, growth edge)
2. **Prior quarter synthesis** — Wins, strategic patterns, leadership progress from last quarter's archive
3. **Active projects** — Show all with quarterly timeline view, flag stalled projects
4. **Key outcomes** — Guide 3 outcomes (Personal → Organisational → Strategic) aligned to annual goals
5. **Quarterly theme** — Suggest theme based on year trajectory and Q position (Q1=foundation, Q4=completion)
6. **Coaching themes** — Generate "Patterns to Watch" and "Questions That Serve Me"

### quarterly-review

Archives Quarter.md to Periodic/Quarterly/ at end of quarter.

| Aspect | Detail |
|--------|--------|
| Trigger | `claude skill run rituals/review/quarterly-review` |
| Argument | `[target-quarter: this quarter\|last quarter\|YYYY-QN]` |
| Input | Quarter.md, monthly archives (3 months), Year.md |
| Output | Periodic/Quarterly/YYYY-QN.md, semantic note updates |

**Review flow:**

1. **Quarter summary** — Synthesize monthly archives: themes, trajectory, major wins
2. **Outcome review** — Check each key outcome against what actually happened
3. **Coaching themes review** — Did patterns show up? Which questions served you?
4. **Leadership reflection** — Growth edge progress, identity alignment, biggest leadership moment
5. **Strategic patterns** — What's the organizational direction? What market/team trends emerged?
6. **Annual checkpoint** — Are you on track for annual goals? What needs to shift?
7. **Forward setup** — Themes for next quarter, what to watch, what to let go

**Coaching questions (coaching.md):**
- "What was your biggest leadership moment this quarter?"
- "Where did you grow into your leadership identity?"
- "What strategic bet would you make differently?"
- "What do you need to stop doing next quarter?"

---

## Yearly Rituals

### yearly-planning

Prepares Year.md on January 1.

| Aspect | Detail |
|--------|--------|
| Trigger | `claude skill run rituals/planning/yearly-planning` |
| Argument | `[target-year: this year\|next year\|YYYY]` |
| Input | Prior year archive, multi-year patterns (if available) |
| Output | Year.md populated from template |

**Planning flow:**

1. **Prior year synthesis** — Major wins, key insights, leadership growth from last year's archive
2. **Life context check-in** — What's changing this year? (role, team, personal circumstances)
3. **Vision & theme** — What does this year represent? One clear theme.
4. **Annual goals** — Guide 3 goals (Personal → Organisational → Strategic) as year-defining outcomes
5. **Leadership Development** — Set Primary/Secondary focus, articulate Leadership Identity, define Growth Edge
6. **Quarterly sketch** — Rough allocation of goals across Q1-Q4

### yearly-review

Archives Year.md to Periodic/Yearly/ on December 31.

| Aspect | Detail |
|--------|--------|
| Trigger | `claude skill run rituals/review/yearly-review` |
| Argument | `[target-year: this year\|last year\|YYYY]` |
| Input | Year.md, quarterly archives (4 quarters) |
| Output | Periodic/Yearly/YYYY.md, semantic note updates |

**Review flow:**

1. **Year summary** — Synthesize quarterly archives: trajectory, major themes, defining moments
2. **Goal review** — Check each annual goal: how did it actually unfold?
3. **Leadership journey** — Growth edge progress, identity evolution, biggest leadership lessons
4. **What defined this year** — One paragraph narrative of the year's meaning
5. **Key insights** — 3-5 crystallized learnings to carry forward
6. **Looking ahead** — What's the trajectory? What carries forward vs. what's complete?

**Coaching questions (coaching.md):**
- "What was the defining moment of this year?"
- "How did you grow as a leader?"
- "What would you tell yourself at the start of this year?"
- "What are you most grateful for?"
- "What do you want next year to be about?"

---

## Implementation Summary

### Complete Ritual Matrix

| Ritual | When | Input | Output |
|--------|------|-------|--------|
| monthly-planning | 1st of month | Quarter.md, Year.md, prior month archive | Month.md |
| monthly-review | End of month | Month.md, 4-5 weekly archives | Periodic/Monthly/YYYY-MM.md |
| quarterly-planning | Start of Q | Year.md, prior quarter archive | Quarter.md |
| quarterly-review | End of Q | Quarter.md, 3 monthly archives | Periodic/Quarterly/YYYY-QN.md |
| yearly-planning | Jan 1 | Prior year archive | Year.md |
| yearly-review | Dec 31 | Year.md, 4 quarterly archives | Periodic/Yearly/YYYY.md |

### New Components

**Sub-skills (6):**
- `_sub/fetch/get-month-content`
- `_sub/fetch/get-quarter-content`
- `_sub/fetch/get-year-content`
- `_sub/synthesis/gather-month-context`
- `_sub/synthesis/gather-quarter-context`
- `_sub/synthesis/gather-year-context`

**Ritual skills (6):**
- `rituals/planning/monthly-planning`
- `rituals/review/monthly-review`
- `rituals/planning/quarterly-planning`
- `rituals/review/quarterly-review`
- `rituals/planning/yearly-planning`
- `rituals/review/yearly-review`

### Implementation Order

1. Monthly sub-skills → monthly-planning → monthly-review
2. Quarterly sub-skills → quarterly-planning → quarterly-review
3. Yearly sub-skills → yearly-planning → yearly-review

**Total: 12 new skills**
