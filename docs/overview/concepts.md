---
title: "Core concepts"
description: "The mental models that make 2bd work."
---

## Metabolic states

2bd organizes notes by **metabolic state**—how active and volatile they are—rather than by topic.

| State | Purpose | Location |
|-------|---------|----------|
| **Captive** | Working notes — high-velocity, volatile intake | `00_Brain/Captive/` |
| **Synthetic** | Active drafts — projects in progress | `00_Brain/Synthetic/` |
| **Periodic** | Archives — the permanent timeline | `00_Brain/Periodic/` |
| **Semantic** | Reference — crystallized knowledge | `00_Brain/Semantic/` |
| **Systemic** | Structure — templates, workflows | `00_Brain/Systemic/` |

### Why not organize by topic?

Traditional systems fail because:
- **Topics are subjective** — Where does a work project that affects your personal life go?
- **Topics multiply** — You end up with hundreds of folders
- **Topics hide stale notes** — Old notes never get reviewed

Metabolic states solve this by organizing around **information lifecycle**. Fresh notes go to Captive. Active work lives in Synthetic. Completed work archives to Periodic. The system moves information naturally without you deciding where things go.

## Rituals

Scheduled operations that drive the productivity loop.

**Planning rituals** — Forward-looking. Prepare Captive notes from templates.

**Reflection rituals** — Reflective. Archive Captive notes to Periodic.

See [How it works](/overview/how-it-works) for the full ritual cycle.

## Actions

One-shot helpers you invoke on demand (unlike rituals which follow a schedule).

| Action | Purpose |
|--------|---------|
| `init` | Bootstrap or configure vault |
| `create-project` | Initialize new project file |
| `archive-project` | Archive completed project |
| `onboard-person` | Create person dossier |

## Hubs

Central navigation notes marked with `✱` prefix:

| Hub | Purpose |
|-----|---------|
| ✱ Home | Central navigation |
| ✱ Projects | Active work overview |
| ✱ People | Relationship notes |
| ✱ Insights | Thematic learnings |

## Engine + Vault

2bd separates **system** (engine) from **content** (vault):

- **Engine** = Skills, docs — git-tracked, lives in `~/Code/2bd-engine/`
- **Vault** = Your notes, templates, archives — cloud-synced, lives wherever you want

Always run Claude from the engine directory. Your vault syncs independently.
