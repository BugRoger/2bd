---
title: "Rituals"
description: "Scheduled operations that drive the productivity loop."
---

Rituals are the engine of 2bd. They prepare your workspace and archive your work at regular intervals.

## Two types of rituals

**Planning rituals** — Forward-looking. Prepare Captive notes from templates. Run in the morning (or start of period).

**Review rituals** — Reflective. Archive Captive notes to Periodic. Run in the evening (or end of period).

## The ritual cycle

| Period | Planning | Review |
|--------|----------|--------|
| Daily | Morning — Prepare Today.md | Evening — Archive to Daily/ |
| Weekly | Monday — Prepare Week.md | Sunday — Archive to Weekly/ |
| Monthly | First of month — Prepare Month.md | End of month — Archive to Monthly/ |
| Quarterly | Start of quarter — Prepare Quarter.md | End of quarter — Archive to Quarterly/ |
| Yearly | January — Prepare Year.md | December — Archive to Yearly/ |

## Running rituals

```bash
# Always run from the engine directory
cd ~/Code/2bd-engine

# Daily rituals
claude skill run ritual-planning-daily
claude skill run ritual-review-daily

# Weekly rituals
claude skill run ritual-planning-weekly
claude skill run ritual-review-weekly

# Monthly, quarterly, yearly follow the same pattern
claude skill run ritual-planning-monthly
claude skill run ritual-review-monthly
```

## What rituals do

### Planning rituals

1. **Load context** — Read prior archives, calendar events, active projects
2. **Prepare workspace** — Create Captive note from template
3. **Synthesize forward** — Pull relevant information from prior periods
4. **Set intention** — Help you establish priorities and leadership focus

### Review rituals

1. **Capture reflection** — Guide you through wins, insights, carry-forward items
2. **Archive** — Move Captive note to Periodic with proper naming
3. **Extract insights** — Update People/, Projects/, Insights/ as needed
4. **Learn** — Record observations about your patterns for template evolution

## Self-learning

Rituals learn from your behavior through an observation pipeline:

1. **Diff analysis** — Compare output against template
2. **Session review** — Track interaction patterns
3. **Clustering** — Group similar observations
4. **Graduation** — Stable patterns mature automatically
5. **Crystallization** — You synthesize insights from patterns
6. **Template evolution** — Insights update templates

This means your templates evolve to match how you actually work.

> **Note:** Self-learning happens in the background during the Observe phase. You don't need to do anything special—just run your rituals consistently.
