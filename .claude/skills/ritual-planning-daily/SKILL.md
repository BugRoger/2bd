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
2. **Load insights** — Read `00_Brain/Systemic/Insights/planning-daily.md` (create if missing)
3. **Fetch calendar** — Invoke `_fetch-calendar` for target date
4. **Load template** — Read `00_Brain/Systemic/Templates/Captive/today.md`
5. **Load hierarchical context:**
   - `00_Brain/Captive/Week.md`
   - `00_Brain/Captive/Month.md` (if insights indicate user values hierarchy)
   - `00_Brain/Captive/Quarter.md` (if insights indicate user values hierarchy)
6. **Load directives:**
   - `00_Brain/Systemic/Directives/user-profile.md`
   - `00_Brain/Systemic/Directives/ai-personality.md`
7. **Find People for 1:1s** — Parse calendar for 1:1 meetings, Glob `02_Areas/People/*.md` for matching names
8. **Check existing Today.md** — `00_Brain/Captive/Today.md`

Graceful degradation: If insights file doesn't exist, create empty one and proceed with defaults.

## Validate

Check if Today.md already exists for the target date. If it does and contains content:
- If date is in the past, warn about potential data loss and suggest review-daily first
- Offer options: Review existing, Update existing, or Start fresh

Proceed only when state is validated.

## Session

Greet the user using their preferred name from directives.

**Adapt to insights:** Read the insights file and adjust the session accordingly:
- Skip steps the user doesn't engage with
- Use coaching style that resonates
- Apply learned phrasing preferences
- For anything not in insights, use reference file defaults

Follow the session flow in [session-flow.md](references/session-flow.md), adapting based on insights:

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

## Observe

After the session, record observations to the insights file.

**What to observe:**
- Which questions the user engaged with vs skipped
- How they rephrased suggested priorities
- Whether they accepted or modified leadership intentions
- Any explicit feedback about the session

**Recording observations:**
Append timestamped entries to the Observations Log section:

```markdown
## Observations Log

- YYYY-MM-DD: [observation about user behavior or preference]
```

**Pattern detection:**
When the same observation appears 3+ times:
1. Synthesize into prose description
2. Add to appropriate section (Session Style, Priorities, Coaching Style, etc.)
3. If high confidence, add to Pending Proposals with rationale

**Template evolution:**
When a template change is warranted:
1. Add proposal to Pending Proposals section
2. Ask user for confirmation
3. If confirmed, edit `00_Brain/Systemic/Templates/Captive/today.md` directly

The skill code never changes. Evolution happens in the vault.