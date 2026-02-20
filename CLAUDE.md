# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Quick Reference

```bash
claude skill run ritual-planning-daily   # morning
claude skill run ritual-review-daily     # evening
claude skill run init --args "profile"   # update profile
claude skill run create-project          # new project
claude skill run archive-project         # archive completed project
```

## Documentation

- **[README.md](README.md)** — User guide (installation, usage, concepts)
- **[DEVELOPING.md](DEVELOPING.md)** — Developer guide (architecture, skills, templates)
- **[docs/](docs/)** — Authoritative conceptual documentation

## Authoritative Documentation

Files in `docs/` are the source of truth:

| File | Covers |
|------|--------|
| [docs/rituals.md](docs/rituals.md) | Ritual structure, template contracts, self-learning |

Read relevant docs before implementing features.

## Documentation Maintenance

**ALWAYS update README.md and DEVELOPING.md when making structural changes.** Check both files for outdated references after any change to paths, templates, skills, or vault structure.

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

### Diagram Maintenance

Diagrams in `docs/` visualize concepts from documentation. The image alt text serves as the source of truth—when alt text changes, regenerate the diagram.

| Diagram | Alt Text Contains | Update When |
|---------|-------------------|-------------|
| `how-it-works.svg` | Time scales, ritual purposes, Planning/Review flow | Alt text content changes |

**Process:**
1. Update the alt text in README.md to reflect new content
2. Edit the `.excalidraw.json` source file via subagent to match
3. Re-export to `.svg` for GitHub rendering
4. Both diagram files live in `docs/`

---

## Claude-Specific Guidance

### Git Worktrees

**ALWAYS use the `superpowers:using-git-worktrees` skill before starting any feature work or implementation.** This creates isolated worktrees that protect the main workspace from work-in-progress changes.

Use worktrees when:
- Implementing new features or enhancements
- Executing implementation plans
- Making changes that span multiple files
- Any work that benefits from isolation

The skill handles directory selection, branch creation, and safety verification automatically.

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
- Scaffold: `.claude/skills/init/assets/scaffold/` (copied to vault during init, then unused)
- Config: `.claude/config.md` (git-ignored)

**Vault paths (always reference these after init):**
- Central Hub: `$VAULT/00_Brain/✱ Home.md`
- Working notes: `$VAULT/00_Brain/Captive/`
- Archives: `$VAULT/00_Brain/Periodic/`
- Templates: `$VAULT/00_Brain/Systemic/Templates/`
- Directives: `$VAULT/00_Brain/Systemic/Directives/`
- Coaching: `$VAULT/00_Brain/Systemic/Coaching/` (planning.md, review.md, leadership.md)

**Self-learning paths (per ritual):**
- Observations: `$VAULT/00_Brain/Synthetic/{ritual-name}/observations.md`
- Insights: `$VAULT/00_Brain/Semantic/{ritual-name}/insights.md`

See [docs/rituals.md](docs/rituals.md) for the authoritative reference on ritual structure and self-learning.

**Scaffold vs Vault:** The scaffold is a template copied to the vault during `init`. After initialization, skills always read templates and content from the vault—never from the engine's scaffold. This lets users customize their templates without affecting the engine.

### Personal Configuration

- `.claude/config.md` — Vault path (git-ignored)
- `.claude/settings.local.json` — Personal Claude settings (git-ignored)
- `.claude.local.md` — Personal CLAUDE.md additions (if needed, git-ignored)
