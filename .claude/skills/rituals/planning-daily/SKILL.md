---
name: planning-daily
description: Morning ritual for planning the day
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day.

## What I Need

- Calendar events for the day
- User's directives and preferences
- Today.md file for this day (may not exist yet)
- Week.md for weekly context
- Month.md for monthly context
- Quarter.md for coaching context
- People files for anyone with 1:1 meetings
- Active project files

## Pre-Flight Check

Check if Today.md already exists for the target date. If it does:
- Check if its date is in the past (older than target date)
- If the date is in the past and the note hasn't been archived to Periodic, warn about potential data loss
- Suggest running review-daily first before proceeding with planning
- If the user wants to proceed anyway, ask whether to:
  - Review existing plan
  - Update existing plan
  - Start fresh (clear and rewrite)

If calendar is unavailable, note that and proceed without it.

## Planning Session

Greet the user using their preferred name from directives.

We're planning their day for the target date.

### Review Context

**Calendar:** Review the calendar. What meetings do they have?

**Weekly Context:** Review Week.md. Present:
- Focus Theme — What this week is about
- Key Outcomes — The three weekly outcomes
- Leadership Intention — Weekly stance
- Patterns to Watch — From coaching check-in

**Monthly Context:** Review Month.md if available. Present:
- Monthly Theme — What this month is about
- Key Outcomes — The three monthly outcomes

**Quarterly Context:** Review Quarter.md if available. Present:
- Patterns to Watch — Self-awareness patterns for coaching
- Questions That Serve Me — Coaching questions for reflection

**Active Projects:** Review active project files.
- List all active projects with timeline urgency
- Flag overdue (❗️) and due-soon (⚠️) projects
- Show next milestone for each

**1:1 Meeting Context:** For each 1:1 meeting on the calendar:
- Review their People file
- Mention context (last interaction, ongoing topics)

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

## Generate Plan

Use the Today.md template as the source of truth. Fill:

**Frontmatter:**
- date: Target date (YYYY-MM-DD)
- day: Day of week name
- week: ISO week (YYYY-Www)
- month: YYYY-MM
- quarter: YYYY-QN
- energy: Ask user (High/Medium/Low)
- location: Ask user (Home/Office/Travel/Other)
- focus_hours: Calculate from calendar gaps
- meetings: Count from calendar

**Context From Above:**
- Week Theme (from Week.md focus theme)
- Week Outcomes (from Week.md key outcomes)
- Month Theme (from Month.md monthly theme)
- Quarter Patterns to Watch (from Quarter.md)
- Active Projects (urgent/due-soon projects flagged ❗️⚠️)

**Focus:**
- Fill Top Priorities with the three outcomes discussed
- Fill Leadership Intention with chosen stance

**Meetings:**
- For each calendar event, add appropriate template section
- 1:1s use the Person template with check-in structure
- Group meetings use standard meeting template
- Interviews use interview template if applicable

**Wins:**
- Fill with generated coaching prompts from planning session

**Insights:**
- Fill with generated coaching prompts from planning session

**Capture, Changelog:**
- Leave empty for user to fill during the day

Write the generated plan to a file called `plan.md` in the session directory.

## Save to Vault

Use bash to write plan.md to Today.md in vault. The orchestrator provides the session directory path in the SESSION_DIR environment variable:

```bash
vault_path=$(grep "vault_path:" .claude/config.md | cut -d' ' -f2)
cp "${SESSION_DIR}/plan.md" "${vault_path}/00_Brain/Captive/Today.md"
```

## Confirm

After writing, summarize:
- The three priorities
- The leadership intention
- Number of meetings prepared

Suggest time-blocking strategies if helpful.

Confirm with the user that their day is planned.
