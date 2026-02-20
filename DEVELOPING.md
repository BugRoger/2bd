# Developing 2bd

This guide is for extending 2bd with new skills, rituals, and integrations.

For user documentation, see [README.md](README.md).

---

## Architecture

### Metabolic State System

The note-taking architecture mirrors human cognitive biology. Information is categorized by its metabolic state:

| State | Purpose | User Writes | Rituals Write |
|-------|---------|-------------|---------------|
| **Captive** | Sensory/Intake — high-velocity, volatile working notes | Yes | Planning rituals prepare |
| **Synthetic** | Short-term/Executive — active project work, drafts | Yes | No |
| **Periodic** | Episodic/Rhythm — timeline archives (the heartbeat) | No | Review rituals archive |
| **Semantic** | Long-term/Reference — crystallized knowledge | Yes | Rituals may suggest |
| **Systemic** | Procedural/Structure — templates, SOPs, workflows | Setup only | No |

### Synthesis Workflow

```
Captive (User writes)              Periodic (Rituals archive)
─────────────────────              ─────────────────────────
Captive/                           Periodic/
├── Today.md   ──review──►         ├── Daily/YYYY-MM-DD.md
├── Week.md    ──review──►         ├── Weekly/YYYY-Www.md
├── Month.md   ──review──►         ├── Monthly/YYYY-MM.md
├── Quarter.md ──review──►         ├── Quarterly/YYYY-QN.md
└── Year.md    ──review──►         └── Yearly/YYYY.md

                                   Areas/ (Rituals extract)
People/   ◄── rituals extract 1:1s
Projects/ ◄── rituals update status
Insights/ ◄── rituals synthesize themes
```

### Skill Architecture

Skills use a flat structure with naming conventions:

```
.claude/skills/
├── ritual-planning-daily/        # Rituals: ritual- prefix
│   ├── SKILL.md
│   └── references/
├── ritual-review-weekly/
├── init/                         # Commands: no prefix
├── create-project/
├── _fetch-calendar/              # Internal: _ prefix
└── _resolve-references/
```

**Naming Conventions:**
- **Rituals** (`ritual-*`) — Scheduled routines that drive the engine
- **Commands** (no prefix) — Discrete one-shot helpers triggered on-demand
- **Internal** (`_*`) — Sub-skills and dev tools (not user-facing)

**Auxiliary Files:**

The scaffold (`.claude/skills/init/assets/scaffold/`) contains the initial vault template copied during init. After initialization, skills reference the vault directly. The scaffold includes:
- `00_Brain/Systemic/Coaching/` — Coaching prompts and guidance
- `00_Brain/Systemic/Config/` — Configuration schemas and defaults
- `00_Brain/Systemic/Templates/` — Template files for all note types

---

## Repository Structure

```
2bd-engine/
├── .claude/
│   ├── config.md             # Vault path configuration (git-ignored)
│   └── skills/               # Flat skill structure
│       ├── ritual-planning-daily/
│       ├── ritual-planning-weekly/
│       ├── ritual-review-daily/
│       ├── ritual-review-weekly/
│       ├── init/
│       │   ├── SKILL.md
│       │   └── assets/scaffold/  # Copied to vault during init
│       ├── create-project/
│       ├── archive-project/
│       ├── _fetch-calendar/
│       └── _resolve-references/
│
├── README.md                 # User documentation
├── DEVELOPING.md             # This file
└── CLAUDE.md                 # Claude-specific instructions
```

**Scaffold → Vault:** During `init`, the scaffold is copied to the user's vault. After that, skills always reference the vault—templates, coaching prompts, and config all live in the vault, not the engine.

---

## Creating Skills

### Skill Writing Style

Skills should read as plain prose describing *what happens*, not scripts with execution directives.

**Do:**
- Write descriptive prose: "Load the vault path from context. Validate the structure exists."
- Organize into sections describing the flow: Context, Validate, Session, Compose, Persist, Confirm
- Reference context naturally: "Review the calendar", "Load Week.md"
- Keep skills scannable — a reader should understand the flow without running it

**Don't:**
- Use template syntax: `{{VAULT}}`, `{{#if}}`, `{{#each}}`
- Use phase markers: `<!-- phase:name -->`
- Use imperative directives: "Ask:", "Check:", "Write:", numbered steps
- Include bash code blocks for file operations
- Embed file structure examples inline (reference templates instead)

**Example — Before (bad):**
```markdown
### 1. Get Vault Path

Check for `--vault=` argument, otherwise ask:

"Where should I create your vault?"

Store as `$VAULT`.

### 2. Validate Path

- Ensure parent directory exists
- Warn if path is inside a git repo: "This path appears to be inside a git repository."
```

**Example — After (good):**
```markdown
### Vault Path

Get the vault path from `--vault=` argument or ask the user. The path should be a folder that syncs (OneDrive, iCloud, Dropbox).

Validate the path exists. Warn if inside a git repo (vaults should not be in repos).
```

**Guideline:** If someone can read your SKILL.md and understand the workflow without template noise, you've done it right.

### Skill File Structure

Each skill is in its own folder with:
- **`SKILL.md`** (required) — Main skill definition with YAML frontmatter and instructions
- Optional supporting files (templates, examples, config)

**SKILL.md format:**

```markdown
---
name: skill-name
description: What this skill does and when to use it
disable-model-invocation: false  # true for manual-only
allowed-tools: Read, Write, Bash(*)
argument-hint: "[argument description]"
---

# Skill Instructions

Instructions Claude follows when invoked.
```

### Creating Rituals

Rituals are scheduled routines. They prepare or archive Captive notes.

1. Create skill file `.claude/skills/ritual-{planning|review}-{period}.md`
   - **Planning rituals** — Forward-looking (prepare Captive from templates)
   - **Review rituals** — Reflective (archive Captive to Periodic)

2. Add YAML frontmatter:
   ```yaml
   ---
   name: ritual-planning-weekly
   description: Prepare Week.md with weekly focus and priorities
   disable-model-invocation: true  # Manual trigger only
   allowed-tools: Read, Write, Bash(*)
   ---
   ```

3. Document the ritual flow and expected outcomes

4. Test: `claude skill run ritual-planning-weekly`

### Creating Actions

Actions are one-shot helpers invoked on-demand.

1. Create skill file `.claude/skills/{action-name}.md` (no prefix)

2. Add YAML frontmatter:
   ```yaml
   ---
   name: create-project
   description: Initialize a new project file with end-date prefix
   disable-model-invocation: false  # Allow auto-invocation
   allowed-tools: Read, Write
   argument-hint: "Project Name"
   ---
   ```

3. Write clear `description` so Claude knows when to use it

4. Test: `claude skill run create-project --args "Project Name"`

### Creating Internal Skills

Internal skills (sub-skills, dev tools) are composable building blocks. Underscore prefix (`_`) signals internal/not user-facing.

**Current Internal Skills:**

| Category | Purpose | Examples |
|----------|---------|----------|
| `_fetch-calendar` | External calendar API access | Calendar events via ekctl |
| `_resolve-references` | Wikilink and embed resolution | Resolve `[[wikilinks]]` |

**Creating:**

1. Create skill folder `.claude/skills/_{skill-name}/SKILL.md`

2. Add YAML frontmatter:
   ```yaml
   ---
   name: _fetch-calendar
   description: Fetch calendar events for a date using ekctl
   disable-model-invocation: true  # Not user-facing
   allowed-tools: Read, Bash(ekctl *)
   ---
   ```

3. Keep scope narrow — one well-defined operation per skill

4. Design for composition: stateless input/output, minimal side effects

5. Return structured output when appropriate (not all internal skills need JSON)

---

### Ritual Structure

Rituals follow a canonical structure with SKILL.md as the table of contents and separate phase files.

#### File Organization

```
.claude/skills/ritual-{type}-{period}/
├── SKILL.md                    # Table of contents + frontmatter
└── references/
    ├── 00-setup.md             # Context loading, validation
    ├── 10-core.md              # Main ritual logic
    ├── 20-observe.md           # Self-learning observations
    └── template-contract.md    # Template structure spec
```

#### The Three Phases

| Phase | File | Purpose |
|-------|------|---------|
| **Setup** | `00-setup.md` | Load context, validate state, handle edge cases |
| **Core** | `10-core.md` | Interactive session, compose artifacts, persist |
| **Observe** | `20-observe.md` | Record observations for self-learning |

**Setup** loads directives, calendar, vault files, and validates prerequisites (existing files, dates, etc.).

**Core** contains the main ritual logic — greeting, conversation, artifact composition, and persistence.

**Observe** records raw observations about user behavior and ritual effectiveness for later synthesis.

#### Template Contract

Each ritual has a `template-contract.md` that defines:
- Which template it uses
- Required sections
- Optional sections
- Section update rules

This contract ensures rituals interact with templates predictably.

#### Full Documentation

See [docs/rituals.md](docs/rituals.md) for the complete reference on:
- Ritual lifecycle and phases
- Template contracts
- Self-learning system (observations → insights)
- Coaching integration

---

### Creating Dev Skills

Dev skills are for engine maintenance. Use underscore prefix (`_`) like other internal skills.

1. Create skill file `.claude/skills/_{dev-skill-name}.md`

2. Add YAML frontmatter:
   ```yaml
   ---
   name: _sync-templates
   description: Bidirectional sync between scaffold and vault templates
   disable-model-invocation: true
   allowed-tools: Read, Write, Bash(diff *)
   ---
   ```

3. Test: `claude skill run _sync-templates`

**_sync-templates workflow:**
- Compares templates between vault (`$VAULT/00_Brain/Systemic/Templates/`) and scaffold
- Shows diff for each changed file
- Prompts per-file: `← Pull` (vault → scaffold), `→ Push` (scaffold → vault), or `Skip`
- Use this when developing new template features to sync changes back to the scaffold

---

## Template Structure

Templates live in the vault at `$VAULT/00_Brain/Systemic/Templates/` (copied from scaffold during init):

- **Captive/** — Templates for working notes (today.md, week.md, month.md, quarter.md, year.md)
- **Periodic/** — Templates for archive notes (daily.md, weekly.md, monthly.md, quarterly.md, yearly.md)
- **Projects/** — project.md
- **Areas/People/** — person.md

**Scaffold vs Vault:** The scaffold (`.claude/skills/init/assets/scaffold/`) is the source template for new vaults. After init, users customize their vault's templates. Use `_sync-templates` to propagate changes between vault and scaffold during development.

### Standard Sections

All Captive templates follow a consistent structure:

1. **Context From Above** — Shows parent timescale goals (e.g., Week.md shows Month/Quarter themes)
2. **Key Outcomes** — 3 priorities using Personal → Organisational → Strategic framework
3. **Progress tracking** — Nested period summaries
4. **Coaching Check-in** — Self-reflection prompts (week.md, month.md)
5. **Carry Forward** — Items to move to next period
6. **Wins** — Personal → Organisational → Strategic categories
7. **Reflections** — What went well, what could be better, key insights
8. **Changelog** — Audit trail of ritual modifications (at bottom of every note)

### Changelog Section

Every note template includes a `## Changelog` section at the bottom that tracks when rituals modify the file.

**Entry format:**
```
- `2026-02-15 09:32` **planning-daily** — Rewrote Focus, Context From Above sections
```

**Components:**
- Backtick timestamp: `YYYY-MM-DD HH:mm` (24-hour)
- Bold skill name: `**skill-name**`
- Em-dash separator: ` — `
- Action and affected sections

**Order:** Most recent entries at top (reverse chronological).

**Integration:** Write skills (`write-captive-note`, `update-semantic`, `project-sync-vault`) call `append-changelog` after modifying files. Pass:
- `skill`: Name of the calling skill
- `action`: Verb describing the change (Rewrote, Added, Archived, Created)
- `sections`: Comma-separated list of affected sections (optional)

### The Three Categories

Order matters — Personal first counters "putting yourself last":

| Category | Focus | Examples |
|----------|-------|----------|
| **Personal** | Individual growth, energy, leadership | Executive presence, boundaries, habits |
| **Organisational** | Team, structure, culture, people | Hiring, delegation, team health |
| **Strategic** | Initiatives, projects, business outcomes | Delivery, roadmap, metrics |

### Special Sections by Timescale

- **today.md** — Leadership Intention, Meetings (with 1:1 and Interview templates), Capture
- **quarter.md** — Coaching Themes (Patterns to Watch, Questions That Serve Me)
- **year.md** — Leadership Development (Current Focus, Identity, Growth Edge)

---

## Key Paths

### Engine Paths

| Path | Purpose |
|------|---------|
| `.claude/config.md` | Vault path configuration (git-ignored) |
| `.claude/skills/` | All skills |
| `.claude/skills/init/assets/scaffold/` | Template copied to vault during init |

### Vault Paths

Skills read vault path from `.claude/config.md`. Use `$VAULT` as prefix in documentation.

**After init, skills always reference the vault:**

| Path | Purpose |
|------|---------|
| `$VAULT/00_Brain/✱ Home.md` | Central hub |
| `$VAULT/00_Brain/Captive/` | Working notes |
| `$VAULT/00_Brain/Periodic/` | Archives |
| `$VAULT/00_Brain/Systemic/Templates/` | Templates (read by skills) |
| `$VAULT/00_Brain/Systemic/Directives/` | User profile & AI personality |
| `$VAULT/00_Brain/Systemic/Coaching/` | Coaching prompts |

### Naming Conventions (Detailed)

**Periodic Notes (moment.js format):**

| Period | Format | Example |
|--------|--------|---------|
| Daily | `YYYY-MM-DD` | 2026-02-08.md |
| Weekly | `gggg-[W]ww` | 2026-W06.md |
| Monthly | `YYYY-MM` | 2026-02.md |
| Quarterly | `YYYY-[Q]Q` | 2026-Q1.md |
| Yearly | `YYYY` | 2026.md |

**Other conventions:**
- **Hubs:** `✱` prefix with Title Case (`✱ Home.md`)
- **Captive Notes:** Capitalized (Today.md, Week.md)
- **People:** `<FirstName><LastInitial>.md` (EstherS.md)
- **Insights:** lowercase-with-hyphens (leadership.md)
- **Projects:** End-date first (`YYYY-MM-DD-project-name.md`)
- **Folders:** Numbered for sorting (`00_`, `01_`, etc.)
- **Skills:** Each in own folder with `SKILL.md`

---

## Directives

Directives personalize how Claude interacts with the user. Located in `$VAULT/00_Brain/Systemic/Directives/`:

| File | Purpose | Content |
|------|---------|---------|
| `user-profile.md` | WHO the user is | Name, role, goals, leadership identity, growth edge, patterns to watch |
| `ai-personality.md` | HOW Claude communicates | Formality, directness, humor, coaching approach, feedback style |

### Loading Directives in Skills

Rituals load directives in their Setup phase (`00-setup.md`). The directives are read from the vault and made available to subsequent phases.

**Loading Pattern:**

Directives are loaded from `$VAULT/00_Brain/Systemic/Directives/`:
- `user-profile.md` — User preferences and identity
- `ai-personality.md` — Communication style settings

**Usage in Skills:**

Apply throughout the ritual:
- Use `user.preferred_name` in greetings
- Reference `user.leadership_identity` for intentions
- Use `user.growth_edge` and `user.patterns_to_watch` for coaching
- Adapt tone based on `ai.formality`, `ai.directness`, `ai.humor`

**Graceful degradation:** If directives don't exist, proceed with defaults and suggest running `/init`.

---

## Hubs

Hubs are central navigation notes that organize content by domain:

- **Acts as a map** — Central navigation point
- **Uses `✱` prefix** — Visual distinction
- **Links bidirectionally** — Hubs link to notes, notes link back

**Hub hierarchy:**

```
✱ Home (central hub, in 00_Brain/)
├── ✱ Projects (active work)
├── ✱ People (relationships)
└── ✱ Insights (thematic learnings)
```

**Navigation pattern** — All Hubs and notes use consistent navigation bar:

```markdown
[[00_Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]
```

---

## GitHub Workflow

### Labels

The repository uses a hierarchical label system:

**Type labels (hierarchy):**

```
type:epic    → Strategic initiative spanning multiple stories
  └── type:story   → Shippable user value, fits in a sprint
        └── type:task    → Implementation work item (≤1 day)
```

| Label | Description | Color |
|-------|-------------|-------|
| `type:epic` | Large initiative spanning multiple stories | Purple #8b5cf6 |
| `type:story` | User-facing capability, shippable increment | Blue #3b82f6 |
| `type:task` | Implementation work item | Cyan #06b6d4 |
| `type:bug` | Something isn't working | Red #ef4444 |
| `type:chore` | Maintenance, refactoring, dependencies | Gray #6b7280 |
| `type:docs` | Documentation improvements | Green #10b981 |

**Scope labels:**

| Label | Description | Color |
|-------|-------------|-------|
| `scope:skill` | Claude skill implementation | Light Pink #f9a8d4 |
| `scope:ritual` | Planning or review ritual | Pink #f472b6 |
| `scope:template` | Template files | Hot Pink #ec4899 |
| `scope:integration` | External tool integration | Deep Pink #db2777 |

### Filtering Examples

```bash
# By hierarchy level
gh issue list --label "type:epic"
gh issue list --label "type:story"
gh issue list --label "type:task"

# By scope
gh issue list --label "scope:skill"

# Combined
gh issue list --label "type:story" --label "scope:skill"
```
