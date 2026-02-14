# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Maintenance

When making changes to the 2bd engine (skills, scaffold, architecture), keep documentation in sync:

- **README.md** — User-facing quick start and overview. Update when:
  - Installation process changes
  - New skills/actions are added that users should know about
  - Architecture changes (e.g., new directories, changed workflows)
  - Vault structure changes

- **CLAUDE.md** — Complete technical reference. Update when:
  - Any skill behavior changes
  - Path patterns or naming conventions change
  - New sub-skills are added
  - Integration points change (calendar, GitHub, etc.)

README.md should remain concise and approachable. CLAUDE.md is the comprehensive reference.

## Project Overview

**2bd (Second Brain Daemon)** is a personal knowledge system that runs itself—powered by Claude Skills, driven by rituals, stored in markdown. It uses Claude Skills to automate productivity rituals, organizing information by **Metabolic State** (energy velocity and temporal density) rather than just topic.

## Installation

### Quick Start

```bash
# 1. Clone the engine
git clone https://github.com/bugroger/2bd ~/Code/2bd-engine
cd ~/Code/2bd-engine

# 2. Set up your vault (run from engine directory)
claude skill run actions/init --args "fresh --vault=~/OneDrive/2bd-vault"

# 3. (Optional) Create a symlink for convenience
ln -s ~/OneDrive/2bd-vault ./vault

# 4. Open the vault in Obsidian
# 5. Start planning!
claude skill run rituals/planning/daily-planning
```

### Engine + Vault Architecture

2bd separates **system** (engine) from **content** (vault):

```
~/Code/2bd-engine/                  ~/OneDrive/2bd-vault/
├── .claude/                        ├── 00_Brain/
│   ├── skills/                     │   ├── Captive/ (your notes)
│   └── config.md  ← vault path     │   ├── Periodic/ (archives)
├── scaffold/   ← vault template    │   └── Systemic/
├── CLAUDE.md                       │       ├── Templates/ (your templates)
└── README.md                       │       └── Directives/ (your profile)
                                    ├── 01_Projects/
                                    ├── 02_Areas/
                                    └── .obsidian/
```

**Key principles:**
- **Engine** (this repo) = Skills, scaffold, documentation — public, git-tracked
- **Vault** (OneDrive) = Your notes, archives, projects — private, cloud-synced
- **Always run Claude from the engine directory** — skills read vault path from config
- **Templates are yours** — copied once during setup, customize freely

### Configuration

The engine stores vault path in `.claude/config.md` (git-ignored):

```markdown
# 2bd Engine Configuration

## Vault

vault_path: /Users/you/OneDrive/2bd-vault
```

All skills read this config to find your vault. If you move your vault, run:

```bash
claude skill run actions/init --args "reconnect --vault=/new/path"

# Recreate the symlink if you use one
ln -sf /new/path ./vault
```

### Migrating from Combined Repo

If you have an existing 2bd repo with personal content mixed in:

```bash
claude skill run actions/migrate --args "--vault=~/OneDrive/2bd-vault"
```

This copies your content to the vault and sets up the config.

## Architecture

### Core Philosophy

The note-taking architecture mirrors human cognitive biology. Information is categorized by its metabolic state:

| State | Purpose | User Writes | Rituals Write |
|-------|---------|-------------|---------------|
| **Captive** | Sensory/Intake - high-velocity, volatile working notes | Yes | Planning rituals prepare |
| **Synthetic** | Short-term/Executive - active project work, drafts | Yes | No |
| **Periodic** | Episodic/Rhythm - timeline archives (the heartbeat) | No | Review rituals archive |
| **Semantic** | Long-term/Reference - crystallized knowledge | Yes | Rituals may suggest |
| **Systemic** | Procedural/Structure - templates, SOPs, workflows | Setup only | No |

### Core Concepts

- **Rituals**: Scheduled routines that drive the engine (planning prepares Captive, review archives to Periodic)
- **Actions**: Discrete one-shot helpers triggered on-demand (e.g., create-project, generate-newsletter)
- **Sub-skills**: Composable building blocks that rituals and actions use for common operations
- **Captive Notes**: Working documents (Today.md, Week.md, Month.md, Quarter.md, Year.md)
- **Periodic Notes**: Unique consecutive archives (2026-02-08.md, 2026-W06.md, etc.)
- **Hubs**: Central navigation notes that organize content by domain (✱ Home, ✱ Projects, ✱ People, ✱ Insights)
- **Skills**: Claude Skills that implement rituals, actions, and sub-skills

### Repository Structure (Engine)

```
2bd-engine/
├── .claude/
│   ├── config.md             # Vault path configuration (git-ignored)
│   └── skills/
│       ├── rituals/          # Scheduled routine skills
│       │   ├── planning/     # Forward-looking (daily-planning, etc.)
│       │   └── review/       # Reflective (daily-review, etc.)
│       ├── actions/          # One-shot helper skills
│       │   ├── init/         # Bootstrap or configure vault
│       │   └── migrate/      # Migrate from combined repo
│       ├── _sub/             # Composable sub-skills
│       │   ├── synthesis/    # Content operations
│       │   └── fetch/        # Data retrieval (get-config, get-directives, etc.)
│       └── _dev/             # Development-time skills (engine maintenance)
│           └── sync-templates/ # Bidirectional template sync
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
├── CLAUDE.md                 # This file
└── README.md                 # User-facing documentation
```

### Vault Structure (User's OneDrive)

```
2bd-vault/                    # Obsidian opens this as vault
├── 00_Brain/
│   ├── ✱ Home.md             # Central Hub
│   ├── Captive/              # Active working notes
│   │   ├── Today.md
│   │   ├── Week.md
│   │   ├── Month.md
│   │   ├── Quarter.md
│   │   ├── Year.md
│   │   └── Flash/
│   ├── Periodic/             # Timeline archives
│   │   ├── Daily/
│   │   ├── Weekly/
│   │   ├── Monthly/
│   │   ├── Quarterly/
│   │   └── Yearly/
│   ├── Semantic/             # Crystallized knowledge
│   ├── Synthetic/            # Active drafts
│   └── Systemic/
│       ├── Templates/        # User-owned templates
│       └── Directives/       # User profile & AI personality
├── 01_Projects/
├── 02_Areas/
│   ├── People/
│   └── Insights/
├── 03_Resources/
├── 04_Archives/
└── .obsidian/                # Obsidian configuration
```

### Naming Conventions

**Periodic Notes (moment.js format):**
| Period | Format | Example |
|--------|--------|---------|
| Daily | `YYYY-MM-DD` | 2026-02-08.md |
| Weekly | `gggg-[W]ww` | 2026-W06.md |
| Monthly | `YYYY-MM` | 2026-02.md |
| Quarterly | `YYYY-[Q]Q` | 2026-Q1.md |
| Yearly | `YYYY` | 2026.md |

**Other conventions:**
- **Hubs:** Use `✱` prefix with Title Case: `✱ Home.md`, `✱ Projects.md`, `✱ People.md`, `✱ Insights.md`
- **Meta-resources:** Underscore prefix for system/template files: `_Templates/`
- **Captive Notes:** In `00_Brain/Captive/`, capitalized (Today.md, Week.md, Month.md, Quarter.md, Year.md)
- **People:** In `02_Areas/People/`, `<FirstName><LastInitial>.md` format (EstherS.md, JonnyB.md)
- **Insights:** In `02_Areas/Insights/`, lowercase-with-hyphens (leadership.md, productivity.md)
- **Projects:** End-date first for lexical sorting: `YYYY-MM-DD-project-name.md`
- **Folders:** Numbered for sorting (`00_`, `01_`, `02_`, `03_`, `04_`)
- **Skills:** Each skill in own folder with `SKILL.md` and optional supporting files

### Hubs

Hubs are central navigation notes that organize content by domain:

- **Acts as a map** - Central navigation point for a domain
- **Uses `✱` prefix** - Visual distinction: `✱ Home`, `✱ Projects`, `✱ People`, `✱ Insights`
- **Links bidirectionally** - Hubs link to notes, notes link back to Hubs

**Hub hierarchy:**
```
✱ Home (central hub, in 00_Brain/)
├── ✱ Projects (active work)
├── ✱ People (relationships)
└── ✱ Insights (thematic learnings)
```

**Navigation pattern** - All Hubs and notes use consistent navigation bar:
```markdown
[[00_Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]
```

### Templates

Templates are stored in two locations:

**Brain templates** (`00_Brain/Systemic/Templates/`):
- **Captive/**: Templates for working notes (today.md, week.md, month.md, quarter.md, year.md)
- **Periodic/**: Templates for archive notes (daily.md, weekly.md, monthly.md, quarterly.md, yearly.md)

**PARA templates** (`03_Resources/_Templates/para/`):
- project.md, person.md, insight.md

### Template Structure

All Captive templates follow a consistent structure with **nested context** and **coaching integration**:

**Standard sections:**
1. **Context From Above** — Shows parent timescale goals (e.g., Week.md shows Month/Quarter themes)
2. **Key Outcomes** — 3 priorities using Personal → Organisational → Strategic framework
3. **Progress tracking** — Nested period summaries (e.g., Week.md has Daily Notes section)
4. **Coaching Check-in** — Self-reflection prompts (week.md and month.md)
5. **Carry Forward** — Items to move to next period
6. **Wins** — Personal → Organisational → Strategic categories
7. **Reflections** — What went well, what could be better, key insights

**The three categories (order matters):**

| Category | Focus | Examples |
|----------|-------|----------|
| **Personal** | Individual growth, energy, leadership | Executive presence, boundaries, habits |
| **Organisational** | Team, structure, culture, people | Hiring, LT team, delegation, team health |
| **Strategic** | Initiatives, projects, business outcomes | SCI delivery, SCOS/Pegasus, roadmap |

*Order rationale: Personal first counters the pattern of "putting yourself last."*

**Special sections by timescale:**
- **today.md**: Leadership Intention, Meetings (with 1:1 and Interview templates), Capture
- **quarter.md**: Coaching Themes (Patterns to Watch, Questions That Serve Me)
- **year.md**: Leadership Development (Current Focus, Identity, Growth Edge)

### Metabolic State System

The system separates **where you work** (Captive) from **where archives accumulate** (Periodic):

**Captive (00_Brain/Captive/)** - Your active working space. This is where you capture. High-velocity, volatile data. Planning rituals prepare these notes from templates and synthesize with prior knowledge.

**Periodic (00_Brain/Periodic/)** - Timeline-based archives. Each period gets a unique, consecutive note (2026-02-08.md, 2026-02-09.md). Review rituals archive Captive notes here and synthesize into next period's Captive notes.

### Ritual Philosophy

**Planning Rituals** (Forward-looking):
- Prepare Captive notes from templates
- Synthesize prior knowledge from Periodic archives
- Set intentions and priorities

**Review/Digest Rituals** (Reflective):
- Archive Captive note to corresponding Periodic folder
- Synthesize insights into next period's Captive notes
- Extract to Areas (People, Insights)
- Update project status

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

### Skill File Structure

Each skill is in its own folder with:
- **`SKILL.md`** (required): Main skill definition with YAML frontmatter and instructions
- Optional supporting files (templates, examples, scripts)

**SKILL.md format:**
```markdown
---
name: skill-name
description: What this skill does and when to use it
disable-model-invocation: false  # true for manual-only (rituals)
allowed-tools: Read, Write, Bash(*)
argument-hint: "[argument description]"
---

# Skill Instructions

Instructions Claude follows when invoked.
```

## Core Rituals

Each ritual is a scheduled operation that drives the productivity loop:

| Ritual | When | Purpose |
|--------|------|---------|
| **Daily Planning** | Every morning | Prepare Today.md with priorities and intentions |
| **Daily Review** | Every evening | Archive Today.md to Periodic, synthesize forward |
| **Weekly Planning** | Every Monday | Prepare Week.md with weekly focus |
| **Weekly Review** | Every Sunday | Archive Week.md, synthesize to Month |
| **Monthly Review** | First of month | Archive Month.md, synthesize patterns |
| **Quarterly Review** | Every 3 months | Archive Quarter.md, assess direction |
| **Yearly Planning** | January 1 | Set vision, prepare Year.md |
| **Yearly Review** | December 31 | Archive Year.md, capture life insights |

**Usage:**
```bash
claude skill run rituals/planning/daily-planning
claude skill run rituals/review/daily-review
```

## Common Actions

Actions are one-shot helpers you invoke on-demand:

| Action | Purpose | Usage |
|--------|---------|-------|
| **Create Project** | Initialize new project file with end-date | `claude skill run actions/create-project --args "Project Name"` |

## Development Guidelines

### Creating New Rituals

When adding a new ritual skill:
1. Create folder in `.claude/skills/rituals/planning/` or `.claude/skills/rituals/review/`
   - Planning rituals: Forward-looking (prepare Captive from templates)
   - Review rituals: Reflective (archive Captive to Periodic)
2. Add `SKILL.md` with frontmatter:
   - Set `disable-model-invocation: true` (manual trigger only)
   - Define `allowed-tools` to avoid permission prompts
3. Document the ritual flow and expected outcomes
4. Test with `claude skill run rituals/{planning|review}/ritual-name`

### Creating New Actions

When adding a new action skill:
1. Create folder in `.claude/skills/actions/`
2. Add `SKILL.md` with frontmatter:
   - Keep `disable-model-invocation: false` (allow auto-invocation)
   - Write clear, specific `description` so Claude knows when to use it
3. Test with `claude skill run actions/action-name`

### Sub-Skills

Sub-skills are composable building blocks that rituals and actions reference to perform common operations. They live in `.claude/skills/_sub/` (underscore prefix follows the `_Templates/` convention for internal/system resources).

**Categories:**

| Category | Purpose | Examples |
|----------|---------|----------|
| **`_sub/synthesis/`** | Content combination and transformation | gather-context, extract-actions, summarize-period |
| **`_sub/fetch/`** | Data retrieval from system or external sources | get-dates, get-calendar, get-template |

**Creating Sub-Skills:**

1. Create folder in `.claude/skills/_sub/synthesis/` or `.claude/skills/_sub/fetch/`
2. Add `SKILL.md` with frontmatter:
   - Set `disable-model-invocation: true` (invoked by other skills, not directly)
   - Keep scope narrow—one well-defined operation per sub-skill
3. Design for composition: stateless input/output, no side effects
4. Test in isolation before using in rituals/actions

**Referencing Sub-Skills:**

Rituals and actions reference sub-skills by instruction in their `SKILL.md`:

```markdown
### 1. Gather Context

**Use sub-skill: `_sub/fetch/get-dates`**
- Get today's date information in all required formats

**Use sub-skill: `_sub/synthesis/gather-context`**
- Scope: day
- Returns: yesterday's work, recent archives, active projects
```

When Claude executes a ritual, it reads the sub-skill's `SKILL.md` and follows those instructions, then returns to the parent skill with the results.

### Development Skills (`_dev/`)

Development skills are for engine maintenance—not part of the production system. They live in `.claude/skills/_dev/` (underscore prefix signals internal/system).

**Available dev skills:**

| Skill | Purpose | Usage |
|-------|---------|-------|
| **sync-templates** | Bidirectional sync between scaffold and vault templates | `claude skill run _dev/sync-templates` |

**Creating Dev Skills:**

1. Create folder in `.claude/skills/_dev/`
2. Add `SKILL.md` with frontmatter:
   - Set `disable-model-invocation: true` (manual trigger only)
   - Define `allowed-tools` explicitly
3. Test with `claude skill run _dev/skill-name`

**sync-templates workflow:**

Compares templates between `scaffold/` (engine) and `$VAULT/` (user vault):
- Shows diff for each changed file
- Prompts per-file: `← Pull` (vault → scaffold), `→ Push` (scaffold → vault), or `Skip`
- Use after modifying templates in either location to keep them in sync

### Directives (User Profile & AI Personality)

Directives personalize how Claude interacts with the user. They're stored in `00_Brain/Systemic/Directives/`:

| File | Purpose | Content |
|------|---------|---------|
| `user-profile.md` | WHO the user is | Name, role, goals, leadership identity, growth edge, patterns to watch |
| `ai-personality.md` | HOW Claude communicates | Formality, directness, humor, coaching approach, feedback style |

**Loading Directives in Skills:**

All user-facing skills should load directives as their first step:

```markdown
### 0. Load Directives

**Use sub-skill: `_sub/fetch/get-directives`**

Apply throughout this ritual:
- Use `user.preferred_name` in greetings
- Reference `user.leadership_identity` for intentions
- Use `user.growth_edge` and `user.patterns_to_watch` for coaching
- Adapt tone based on `ai.formality`, `ai.directness`, `ai.humor`
```

**When to load directives:**

| Skill Type | Load Directives? | Reason |
|------------|-----------------|--------|
| **Rituals** | Always | Coaching context is essential |
| **Actions** | Usually | Personalization improves UX |
| **Sub-skills** | Rarely | Data operations, not conversations |

**Graceful degradation:**

If directives don't exist (user hasn't run `/init`), skills should proceed with defaults and suggest running `/init` at the end.

## Working with 2bd

### Daily Usage

**Always run Claude from the engine directory:**

```bash
cd ~/Code/2bd-engine

# Morning planning
claude skill run rituals/planning/daily-planning

# Evening review
claude skill run rituals/review/daily-review
```

Skills automatically read `$VAULT` from `.claude/config.md` and operate on your vault files.

### Key Files (in Vault)

- **Central Hub:** `$VAULT/00_Brain/✱ Home.md`
- **Captive notes (active workspace):** `$VAULT/00_Brain/Captive/`
  - Today.md, Week.md, Month.md, Quarter.md, Year.md
- **Periodic archives:** `$VAULT/00_Brain/Periodic/`
  - Daily/, Weekly/, Monthly/, Quarterly/, Yearly/
- **Templates:** `$VAULT/00_Brain/Systemic/Templates/`
  - Captive/ - Working note templates
  - Periodic/ - Archive templates
- **PARA templates:** `$VAULT/03_Resources/_Templates/para/`
- **Hubs:**
  - `$VAULT/01_Projects/✱ Projects.md` - Projects navigation
  - `$VAULT/02_Areas/People/✱ People.md` - People navigation
  - `$VAULT/02_Areas/Insights/✱ Insights.md` - Insights navigation

### Key Files (in Engine)

- **Skills:** `.claude/skills/rituals/`, `.claude/skills/actions/`, `.claude/skills/_sub/`
- **Scaffold:** `scaffold/` - Template for new vaults
- **Config:** `.claude/config.md` - Vault path (git-ignored)
- **Vault symlink:** `./vault` - Optional symlink to vault (git-ignored)

### Metabolic Interaction Guidelines

When generating content, consider its metabolic state:
- **Captive**: High-velocity, volatile - "This belongs in Captive for active capture"
- **Synthetic**: Active drafts - "This is a draft in progress"
- **Periodic**: Archived records - "This goes to Periodic as a permanent record"
- **Semantic**: Crystallized knowledge - "This is evergreen reference material"
- **Systemic**: Structure - "This is a template or SOP"

## Obsidian Integration

2bd uses Obsidian as the primary interface for writing and browsing, while Claude CLI handles ritual execution.

### Daily Workflow

**Morning:**
1. Terminal: `claude skill run rituals/planning/daily-planning`
2. Obsidian: Open Today.md (`Cmd+Shift+D`) and work through the day

**Throughout Day:**
- Write in Today.md (meetings, 1:1s, completed work, actions)
- Capture 1:1 conversations—rituals will extract to People/
- Navigate projects via ✱ Projects.md
- Add context to People/ files directly if needed

**Evening:**
1. Obsidian: Complete Today.md sections (Wins, Insights, Completed)
2. Terminal: `claude skill run rituals/review/daily-review` (archives & synthesizes)

### Hotkeys

| Hotkey | Action |
|--------|--------|
| `Cmd+Shift+D` | Open Today.md |
| `Cmd+Shift+W` | Open Week.md |
| `Cmd+Shift+M` | Open Month.md |
| `Cmd+Shift+Q` | Open Quarter.md |
| `Cmd+Shift+H` | Open ✱ Home.md |
| `Cmd+Shift+G` | Open graph view |

### Template System

Templater automatically applies templates when creating files:
- New file in `01_Projects/` → uses project.md
- New file in `02_Areas/People/` → uses person.md
- New file in `02_Areas/Insights/` → uses insight.md

## Calendar Integration (macOS)

2bd can fetch calendar events from macOS Calendar to inform daily planning using the `ekctl` CLI tool.

### Prerequisites

- **macOS 13.0** (Ventura) or later
- **ekctl** CLI tool

### Setup

#### 1. Install ekctl

```bash
# Using Homebrew
brew install schappim/tap/ekctl

# Or build from source
git clone https://github.com/schappim/ekctl.git
cd ekctl && swift build -c release
```

#### 2. Grant Calendar Access

On first run, ekctl will prompt for calendar access. Grant permission when asked, or manually enable in:
**System Settings → Privacy & Security → Calendars → Terminal** (or your terminal app)

#### 3. List Your Calendars

```bash
ekctl list calendars
```

This returns JSON with all calendars (iCloud, Exchange, subscribed, etc.):
```json
{
  "calendars": [
    { "id": "ABC123...", "title": "Work", "source": "Exchange" },
    { "id": "DEF456...", "title": "Personal", "source": "iCloud" }
  ]
}
```

#### 4. Create Calendar Aliases

Create friendly aliases for calendars you want to sync:

```bash
# Main work calendar
ekctl alias set work "YOUR-WORK-CALENDAR-ID"

# Personal calendar
ekctl alias set personal "YOUR-PERSONAL-CALENDAR-ID"

# Team/shared calendar (optional)
ekctl alias set team "YOUR-TEAM-CALENDAR-ID"
```

Aliases are stored in `~/.ekctl/config.json`.

#### 5. Configure the Skill

Edit `.claude/skills/_sub/fetch/get-calendar/calendars.json`:

```json
{
  "calendars": ["work", "personal"],
  "default_scope": "today",
  "settings": {
    "work_hours": { "start": "09:00", "end": "18:00" },
    "min_focus_block_minutes": 30,
    "one_on_one_patterns": ["1:1", "1-1"]
  }
}
```

#### 6. Test

```bash
# List events for today
ekctl list events --calendar work \
  --from "$(date -v0H -v0M -v0S +%Y-%m-%dT%H:%M:%S%z)" \
  --to "$(date -v23H -v59M -v59S +%Y-%m-%dT%H:%M:%S%z)"
```

### Recommended Calendar Setup

| Alias | Calendar | Purpose |
|-------|----------|---------|
| `work` | Main work calendar | Meetings, reviews, standups |
| `personal` | Personal calendar | Personal appointments |
| `team` | Team/shared calendar | Team events, OOO |

### Usage in Rituals

The `get-calendar` sub-skill is used by planning rituals to:
- Pre-populate the Meetings section in Today.md
- Identify 1:1s and apply the 1:1 template format
- Calculate focus blocks between meetings
- Set the `meetings` count in frontmatter

## GitHub Integration

Use the `gh` CLI for all GitHub interactions (issues, PRs, repos, etc.) instead of MCP GitHub tools.

### Common Commands

```bash
# Issues
gh issue create --title "Title" --body "Description"
gh issue list
gh issue view 123

# Pull Requests
gh pr create --title "Title" --body "Description"
gh pr list
gh pr view 123

# Repository
gh repo view
```

### Authentication

The `gh` CLI uses your local GitHub authentication. If not authenticated:

```bash
gh auth login
```

### Issue Labels

The repository uses a hierarchical label system following Scrum methodology:

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

**Scope labels (2bd-specific):**

| Label | Description | Color |
|-------|-------------|-------|
| `scope:skill` | Claude skill implementation | Light Pink #f9a8d4 |
| `scope:ritual` | Planning or review ritual | Pink #f472b6 |
| `scope:template` | Template files | Hot Pink #ec4899 |
| `scope:integration` | External tool integration | Deep Pink #db2777 |

**Filtering examples:**

```bash
# View by hierarchy level
gh issue list --label "type:epic"      # Strategic initiatives
gh issue list --label "type:story"     # Sprint-level work
gh issue list --label "type:task"      # Implementation tasks

# View by scope
gh issue list --label "scope:skill"
gh issue list --label "scope:integration"

# Combined filters
gh issue list --label "type:story" --label "scope:skill"
```
