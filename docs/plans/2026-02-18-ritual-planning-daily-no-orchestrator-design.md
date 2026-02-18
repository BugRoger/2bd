# Design: ritual-planning-daily Without Orchestrator

**Date:** 2026-02-18
**Status:** Approved

## Goals

- Remove orchestrator complexity and indirection
- Make skill self-contained without depending on orchestration infrastructure
- Keep genuinely reusable sub-skills (calendar, dates)

## Decisions

| Concern | Decision |
|---------|----------|
| Calendar | Keep `_fetch-calendar` sub-skill |
| Dates | Keep `_resolve-dates` sub-skill |
| Vault paths | Hardcoded (skill knows structure) |
| People files | Inline resolution (parse calendar → Glob) |
| Orchestrator | Remove entirely |
| Template | Load from vault, not skill references |

## Approach

**Procedural Steps** — Structure the skill as explicit procedural steps with tool calls inline. Explicit, debuggable, no magic.

## New Skill Structure

```markdown
---
name: planning-daily
description: Morning ritual for planning the day...
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
5. **Find People for 1:1s** — Parse calendar, Glob `02_Areas/People/*.md` for matching names
6. **Check existing Today.md** — `00_Brain/Captive/Today.md`

Graceful degradation: If any file doesn't exist, note it and continue.

## Validate

Check if Today.md already exists. If it does and contains content:
- If date is in the past, warn about potential data loss
- Offer options: Review existing, Update existing, or Start fresh

## Session

Greet the user using their preferred name from directives.

Follow the session flow in [session-flow.md](references/session-flow.md):

1. **Context From Above** — Present hierarchical context summary
2. **Focus** — Establish energy, priorities, leadership intention
3. **Meetings** — Review calendar, prepare 1:1s with People context
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

Suggest time-blocking strategies if helpful.
```

## Changes Summary

**Frontmatter:**
- Remove `orchestrated: true`
- Remove `metadata.orchestrated` if present
- Keep `argument-hint`

**Sections:**
- Add `## Paths` — establishes vault root convention
- Replace `## Context` with `## Setup` — explicit steps
- Keep `## Validate`, `## Session`, `## Confirm` unchanged
- Update `## Compose` — load template from vault
- Update `## Persist` — explicit output path

**Reference files:**
- Remove `references/today-template.md` (use vault template)
- Keep all other reference files:
  - `session-flow.md`
  - `context-summary.md`
  - `priorities-framework.md`
  - `meeting-templates.md`

**Dependencies:**
- Keep `_resolve-dates` sub-skill
- Keep `_fetch-calendar` sub-skill
- Remove dependency on `_orchestrator`
