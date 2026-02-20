---
title: "Rituals reference"
description: "Complete list of all rituals and when to run them."
---

## Planning rituals

| Ritual | Command | When | Prepares |
|--------|---------|------|----------|
| Daily | `ritual-planning-daily` | Morning | Today.md |
| Weekly | `ritual-planning-weekly` | Monday | Week.md |
| Monthly | `ritual-planning-monthly` | First of month | Month.md |
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
| Monthly | `ritual-review-monthly` | End of month | Periodic/Monthly/ |
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
# Always from engine directory
cd ~/Code/2bd-engine

# Pattern: claude skill run ritual-{type}-{period}
claude skill run ritual-planning-daily
claude skill run ritual-review-daily
```

## Ritual structure

Each ritual follows a three-phase pattern:

| Phase | Purpose |
|-------|---------|
| **Setup** | Load context, validate state, initialize |
| **Core** | Main ritual work (interactive or automated) |
| **Observe** | Record observations for self-learning |

## Template contracts

Rituals declare which sections they update. This ensures predictable behavior:

- **H2 sections are stable** — Rituals reference these, never change them
- **H3 structure is dynamic** — Can evolve through self-learning
- **Single ownership** — Each H2 has exactly one owning phase
