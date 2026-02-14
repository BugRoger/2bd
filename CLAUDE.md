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

### Orchestrated Skills

Skills with `metadata.orchestrated: true` in frontmatter use subagent orchestration via `phases.yaml`.

**Detecting orchestrated skills:**
```yaml
metadata:
  orchestrated: true
  phases_file: phases.yaml
```

**Executing orchestrated skills:**

1. Read `phases.yaml` from the skill's directory
2. Parse phase definitions and build dependency graph
3. Execute phases in topological order:

| Phase Type | Execution |
|------------|-----------|
| `inline: true` | Execute in main conversation context |
| `subagents: [...]` | Spawn via Task tool |
| `parallel: true` | Spawn all subagents simultaneously |

**Subagent type mapping:**
- `type: explore` → `subagent_type: "Explore"` (read-only)
- `type: general-purpose` → `subagent_type: "general-purpose"` (can write files)

**Variable interpolation:**
Replace `{{VARIABLE}}` patterns in args and markdown with values from the context store.

**Error handling:**
| Declaration | Behavior |
|-------------|----------|
| `optional: true` | Log warning, continue if subagent fails |
| `fallback: inline` | Execute skill in main context on failure |

**Example execution flow:**
```
Phase: setup (parallel)
├─ Task(explore): get-config → VAULT
├─ Task(explore): get-dates → DATES
└─ Task(explore): get-directives → DIRECTIVES

Phase: gather (depends_on: setup)
└─ Task(explore): get-calendar → CALENDAR

Phase: interact (inline)
└─ [User dialogue in main context]

Phase: write
└─ Task(general-purpose): captive-note
```

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
