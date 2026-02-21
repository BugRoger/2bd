---
title: "Templates reference"
description: "Complete reference for Captive templates used by planning rituals."
---

## Overview

Captive templates are the working documents you fill out during planning rituals. They live in `00_Brain/Captive/` and capture your intentions, priorities, and progress at each timescale.

| Template | Location | Planning ritual | Reflection ritual |
|----------|----------|-----------------|-------------------|
| Year.md | `Captive/Year.md` | `ritual-planning-yearly` | `ritual-reflection-yearly` |
| Quarter.md | `Captive/Quarter.md` | `ritual-planning-quarterly` | `ritual-reflection-quarterly` |
| Week.md | `Captive/Week.md` | `ritual-planning-weekly` | `ritual-reflection-weekly` |
| Today.md | `Captive/Today.md` | `ritual-planning-daily` | `ritual-reflection-daily` |

Templates source from `Systemic/Templates/Captive/`. When you run a planning ritual, it creates or updates the corresponding Captive note.

## Year.md

Yearly planning template. Captures your vision, goals, and leadership development for the year.

### Key sections

| Section | Purpose | GPS component |
|---------|---------|---------------|
| Vision and Theme | One theme or vision for the year | Life Compass |
| Key Annual Goals | Three goals: personal, organisational, strategic | 3-Year Sketch |
| Leadership Development | Current focus, identity, growth edge | Why |
| Key Dates | Annual milestones and deadlines | - |
| Quarterly Progress | Q1-Q4 capture areas | - |
| Annual Wins | Personal, organisational, strategic achievements | - |
| Reflections | Year narrative and key insights | Anti-Goals |

### Structure

```markdown
---
year: 2026
quarters: [2026-Q1, 2026-Q2, 2026-Q3, 2026-Q4]
---

## Year Overview

### Vision & Theme
[One theme or vision for the year]

### Key Annual Goals
1. What personal leadership growth will you make?
2. What organisational capability will you build?
3. What strategic achievement would make this year remarkable?

## Leadership Development

### Current Focus
- **Primary:** [Leadership competency actively developing]
- **Secondary:** [Secondary growth area]

### Leadership Identity
[The leader you are becoming - 1-2 sentences]

### Growth Edge
[Where discomfort lives - the stretch you are working on]

## Quarterly Progress

### Q1 (January - March)
- [Key themes and progress]

## Annual Wins

### Personal
- [Leadership growth]

### Organisational
- [Team evolution]

### Strategic
- [[project-name]]: [Annual outcomes]

## Reflections

### What Defined This Year
[Core narrative]

### Key Insights
[Synthesized learnings]
```

## Quarter.md

Quarterly planning template. Focuses your energy on one quest with major moves.

### Key sections

| Section | Purpose | GPS component |
|---------|---------|---------------|
| Context From Above | Year theme, goals, growth edge | - |
| Key Outcomes | Three outcomes: personal, organisational, strategic | Quarterly Quest |
| Quarterly Theme | One focus area for the quarter | Major Moves |
| Coaching Themes | Patterns to watch, questions that serve you | 80% Reality Check |
| Weekly Progress | Synthesized from weekly archives | - |
| Wins This Quarter | Personal, organisational, strategic achievements | Crystal Ball |
| Reflections | What went well, what could improve | - |

### Structure

```markdown
---
quarter: 2026-Q1
year: 2026
---

## Context From Above
> **Year Theme:** [From Year.md]
> **Annual Goals:** [From Year.md]
> **Growth Edge:** [From Year.md]

## Quarter Overview

### Key Outcomes This Quarter
1. What personal leadership skill will you level up?
2. What organisational capability will you establish?
3. What strategic outcome demonstrates quarter success?

### Quarterly Theme
[One theme or focus area]

## Coaching Themes

### Patterns to Watch
- [Pattern 1 - recurring behavior to notice]
- [Pattern 2]

### Questions That Serve Me
- [Question 1 - coaching question for the quarter]
- [Question 2]

## Wins This Quarter

### Personal
- [Personal growth and achievements]

### Organisational
- [Team evolution]

### Strategic
- [[project-name]]: [Quarterly outcomes]

## Reflections

### What Went Well
- [What strategies drove success?]

### What Could Be Better
- [What needs to change?]
```

## Week.md

Weekly planning template. Structures your week with intentions and commitments.

### Key sections

| Section | Purpose | GPS component |
|---------|---------|---------------|
| Context From Above | Quarter theme, outcomes, year theme | - |
| Synthesis from Prior Week | Carryover, patterns, relationships | - |
| Key Outcomes | Three outcomes: personal, organisational, strategic | Balanced Week Blueprint |
| Focus Theme | One theme for the week | - |
| Leadership Intention | One-word stance (Decisive, Collaborative, etc.) | - |
| Weekly Commitments | Decisions, people, boundaries, growth challenge | Accountability |
| Coaching Check-in | Self-awareness prompts | - |
| Next Week Setup | Carry forward items | - |

### Structure

```markdown
---
week: 2026-W03
dates: 2026-01-13 to 2026-01-19
quarter: 2026-Q1
year: 2026
week_type: balanced
energy_trend: stable
leadership_intention: Decisive
---

## Context From Above
> **Quarter Theme:** [From Quarter.md]
> **Quarter Outcomes:** [From Quarter.md]
> **Year Theme:** [From Year.md]

## Synthesis from Prior Week

### Carryover Priorities
- [ ] [Incomplete items from last week]

### Patterns Noted
- [Synthesized from prior week]

## Week Overview

### Key Outcomes This Week
1. What personal habit or system will you strengthen?
2. What organisational conversation or decision is needed?
3. What strategic deliverable moves the quarter forward?

### Focus Theme
[One theme for the week]

### Leadership Intention
[One word - your stance for this week]

## Weekly Commitments

### Key Decisions to Make
- [ ] [Decision needing resolution]

### People I Need to Connect With
- [ ] [[PersonName]] - [reason]

### Boundaries I Will Maintain
- [Energy/time boundary to protect]

### One Growth Challenge I Will Embrace
- [Connected to your growth edge]

## Next Week Setup
**Theme:** [Working title for next week]
**Carry Forward:**
- [ ] [Items moving to next week]
```

## Today.md

Daily planning template. The 1-3-5 method prevents overcommitment.

### Key sections

| Section | Purpose | GPS component |
|---------|---------|---------------|
| Daily Brief | Week focus, growth edge, calendar context | - |
| Priorities | 1-3-5 tasks (1 big, 3 medium, 5 small) | 1-3-5 Daily Method |
| Intention | One-word stance for the day | - |
| Meetings | Structured capture with decisions and next steps | Tracking |
| Journal | Wins and insights | - |

### Structure

```markdown
---
date: 2026-01-15
day: Wednesday
week: 2026-W03
quarter: 2026-Q1
energy: Medium
location: Office
focus_hours: 2
meetings: 8
---

## Daily Brief

**This Week's Focus:** [From Week.md]

**Growth Edge:** [From Week.md or Quarter.md]

[Calendar context - meeting load, focus time available]

### Priorities
1. **[Big task]** - [Why it matters]
2. **[Medium task]** - [Context]
3. **[Medium task]** - [Context]

### Intention
**[One word]** - [Brief explanation]

## Meetings

### 09:00-09:30 | Team Standup
**Decisions:**
- [Decision made]

**Next Steps:**
- [ ] Person: [Action]

### 14:00-14:30 | 1:1 with [[PersonName]]
**Check-in**
- [How they are doing]

**Commitments**
- [ ] Me: [Action]
- [ ] Them: [Action]

## Journal

### Wins
**Personal**
- [Personal win]

**Team**
- [Team win]

**Strategic**
- [Strategic progress]

### Insights
**What Went Well**
- [Success pattern]

**What Could Be Better**
- [Improvement area]

**Key Insight**
[One synthesized learning from the day]
```

### The 1-3-5 method

A constraint that forces prioritization:

| Category | Count | Definition |
|----------|-------|------------|
| Big | 1 | The one thing that moves the needle |
| Medium | 3 | Important tasks that support the big one |
| Small | 5 | Quick wins, admin, maintenance |

**Total: 9 items maximum per day.** If a task does not fit, something else must go.

## Related

- [GPS methodology](/overview/gps-methodology) - The framework behind these templates
- [Rituals reference](/reference/rituals) - When templates get updated
- [Vault structure](/reference/vault-structure) - Where templates live
- [How it works](/overview/how-it-works) - The ritual cycle explained
