---
title: "Introduction"
description: "A personal knowledge system that runs itself—powered by Claude, driven by daily rituals, stored in markdown."
---

# 2bd (Second Brain Daemon)

Most productivity systems fail because they depend on you to maintain them. Miss a few days, and everything falls out of date.

2bd runs itself. Daily **rituals** archive your notes, synthesize insights, and prepare tomorrow's workspace. You write in markdown files that sync to the cloud. Claude handles the housekeeping.

## Core philosophy

Notes are organized by **metabolic state**—how active and volatile they are—rather than by topic.

| State | Purpose |
|-------|---------|
| **Captive** | Working notes — high-velocity, volatile intake |
| **Synthetic** | Active drafts — projects in progress |
| **Periodic** | Archives — the permanent timeline |
| **Semantic** | Reference — crystallized knowledge |
| **Systemic** | Structure — templates, workflows |

## How it works

Time scales nest inside each other, each feeding into the next:

![Planning and review cycles across time scales](/images/how-it-works.svg)

Two rituals drive the system:

- **Planning** — Prepares your working notes from templates, synthesizes prior knowledge
- **Review** — Archives working notes to Periodic, synthesizes forward

```bash
cd ~/Code/2bd-engine
claude skill run ritual-planning-daily   # morning
claude skill run ritual-review-daily     # evening
```

## What you get

- **Self-maintaining notes** — Rituals archive your working notes daily, so nothing falls out of date.
- **Synthesized insights** — The system learns your patterns and crystallizes insights over time.
- **Leadership coaching** — Daily intentions and coaching prompts integrated into your workflow.
- **Cloud-synced** — Works with OneDrive, iCloud, Dropbox. Your notes follow you everywhere.

## Next steps

- [Quickstart](/quickstart) — Get 2bd running in five minutes.
- [Metabolic states](/concepts/metabolic-states) — Understand the core organizational principle.
