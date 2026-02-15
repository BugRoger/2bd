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
├── _sub/                 # Composable building blocks (archive-*, write-*, fetch-calendar)
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
│       │   ├── fetch-calendar/
│       │   ├── archive-daily/
│       │   └── write-captive-note/   # etc.
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
│   │       │   ├── Captive/       # today.md, week.md, etc.
│   │       │   ├── Periodic/      # daily.md, weekly.md, etc.
│   │       │   ├── Projects/      # project.md
│   │       │   └── Areas/People/  # person.md
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

Sub-skills are composable building blocks for operations the orchestrator cannot handle. Underscore prefix (`_sub/`) signals internal/system.

**Current Sub-Skills:**

| Category | Purpose | Examples |
|----------|---------|----------|
| `_sub/archive-*` | Archive operations (Captive → Periodic) | archive-daily, archive-weekly, archive-monthly |
| `_sub/write-*` | File creation operations | write-captive-note |
| `_sub/append-*` | Append operations | append-changelog |
| `_sub/extract-*` | Content extraction and transformation | extract-to-areas |
| `_sub/update-*` | Semantic note updates | update-semantic |
| `_sub/fetch-calendar` | External calendar API access | fetch-calendar (via ekctl) |
| `_sub/project-sync-*` | External system integration | project-sync-finder, project-sync-outlook |
| `_sub/resolve-references` | Wikilink and embed resolution | resolve-references |
| `_sub/apply-writing-style` | Prose quality enhancement | apply-writing-style |

**Note:** The orchestrator handles most data loading (config, directives, vault files, date resolution). Only create _sub/ skills for complex operations the orchestrator cannot perform.

**Creating:**

1. Create folder in `.claude/skills/_sub/` with appropriate prefix (archive-, write-, fetch-, etc.)

2. Add `SKILL.md`:
   ```yaml
   ---
   name: archive-daily
   description: Move Today.md to Periodic/Daily/
   disable-model-invocation: true  # Invoked by other skills
   allowed-tools: Bash(mv, cp)
   ---
   ```

3. Keep scope narrow — one well-defined operation per sub-skill

4. Design for composition: stateless input/output, minimal side effects

5. Return structured output when appropriate (not all sub-skills need JSON)

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

The orchestrator handles session creation, date resolution, sub-skill spawning, context assembly, and file loading. Skills focus on user interaction and artifact creation.

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
| "Calendar events" | Spawn `_sub/fetch-calendar` as subagent |
| "Week.md" / "Month.md" | Read vault file directly |
| "People files for 1:1s" | Parse calendar → read matching vault files |
| "Active project files" | Scan vault → read active projects |
| "User directives" | Read directives file |

**3. Subagent Invocations**

External data fetches (calendar, QMD) spawn subagents in parallel:
- Each subagent runs in isolated conversation with SKILL.md + date context
- Returns structured markdown to main conversation
- Main orchestrator integrates results into conversation history

**4. Context Pre-Loading**

The orchestrator loads all context before skill execution:
- External data (calendar.md, resources.md) loaded as messages
- Vault files read and added to conversation
- No session directory or file passing required

**5. Skill Execution**

Execute skill prose inline in main conversation:
- All context already present in conversation history
- Skills reference context naturally ("review the calendar", "check Week.md")
- Write operations use declarative language ("Write Today.md to Captive")

### Sub-Skills for Orchestration

Sub-skills run as isolated subagents and return markdown to the orchestrator.

**External Data Sub-Skills:**
- `_sub/fetch-calendar` - Calendar events via ekctl
- `_sub/fetch-qmd` - Search results from QMD (future)

**Note:** Session directory creation and date resolution are now handled directly by the orchestrator, not by sub-skills.

**Subagent Pattern:**

Sub-skills receive date context and return structured markdown:

```markdown
---
name: fetch-calendar
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
| **Conversation-native** | No session directory, no file passing |
| **Parallel subagents** | External data fetched simultaneously |
| **Pre-loaded context** | Everything available before skill execution |
| **No implementation coupling** | Skills resilient to orchestration changes |

### Skill Writing Pattern

Skills describe work naturally, without orchestration mechanics.

**Context references:**
- ✓ "Review the calendar"
- ✗ "Load calendar.md from session"
- ✓ "Check Week.md for weekly goals"
- ✗ "Load Week.md from path in memory.md"
- ✓ "If QMD results are available"
- ✗ "If resources.md exists in session"

**File operations:**
- ✓ "Write Today.md to Captive"
- ✗ `cp "${SESSION_DIR}/plan.md" "${vault_path}/00_Brain/Captive/Today.md"`
- ✓ "Update Week.md with outcomes"
- ✗ Manual path resolution with config.md

The orchestrator interprets natural phrases and handles implementation.

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

**Integration:** Write skills (`write-captive-note`, `update-semantic`, `archive-*`, `project-sync-vault`) call `append-changelog` after modifying files. Pass:
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
