---
title: "Directives"
description: "How directives personalize Claude's behavior."
---

## Directive files

Located in `$VAULT/00_Brain/Systemic/Directives/`:

| File | Purpose |
|------|---------|
| `user-profile.md` | WHO you are — name, role, goals, growth edge |
| `ai-personality.md` | HOW Claude communicates — tone, coaching style |

## Loading directives in skills

Rituals load directives in their Setup phase (`00-setup.md`).

**Usage:**
- Use `user.preferred_name` in greetings
- Reference `user.leadership_identity` for intentions
- Use `user.growth_edge` and `user.patterns_to_watch` for coaching
- Adapt tone based on `ai.formality`, `ai.directness`, `ai.humor`

## Graceful degradation

If directives don't exist, proceed with defaults and suggest running `/init` at the end.
