---
name: monthly-review
description: Review and archive a month's work. Synthesizes weekly archives into monthly patterns, guides reflection on outcomes and growth progress, extracts insights to semantic notes, and archives to Periodic/Monthly/. Accepts an optional target month (default: current month).
argument-hint: "[target-month: (empty)|last month|YYYY-MM]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Monthly Review

Evening ritual for synthesizing a month's work, reflecting on outcomes and growth patterns, extracting learnings to semantic notes, and archiving to Periodic/Monthly/.

## Context

- Month.md file for the target month
- User's directives and preferences
- Weekly archives from Periodic/Weekly/
- Active project files
- Existing monthly archive if re-reviewing

---

## Flow

1. **Setup** — Load config, dates, directives
2. **Load** — Parse Month.md content and weekly archives
3. **Gather** — Collect month context from weekly archives
4. **Pre-flight** — Verify month state, check for conflicts
5. **Interact** — Guide reflection (see [coaching.md](coaching.md))
6. **Synthesize** — Prepare semantic note updates (parallel)
7. **Confirm** — Present changes for approval
8. **Write** — Archive to Periodic, update semantic notes

---

## Validate

Verify the month state before reviewing:

- Check date alignment between Month.md frontmatter and target review month. If mismatched, ask which month to review.
- Check if an archive already exists for this month in Periodic/Monthly/. If exists, offer to view or re-review.
- Check for an archived marker in Month.md frontmatter. If present, the month has already been archived.
- Check which weeks have weekly archives. If incomplete, offer to proceed with partial data or complete weekly reviews first.

Proceed only when state is validated.

---

## Session

Guide the user through reflection on the month.

### Month Summary

Present a synthesized month overview: weeks reviewed, total meetings, total focus hours, energy trends across weeks, and outcome completion rate. Ask if this feels accurate.

### Outcome Review

Review each outcome from Month.md. For each, categorize as:

- **Completed** — fully achieved, celebrate the success
- **Partial** — progress made but not complete, identify what remains
- **Deferred** — moved to next month or dropped, understand why

Ask which outcome they're most proud of and which taught them the most.

### Coaching Check-in

Apply monthly coaching guidance from [coaching.md](coaching.md).

Connect to growth edge and patterns to watch from directives. Ask:
- Where did the growth edge show up this month and what progress was made?
- Which watched patterns emerged and what triggered them?
- What conversations were avoided that should have happened?
- How did delegation evolve over the month?

Self-care reflection: energy as the month closes, boundaries that served well, what to protect next month.

### Wins Synthesis

Guide through wins from weekly archives, grouped by category:

- **Personal**: sustained energy, maintained boundaries, growth milestones
- **Organisational**: team achievements, culture moments, recognition given
- **Strategic**: project completions, goal progress, key decisions made

Ask which win defines the month. Identify the theme that connects the month's successes.

### Patterns & Trends

Review patterns that emerged across weeks:

- Recurring themes in weekly reviews
- Energy patterns (which weeks were high/low energy, why)
- Meeting load trends and calendar health
- Relationship patterns (who showed up frequently, who was missing)

Look for systemic patterns that need addressing vs. one-off incidents.

### Forward Setup

Review carry-forward items from weekly archives and Month.md. Ask which remain relevant for next month.

Check for strategic items that should surface in quarterly planning. Ask what the focus theme should be for next month and what one thing would make it successful.

---

## Compose

Parallel subagents prepare semantic note updates based on the completed review:

- **People** — updates from month's interactions and relationship patterns
- **Projects** — updates from outcome completion and strategic progress
- **Insights** — updates from key learnings and pattern recognition

Each returns structured proposals for user approval.

---

## Persist

Execute confirmed writes:

- Archive Month.md content to Periodic/Monthly/
- Apply semantic note updates
- Update Month.md with archived placeholder

Report completion and suggest next steps:
- Monthly planning when ready
- Quarterly review if end of quarter approaching
- Year.md updates if significant patterns emerged

If directives were not available, suggest running `/init`.

---

## Confirm

Present all proposed changes for approval:

- Archive destination (Periodic/Monthly/) and month summary
- Each semantic note update with target file, section, and content preview

Options:
- **Proceed all** — archive and apply all updates
- **Archive only** — skip semantic updates
- **Review each** — approve individually
- **Cancel** — exit (captured synthesis preserved in Month.md)

---

## Tips

- **Outcomes over activities**: focus on what was achieved, not just what was done
- **Patterns over incidents**: monthly view reveals systemic issues
- **Growth tracking**: connect monthly progress to annual development goals
- **Relationship investment**: notice who got attention and who was neglected
- **Forward momentum**: use the review to shape next month's outcomes

## Metabolic Flow

This ritual moves content through the knowledge metabolism:

```
Captive (volatile)     →    Periodic (archive)      →    Semantic (crystallized)
Month.md + Weekly/*.md      Monthly/YYYY-MM.md          People/, Projects/,
                                                        Insights/
```

## Integration

- **weekly-review**: Creates the weekly archives that monthly-review synthesizes
- **monthly-planning**: Morning counterpart that creates Month.md
- **quarterly-review**: Higher-level synthesis that uses monthly archives
- **get-month-content**: Sub-skill that parses Month.md structure
- **gather-month-context**: Sub-skill that collects weekly archives
- **extract-to-areas**: Sub-skill that prepares semantic updates
- **archive-monthly**: Sub-skill that handles Captive → Periodic transition
