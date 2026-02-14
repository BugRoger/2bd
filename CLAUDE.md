# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Documentation

Comprehensive documentation is split into two human-readable files:

- **[README.md](README.md)** — User guide (installation, usage, concepts, integrations)
- **[DEVELOPING.md](DEVELOPING.md)** — Developer guide (architecture, creating skills, templates, GitHub workflow)

Reference these files for detailed information. This file contains Claude-specific instructions only.

## Documentation Maintenance

When making changes to 2bd, update documentation as instructed by the user:

**Update README.md when:**
- Installation or configuration process changes
- New user-facing features (rituals, actions users invoke)
- Vault structure changes
- Integration setup changes (calendar, GitHub)
- Anything a USER needs to know to use 2bd

**Update DEVELOPING.md when:**
- Skill architecture or patterns change
- New sub-skills or development patterns
- Template structure changes
- Naming conventions or path patterns change
- Anything a DEVELOPER needs to know to extend 2bd

**Both files:** Major architectural changes affecting both users and development.

---

## Claude-Specific Guidance

### Metabolic Interaction

When generating or placing content, consider its metabolic state:

| State | Guidance |
|-------|----------|
| **Captive** | High-velocity, volatile — "This belongs in Captive for active capture" |
| **Synthetic** | Active drafts — "This is a draft in progress" |
| **Periodic** | Archives — "This goes to Periodic as a permanent record" |
| **Semantic** | Crystallized knowledge — "This is evergreen reference material" |
| **Systemic** | Structure — "This is a template or SOP" |

### Loading Directives

User-facing skills should load directives as their first step. See [DEVELOPING.md](DEVELOPING.md#loading-directives-in-skills) for the pattern.

Apply directives throughout:
- Use `user.preferred_name` in greetings
- Reference `user.leadership_identity` for intentions
- Use `user.growth_edge` and `user.patterns_to_watch` for coaching
- Adapt tone based on `ai.formality`, `ai.directness`, `ai.humor`

### Graceful Degradation

If directives don't exist (user hasn't run `/init`), proceed with defaults and suggest running `/init` at the end.

### Key Paths

**Vault path:** Read from `.claude/config.md`

```markdown
vault_path: /Users/you/OneDrive/2bd-vault
```

**Use `$VAULT` prefix** when referencing vault files in skills and documentation.

**Engine paths:**
- Skills: `.claude/skills/`
- Scaffold: `scaffold/`
- Config: `.claude/config.md` (git-ignored)

**Vault paths:**
- Central Hub: `$VAULT/00_Brain/✱ Home.md`
- Working notes: `$VAULT/00_Brain/Captive/`
- Archives: `$VAULT/00_Brain/Periodic/`
- Templates: `$VAULT/00_Brain/Systemic/Templates/`
- Directives: `$VAULT/00_Brain/Systemic/Directives/`
