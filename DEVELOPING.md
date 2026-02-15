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

Skills are organized by type:

```
.claude/skills/
├── rituals/              # Scheduled routines (planning-daily, review-weekly, etc.)
├── commands/             # One-shot helpers (init, migrate, onboard-person)
├── _sub/                 # Composable building blocks (fetch-*, gather-*, archive-*, write-*)
└── _dev/                 # Development-time skills
```

**Types:**
- **Rituals** — Scheduled routines that drive the engine (planning prepares Captive, review archives to Periodic)
- **Commands** — Discrete one-shot helpers triggered on-demand
- **Sub-skills** — Composable building blocks that rituals and commands use
- **Dev skills** — Engine maintenance (not part of production system)

---

## Repository Structure

```
2bd-engine/
├── .claude/
│   ├── config.md             # Vault path configuration (git-ignored)
│   └── skills/
│       ├── rituals/
│       │   ├── planning-daily/
│       │   ├── planning-weekly/
│       │   ├── review-daily/
│       │   └── review-weekly/   # etc.
│       ├── commands/
│       │   ├── init/         # Bootstrap or configure vault
│       │   └── migrate/      # Migrate from combined repo
│       ├── _sub/
│       │   ├── fetch-dates/
│       │   ├── fetch-calendar/
│       │   ├── gather-week-context/
│       │   └── archive-daily/   # etc.
│       └── _dev/
│           └── sync-templates/
│
├── scaffold/                 # Complete vault template (copied during /init)
│   ├── 00_Brain/
│   │   ├── ✱ Home.md
│   │   ├── Captive/
│   │   ├── Periodic/
│   │   ├── Semantic/
│   │   ├── Synthetic/
│   │   └── Systemic/
│   │       ├── Templates/
│   │       │   ├── Captive/  # today.md, week.md, etc.
│   │       │   └── Periodic/ # daily.md, weekly.md, etc.
│   │       └── Directives/
│   ├── 01_Projects/
│   ├── 02_Areas/
│   ├── 03_Resources/
│   └── 04_Archives/
│
├── README.md                 # User documentation
├── DEVELOPING.md             # This file
└── CLAUDE.md                 # Claude-specific instructions
```

---

## Creating Skills

### Skill Writing Style

Skills should read as plain prose describing *what happens*, not scripts with execution directives.

**Do:**
- Write descriptive prose: "Load config to get the vault path. Validate the structure exists."
- Organize into sections describing the flow: Setup, Interview, Output
- Reference sub-skills naturally: "Load config using `_sub/fetch-config`"
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

1. Create folder in `.claude/skills/rituals/planning-` or `.claude/skills/rituals/review-`
   - **Planning rituals** — Forward-looking (prepare Captive from templates)
   - **Review rituals** — Reflective (archive Captive to Periodic)

2. Add `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: weekly-planning
   description: Prepare Week.md with weekly focus and priorities
   disable-model-invocation: true  # Manual trigger only
   allowed-tools: Read, Write, Bash(*)
   ---
   ```

3. Document the ritual flow and expected outcomes

4. Test: `claude skill run rituals/planning-weekly-planning`

### Creating Actions

Actions are one-shot helpers invoked on-demand.

1. Create folder in `.claude/skills/commands/`

2. Add `SKILL.md` with frontmatter:
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

4. Test: `claude skill run actions/create-project --args "Project Name"`

### Creating Sub-skills

Sub-skills are composable building blocks. Underscore prefix (`_sub/`) signals internal/system.

**Categories:**

| Category | Purpose | Examples |
|----------|---------|----------|
| `_sub/gather-*` | Content combination and transformation | gather-week-context, gather-month-context, gather-key-dates |
| `_sub/fetch-*` | Data retrieval from system or external sources | fetch-dates, fetch-calendar, fetch-config |
| `_sub/archive-*` | Archive operations | archive-daily, archive-weekly |
| `_sub/write-*` | Write operations | write-captive-note |

**Creating:**

1. Create folder in `.claude/skills/_sub/` with appropriate prefix (fetch-, gather-, archive-, write-)

2. Add `SKILL.md`:
   ```yaml
   ---
   name: fetch-dates
   description: Get today's date in all required formats
   disable-model-invocation: true  # Invoked by other skills
   allowed-tools: Bash(date *)
   ---
   ```

3. Keep scope narrow — one well-defined operation per sub-skill

4. Design for composition: stateless input/output, no side effects

5. Return structured JSON output for orchestrator consumption:
   ```json
   {
     "success": true,
     "key": "value"
   }
   ```

**Referencing in rituals/actions (legacy pattern):**

```markdown
### 1. Gather Context

**Use sub-skill: `_sub/fetch-dates`**
- Get today's date information in all required formats

**Use sub-skill: `_sub/gather-context`**
- Scope: day
- Returns: yesterday's work, recent archives, active projects
```

---

## Orchestrated Skills

Skills can use subagent orchestration for parallel execution and context isolation. The orchestration logic lives in `phases.yaml`, keeping SKILL.md clean prose.

### Enabling Orchestration

1. Add `metadata.orchestrated: true` to SKILL.md frontmatter:
   ```yaml
   ---
   name: daily-planning
   description: Plan a day's priorities...
   metadata:
     orchestrated: true
     phases_file: phases.yaml
   ---
   ```

2. Create `phases.yaml` in the skill's directory with phase definitions

3. Keep SKILL.md as plain prose describing the workflow — no phase markers or template syntax

### Phase Configuration (phases.yaml)

```yaml
phases:
  # Phase 0: Setup (parallel, read-only)
  - name: setup
    parallel: true           # Spawn all subagents simultaneously
    subagents:
      - skill: _sub/fetch-config
        type: explore        # Read-only subagent
        output: VAULT        # Variable name to store result
      - skill: _sub/fetch-directives
        type: explore
        output: DIRECTIVES
        optional: true       # Continue if this fails
        on_error: "Directives not found. Using defaults."

  # Phase 1: Gather (depends on setup)
  - name: gather
    depends_on: [setup]      # Wait for setup to complete
    parallel: true
    subagents:
      - skill: _sub/fetch-calendar
        type: explore
        args: "scope={{DATES.target_date}}"  # Variable interpolation
        output: CALENDAR
        optional: true
        fallback: inline     # Execute in main context on failure

  # Phase 2: Interactive (inline)
  - name: interact
    depends_on: [gather]
    inline: true             # Execute in main conversation context

  # Phase 3: Write (write-capable)
  - name: write
    depends_on: [interact]
    subagents:
      - skill: _sub/write-captive-note
        type: general-purpose  # Can modify files
        args: "path={{VAULT}}/Today.md content={{PLAN}}"
```

### Phase Schema Reference

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Phase identifier |
| `parallel` | boolean | Spawn subagents simultaneously (default: false) |
| `depends_on` | [string] | Phases that must complete first |
| `inline` | boolean | Run in main context, not as subagent |
| `subagents` | array | List of subagents to spawn |

**Subagent fields:**

| Field | Type | Description |
|-------|------|-------------|
| `skill` | string | Path to sub-skill (e.g., `_sub/fetch-config`) |
| `type` | string | `explore` (read-only) or `general-purpose` (can write) |
| `args` | string | Arguments with `{{VAR}}` interpolation |
| `output` | string | Variable name to store result |
| `optional` | boolean | Continue if this fails |
| `fallback` | string | `inline` to execute in main context on failure |
| `on_error` | string | Message to show on failure |

### Variable Interpolation in phases.yaml

Use `{{VARIABLE}}` syntax in `phases.yaml` args to reference context values:

- `{{VAULT}}` — Simple variable
- `{{DATES.target_date}}` — Nested property

Variables are interpolated when spawning subagents. SKILL.md itself should not contain template syntax.

### Execution Flow

```
Parse phases.yaml
    ↓
Build dependency graph
    ↓
For each phase in topological order:
    ├─ If inline: true → execute in main context
    └─ If subagents → spawn via Task tool
        ├─ type: explore → subagent_type="Explore"
        └─ type: general-purpose → subagent_type="general-purpose"
    ↓
Capture outputs into context store
    ↓
Continue to next phase
```

### Benefits of Orchestration

| Benefit | Description |
|---------|-------------|
| **Parallel execution** | Independent operations run simultaneously |
| **Context isolation** | Large file operations don't exhaust conversation context |
| **Formal contracts** | Structured JSON outputs between phases |
| **Error handling** | Optional fallbacks and graceful degradation |
| **Backwards compatible** | Skills without phases.yaml work as before |

### Creating Dev Skills

Dev skills are for engine maintenance. Underscore prefix (`_dev/`) signals internal.

1. Create folder in `.claude/skills/_dev/`

2. Add `SKILL.md`:
   ```yaml
   ---
   name: sync-templates
   description: Bidirectional sync between scaffold and vault templates
   disable-model-invocation: true
   allowed-tools: Read, Write, Bash(diff *)
   ---
   ```

3. Test: `claude skill run _dev/sync-templates`

**sync-templates workflow:**
- Compares templates between `scaffold/` and `$VAULT/`
- Shows diff for each changed file
- Prompts per-file: `← Pull` (vault → scaffold), `→ Push` (scaffold → vault), or `Skip`

---

## Template Structure

Templates are stored in two locations in the vault:

**Brain templates** (`00_Brain/Systemic/Templates/`):
- **Captive/** — Templates for working notes (today.md, week.md, month.md, quarter.md, year.md)
- **Periodic/** — Templates for archive notes (daily.md, weekly.md, monthly.md, quarterly.md, yearly.md)

**PARA templates** (`03_Resources/_Templates/para/`):
- project.md, person.md, insight.md

### Standard Sections

All Captive templates follow a consistent structure:

1. **Context From Above** — Shows parent timescale goals (e.g., Week.md shows Month/Quarter themes)
2. **Key Outcomes** — 3 priorities using Personal → Organisational → Strategic framework
3. **Progress tracking** — Nested period summaries
4. **Coaching Check-in** — Self-reflection prompts (week.md, month.md)
5. **Carry Forward** — Items to move to next period
6. **Wins** — Personal → Organisational → Strategic categories
7. **Reflections** — What went well, what could be better, key insights

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
| `scaffold/` | Template for new vaults |

### Vault Paths

Skills read vault path from `.claude/config.md`. Use `$VAULT` as prefix in documentation:

| Path | Purpose |
|------|---------|
| `$VAULT/00_Brain/✱ Home.md` | Central hub |
| `$VAULT/00_Brain/Captive/` | Working notes |
| `$VAULT/00_Brain/Periodic/` | Archives |
| `$VAULT/00_Brain/Systemic/Templates/` | User-owned templates |
| `$VAULT/00_Brain/Systemic/Directives/` | User profile & AI personality |

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
- **Meta-resources:** Underscore prefix (`_Templates/`)
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

User-facing skills should load directives as their first step:

```markdown
### 0. Load Directives

**Use sub-skill: `_sub/fetch-directives`**

Apply throughout this ritual:
- Use `user.preferred_name` in greetings
- Reference `user.leadership_identity` for intentions
- Use `user.growth_edge` and `user.patterns_to_watch` for coaching
- Adapt tone based on `ai.formality`, `ai.directness`, `ai.humor`
```

**When to load:**

| Skill Type | Load Directives? | Reason |
|------------|-----------------|--------|
| Rituals | Always | Coaching context is essential |
| Actions | Usually | Personalization improves UX |
| Sub-skills | Rarely | Data operations, not conversations |

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
