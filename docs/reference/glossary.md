---
title: "Glossary"
description: "Key terms and concepts in 2bd."
---

## Metabolic states

How notes are organized based on their activity level and volatility.

| Term | Definition |
|------|------------|
| **Captive** | Working notes with high-velocity, volatile intake. Lives in `00_Brain/Captive/`. Examples: Today.md, Week.md, Quarter.md |
| **Periodic** | Archived notes forming the permanent timeline. Lives in `00_Brain/Periodic/`. Examples: Daily/, Weekly/, Quarterly/ |
| **Semantic** | Crystallized knowledge and reference material. Lives in `00_Brain/Semantic/`. Contains insights extracted from rituals |
| **Synthetic** | Active drafts and works in progress. Lives in `00_Brain/Synthetic/`. Contains observations being processed |
| **Systemic** | Infrastructure: templates, directives, coaching. Lives in `00_Brain/Systemic/` |

See [Core concepts](/overview/concepts) for detailed explanation.

## Skills

| Term | Definition |
|------|------------|
| **Skill** | A Claude instruction set that performs a specific task. Lives in `.claude/skills/` |
| **Ritual** | A skill that runs on a schedule (daily, weekly, etc). Prefixed with `ritual-` |
| **Action** | A skill that runs on demand. No prefix |
| **Internal skill** | A sub-skill not user-facing. Prefixed with `_` |

See [Skills](/development/skills) for architecture details.

## Ritual concepts

| Term | Definition |
|------|------------|
| **Planning ritual** | Prepares Captive notes from templates. Runs at start of period |
| **Reflection ritual** | Archives Captive notes to Periodic. Runs at end of period |
| **Setup phase** | First ritual phase: loads context, validates prerequisites |
| **Core phase** | Main ritual phase: interactive session, creates artifacts |
| **Learning phase** | Final ritual phase: records observations for self-learning |
| **Template contract** | Declaration of which template sections a ritual updates |

See [Rituals](/development/rituals) for implementation details.

## Vault structure

| Term | Definition |
|------|------------|
| **Engine** | The 2bd system code. Git-tracked, lives in `~/Code/2bd-engine/` |
| **Vault** | Your personal notes and data. Cloud-synced, location configurable |
| **Hub** | Central navigation note marked with `✱` prefix. Examples: ✱ Home, ✱ Projects |
| **Directive** | Configuration file that personalizes Claude. Lives in `Systemic/Directives/` |
| **Template** | Starter structure for new notes. Lives in `Systemic/Templates/` |

See [Vault structure](/reference/vault-structure) for complete reference.

## File naming

| Term | Definition |
|------|------------|
| **End-date prefix** | Project naming using `YYYY-MM-DD-name.md` so deadlines sort first |
| **FirstNameL** | Person naming format: first name plus last initial. Example: `EstherS.md` |
| **Period format** | Date-based naming: `YYYY-MM-DD` (daily), `YYYY-Www` (weekly), `YYYY-QN` (quarterly) |

See [Naming conventions](/reference/naming-conventions) for complete rules.

## Self-learning

| Term | Definition |
|------|------------|
| **Observation** | A recorded pattern from ritual execution. Stored in Synthetic |
| **Cluster** | Grouped observations with semantic similarity |
| **Graduate** | When a cluster reaches maturity and becomes an insight |
| **Crystallize** | Converting graduated observations into Semantic knowledge |
| **Template evolution** | Applying crystallized insights to improve templates |

See [How it works](/overview/how-it-works#self-learning) for the learning cycle.
