---
name: ritual-review-quarterly
description: Review and archive a quarter's work. Synthesizes monthly archives into quarterly patterns, guides reflection on outcomes and leadership growth, extracts insights to semantic notes, and archives to Periodic/Quarterly/. Accepts an optional target quarter (default: current quarter).
argument-hint: "[target-quarter: (empty)|this quarter|last quarter|YYYY-QN]"
metadata:
  orchestrated: true
---

# Quarterly Review

Evening ritual for synthesizing a quarter's work, reflecting on outcomes and leadership growth, extracting learnings to semantic notes, and archiving to Periodic/Quarterly/.

## Context

- Quarter.md file for the target quarter
- User's directives and preferences
- Monthly archives from Periodic/Monthly/
- Year.md for annual context
- Active project files
- Existing quarterly archive if re-reviewing

---

## Validate

Verify the quarter state before reviewing:

- Check date alignment between Quarter.md frontmatter and target review quarter. If mismatched, ask which quarter to review.
- Check if an archive already exists for this quarter in Periodic/Quarterly/. If exists, offer to view or re-review.
- Check for an archived marker in Quarter.md frontmatter. If present, the quarter has already been archived.
- Check which months have monthly archives. If incomplete, offer to proceed with partial data or complete monthly reviews first.

Proceed only when state is validated.

---

## Session

Guide the user through reflection on the quarter.

### Quarter Summary

Present a synthesized quarter overview: months reviewed, total outcomes completed, energy trends across months, major project milestones, and outcome completion rate. Ask if this feels accurate.

### Outcome Review

Review each key outcome from Quarter.md. For each, categorize as:

- **Completed** — fully achieved, celebrate the success
- **Partial** — progress made but not complete, identify what remains
- **Deferred** — moved to next quarter or dropped, understand why

Ask which outcome they're most proud of and which taught them the most.

### Coaching Themes Review

Connect to the coaching themes that were set for the quarter:

- **Patterns to Watch** — Which watched patterns showed up? Which improved or worsened?
- **Questions That Served** — Which coaching questions were most valuable? What new questions emerged?

Review avoided conversations trend across months. Identify any that persisted all quarter.

### Leadership Reflection

Apply quarterly coaching guidance from `$VAULT/00_Brain/Systemic/Coaching/review-quarterly.md`.

Connect to growth_edge and leadership_identity from directives:

- Where did the growth edge show up this quarter?
- How did you grow into your leadership identity?
- What was your biggest leadership moment?
- What leadership challenge surprised you?

Self-care reflection: energy as the quarter closes, what sustainable practices emerged, what to protect next quarter.

### Strategic Patterns

Look at patterns across the three months:

- **What worked** — Practices, rhythms, or approaches that delivered results
- **What didn't** — Friction points that persisted despite attention
- **What emerged** — Unexpected themes or opportunities that arose
- **What was missing** — Gaps in focus, relationships, or capabilities

Identify systemic patterns that need structural solutions vs. execution issues.

### Annual Checkpoint

Connect quarterly progress to annual goals:

- Which annual goals made progress this quarter?
- Are you on track for the year based on Q1-Qn progress?
- What needs to shift for the remaining quarters?
- Does the annual theme still resonate?

If off track, explore what would get back on track or whether goals need revision.

### Forward Setup

Review carry-forward items from monthly archives and Quarter.md. Ask which remain relevant for next quarter.

Identify strategic priorities that should anchor next quarter's planning. Ask what the focus theme should be and what one outcome would make it a successful quarter.

---

## Compose

Parallel subagents prepare semantic note updates based on the completed review:

- **People** — updates from quarter's interactions and relationship patterns
- **Projects** — updates from outcome completion and strategic progress
- **Insights** — updates from key learnings and pattern recognition

Each returns structured proposals for user approval.

---

## Persist

Execute confirmed writes:

- Apply semantic note updates
- Archive Quarter.md to Periodic/Quarterly/{quarter}.md. Transform the content into the archive format, ensuring the target directory exists. Write the file and verify the write succeeded. Call append-changelog to record the archival. Replace Quarter.md in Captive with an archived placeholder.

Report completion and suggest next steps:
- Quarterly planning when ready for next quarter
- Yearly review if end of year approaching
- Year.md updates if significant patterns emerged

If directives were not available, suggest running `/init`.

---

## Confirm

Present all proposed changes for approval:

- Archive destination (Periodic/Quarterly/) and quarter summary
- Each semantic note update with target file, section, and content preview

Options:
- **Proceed all** — archive and apply all updates
- **Archive only** — skip semantic updates
- **Review each** — approve individually
- **Cancel** — exit (captured synthesis preserved in Quarter.md)

---

## Tips

- **Outcomes over activities**: Focus on what was achieved, not just what was done
- **Strategic patterns**: Quarterly view reveals what's systemic vs. situational
- **Leadership growth**: Connect quarter progress to long-term development
- **Relationship investment**: Notice who got attention and who was neglected
- **Annual alignment**: Use the review to calibrate year progress
- **Sustainable pace**: Identify what enabled endurance vs. what caused burnout

## Metabolic Flow

This ritual moves content through the knowledge metabolism:

```
Captive (volatile)      →    Periodic (archive)       →    Semantic (crystallized)
Quarter.md + Monthly/*.md    Quarterly/YYYY-QN.md         People/, Projects/,
                                                          Insights/
```

## Integration

- **monthly-review**: Creates the monthly archives that quarterly-review synthesizes
- **quarterly-planning**: Morning counterpart that creates Quarter.md
- **yearly-review**: Higher-level synthesis that uses quarterly archives
- **get-quarter-content**: Sub-skill that parses Quarter.md structure
- **gather-quarter-context**: Sub-skill that collects monthly archives
- **extract-to-areas**: Sub-skill that prepares semantic updates
- **append-changelog**: Sub-skill that records archival events
