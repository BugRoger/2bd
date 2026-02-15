---
name: planning-daily
description: Morning ritual for planning the day
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day.

## Context

- Calendar events for the day
- User's directives and preferences
- Today.md file for this day (may not exist yet)
- Week.md for weekly context
- Month.md for monthly context
- Quarter.md for coaching context
- People files for anyone with 1:1 meetings
- Active project files

## Validate

Check if Today.md already exists for the target date. If it does:
- Check if its date is in the past (older than target date)
- If the date is in the past and the note hasn't been archived to Periodic, warn about potential data loss
- Suggest running review-daily first before proceeding with planning
- If the user wants to proceed anyway, ask whether to:
  - Review existing plan
  - Update existing plan
  - Start fresh (clear and rewrite)

## Session

Greet the user using their preferred name from directives.

We're planning their day for the target date.

### Context From Above

Present a focused Top 3 Context Summary (this will go directly into the template's "Context From Above" section):

1. **This Week's Focus**
   - Key outcome (from Week.md Key Outcomes - pick most relevant)
   - Weekly theme (from Week.md Focus Theme)

2. **Critical Projects**
   - List ONLY overdue or due-soon projects (no icons)
   - Include next milestone for each
   - If none are urgent, list top 1-2 active projects

3. **Growth Edge**
   - Single most relevant pattern to watch (from Quarter.md or Week.md)

### Focus

Ask about energy level, work location, and any deadlines or constraints. These will populate the frontmatter (energy: High/Medium/Low, location: Home/Office/Travel/Other). Also calculate focus_hours from calendar gaps and count meetings.

**Priorities:** Review hierarchical context and active projects. Identify three outcomes (these become "Top Priorities" in the template):

1. **Must happen** — The critical outcome that defines success. Connect to weekly key outcomes or overdue/due-soon projects when relevant.
2. **Team/strategic** — Work that moves the team or strategy forward. Align with monthly theme or weekly focus.
3. **Personal/operational** — Something for yourself or routine operations. Reference patterns to watch from coaching.

Frame these as outcomes, not tasks. What will be different by end of day?

**Leadership Intention:** Suggest 2-3 intentions based on the day's shape (user chooses one for the template):

- Heavy meetings → Present, Listening, Patient
- Many 1:1s → Supportive, Coaching, Curious
- Deadline pressure → Decisive, Confident, Clear
- Low energy → Sustainable, Boundaries, Selective
- Light calendar → Creative, Ambitious, Momentum

### Meetings

**Calendar Review:** Review the calendar. What meetings do they have (exclude routine items that don't need notes: Lunch, Focus Work/Time, Prep/Preparation, Blockers, Break, Coffee)?

**1:1 Context:** For each 1:1 meeting on the calendar:
- Review their People file thoroughly
- Present enriched context:
  - Last interaction date
  - Active topics or ongoing conversations
  - Related projects they're involved in
  - Recent wins, blockers, or updates worth mentioning
  - If direct report: current team/project status context
- Ask what the user wants to focus on with that person

In the template, create a section for each meeting using the appropriate format (Person template for 1:1s with enriched context as a comment above, standard meeting template for group meetings, interview template if applicable).

### Wins

Generate personalized coaching prompts for the Wins section of the template, connecting to:
- Priorities and leadership intention
- Weekly key outcomes and focus theme
- Active project milestones approaching
- Key interactions and 1:1 opportunities

### Insights

Generate personalized coaching prompts for the Insights section of the template, connecting to:
- Patterns to watch (from Week.md coaching check-in)
- Monthly theme alignment
- Leadership development themes
- Day-type context (meeting-heavy, deadline, creative)

## Compose

Build the complete Today.md file using all content from the session above:
- Fill frontmatter with calculated date fields (YYYY-MM-DD, day name, ISO week, month, quarter)
- Include standard navigation links
- Write all sections in template order: Context From Above, Focus, Meetings, Capture (empty), Wins, Insights, Changelog (empty)

## Persist

Write Today.md to Captive.

## Confirm

After writing, summarize:
- The three priorities
- The leadership intention
- Number of meetings prepared

Suggest time-blocking strategies if helpful.

Confirm with the user that their day is planned.
