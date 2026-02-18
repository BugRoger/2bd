---
name: daily-review
description: Review and archive a day's work. Guides reflection on wins and insights, synthesizes learnings to semantic notes (People, Projects, Insights, Resources), and archives to Periodic. Accepts an optional target date (default: today).
argument-hint: "[target-date: today|yesterday|YYYY-MM-DD]"
metadata:
  orchestrated: true
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
- Planning insights file for observation synthesis

---

## Validate

Load Today.md for the target date. Verify the note state before reviewing:

- Check date alignment between Today.md frontmatter and the target review date. If mismatched, ask which date to review.
- Check if an archive already exists for this date in Periodic/Daily/. If exists, offer to view or re-review.
- Check for an archived marker in Today.md frontmatter. If present, the day has already been archived.

If directives are unavailable, note that and proceed with limited coaching context.

Proceed only when state is validated.

---

## Session

Guide the user through reflection on the day. Load Week.md for coaching context.

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

Apply coaching guidance from `$VAULT/00_Brain/Systemic/Coaching/review-daily.md`. Generate contextual questions based on what actually happened—meetings, priorities, energy, captures—combined with development context from directives.

Cover each wins category:
- Personal
- Organisational
- Strategic

### Coached Insights

Apply coaching guidance from `$VAULT/00_Brain/Systemic/Coaching/review-daily.md`. Look for patterns, themes, and energy trajectory.

Guide through:
- What Went Well
- What Could Be Better
- Key Insight

Connect insights to longer-term development patterns from directives and Week.md.

---

## Compose

Review the completed session content.

**Semantic note updates:**

- Extract People file updates from 1:1 meetings and interactions
- Prepare project updates from wins and priority completion
- Prepare insight notes from key learnings
- Prepare resource notes from captures (links, articles, ideas)

**Planning insights synthesis:**

Compare Today.md with the generated version (if available in changelog):
- What sections were filled vs left empty?
- What was modified from generated content?
- What was added that wasn't in the template?
- What phrasing did the user prefer?

Load `00_Brain/Systemic/Insights/planning-daily.md` and:
1. Append new observations to Observations Log
2. Look for patterns across recent observations
3. Propose insight updates if patterns emerge
4. Propose template changes if high confidence

Present proposed updates for user approval.

Transform Today.md into archive format:
- Preserve all frontmatter with final energy and completion status
- Keep all sections (Context From Above, Focus, Meetings, Capture, Wins, Insights)
- Preserve all meeting notes and 1:1 context
- Include the full Changelog section

---

## Persist

Execute confirmed semantic note updates.

Archive Today.md to Periodic/Daily/{date}.md. Transform the content into the archive format, ensuring the target directory exists. Write the file and verify the write succeeded. Call append-changelog to record the archival with skill "review-daily", action "Archived", summary "from Captive/Today.md".

Replace Today.md in Captive with an archived placeholder (substitute {date} with the target date in YYYY-MM-DD format):
```markdown
---
archived: {date}
---

# Archived

This day has been archived to [[00_Brain/Periodic/Daily/{date}]].

Run `/daily-planning` to start a new day.
```

Report completion and suggest next steps:
- Daily planning for tomorrow
- Quarter.md updates if patterns emerged
- New insight notes if warranted

If directives were not available, suggest running `/init`.

---

## Confirm

Present a summary of what was done:
- Archive location (Periodic/Daily/{date}.md)
- Day summary (energy, priorities completed, key wins)
- Each semantic note update with target file and content preview

The user has already approved during the session, this is verification after completion.

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
- **append-changelog**: Records modifications in file changelog sections
