---
title: "Settings and Directives"
description: "Configure 2bd behavior and customize your experience"
---

After [installation](/configuration/installation), configure your vault and profile to personalize 2bd.

## Vault path

The engine stores your vault path in `.claude/config.md` (git-ignored):

```markdown
vault_path: /Users/you/OneDrive/2bd-vault
```

To change your vault location, update your profile:

```bash
/ada profile
```

## User profile

The initialization wizard creates directives in your vault:

| File | Purpose |
|------|---------|
| `human.md` | Your name, role, goals, growth edge |
| `ada.md` | Ada's personality, coaching style, communication preferences |

### Editing your profile

Update your profile anytime by asking Ada:

```bash
/ada profile
```

Or just say "Ada, let's update my profile."

Or edit directives directly in your vault at `00_Brain/Systemic/Directives/`.

### Profile fields

**human.md**:
- `preferred_name` - How Ada addresses you
- `role` - Your job title or primary role
- `leadership_identity` - How you see yourself as a leader
- `growth_edge` - What you are working to improve
- `patterns_to_watch` - Habits or tendencies to flag

**ada.md**:
- `character` - Who Ada is for you (work wife, sparring partner, mentor, etc.)
- `ego` - How much personality Ada shows
- `challenge` - How much Ada pushes back
- `celebration` - How Ada acknowledges wins
- `formality` - Casual to formal communication style
- `directness` - How blunt feedback should be
- `humor` - Dry, playful, minimal, or none

## Template customization

Templates live in your vault at `00_Brain/Systemic/Templates/`. After init, customize them freely.

See [Templates](/reference/templates) for:
- Template locations and structure
- Standard sections and their purpose
- How rituals interact with templates

## Coaching prompts

Coaching prompts in `00_Brain/Systemic/Coaching/` guide ritual interactions:

| File | Used by |
|------|---------|
| `planning.md` | Planning rituals - intention setting |
| `review.md` | Reflection rituals - reflection prompts |
| `leadership.md` | Leadership coaching integration |

Edit these to customize how Claude coaches you through rituals.

## Related

- [Templates](/reference/templates) - Template structure and modification
- [Vault structure](/reference/vault-structure) - Complete vault organization
- [How Ada Works](/ada/how-ada-works) - Understanding metabolic states
