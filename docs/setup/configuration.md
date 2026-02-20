---
title: "Configuration"
description: "Customize your vault, profile, and integrations."
---

After [installation](/setup/installation), configure your vault and profile to personalize 2bd.

## Vault path

The engine stores your vault path in `.claude/config.md` (git-ignored):

```markdown
vault_path: /Users/you/OneDrive/2bd-vault
```

To change your vault location, run the reconnect wizard:

```bash
claude skill run init --args "reconnect --vault=/new/path/to/vault"
```

## User profile

The initialization wizard creates [directives](/development/directives) in your vault:

| File | Purpose |
|------|---------|
| `user-profile.md` | Your name, role, goals, growth edge |
| `ai-personality.md` | Formality, directness, coaching style |

### Editing your profile

Run the profile wizard anytime:

```bash
claude skill run init --args "profile"
```

Or edit directives directly in your vault at `00_Brain/Systemic/Directives/`.

### Profile fields

**user-profile.md**:
- `preferred_name` — How Claude addresses you
- `role` — Your job title or primary role
- `leadership_identity` — How you see yourself as a leader
- `growth_edge` — What you're working to improve
- `patterns_to_watch` — Habits or tendencies to flag

**ai-personality.md**:
- `formality` — Casual to formal communication style
- `directness` — How blunt feedback should be
- `humor` — Dry, playful, minimal, or none
- `coaching_style` — Supportive, challenging, or balanced

## Calendar integration

Calendar integration (macOS only) pulls events into your daily planning ritual.

### Setup

1. Complete the [prerequisites](/setup/prerequisites) calendar authorization
2. Events automatically appear in `ritual-planning-daily`

### What gets pulled

- Today's meetings with times and attendees
- 1:1s trigger loading the person's dossier from `02_Areas/People/`
- All-day events and reminders

## Template customization

Templates live in your vault at `00_Brain/Systemic/Templates/`. After init, customize them freely.

See [Templates](/development/templates) for:
- Template locations and structure
- Standard sections and their purpose
- How rituals interact with templates

## Coaching prompts

Coaching prompts in `00_Brain/Systemic/Coaching/` guide ritual interactions:

| File | Used by |
|------|---------|
| `planning.md` | Planning rituals — intention setting |
| `review.md` | Review rituals — reflection prompts |
| `leadership.md` | Leadership coaching integration |

Edit these to customize how Claude coaches you through rituals.

## Related

- [Directives](/development/directives) — How directives personalize Claude
- [Templates](/development/templates) — Template structure and modification
- [Vault structure](/reference/vault-structure) — Complete vault organization
- [Core concepts](/overview/concepts) — Understanding metabolic states
