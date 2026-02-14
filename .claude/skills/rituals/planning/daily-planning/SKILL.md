---
name: daily-planning
description: Plan a day's priorities, meetings, and intentions.
argument-hint: "[target-date: today|tomorrow|monday|YYYY-MM-DD]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Daily Planning

A morning ritual to set intentions, prioritize outcomes, and prepare for the day.

## Flow

1. **Setup** — Load vault config, resolve target date, load directives
2. **Gather** — Fetch calendar, weekly context, monthly context, active projects
3. **Pre-flight** — Verify note state, handle stale notes
4. **Plan** — Present hierarchical context, discuss priorities, leadership intention, generate coaching prompts
5. **Write** — Generate and save the plan

---

## Pre-flight

Before overwriting the current note, verify its state:

- If the note date is older than today and hasn't been archived, block and suggest running the corresponding review first
- If planning for a future date, warn that the current note will be overwritten
- Only proceed with explicit confirmation when there's unarchived work

---

## Planning Session

### Hierarchical Context

Present context from higher-level planning if available:

**Weekly Context** (from Week.md):
- Focus Theme — What this week is about
- Key Outcomes — The three weekly outcomes
- Leadership Intention — Weekly stance
- Patterns to Watch — From coaching check-in

**Monthly Context** (from Month.md):
- Monthly Theme — What this month is about
- Key Outcomes — The three monthly outcomes

**Active Projects** (from 01_Projects/):
- List all active projects with timeline urgency
- Flag overdue (❗️) and due-soon (⚠️) projects
- Show next milestone for each

If any context is unavailable, note it and continue. This context informs priority suggestions.

### Calendar Overview

Present the day's meetings and confirm template assignments. For each meeting, identify whether it's a 1:1 (use person template) or group meeting (use meeting template).

### Context Questions

Ask about energy level, work location, and any deadlines or constraints. For scheduled 1:1s, ask what the user wants to focus on with that person.

### Priorities

Review hierarchical context and active projects. Identify three outcomes:

1. **Must happen** — The critical outcome that defines success. Connect to weekly key outcomes or overdue/due-soon projects when relevant.
2. **Team/strategic** — Work that moves the team or strategy forward. Align with monthly theme or weekly focus.
3. **Personal/operational** — Something for yourself or routine operations. Reference patterns to watch from coaching.

Frame these as outcomes, not tasks. What will be different by end of day?

### Leadership Intention

Suggest 2-3 intentions based on the day's shape:

- Heavy meetings → Present, Listening, Patient
- Many 1:1s → Supportive, Coaching, Curious
- Deadline pressure → Decisive, Confident, Clear
- Low energy → Sustainable, Boundaries, Selective
- Light calendar → Creative, Ambitious, Momentum

### Coaching Prompts

Generate personalized prompts for Wins and Insights sections, connecting to:

**For Wins:**
- Priorities and leadership intention
- Weekly key outcomes and focus theme
- Active project milestones approaching
- Key interactions and 1:1 opportunities

**For Insights:**
- Patterns to watch (from Week.md coaching check-in)
- Monthly theme alignment
- Leadership development themes
- Day-type context (meeting-heavy, deadline, creative)

---

## Generate

Use the template as the source of truth. Fill:

- **Frontmatter** with target date values
- **Context From Above** with:
  - Week Theme (from Week.md focus theme)
  - Week Outcomes (from Week.md key outcomes)
  - Month Theme (from Month.md monthly theme)
  - Patterns to Watch (from Week.md coaching or Quarter.md)
- **Active Projects** section with urgent projects (overdue/due-soon)
- **Focus** with priorities and leadership intention
- **Meetings** with calendar events matched to templates
- **Wins** with generated coaching prompts
- **Insights** with generated coaching prompts

Keep Capture section empty for the user to fill during the day.

---

## Confirm

After writing, summarize:
- The three priorities
- The leadership intention
- Number of meetings prepared

Suggest time-blocking strategies if helpful.
