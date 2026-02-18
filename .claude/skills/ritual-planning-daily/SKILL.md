---
name: planning-daily
description: Morning ritual for planning the day. Use when starting work to set priorities, prepare for meetings, and establish leadership intention.
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day with focused priorities, prepared meetings, and a clear leadership intention.

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

Check if Today.md already exists for the target date. If it does and contains content:
- If date is in the past, warn about potential data loss and suggest review-daily first
- Offer options: Review existing, Update existing, or Start fresh

Proceed only when state is validated.

## Session

Greet the user using their preferred name from directives.

Follow the session flow in [session-flow.md](references/session-flow.md):

1. **Context From Above** — Present hierarchical context summary using [context-summary.md](references/context-summary.md)
2. **Focus** — Establish energy, priorities, and leadership intention using [priorities-framework.md](references/priorities-framework.md)
3. **Meetings** — Review calendar and prepare 1:1s with enriched context using [meeting-templates.md](references/meeting-templates.md)
4. **Wins** — Generate personalized coaching prompts
5. **Insights** — Generate personalized coaching prompts

## Compose

Build the complete Today.md file using [today-template.md](references/today-template.md) as structure guide:
- Fill frontmatter with calculated date fields (YYYY-MM-DD, day name, ISO week, month, quarter)
- Include standard navigation links
- Write all sections in template order

## Persist

Write Today.md to Captive.

## Confirm

After writing, summarize:
- The three priorities
- The leadership intention
- Number of meetings prepared

Suggest time-blocking strategies if helpful. Confirm the day is planned.
