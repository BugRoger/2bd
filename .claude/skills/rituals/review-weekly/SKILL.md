---
name: weekly-review
description: Review and archive a week's work. Synthesizes daily archives into weekly patterns, guides reflection on leadership and themes, extracts insights to semantic notes (People, Projects, Insights), and archives to Periodic/Weekly/. Accepts an optional target week (default: current week).
argument-hint: "[target-week: (empty)|last week|YYYY-Www]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Weekly Review

Evening ritual for synthesizing a week's work, reflecting on leadership intentions and patterns, extracting learnings to semantic notes, and archiving to Periodic/Weekly/.

## Flow

1. **Setup** — Load config, dates, directives
2. **Load** — Parse Week.md content and daily archives
3. **Pre-flight** — Verify week state, check for conflicts
4. **Interact** — Guide reflection (see [coaching.md](../daily-review/coaching.md))
5. **Synthesize** — Prepare semantic note updates (parallel)
6. **Confirm** — Present changes for approval
7. **Write** — Archive to Periodic, update semantic notes

---

## Pre-flight

Verify the week state before reviewing:

- Check date alignment between Week.md frontmatter and target review week. If mismatched, ask which week to review.
- Check if an archive already exists for this week in Periodic/Weekly/. If exists, offer to view or re-review.
- Check for an archived marker in Week.md frontmatter. If present, the week has already been archived.
- Check which workdays (Mon-Fri) have daily archives. If incomplete, offer to proceed with partial data or complete daily reviews first.

Proceed only when state is validated.

---

## Interactive Review

Guide the user through reflection on the week.

### Week Summary

Present a synthesized week overview: days reviewed, total meetings, total focus hours, energy trend, and priority completion rate. Ask if this feels accurate.

### Key Dates Check

Review key dates from the month:

**Status check:**
- Which key dates passed this week?
- Were deadlines met?
- Any dates requiring attention next week?

Surface upcoming dates from Month.md Key Dates section with countdown.

### Leadership Reflection

Review each day's leadership intention. For each, ask how well the user embodied it (1-10). Then synthesize: which intention served best, where did they struggle, what pattern emerges about being at their best.

Apply weekly coaching guidance from [coaching.md](../daily-review/coaching.md).

### Wins Synthesis

Guide through wins from daily archives, grouped by category:

- **Personal**: energy protection, boundaries, growth progress
- **Organisational**: team success, recognition opportunities
- **Strategic**: project progress, goal advancement

Ask which win they're most proud of. Identify a theme across all wins.

### Insights Synthesis

Review key insights from daily archives. Ask which feels most important to carry forward.

Look for patterns in What Went Well and What Could Be Better. Ask how to do more of what worked and what one change would address the biggest friction.

### People Review

Review 1:1 meetings and significant interactions. For each key person, ask for the main takeaway and whether follow-up is needed.

Prepare People file updates for confirmation.

### Coaching Check-in

Connect to growth edge and patterns to watch from directives. Ask where the growth edge showed up this week and what progress was made. Check if watched patterns emerged and what triggered them.

Self-care check: energy as the week closes, boundaries that served well, what to protect next week.

Apply weekly coaching guidance from [coaching.md](../daily-review/coaching.md).

### Forward Synthesis

Review carry-forward items from daily archives and Week.md. Ask which are still relevant.

Check for incomplete decisions. Ask what the focus theme should be for next week and what one thing would make it successful.

---

## Synthesis

Parallel subagents prepare semantic note updates based on the completed review:

- **People** — updates from 1:1 meetings and interactions
- **Projects** — updates from wins and priority completion
- **Insights** — updates from key learnings

Each returns structured proposals for user approval.

---

## Confirm

Present all proposed changes for approval:

- Archive destination (Periodic/Weekly/) and week summary
- Each semantic note update with target file, section, and content preview

Options:
- **Proceed all** — archive and apply all updates
- **Archive only** — skip semantic updates
- **Review each** — approve individually
- **Cancel** — exit (captured synthesis preserved in Week.md)

---

## Write

Execute confirmed writes:

- Archive Week.md content to Periodic/Weekly/
- Apply semantic note updates
- Update Week.md with archived placeholder

Report completion and suggest next steps:
- Weekly planning when ready
- Monthly review if end of month approaching
- Quarter.md updates if patterns emerged

If directives were not available, suggest running `/init`.

---

## Tips

- **Patterns over incidents**: look for recurring themes across days
- **Theme clarity**: one clear theme beats five vague ones
- **People matter**: take time to reflect on key relationships
- **Synthesis compounds**: weekly insights build on daily learnings
- **Forward focus**: use the review to set up next week's success

## Metabolic Flow

This ritual moves content through the knowledge metabolism:

```
Captive (volatile)     →    Periodic (archive)      →    Semantic (crystallized)
Week.md + Daily/*.md        Weekly/YYYY-Www.md          People/, Projects/,
                                                        Insights/
```

## Integration

- **daily-review**: Creates the daily archives that weekly-review synthesizes
- **weekly-planning**: Morning counterpart that creates Week.md
- **monthly-review**: Higher-level synthesis that uses weekly archives
- **get-week-content**: Sub-skill that parses Week.md structure
- **gather-week-context**: Sub-skill that collects daily archives
- **extract-to-areas**: Sub-skill that prepares semantic updates
- **archive-weekly**: Sub-skill that handles Captive → Periodic transition
