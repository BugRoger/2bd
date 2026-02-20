---
name: ritual-review-weekly
description: Review and archive a week's work. Synthesizes daily archives into weekly patterns, guides reflection on leadership and themes, extracts insights to semantic notes (People, Projects, Insights), and archives to Periodic/Weekly/. Accepts an optional target week (default: current week).
argument-hint: "[target-week: (empty)|last week|YYYY-Www]"
metadata:
  orchestrated: true
---

# Weekly Review

Evening ritual for synthesizing a week's work, reflecting on leadership intentions and patterns, extracting learnings to semantic notes, and archiving to Periodic/Weekly/.

## Context

- Week.md for the target week
- All daily archive files for the week (workdays)
- User's directives and preferences
- Month.md for monthly context
- Quarter.md for quarterly coaching context
- Calendar events for the week (already past)
- People files mentioned in the week
- Project files mentioned in the week

---

## Validate

Load Week.md from vault. Verify the week state before reviewing:

- Check date alignment between Week.md frontmatter and target review week. If mismatched, ask which week to review.
- Check if an archive already exists for this week in Periodic/Weekly/. If exists, offer to view or re-review.
- Check for an archived marker in Week.md frontmatter. If present, the week has already been archived.
- Check which workdays (Mon-Fri) have daily archives available. If incomplete, offer to proceed with partial data or complete daily reviews first.

If directives are unavailable, note that and proceed with limited coaching context.

Proceed only when state is validated.

---

## Session

Greet the user using their preferred name from directives.

Guide the user through reflection on the week. Load daily archives from the vault.

### Week Summary

Present a synthesized week overview: days reviewed, total meetings, total focus hours, energy trend, and priority completion rate. Ask if this feels accurate.

### Key Dates Check

Load Month.md and review key dates:

**Status check:**
- Which key dates passed this week?
- Were deadlines met?
- Any dates requiring attention next week?

Surface upcoming dates from Month.md Key Dates section with countdown.

### Leadership Reflection

Review each day's leadership intention from daily archives. For each, ask how well the user embodied it (1-10). Then synthesize: which intention served best, where did they struggle, what pattern emerges about being at their best.

Apply weekly coaching guidance from `$VAULT/00_Brain/Systemic/Coaching/review-daily.md`.

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

Review 1:1 meetings and significant interactions from daily archives. For each key person, ask for the main takeaway and whether follow-up is needed.

Prepare People file updates for confirmation (load from the vault).

### Coaching Check-in

Load Quarter.md and connect to growth edge and patterns to watch from directives. Ask where the growth edge showed up this week and what progress was made. Check if watched patterns emerged and what triggered them.

Self-care check: energy as the week closes, boundaries that served well, what to protect next week.

Apply weekly coaching guidance from `$VAULT/00_Brain/Systemic/Coaching/review-daily.md`.

### Forward Synthesis

Review carry-forward items from daily archives and Week.md. Ask which are still relevant.

Check for incomplete decisions. Ask what the focus theme should be for next week and what one thing would make it successful.

---

## Compose

Use Task tool to spawn parallel sub-skills for semantic note updates based on the completed review:

- **extract-to-areas** — Identify People file updates from 1:1 meetings and interactions
- **update-semantic** — Prepare project updates from wins and priority completion
- **update-semantic** — Prepare insight notes from key learnings

Each returns structured proposals for user approval.

---

## Persist

Archive Week.md to Periodic/Weekly/{week}.md. Transform the content into the archive format, ensuring the target directory exists. Write the file and verify the write succeeded. Call append-changelog to record the archival with skill "review-weekly", action "Archived", summary "from Captive/Week.md".

Replace Week.md in Captive with an archived placeholder linking to the archive.

Use `update-semantic` sub-skill for each approved semantic note update.

Report completion and suggest next steps:
- Weekly planning when ready
- Monthly review if end of month approaching
- Quarter.md updates if patterns emerged

If directives were not available, suggest running `/init`.

---

## Confirm

Present all proposed changes for approval:

- Archive destination (Periodic/Weekly/{week}.md) and week summary
- Each semantic note update with target file, section, and content preview

Options:
- **Proceed all** — archive and apply all updates
- **Archive only** — skip semantic updates
- **Review each** — approve individually
- **Cancel** — exit (captured synthesis preserved in Week.md)

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

- **review-daily**: Creates the daily archives that review-weekly synthesizes
- **planning-weekly**: Morning counterpart that creates Week.md
- **review-monthly**: Higher-level synthesis that uses weekly archives
- **extract-to-areas**: Sub-skill that prepares semantic updates
- **update-semantic**: Sub-skill that appends to semantic notes
- **append-changelog**: Sub-skill that records archival in changelog
