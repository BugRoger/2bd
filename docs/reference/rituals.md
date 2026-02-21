---
title: "Rituals reference"
description: "Complete list of all rituals and when to run them."
---

## Quick reference

```bash
# Planning (start of period)
claude skill run ritual-planning-daily     # Morning
claude skill run ritual-planning-weekly    # Monday
claude skill run ritual-planning-quarterly # Start of Q
claude skill run ritual-planning-yearly    # January

# Review (end of period)
claude skill run ritual-review-daily       # Evening
claude skill run ritual-review-weekly      # Sunday
claude skill run ritual-review-quarterly   # End of Q
claude skill run ritual-review-yearly      # December
```

## Planning rituals

| Ritual | Command | When | Prepares |
|--------|---------|------|----------|
| Daily | `ritual-planning-daily` | Morning | Today.md |
| Weekly | `ritual-planning-weekly` | Monday | Week.md |
| Quarterly | `ritual-planning-quarterly` | Start of quarter | Quarter.md |
| Yearly | `ritual-planning-yearly` | January | Year.md |

### What planning rituals do

1. Load context from higher timescales
2. Fetch calendar events (if configured)
3. Create/update Captive note from template
4. Synthesize relevant information from prior periods
5. Prompt for intention setting

## Review rituals

| Ritual | Command | When | Archives to |
|--------|---------|------|-------------|
| Daily | `ritual-review-daily` | Evening | Periodic/Daily/ |
| Weekly | `ritual-review-weekly` | Sunday | Periodic/Weekly/ |
| Quarterly | `ritual-review-quarterly` | End of quarter | Periodic/Quarterly/ |
| Yearly | `ritual-review-yearly` | December | Periodic/Yearly/ |

### What review rituals do

1. Guide reflection on the period
2. Archive Captive note to Periodic
3. Extract insights to People/, Projects/, Insights/
4. Record observations for self-learning
5. Prepare carry-forward items

## Running rituals

```bash
# Pattern: claude skill run ritual-{type}-{period}
claude skill run ritual-planning-daily
claude skill run ritual-review-daily
```

## Related

- [Rituals development](/development/rituals) — Creating custom rituals
- [How it works](/overview/how-it-works) — The ritual cycle explained
- [Actions reference](/reference/actions) — One-shot commands

