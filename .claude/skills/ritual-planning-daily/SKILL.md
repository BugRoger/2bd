---
name: planning-daily
description: Morning ritual for planning the day. Use when starting work to set priorities, prepare for meetings, and establish leadership intention.
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day with focused priorities, prepared meetings, and a clear leadership intention.

## Paths

This skill runs from the vault. Resolve vault root from skill location (parent of `.claude/skills/`).

All paths below are relative to vault root.

## Setup

Load context before starting the session:

1. **Resolve date** — Invoke `_resolve-dates` with argument (default: today)
2. **Fetch calendar** — Invoke `_fetch-calendar` for target date
3. **Load hierarchical context:**
   - `00_Brain/Captive/Week.md`
   - `00_Brain/Captive/Month.md`
   - `00_Brain/Captive/Quarter.md`
4. **Load directives:**
   - `00_Brain/Systemic/Directives/user-profile.md`
   - `00_Brain/Systemic/Directives/ai-personality.md`
5. **Find People for 1:1s** — Parse calendar for 1:1 meetings, Glob `02_Areas/People/*.md` for matching names
6. **Check existing Today.md** — `00_Brain/Captive/Today.md`

Graceful degradation: If any file doesn't exist, note it and continue.

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

Build Today.md:
- Load template from `00_Brain/Systemic/Templates/Captive/today.md`
- Fill frontmatter with date fields from resolved date
- Write all sections from session

## Persist

Write to `00_Brain/Captive/Today.md`.

## Confirm

After writing, summarize:
- The three priorities
- The leadership intention
- Number of meetings prepared

Suggest time-blocking strategies if helpful. Confirm the day is planned.
