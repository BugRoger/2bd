# Codebase Structure

**Analysis Date:** 2026-02-28

## Directory Layout

```
2bd/
├── .claude/                    # Claude Code configuration and skills
│   ├── skills/                 # All executable skills
│   │   ├── ada/                # Executive Assistant (orchestrator)
│   │   ├── _assistant-*/       # Domain assistants (goals, calendar, journal, etc.)
│   │   ├── _specs/             # Skill contracts (output-format, timescales, etc.)
│   │   └── _util-*/            # Utility skills (changelog, date resolution)
│   ├── hooks/                  # Git hooks and skill activation rules
│   └── config.md               # User configuration (vault path, etc.)
├── .claude-plugin/             # Claude IDE plugin configuration
│   ├── plugin.json             # Plugin metadata (name, version, author)
│   └── marketplace.json        # Marketplace configuration
├── .planning/                  # GSD orchestrator outputs
│   └── codebase/               # Codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
├── .plans/                     # Implementation plans created by `/gsd:plan-phase`
├── docs/                       # Public documentation (Mintlify)
│   ├── ada/                    # Ada-specific docs
│   ├── assistants/             # Assistant documentation
│   ├── configuration/          # Setup and configuration guides
│   ├── overview/               # Getting started docs
│   ├── reference/              # API reference and deep dives
│   └── images/                 # Documentation assets
├── vault/                      # Symlink to OneDrive Second Brain (user's persistent storage)
│   └── (see Vault Structure below)
├── README.md                   # Project overview and quick start
├── CLAUDE.md                   # Project-specific Claude Code guidelines
├── CHANGELOG.md                # Version history
└── TODO.md                     # Current work items

```

## Directory Purposes

**.claude/ - Skill System:**
- Purpose: All executable skills and Claude Code configuration
- Contains: Ada orchestrator, 6 domain assistants, utility skills, specification contracts
- Key files: `.claude/config.md` (user config), `.claude/skills/ada/SKILL.md` (entrypoint)

**.claude/skills/ - Skill Registry:**
- Purpose: Central repository of all executable skills
- Contains: 3 namespaces - main skills (ada, person, plan, project, reflect), domain assistants (_assistant-*), utilities (_util-*, _specs)
- Pattern: Each skill is a directory with SKILL.md manifest + action reference files

**.claude/skills/ada/ - Executive Assistant:**
- Purpose: Ritual orchestrator; main entry point to 2bd
- Contains: SKILL.md, templates for daily/weekly/quarterly/yearly, references for plan/reflect/setup/compose/project/person
- Key files:
  - `SKILL.md` - manifest and usage documentation
  - `templates/` - base templates for each timescale with frontmatter
  - `references/` - sequences and actions (plan/, reflect/, setup/, compose/, etc.)

**.claude/skills/_assistant-{name}/ - Domain Assistants:**
- Purpose: Specialize in one domain across all supported timescales
- Contains: SKILL.md with timescale declarations, plan/reflect/learn action references, templates
- Pattern: Each assistant repeats the same structure (6 total: goals, calendar, journal, achievements, relationships, projects)
- Examples:
  - `_assistant-journal/` - reflection and insight capture
  - `_assistant-goals/` - 1-3-5 goals and Major Moves
  - `_assistant-calendar/` - meeting prep and time shape

**.claude/skills/_specs/ - Specification Contracts:**
- Purpose: Define standards and contracts for all skills
- Contains: output-format.md (expected output structure), timescales.md (timescale support contract), knowledge-model.md (learning contract)
- Used by: All assistants during implementation

**docs/ - Public Documentation:**
- Purpose: Mintlify-hosted documentation at https://2bd.l48a.de
- Contains: User guides, API reference, setup instructions
- Subdirectories:
  - `ada/` - How Ada works, talking to Ada, first ritual
  - `assistants/` - Documentation for each assistant
  - `configuration/` - Installation, settings, integrations
  - `overview/` - What is 2bd, quick start, what you get
  - `reference/` - Creating custom rituals/assistants, templates, naming conventions
  - `images/` - SVG diagrams and assets

**vault/ - Persistent User Data:**
- Purpose: User's Second Brain - markdown knowledge base organized by metabolic state
- Contains: 00_Brain, 01_Projects, 02_Areas, 04_Archives (see Vault Structure below)
- Is symlink: Points to user's OneDrive Second Brain folder
- Updated by: All assistants during plan/reflect rituals

## Key File Locations

**Entry Points:**
- `.claude/skills/ada/SKILL.md` - Main Ada skill manifest; user's primary interface
- `.claude/config.md` - User configuration (vault path, profile settings)
- `/ada` - Slash command to invoke Ada

**Configuration:**
- `CLAUDE.md` - Project-specific guidelines and rules for Claude Code
- `.claude/hooks/skill-activation-forced-eval.sh` - Ensures skills are activated before use
- `2bd.code-workspace` - VS Code workspace configuration

**Ritual Sequences:**
- `.claude/skills/ada/references/plan/daily.md` - Daily planning sequence
- `.claude/skills/ada/references/reflect/daily.md` - Daily reflection sequence
- `.claude/skills/ada/references/plan/weekly.md` - Weekly planning sequence
- `.claude/skills/ada/references/compose/compose.md` - Output assembly logic

**Templates:**
- `.claude/skills/ada/templates/daily.md` - Base template with frontmatter
- `.claude/skills/_assistant-{name}/templates/daily.md` - Assistant section templates
- `vault/00_Brain/Systemic/Templates/` - User's template copies (synced from `.claude/skills/`)

**Vault Structure (User Data):**
```
vault/00_Brain/
├── ✱ Home.md                  # Central navigation hub
├── Captive/                   # Working notes (volatile)
│   ├── Today.md               # Current day working notes
│   ├── Week.md                # Current week working notes
│   ├── Quarter.md             # Current quarter working notes
│   └── Year.md                # Current year working notes
├── Periodic/                  # Archives (immutable timeline)
│   ├── Daily/YYYY-MM-DD.md    # Archived daily reflections
│   ├── Weekly/YYYY-Www.md     # Archived weekly reflections
│   ├── Quarterly/YYYY-QN.md   # Archived quarterly reflections
│   └── Yearly/YYYY.md         # Archived yearly reflections
├── Synthetic/Assistants/      # Assistant draft outputs
│   ├── goals/observations.md  # Latest goals assistant output
│   ├── calendar/observations.md # Latest calendar assistant output
│   └── compose/               # Compose operation logs
├── Semantic/                  # Graduated learnings
│   └── {ritual-name}/insights.md # High-confidence pattern analysis
└── Systemic/                  # Infrastructure
    ├── Templates/             # Template library
    ├── Directives/            # user-profile.md, ai-personality.md
    ├── Ada/section-order.md   # Section ordering for compose
    └── Coaching/              # Leadership coaching prompts

vault/01_Projects/
├── ✱ Projects.md              # Projects hub
├── 2026-03-15-launch.md       # Project with deadline prefix (YYYY-MM-DD-name)
└── ...

vault/02_Areas/
├── People/
│   ├── ✱ People.md            # People hub
│   └── FirstNameL.md          # Person note (FirstName + Initial)
└── Insights/
    ├── ✱ Insights.md          # Insights hub
    └── lowercase-hyphens.md   # Thematic insight
```

## Naming Conventions

**Files:**
- Skills: Lowercase with hyphens (e.g., `_assistant-journal`)
- Vault hubs: `✱ Title.md` (e.g., `✱ Home.md`, `✱ Projects.md`)
- Daily notes: `YYYY-MM-DD.md` (ISO 8601 date)
- Weekly notes: `YYYY-Www.md` (ISO week, e.g., `2026-W06.md`)
- Quarterly notes: `YYYY-QN.md` (e.g., `2026-Q1.md`)
- Yearly notes: `YYYY.md` (e.g., `2026.md`)
- Projects: `YYYY-MM-DD-name.md` (deadline prefix for sorting, lowercase-hyphens name)
- People: `FirstNameL.md` (first name + last initial, e.g., `EstherS.md`)
- Insights: `lowercase-hyphens.md` (thematic name)

**Directories:**
- Skills: Lowercase with hyphens (`ada`, `_assistant-goals`, `_util-changelog`)
- Metabolic states: PascalCase (`Captive`, `Periodic`, `Semantic`, `Synthetic`, `Systemic`)
- Years/periods: Uppercase with numbers (`YYYY-MM-DD`, `YYYY-Www`)
- Topics: lowercase or PascalCase depending on context (e.g., `Templates`, `Coaching`)

## Where to Add New Code

**New Skill:**
- Create `.claude/skills/{skill-name}/` directory
- Add `SKILL.md` with manifest (name, description, argument-hint)
- Create action reference files (e.g., `plan/daily.md`, `reflect/daily.md`)
- If domain assistant: Add timescales declaration in SKILL.md frontmatter
- Register skill location in `.claude/skills/` parent

**New Assistant Action Reference:**
- Location: `.claude/skills/_assistant-{name}/[plan|reflect|learn]/{timescale}.md`
- Pattern: List @-mentions of other skills to invoke in sequence
- Example: See `.claude/skills/ada/references/plan/daily.md`

**New Assistant Template Section:**
- Location: `.claude/skills/_assistant-{name}/templates/{timescale}.md`
- Pattern: Markdown with ## Section heading matching final output
- Gets inserted into Captive/Periodic files at position defined by `vault/00_Brain/Systemic/Ada/section-order.md`

**New Vault Structure Path:**
- Must follow metabolic state pattern
- Working paths: `vault/00_Brain/Synthetic/`
- Archive paths: `vault/00_Brain/Periodic/`
- Reference paths: `vault/00_Brain/Semantic/`
- Infrastructure: `vault/00_Brain/Systemic/`
- Active work: `vault/01_Projects/`
- Ongoing contexts: `vault/02_Areas/`

**Utility Skill (non-interactive helper):**
- Location: `.claude/skills/_util-{name}/`
- Pattern: Implements single focused action; no timescale support
- Examples: `_util-changelog` (generates CHANGELOG.md), `_util-resolve-date` (parses date strings)

## Special Directories

**.planning/codebase/ - Analysis Output:**
- Purpose: Generated by GSD orchestrator for codebase analysis
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md
- Generated: Yes (on-demand via `/gsd:map-codebase`)
- Committed: Yes

**.plans/ - Implementation Plans:**
- Purpose: Phase execution plans created by `/gsd:plan-phase`
- Contains: Markdown files with task breakdowns (named by date and feature)
- Generated: Yes (on-demand via `/gsd:plan-phase`)
- Committed: Yes

**.obsidian/ - Vault Configuration:**
- Purpose: Obsidian settings for vault rendering
- Contains: Plugin configs (periodic-notes, templater, dataview), theme settings
- Generated: No (user-managed)
- Committed: Yes

**.claude-plugin/ - IDE Integration:**
- Purpose: Claude IDE configuration for 2bd plugin
- Contains: plugin.json (metadata), marketplace.json (distribution config)
- Generated: No (manual configuration)
- Committed: Yes

**vault/ - Symlink to OneDrive:**
- Purpose: User's persistent knowledge base
- Points to: `/Users/D038720/OneDrive - SAP SE/Second Brain/`
- Generated: No (user-managed, external)
- Committed: No (symlink only, not contents)

---

*Structure analysis: 2026-02-28*
