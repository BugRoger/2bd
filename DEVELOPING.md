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
├── ritual-planning-daily.md      # Rituals: ritual- prefix
├── ritual-review-weekly.md
├── init.md                       # Commands: no prefix
├── create-project.md
├── _fetch-calendar.md            # Internal: _ prefix
├── _resolve-references.md
└── _orchestrator.md
```

**Naming Conventions:**
- **Rituals** (`ritual-*`) — Scheduled routines that drive the engine
- **Commands** (no prefix) — Discrete one-shot helpers triggered on-demand
- **Internal** (`_*`) — Sub-skills, orchestrator, and dev tools (not user-facing)

**Auxiliary Files:**

Non-skill supporting files live in `scaffold/00_Brain/Systemic/`:
- `Coaching/` — Coaching prompts and guidance
- `Config/` — Configuration schemas and defaults
- `Templates/Directives/` — Directive templates

---

## Repository Structure

```
2bd-engine/
├── .claude/
│   ├── config.md             # Vault path configuration (git-ignored)
│   └── skills/               # Flat skill structure
│       ├── ritual-planning-daily.md
│       ├── ritual-planning-weekly.md
│       ├── ritual-review-daily.md
│       ├── ritual-review-weekly.md
│       ├── init.md
│       ├── create-project.md
│       ├── archive-project.md
│       ├── _fetch-calendar.md
│       ├── _resolve-references.md
│       └── _orchestrator.md
│
├── scaffold/                 # Complete vault template (copied during /init)
│   ├── 00_Brain/
│   │   ├── ✱ Home.md
│   │   ├── Captive/
│   │   ├── Periodic/
│   │   ├── Semantic/
│   │   ├── Synthetic/
│   │   └── Systemic/
│   │       ├── Coaching/         # Coaching prompts
│   │       ├── Config/           # Configuration schemas
│   │       ├── Templates/
│   │       │   ├── Captive/       # today.md, week.md, etc.
│   │       │   ├── Periodic/      # daily.md, weekly.md, etc.
│   │       │   ├── Projects/      # project.md
│   │       │   ├── Areas/People/  # person.md
│   │       │   └── Directives/    # Directive templates
│   │       └── Directives/
│   ├── 01_Projects/
│   ├── 02_Areas/
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

Internal skills (sub-skills, orchestrator, dev tools) are composable building blocks for operations the orchestrator cannot handle. Underscore prefix (`_`) signals internal/not user-facing.

**Current Internal Skills:**

| Category | Purpose | Examples |
|----------|---------|----------|
| `_fetch-calendar` | External calendar API access | Calendar events via ekctl |
| `_resolve-references` | Wikilink and embed resolution | Resolve `[[wikilinks]]` |
| `_orchestrator` | Skill orchestration | Context loading, subagent spawning |

**Note:** The orchestrator handles most data loading (config, directives, vault files, date resolution). Only create internal skills for complex operations the orchestrator cannot perform.

**Creating:**

1. Create skill file `.claude/skills/_{skill-name}.md`

2. Add YAML frontmatter:
   ```yaml
   ---
   name: _fetch-calendar
   description: Fetch calendar events for a date using ekctl
   disable-model-invocation: true  # Invoked by orchestrator
   allowed-tools: Read, Bash(ekctl *)
   ---
   ```

3. Keep scope narrow — one well-defined operation per skill

4. Design for composition: stateless input/output, minimal side effects

5. Return structured output when appropriate (not all internal skills need JSON)

---

### Ritual Structure

All rituals follow a canonical 6-phase lifecycle. Each phase has a specific purpose and uses a standardized section name.

#### The 6 Phases

| Phase | Section Name | Purpose | Gate? |
|-------|--------------|---------|-------|
| 1 | `## Context` | Declare context needs (orchestrator loads) | No |
| 2 | `## Validate` | Check prerequisites and state | Yes (proceed only when safe) |
| 3 | `## Session` | Interactive guided conversation | No |
| 4 | `## Compose` | Build artifact in memory | No |
| 5 | `## Persist` | Write to vault | No |
| 6 | `## Confirm` | Summarize and suggest next steps | No |

**Phase 1: Context**

Declare what context is needed in natural prose. The orchestrator interprets these needs and pre-loads all context before execution.

```markdown
## Context

- Calendar events for the target period
- User's directives and preferences
- Week.md, Month.md, Quarter.md for hierarchical context
- People files for anyone with 1:1 meetings
- Active project files
```

**Phase 2: Validate**

Check prerequisites and state. Verify dates, check for existing files, warn about risks, offer alternatives. Proceed only when safe.

**Phase 3: Session**

Interactive guided conversation with the user. Personalized greeting, present context, gather input, facilitate reflection. May include subsections to organize conversation flow (subsections are ritual-specific).

**Phase 4: Compose**

Build the complete artifact in memory. Generate content, fill templates, prepare everything for persistence.

**Phase 5: Persist**

Execute file operations. Write to vault, update changelogs. Document what will be written before executing.

**Phase 6: Confirm**

Summarize what was done. Show key outcomes, suggest next steps. This is verification after persistence, not an approval gate.

#### Principles

- **Universal:** All rituals use these exact phase names
- **No variations:** No ritual-specific phase names
- **Subsections allowed:** Within phases (especially Session), use subsections to organize content
- **Separation:** Keep Compose and Persist as separate phases

---

## Prose-Driven Orchestration

Skills declare context needs in natural language. The orchestrator interprets needs and coordinates fulfillment transparently.

### Writing Prose-Driven Skills

Skills declare context needs in prose and reference context naturally without orchestration mechanics.

**1. Declare Context Needs (Phase 1: Context)**

Add a "Context" section using the prose-driven pattern:

```markdown
---
name: planning-daily
description: Morning ritual for planning the day
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day.

## Context

- Calendar events for the target period
- User's directives and preferences
- Week.md for weekly context
- Month.md for monthly context
- People files for anyone with 1:1 meetings
- Active project files
```

**2. Write Phases as Natural Language**

Phases reference context naturally. The orchestrator pre-loads everything into the conversation:

```markdown
## Validate

Check if Today.md already exists at the target date. If it does, ask whether to:
- Review existing plan
- Update existing plan
- Start fresh

## Session

Greet the user using their preferred name from directives.

Review the calendar. What meetings do they have? Highlight any 1:1s.
Check Week.md for weekly goals.

### Focus and Priorities

Ask: What's the leadership intention for today?
Ask: What are the top 2-3 priorities?
```

**3. No Orchestration Mechanics**

The orchestrator handles date resolution, sub-skill spawning, context assembly, and file loading. Skills focus on user interaction and artifact creation.

### How Orchestration Works

The orchestrator coordinates context loading and skill execution entirely through conversation history.

**1. Initialization**

The main orchestrator agent (Claude) receives the skill invocation. It:
- Resolves flexible time arguments (`tomorrow` → `2026-02-16`, etc.)
- Parses the skill's `## Context` section to identify needs

**2. Context Loading Strategy**

For each context need, the orchestrator determines fulfillment:

| Need Pattern | Action |
|--------------|--------|
| "Calendar events" | Spawn `_fetch-calendar` as subagent |
| "Week.md" / "Month.md" | Read vault file directly |
| "People files for 1:1s" | Parse calendar → read matching vault files |
| "Active project files" | Scan vault → read active projects |
| "User directives" | Read directives file |

**3. Subagent Invocations**

External data fetches (calendar) spawn subagents in parallel:
- Each subagent runs in isolated conversation with SKILL.md + date context
- Returns structured markdown to main conversation
- Main orchestrator integrates results into conversation history

**4. Context Pre-Loading**

The orchestrator loads all context before skill execution:
- External data (calendar.md) loaded as messages
- Vault files read and added to conversation
- All context pre-loaded into conversation history

**5. Skill Execution**

Execute skill prose inline in main conversation:
- All context already present in conversation history
- Skills reference context naturally ("review the calendar", "check Week.md")
- Write operations use declarative language ("Write Today.md to Captive")

### Internal Skills for Orchestration

Internal skills run as isolated subagents and return markdown to the orchestrator.

**External Data Skills:**
- `_fetch-calendar` - Calendar events via ekctl

**Note:** Date resolution is now handled directly by the orchestrator, not by sub-skills.

**Subagent Pattern:**

Internal skills receive date context and return structured markdown:

```markdown
---
name: _fetch-calendar
description: Fetch calendar events for a date using ekctl
---

Receive date from orchestrator (YYYY-MM-DD).
Run: ekctl calendar list --date {date}
Return natural markdown of events.
```

Orchestrator spawns subagent, receives output, integrates into main conversation.

### Benefits

| Benefit | Description |
|---------|-------------|
| **Pure declarative intent** | Skills describe WHAT, not HOW |
| **Natural language** | Prose that Claude interprets directly |
| **Flexible fulfillment** | Orchestrator chooses fetch strategy per need |
| **Conversation-native** | All context in conversation history |
| **Parallel subagents** | External data fetched simultaneously |
| **Pre-loaded context** | Everything available before skill execution |
| **No implementation coupling** | Skills resilient to orchestration changes |

### Skill Writing Pattern

Skills describe work naturally, without orchestration mechanics.

**Context references:**
- ✓ "Review the calendar"
- ✗ "Load calendar.md from context"
- ✓ "Check Week.md for weekly goals"
- ✗ "Load Week.md from vault path"

**File operations:**
- ✓ "Write Today.md to Captive"
- ✗ Manual path construction and file operations
- ✓ "Update Week.md with outcomes"
- ✗ Manual path resolution with config.md

The orchestrator interprets natural phrases and handles implementation.

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
- Compares templates between `scaffold/` and `$VAULT/`
- Shows diff for each changed file
- Prompts per-file: `← Pull` (vault → scaffold), `→ Push` (scaffold → vault), or `Skip`

---

## Template Structure

Templates are stored in the engine at `scaffold/00_Brain/Systemic/Templates/`:

- **Captive/** — Templates for working notes (today.md, week.md, month.md, quarter.md, year.md)
- **Periodic/** — Templates for archive notes (daily.md, weekly.md, monthly.md, quarterly.md, yearly.md)
- **Projects/** — project.md
- **Areas/People/** — person.md

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
| `scaffold/` | Template for new vaults |

### Vault Paths

Skills read vault path from `.claude/config.md`. Use `$VAULT` as prefix in documentation:

| Path | Purpose |
|------|---------|
| `$VAULT/00_Brain/✱ Home.md` | Central hub |
| `$VAULT/00_Brain/Captive/` | Working notes |
| `$VAULT/00_Brain/Periodic/` | Archives |
| `$VAULT/00_Brain/Systemic/Directives/` | User profile & AI personality |
| `scaffold/00_Brain/Systemic/Templates/` | Templates (engine, not vault) |

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

Rituals and user-facing skills automatically receive directives through the orchestrator's context loading. The orchestrator pre-loads directives into the conversation before skill execution.

**Context Declaration:**

```markdown
## Context

- User's directives and preferences
- Calendar events for the day
- Week.md for weekly context
```

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
