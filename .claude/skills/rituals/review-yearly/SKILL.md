---
name: yearly-review
description: Review and archive a year's work. Synthesizes quarterly archives into the year's narrative, guides reflection on annual goals and leadership journey, extracts insights to semantic notes, and archives to Periodic/Yearly/. Accepts an optional target year (default: current year).
argument-hint: "[target-year: (empty)|this year|last year|YYYY]"
metadata:
  orchestrated: true
---

# Yearly Review

Capstone ritual for synthesizing an entire year's work, reflecting on annual goal achievement and leadership evolution, extracting crystallized learnings to semantic notes, and archiving to Periodic/Yearly/.

## Context

- Year.md file for the target year
- User's directives and preferences
- Quarterly archives from Periodic/Quarterly/
- Active project files
- Existing yearly archive if re-reviewing

---

## Validate

Verify the year state before reviewing:

- Check date alignment between Year.md frontmatter and target review year. If mismatched, ask which year to review.
- Check if an archive already exists for this year in Periodic/Yearly/. If exists, offer to view or re-review.
- Check for an archived marker in Year.md frontmatter. If present, the year has already been archived.
- Check which quarters have quarterly archives. If incomplete, offer to proceed with partial data or complete quarterly reviews first.

Proceed only when state is validated.

---

## Session

Guide the user through reflection on the full year.

### Year Summary

Present a synthesized year overview: quarters reviewed, total outcomes completed across quarters, quarterly themes progression, major strategic milestones, and overall goal completion rate. Ask if this captures the year accurately.

### Goal Review

Review each annual goal from Year.md. For each goal, explore:

- **Achieved** — What made success possible? What impact did it have?
- **Partial** — How far did you get? What would completion have required?
- **Missed** — Why was it missed? Was it the right goal in hindsight?
- **Evolved** — Did the goal change shape during the year? Why?

Ask which goal they're most proud of achieving and which taught them the most regardless of outcome.

### Leadership Journey

This is the heart of yearly review—understanding how leadership identity evolved over twelve months.

Apply yearly coaching guidance from [coaching.md](coaching.md).

Connect to growth_edge and leadership_identity from directives:

- Where were you at the start of this year as a leader?
- How did your relationship with your growth edge evolve across quarters?
- What leadership capability became natural that once felt difficult?
- What moment defined your leadership this year?
- What surprised you about your own growth?
- Who would describe you differently as a leader than a year ago?

Review the key coaching moments from each quarter. Identify the through-line.

### What Defined This Year

Guide toward a one-paragraph narrative that captures the essence of this year:

- What was the central theme or through-line?
- What will you remember most?
- If you described this year in one sentence, what would it be?

This becomes the year's archived summary.

### Key Insights

Synthesize 3-5 crystallized learnings from the year:

- What did you learn that you'll carry forward forever?
- What changed how you think about leadership?
- What pattern became visible only with yearly perspective?
- What would you tell someone else based on this year?

These should be evergreen—insights that transcend this specific year.

### Wins Celebration

Before looking ahead, celebrate what was accomplished:

- Personal wins that mattered to you
- Organisational wins that made an impact
- Strategic wins that moved the needle

This year deserves acknowledgment.

### Looking Ahead

Frame what carries forward:

- What trajectory are you on?
- What momentum do you want to maintain?
- What do you want next year to be about?
- What one thing would make next year successful?

Connect to the emerging sense of next year's focus without overplanning.

---

## Compose

Parallel subagents prepare semantic note updates based on the completed review:

- **People** — updates from year's relationships and key interactions
- **Projects** — updates from annual progress and strategic outcomes
- **Insights** — updates from crystallized learnings and leadership development

Each returns structured proposals for user approval.

---

## Persist

Execute confirmed writes:

- Archive Year.md content to Periodic/Yearly/
- Apply semantic note updates
- Update Year.md with archived placeholder

Report completion and suggest next steps:
- Yearly planning when ready for the new year
- Multi-year reflection if significant milestones reached
- Share the year's narrative with relevant people if appropriate

If directives were not available, suggest running `/init`.

---

## Confirm

Present all proposed changes for approval:

- Archive destination (Periodic/Yearly/) and year summary
- Each semantic note update with target file, section, and content preview

Options:
- **Proceed all** — archive and apply all updates
- **Archive only** — skip semantic updates
- **Review each** — approve individually
- **Cancel** — exit (captured synthesis preserved in Year.md)

---

## Tips

- **Narrative over metrics**: A year tells a story, not just a scorecard
- **Leadership evolution**: The growth edge journey is the deepest insight
- **Quarterly patterns**: Look for what repeated vs. what changed
- **Gratitude**: Acknowledge what and who made the year possible
- **Honest assessment**: Clear-eyed review enables better next year
- **Crystallized learning**: Extract what's truly evergreen

## Metabolic Flow

This ritual moves content through the knowledge metabolism:

```
Captive (volatile)        →    Periodic (archive)       →    Semantic (crystallized)
Year.md + Quarterly/*.md      Yearly/YYYY.md              People/, Projects/,
                                                           Insights/
```

## Integration

- **quarterly-review**: Creates the quarterly archives that yearly-review synthesizes
- **yearly-planning**: Morning counterpart that creates Year.md
- **get-year-content**: Sub-skill that parses Year.md structure
- **gather-year-context**: Sub-skill that collects quarterly archives
- **extract-to-areas**: Sub-skill that prepares semantic updates
- **archive-yearly**: Sub-skill that handles Captive -> Periodic transition
