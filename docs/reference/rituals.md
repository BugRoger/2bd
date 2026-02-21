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

# Reflection (end of period)
claude skill run ritual-reflection-daily       # Evening
claude skill run ritual-reflection-weekly      # Sunday
claude skill run ritual-reflection-quarterly   # End of Q
claude skill run ritual-reflection-yearly      # December
```

## Planning rituals

| Ritual | Command | When | Prepares | GPS Components |
|--------|---------|------|----------|----------------|
| Daily | `ritual-planning-daily` | Morning | Today.md | 1-3-5 |
| Weekly | `ritual-planning-weekly` | Monday | Week.md | Balanced Week Blueprint |
| Quarterly | `ritual-planning-quarterly` | Start of quarter | Quarter.md | Quest, Major Moves, 80% Check, Crystal Ball |
| Yearly | `ritual-planning-yearly` | January | Year.md | Life Compass, 3-Year Sketch, Why, Anti-Goals |

### What planning rituals do

1. Load context from higher timescales
2. Fetch calendar events (if configured)
3. Create/update Captive note from template
4. Synthesize relevant information from prior periods
5. Prompt for intention setting

## Reflection rituals

| Ritual | Command | When | Archives to |
|--------|---------|------|-------------|
| Daily | `ritual-reflection-daily` | Evening | Periodic/Daily/ |
| Weekly | `ritual-reflection-weekly` | Sunday | Periodic/Weekly/ |
| Quarterly | `ritual-reflection-quarterly` | End of quarter | Periodic/Quarterly/ |
| Yearly | `ritual-reflection-yearly` | December | Periodic/Yearly/ |

### What reflection rituals do

1. Guide reflection on the period
2. Archive Captive note to Periodic
3. Extract insights to People/, Projects/, Insights/
4. Record observations for self-learning
5. Prepare carry-forward items

## Running rituals

```bash
# Pattern: claude skill run ritual-{type}-{period}
claude skill run ritual-planning-daily
claude skill run ritual-reflection-daily
```

## Related

- [Rituals development](/development/rituals) — Creating custom rituals
- [How it works](/overview/how-it-works) — The ritual cycle explained
- [GPS methodology](/overview/gps-methodology) — Goal, Plan, System framework
- [Templates reference](/reference/templates) — What each template contains
- [Actions reference](/reference/actions) — One-shot commands

