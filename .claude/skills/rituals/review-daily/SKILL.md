---
name: daily-review
description: Review and archive a day's work. Guides reflection on wins and insights, synthesizes learnings to semantic notes (People, Projects, Insights, Resources), and archives to Periodic. Accepts an optional target date (default: today).
argument-hint: "[target-date: today|yesterday|YYYY-MM-DD]"
---

# Daily Review

Evening ritual for reflecting on the day, completing wins and insights with personalized coaching, synthesizing learnings to semantic notes, and archiving to Periodic.

## Context

- Today.md file for the target date
- User's directives and preferences
- Week.md for weekly context
- Calendar events for the day (for meeting context)
- People files for anyone mentioned in meetings
- Active project files
- Existing daily archive if re-reviewing

---

## Validate

Read memory.md to see what context is available.

Load Today.md from vault (path in memory.md). Verify the note state before reviewing:

- Check date alignment between Today.md frontmatter and the target review date. If mismatched, ask which date to review.
- Check if an archive already exists for this date in Periodic/Daily/. If exists, offer to view or re-review.
- Check for an archived marker in Today.md frontmatter. If present, the day has already been archived.

If directives are unavailable, note that and proceed with limited coaching context.

Proceed only when state is validated.

---

## Session

Guide the user through reflection on the day. Load Week.md (path in memory.md) for coaching context.

### Check-in

Greet the user using their preferred name from directives.

Start with a brief energy check. Compare to the morning energy level from Today.md frontmatter. Note any shift.

### Upcoming Key Dates

If Week.md contains key dates within 7 days, surface them:

**Countdown reminder:**
```
⚠️ Upcoming Key Dates:
- [Event] — in [N] days [urgency]
```

Note any dates requiring prep this week.

### Priority Status

Review each priority from Today.md focus section:

- State the priority text and current completion status
- Ask: "How did this go? Completed / Partial / Deferred?"
- If partial or deferred, capture brief context for carry-forward

### Coached Wins

Apply coaching guidance from [coaching.md](coaching.md) in this directory. Generate contextual questions based on what actually happened—meetings, priorities, energy, captures—combined with development context from directives.

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

Connect insights to longer-term development patterns from directives and Week.md.

---

## Compose

Use Task tool to spawn parallel sub-skills for semantic note updates based on the completed review:

- **extract-to-areas** — Identify updates from 1:1 meetings and interactions for People files
- **update-semantic** — Prepare project updates from wins and priority completion
- **update-semantic** — Prepare insight notes from key learnings
- **update-semantic** — Prepare resource notes from captures (links, articles, ideas)

Each returns structured proposals for user approval.

---

## Confirm

Present all proposed changes for approval:

- Archive destination (Periodic/Daily/{date}.md) and day summary
- Each semantic note update with target file, section, and content preview

Options:
- **Proceed all** — archive and apply all updates
- **Archive only** — skip semantic updates
- **Review each** — approve individually
- **Cancel** — exit (captured wins/insights preserved in Today.md)

---

## Persist

Execute confirmed writes using sub-skills:

Use `archive-daily` sub-skill to move Today.md to Periodic/Daily/.

Use `update-semantic` sub-skill for each approved semantic note update.

Update Today.md with archived placeholder marker in frontmatter.

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

- **planning-daily**: Morning counterpart that creates Today.md
- **review-weekly**: Synthesizes daily archives into weekly patterns
- **archive-daily**: Sub-skill that handles Captive → Periodic transition
- **update-semantic**: Sub-skill that appends to semantic notes
- **extract-to-areas**: Sub-skill that identifies People file updates
