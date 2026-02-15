# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Quick Reference

```bash
claude skill run rituals/planning-daily   # morning
claude skill run rituals/review-daily     # evening
claude skill run commands/init --args "profile"   # update profile
claude skill run commands/create-project          # new project
claude skill run commands/archive-project         # archive completed project
```

## Documentation

Comprehensive documentation is split into two human-readable files:

- **[README.md](README.md)** — User guide (installation, usage, concepts, integrations)
- **[DEVELOPING.md](DEVELOPING.md)** — Developer guide (architecture, creating skills, templates, GitHub workflow)

Reference these files for detailed information. This file contains Claude-specific instructions only.

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

### Prose-Driven Orchestration

Skills declare context needs in natural language. The orchestrator interprets these needs and coordinates fulfillment transparently.

**Detecting prose-driven skills:**

Skills with a "What I Need" section use prose-driven orchestration:

```markdown
## What I Need

- Calendar events for the day
- User's directives and preferences
- Week.md for weekly context
- People files for anyone with 1:1 meetings
- Active project files
```

**How orchestration works:**

1. **Session Creation** - Orchestrator creates temp directory: `/tmp/2bd-session-{skill}-{timestamp}/`
2. **Date Resolution** - Resolves time arguments (today, tomorrow, "next monday", YYYY-MM-DD) to concrete dates
3. **Need Interpretation** - Parses prose needs and determines fulfillment strategy:
   - "Calendar events" → spawn fetch-calendar sub-skill
   - "Week.md" / "Month.md" → resolve vault paths
   - "People files for 1:1s" → resolve from calendar + vault
   - "Active projects" → scan vault for project files
4. **Context Assembly** - Spawns sub-skills in parallel, builds `memory.md` with available context
5. **Inline Execution** - Executes skill prose with session directory available

**Session structure:**

```
/tmp/2bd-session-{skill}-{timestamp}/
├── memory.md              # Index of available context
├── dates.md               # Resolved time context (internal)
└── calendar.md            # External: fetched calendar events
```

**memory.md format:**

```markdown
# Session Memory: planning-daily (2026-02-17)

## External Data Available
### Calendar Events (calendar.md)
3 events fetched for 2026-02-17

## Vault Files Available
### Configuration
- **Directives**: /vault/00_Brain/Systemic/Directives/profile.md ✓

### Working Notes
- **Week.md**: /vault/00_Brain/Captive/Week.md ✓
- **Today.md**: (new - will create)

### People (from calendar 1:1s)
- **Sarah Chen**: /vault/02_Areas/People/Sarah Chen.md ✓
```

**Inline phases read context incrementally:**
- Start with memory.md (see what's available)
- Load external data (calendar.md)
- Load vault files as needed (direct Read with full paths)

**Benefits:**
- **No orchestration mechanics in skills** - pure declarative intent
- **Natural language** - describe what you need, not how to get it
- **Flexible fulfillment** - orchestrator chooses appropriate sub-skills
- **Incremental context loading** - only read what's needed

### Key Paths

**Vault path:** Read from `.claude/config.md`

```markdown
vault_path: /Users/you/OneDrive/2bd-vault
```

**Use `$VAULT` prefix** when referencing vault files in skills and documentation.

**Engine paths:**
- Skills: `.claude/skills/`
- Scaffold: `scaffold/`
- Templates: `scaffold/00_Brain/Systemic/Templates/`
- Config: `.claude/config.md` (git-ignored)

**Vault paths:**
- Central Hub: `$VAULT/00_Brain/✱ Home.md`
- Working notes: `$VAULT/00_Brain/Captive/`
- Archives: `$VAULT/00_Brain/Periodic/`
- Directives: `$VAULT/00_Brain/Systemic/Directives/`

### Personal Configuration

- `.claude/config.md` — Vault path (git-ignored)
- `.claude/settings.local.json` — Personal Claude settings (git-ignored)
- `.claude.local.md` — Personal CLAUDE.md additions (if needed, git-ignored)
