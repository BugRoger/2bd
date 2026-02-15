---
name: daily-review
description: Review and archive a day's work. Guides reflection on wins and insights, synthesizes learnings to semantic notes (People, Projects, Insights, Resources), and archives to Periodic. Accepts an optional target date (default: today).
argument-hint: "[target-date: today|yesterday|YYYY-MM-DD]"
metadata:
  orchestrated: true
  phases_file: phases.yaml
---

# Daily Review

Evening ritual for reflecting on the day, completing wins and insights with personalized coaching, synthesizing learnings to semantic notes, and archiving to Periodic.

## Flow

1. **Setup** — Load config, dates, directives
2. **Load** — Parse Today.md content and structure
3. **Pre-flight** — Verify note state, check for conflicts
4. **Interact** — Guide reflection (see [coaching.md](coaching.md))
5. **Synthesize** — Prepare semantic note updates (parallel)
6. **Confirm** — Present changes for approval
7. **Write** — Archive to Periodic, update semantic notes

---

## Pre-flight

Verify the note state before reviewing:

- Check date alignment between Today.md frontmatter and the target review date. If mismatched, ask which date to review.
- Check if an archive already exists for this date in Periodic/Daily/. If exists, offer to view or re-review.
- Check for an archived marker in Today.md frontmatter. If present, the day has already been archived.

Proceed only when state is validated.

---

## Interactive Review

Guide the user through reflection on the day.

### Check-in

Start with a brief energy check. Compare to the morning energy level from the frontmatter. Note any shift.

### Priority Status

Review each priority from the day's focus section:

- State the priority text and current completion status
- Ask: "How did this go? Completed / Partial / Deferred?"
- If partial or deferred, capture brief context for carry-forward

### Coached Wins

Apply coaching guidance from [coaching.md](coaching.md). Generate contextual questions based on what actually happened—meetings, priorities, energy, captures—combined with development context from directives.

Cover each wins category:
- Personal
- Organisational
- Strategic

### Coached Insights

Apply coaching guidance from [coaching.md](coaching.md). Look for patterns, themes, and energy trajectory.

Guide through:
- What Went Well
- What Could Be Better
- Key Insight

Connect insights to longer-term development.

---

## Synthesis

Parallel subagents prepare semantic note updates based on the completed review:

- **People** — updates from 1:1 meetings and interactions
- **Projects** — updates from wins and priority completion
- **Insights** — updates from key learnings
- **Resources** — updates from captures (links, articles, ideas)

Each returns structured proposals for user approval.

---

## Confirm

Present all proposed changes for approval:

- Archive destination (Periodic/Daily/) and day summary
- Each semantic note update with target file, section, and content preview

Options:
- **Proceed all** — archive and apply all updates
- **Archive only** — skip semantic updates
- **Review each** — approve individually
- **Cancel** — exit (captured wins/insights preserved in Today.md)

---

## Write

Execute confirmed writes:

- Archive Today.md content to Periodic/Daily/
- Apply semantic note updates
- Update Today.md with archived placeholder

Report completion and suggest next steps:
- Daily planning for tomorrow
- Quarter.md updates if patterns emerged
- New insight notes if warranted

If directives were not available, suggest running `/init`.

---

## Tips

- **Honesty over perfection**: capture what actually happened, not what you wanted to happen
- **Patterns over incidents**: look for recurring themes across days
- **Specificity wins**: "Great 1:1 with Sarah about career goals" beats "Good meetings"
- **Synthesis compounds**: updates to semantic notes build knowledge over time

## Metabolic Flow

This ritual moves content through the knowledge metabolism:

```
Captive (volatile)       →    Periodic (archive)    →    Semantic (crystallized)
Today.md                      Daily/YYYY-MM-DD.md        People/, Projects/,
                                                         Insights/, Resources/
```

## Integration

- **daily-planning**: Morning counterpart that creates Today.md
- **weekly-review**: Synthesizes daily archives into weekly patterns
- **get-today-content**: Sub-skill that parses Today.md structure
- **archive-daily**: Sub-skill that handles Captive → Periodic transition
- **update-semantic**: Sub-skill that appends to semantic notes
