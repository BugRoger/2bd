---
title: "Introduction"
description: "A personal knowledge system that runs itself—powered by Claude, driven by daily rituals, stored in markdown."
---

```
[BOOT_SEQUENCE]
> BIOMETRIC_SCAN.............. [MATCH]
> SYNCING_AUGMENT............. [100%]
> NEURAL_STORM_FILTER......... [ACTIVE]

 ____________________________________
|  ___   ___   ___                   |
| |__ \ | _ ) |   \   [SYSTEM_ON]    |
|  / __/| _ \ | |) |   v0.1.269      |
| |____||___/ |___/   [LINK_ACTIVE]  |
|____________________________________|
    |||   |||   |||
    `-----'-----'---[NEURAL_FEED]

> ALLOCATING_BUFFERS...
> MOUNTING: /mnt/brain/2bd/vault
> CONNECTING_TO_ADA........... [OK]
> STATUS: ONLINE

╭─────────────────────────────────────────────────────────────────╮
│ ADA://EXECUTIVE_ASSISTANT                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Morning. I'm Ada—your executive assistant.                     │
│                                                                 │
│  You have a very busy day. Six meetings, two deadlines,         │
│  and... oh. It's Valentine's Day.                               │
│                                                                 │
│  Did you make that dinner reservation?                          │
│                                                                 │
│  You forgot last year. Spent six months making up for it        │
│  with a habit-tracked chore list. Your journal entries from     │
│  that period were... let's say "rich with frustration."         │
│                                                                 │
│  Ever heard of "happy wife, happy life"? Just checking.         │
│                                                                 │
│  > SCANNING: Calendar ............. 6 conflicts detected        │
│  > SCANNING: Relationships ........ 1 anniversary flagged       │
│  > SCANNING: Goals ................ Q1 review overdue           │
│  > SCANNING: Journal .............. patterns identified         │
│                                                                 │
│  I've already prepped your daily brief. Want me to              │
│  reschedule that 4pm so you can leave early?                    │
│                                                                 │
│  Your move.                                                     │
│                                                                 │
╰─────────────────────────────────────────────────────────────────╯
```

# Second Brain Daemon

Most productivity systems fail because they depend on *you* to maintain them. Miss a few days, and everything falls out of date.

**2bd runs itself.** Daily rituals archive your notes, synthesize insights, and prepare tomorrow's workspace. You write in markdown files that sync to the cloud. Claude handles the housekeeping.

## Core architecture

Notes are organized by **metabolic state**—how active and volatile they are—rather than by topic.

| State | Purpose |
|-------|---------|
| `CAPTIVE` | Working notes — high-velocity, volatile intake |
| `SYNTHETIC` | Active drafts — projects in progress |
| `PERIODIC` | Archives — the permanent timeline |
| `SEMANTIC` | Reference — crystallized knowledge |
| `SYSTEMIC` | Structure — templates, workflows |

## Neural pathways

Time scales nest inside each other, each feeding into the next:

![Planning and review cycles across time scales](/images/how-it-works.svg)

Two rituals drive the system:

- **PLANNING** — Prepares your working notes from templates, synthesizes prior knowledge
- **REVIEW** — Archives working notes to Periodic, synthesizes forward

```bash
cd ~/Code/2bd-engine
claude skill run ritual-planning-daily   # morning cycle
claude skill run ritual-reflection-daily  # evening cycle
```

## System capabilities

- **Self-maintaining notes** — Rituals archive your working notes daily, so nothing falls out of date.
- **Synthesized insights** — The system learns your patterns and crystallizes insights over time.
- **Leadership coaching** — Daily intentions and coaching prompts integrated into your workflow.
- **Cloud-synced** — Works with OneDrive, iCloud, Dropbox. Your notes follow you everywhere.

## Jack in

- [Getting Started](/setup/installation) — Get 2bd running in five minutes
- [Meet Ada](/ada/how-it-works) — Your executive assistant and how she works
