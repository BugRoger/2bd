---
title: "Daily workflow"
description: "The morning and evening rhythm that keeps your system running."
---

## Morning routine

1. **Run planning ritual**

   ```bash
   cd ~/Code/2bd-engine
   claude skill run ritual-planning-daily
   ```

   This prepares Today.md with:
   - Context from Week/Month/Quarter
   - Calendar events (if configured)
   - Leadership intention prompt
   - Key outcomes framework

2. **Open Today.md in Obsidian**

   Use `Cmd+Shift+D` or navigate to `00_Brain/Captive/Today.md`.

   Review what the ritual prepared and add your own priorities.

3. **Set your intention**

   The Leadership Intention section prompts you to consider how you want to show up today. This takes 30 seconds and shapes your mindset.

## Throughout the day

Write in Today.md as you work:

- **Meetings** — Notes, decisions, action items
- **1:1s** — Conversations with reports and peers (rituals extract to People/)
- **Completed work** — Check off tasks, note wins
- **Capture** — Ideas, observations, things to follow up

> **Tip:** Don't organize as you capture. Just write. The review ritual handles organization.

## Evening routine

1. **Complete Today.md sections**

   Fill in:
   - **Wins** — What went well (Personal, Organisational, Strategic)
   - **Reflections** — Key insights and learnings
   - **Carry Forward** — Items for tomorrow

2. **Run review ritual**

   ```bash
   claude skill run ritual-review-daily
   ```

   This:
   - Archives Today.md to `Periodic/Daily/YYYY-MM-DD.md`
   - Extracts 1:1 notes to People/
   - Updates project status
   - Records observations for self-learning

## Time investment

| Activity | Time |
|----------|------|
| Morning planning | 5-10 minutes |
| Writing throughout day | As needed |
| Evening review | 5-10 minutes |

The rituals do the heavy lifting. Your job is to write and reflect.

## Common patterns

### Missed a day?

Run the review ritual anyway. It handles gaps gracefully.

### Multiple days behind?

Run review for each day in sequence, or just start fresh with today's planning ritual. The system is forgiving.

### Traveling or on vacation?

Skip rituals guilt-free. When you return, run the review for whatever you captured (even if incomplete) and start fresh.
