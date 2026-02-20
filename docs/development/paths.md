---
title: "Paths"
description: "Engine and vault path conventions."
---

## Engine paths

| Path | Purpose |
|------|---------|
| `.claude/config.md` | Vault path configuration (git-ignored) |
| `.claude/skills/` | All skills |
| `.claude/skills/init/assets/scaffold/` | Template copied to vault during init |

## Vault paths

Skills read vault path from `.claude/config.md`. Use `$VAULT` as prefix in documentation.

| Path | Purpose |
|------|---------|
| `$VAULT/00_Brain/✱ Home.md` | Central hub |
| `$VAULT/00_Brain/Captive/` | Working notes |
| `$VAULT/00_Brain/Periodic/` | Archives |
| `$VAULT/00_Brain/Systemic/Templates/` | Templates |
| `$VAULT/00_Brain/Systemic/Directives/` | User profile & AI personality |
| `$VAULT/00_Brain/Systemic/Coaching/` | Coaching prompts |

## Self-learning paths

Per-ritual paths created on first use:

| Path | Purpose |
|------|---------|
| `$VAULT/00_Brain/Synthetic/{ritual-name}/observations.md` | Raw observations |
| `$VAULT/00_Brain/Semantic/{ritual-name}/insights.md` | Crystallized insights |
