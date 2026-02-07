# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**2bd (Second Brain Daemon)** is a personal knowledge system that runs itself—powered by Claude Skills, driven by rituals, stored in markdown. It uses Claude Skills to automate productivity rituals, maintaining **Living Notes** (Day.md, Week.md, Month.md, Quarter.md) through scheduled **Rituals**, organizing everything using the **PARA method** in plain markdown files.

## Architecture

### Core Concepts

- **Rituals**: Scheduled routines that drive the engine (daily planning, daily review, weekly planning, weekly review, monthly review, quarterly review, yearly planning, yearly review)
- **Actions**: Discrete one-shot helpers triggered on-demand (e.g., create-project)
- **Living Notes**: Continuously evolving documents that get updated by rituals (Day.md, Week.md, Month.md, Quarter.md)
- **Hubs**: Central navigation notes that organize content by domain (✱ Home, ✱ Projects, ✱ People, ✱ Insights)
- **Skills**: Claude Skills that implement rituals and actions, callable from Claude Code CLI or Claude.ai

### Repository Structure

This repository follows the PARA method with a Hot/Cold brain system:

```
2bd/
│
├── 01_Projects/             # PARA: Active projects (deadline-driven)
│   ├── ✱ Projects.md        # Projects Hub - navigation for all projects
│   ├── 2026-06-30-launch-2bd.md
│   └── ...
│
├── 02_Areas/                # PARA: People and Insights
│   ├── Insights/            # AI-generated thematic patterns from Cold
│   │   ├── ✱ Insights.md    # Insights Hub - navigation for themes
│   │   └── ...
│   └── People/              # Living notes for individuals (user + rituals)
│       ├── ✱ People.md      # People Hub - navigation for relationships
│       └── ...
│
├── 03_Resources/            # PARA: Brain and templates
│   ├── _Templates/          # Meta-resource: Template library
│   │   ├── current/         # Templates for Hot notes
│   │   ├── para/            # Templates for PARA method files
│   │   ├── resources/       # Templates for Cold synthesis notes
│   │   └── archives/
│   └── Brain/               # All brain content lives here
│       ├── ✱ Home.md        # Central Hub - links to all other Hubs
│       ├── Hot/             # Active working space (user writes here only)
│       │   ├── Day.md       # Today's working note
│       │   ├── Week.md      # This week's working note (ephemeral)
│       │   ├── Month.md     # This month's working note
│       │   ├── Quarter.md   # This quarter's working note
│       │   └── Year.md      # Current year (always hot)
│       └── Cold/            # Year-agnostic synthesis (rituals write only)
│           ├── Days/        # 366 files: 01-01.md through 12-31.md
│           ├── Months/      # 12 files: 01-january.md through 12-december.md
│           └── Quarters/    # 4 files: q1.md through q4.md
│
├── 04_Archives/             # PARA: Backup snapshots (ephemeral notes only)
│   ├── Brain/Weekly/        # Archived weekly notes (ISO 8601: YYYY-Www.md)
│   └── Projects/            # Completed projects
│
└── .claude/                 # Claude-specific configuration
    └── skills/
        ├── rituals/         # Scheduled routine skills
        └── actions/         # One-shot helper skills
```

### Naming Conventions

- **Hubs:** Use `✱` prefix with Title Case: `✱ Home.md`, `✱ Projects.md`, `✱ People.md`, `✱ Insights.md`
- **Meta-resources:** Underscore prefix for system/template files: `_Templates/`, `_Guides/`
- **Hot Notes:** In `03_Resources/Brain/Hot/`, capitalized (Day.md, Week.md, Month.md, Quarter.md, Year.md)
- **Cold Notes (Year-Agnostic):**
  - Days: `MM-DD.md` format (01-01.md through 12-31.md, includes leap day 02-29.md)
  - Months: `NN-monthname.md` format (01-january.md through 12-december.md)
  - Quarters: `qN.md` format (q1.md through q4.md)
- **People:** In `02_Areas/People/`, `<FirstName><LastInitial>.md` format (EstherS.md, JonnyB.md, MichaelS.md). Disambiguate when first name + last initial collide by using more letters of the last name (DavidHo.md, DavidHe.md, DavidR.md) - user + rituals edit
- **Insights:** In `02_Areas/Insights/`, lowercase-with-hyphens (leadership.md, productivity.md) - rituals only
- **Projects:** End-date first for lexical sorting: `YYYY-MM-DD-project-name.md`
- **Archives (Weekly):** ISO 8601 week format: `YYYY/YYYY-Www.md` (e.g., 2026/2026-W06.md)
- **Folders:** Numbered for sorting (`01_`, `02_`, `03_`, `04_`)
- **Skills:** Each skill in own folder with `SKILL.md` and optional supporting files

### Hubs

Hubs are central navigation notes that organize content by domain. Inspired by [MyForeverNotes](https://www.myforevernotes.com/docs/hubs), each Hub:

- **Acts as a map** - Central navigation point for a domain
- **Uses `✱` prefix** - Visual distinction: `✱ Home`, `✱ Projects`, `✱ People`, `✱ Insights`
- **Links bidirectionally** - Hubs link to notes, notes link back to Hubs
- **Contains dataview queries** - Dynamic lists of domain content
- **Includes related Hubs** - Cross-references to other domains

**Hub hierarchy:**
```
✱ Home (central hub, in Brain/)
├── ✱ Projects (active work)
├── ✱ People (relationships)
└── ✱ Insights (thematic learnings)
```

**Navigation pattern** - All Hubs and notes use consistent navigation bar:
```markdown
[[03_Resources/Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]
```

### Templates

All note templates are stored in `03_Resources/_Templates/`:

- **current/**: Templates for Hot notes (Day.md, Week.md, Month.md, Quarter.md)
- **para/**: Templates for PARA method files (project.md, person.md, insight.md)
- **resources/**: Templates for Cold synthesis notes (day.md, month.md, quarter.md, year.md)
- **archives/**: Template for archived weekly notes (week.md)

**Usage:** Copy templates to appropriate locations and fill in placeholders. Templates include YAML frontmatter, section headers, and example content to guide usage.

### Hot/Cold Brain System

The Hot/Cold system separates **where you work** from **where synthesis accumulates**:

**Hot (03_Resources/Brain/Hot/)** - Your active working space. This is the **only place you write**. Messy, unstructured, stream of consciousness is OK. Hot notes are living direction documents—ongoing intentions and work-in-progress that give direction. Rituals read from here and transfer content to Cold.

**Cold (03_Resources/Brain/Cold/)** - Year-agnostic historical notes that accumulate synthesis **across years**. **Rituals write here exclusively**—you never edit Cold directly. Structured, curated, high-signal.

### Editing Modes

| Location | Who Writes | Purpose |
|----------|------------|---------|
| **Hot/** | User only | Active workspace—capture, plan, reflect |
| **Cold/** | Rituals only | Year-agnostic temporal synthesis |
| **Insights/** | Rituals only | AI-generated thematic patterns from Cold |
| **People/** | Both | Rituals extract from Day.md (1:1s), user adds context |
| **Projects/** | Both | Rituals update status, user adds details |

### Year-Agnostic Accumulation

- `03_Resources/Brain/Cold/Days/02-15.md` contains synthesis from **ALL** Feb 15ths (2026, 2027, 2028...)
- `03_Resources/Brain/Cold/Months/03-march.md` contains synthesis from **ALL** Marchs across years
- Enables long-term pattern recognition: "What do I always work on in Q4?" or "What happens every February 15th?"
- Multi-year insights emerge naturally over time

### Synthesis Workflow

```
User Domain (Hot)              Ritual Domain
─────────────────              ─────────────
Hot/                           Cold/ (ritual-only)
├── Day.md    ──rituals──►     ├── Days/MM-DD.md
├── Week.md   ──rituals──►     └── Archives only (ephemeral)
├── Month.md  ──rituals──►     ├── Months/NN-month.md
├── Quarter.md──rituals──►     └── Quarters/qN.md
└── Year.md
                               Insights/ (AI-generated from Cold)
People/   ◄── both
Projects/ ◄── both
```

1. **User works in Hot/** - Day.md, Week.md, Month.md, Quarter.md, Year.md
2. **Rituals read Hot, write Cold** - Temporal synthesis to year-agnostic files
3. **Rituals read Cold, generate Insights** - AI synthesizes thematic patterns
4. **Rituals extract to People/** - 1:1 conversations from Day.md → person files
5. **Rituals update Projects/** - Status updates from Hot notes
6. **Week notes archived** - Backed up to `04_Archives/Brain/Weekly/` (ephemeral)

### Ephemeral vs. Living

- **Week notes** are ephemeral → backed up to Archives only, no Cold representation
- **Day/Month/Quarter/Year notes** synthesize to Cold (living, accumulating notes)
- **People/Projects** are collaborative → rituals contribute, user can edit directly
- **Insights** are derived → AI-generated from Cold, user does not edit

### Skill File Structure

Each skill is in its own folder with:
- **`SKILL.md`** (required): Main skill definition with YAML frontmatter and instructions
- Optional supporting files (templates, examples, scripts)

Example skill structure:
```
daily-review/
├── SKILL.md           # Main skill definition
└── ...                # Optional supporting files
```

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

| Ritual | When | Purpose | Duration |
|--------|------|---------|----------|
| **Daily Planning** | Every morning | Plan today's priorities and intentions | 5-10 min |
| **Daily Review** | Every evening | Reflect on yesterday, capture learnings | 5-10 min |
| **Weekly Planning** | Every Monday | Set this week's priorities and focus | 20-30 min |
| **Weekly Review** | Every Sunday | Reflect on last week, synthesize wins and lessons | 20-30 min |
| **Monthly Review** | First of month | Synthesize patterns, review projects | 45-60 min |
| **Quarterly Review** | Every 3 months | Assess direction, review goals | 1-2 hrs |
| **Yearly Planning** | January 1 | Set vision, define annual goals | 2-3 hrs |
| **Yearly Review** | December 31 | Reflect on the year, capture insights | 2-3 hrs |

**Usage:**
```bash
claude skill run rituals/planning/daily-planning
claude skill run rituals/review/daily-review
claude skill run rituals/planning/weekly-planning
claude skill run rituals/review/weekly-review
claude skill run rituals/review/monthly-review
claude skill run rituals/review/quarterly-review
claude skill run rituals/planning/yearly-planning
claude skill run rituals/review/yearly-review
```

## Common Actions

Actions are one-shot helpers you invoke on-demand:

| Action | Purpose | Usage |
|--------|---------|-------|
| **Create Project** | Initialize new project file with end-date | `claude skill run actions/create-project --args "Project Name" --end-date "2026-12-31"` |

## Development Guidelines

### Creating New Rituals

When adding a new ritual skill:
1. Create folder in `.claude/skills/rituals/planning/` or `.claude/skills/rituals/review/`
   - Planning rituals: Forward-looking (daily-planning, weekly-planning, yearly-planning)
   - Review rituals: Reflective (daily-review, weekly-review, monthly-review, quarterly-review, yearly-review)
2. Add `SKILL.md` with frontmatter:
   - Set `disable-model-invocation: true` (manual trigger only)
   - Define `allowed-tools` to avoid permission prompts
   - Add clear `description` for documentation
3. Document the ritual flow and expected outcomes
4. Test with `claude skill run rituals/{planning|review}/ritual-name`

### Creating New Actions

When adding a new action skill:
1. Create folder in `.claude/skills/actions/`
2. Add `SKILL.md` with frontmatter:
   - Keep `disable-model-invocation: false` (allow auto-invocation)
   - Write clear, specific `description` so Claude knows when to use it
   - Add `argument-hint` to guide users
   - Define `allowed-tools` for streamlined execution
3. Keep instructions focused and composable
4. Test with `claude skill run actions/action-name`

## Working with 2bd

### Key Files

- **Hubs:** Central navigation notes
  - `03_Resources/Brain/✱ Home.md` - Central Hub linking all domains
  - `01_Projects/✱ Projects.md` - Projects navigation
  - `02_Areas/People/✱ People.md` - People navigation
  - `02_Areas/Insights/✱ Insights.md` - Insights navigation
- **Templates:** `03_Resources/_Templates/` - All note templates organized by category
- **Hot notes (active workspace):** `03_Resources/Brain/Hot/`
  - Day.md, Week.md, Month.md, Quarter.md, Year.md
- **Cold notes (historical brain):** `03_Resources/Brain/Cold/`
  - Days/ (01-01.md through 12-31.md, 366 files)
  - Months/ (01-january.md through 12-december.md)
  - Quarters/ (q1.md through q4.md)
- **PARA folders:**
  - `01_Projects/` - Active projects with end-dates (user + rituals edit)
  - `02_Areas/Insights/` - AI-generated thematic patterns (rituals only)
  - `02_Areas/People/` - Living notes for individuals (user + rituals edit)
  - `03_Resources/` - Brain and templates
  - `04_Archives/Brain/Weekly/` - Archived weekly notes (ephemeral backups)
  - `04_Archives/Projects/` - Completed projects
- **Skills:** `.claude/skills/rituals/` and `.claude/skills/actions/`

### Skill Testing

When modifying skills:
- Test manual invocation: `claude skill run rituals/{planning|review}/skill-name` or `claude skill run actions/skill-name`
- Verify ritual flows work end-to-end (context gathering → generation → file updates → archival)
- Validate `allowed-tools` permissions are sufficient

### Personal Knowledge System Philosophy

2bd follows a "second brain" approach:
- Rituals provide rhythm and structure (they drive the engine)
- Actions are building blocks for workflows (one-shot helpers)
- The system augments memory and planning, not replacing human judgment
- **User works only in Hot** - Hot notes are living direction documents
- **Cold is ritual-only** - Year-agnostic synthesis accumulates automatically
- **Insights are AI-derived** - Thematic patterns generated from Cold
- **People/Projects are collaborative** - Rituals extract and update, user adds context

## Obsidian Integration

2bd uses Obsidian as the primary interface for writing and browsing, while Claude CLI handles ritual execution.

### Daily Workflow

**Morning:**
1. Terminal: `claude skill run rituals/planning/daily-planning`
2. Obsidian: Open [Day.md](03_Resources/Brain/Hot/Day.md) (`Cmd+Shift+D`) and work through the day

**Throughout Day:**
- Write in Day.md (meetings, 1:1s, completed work, actions)
- Capture 1:1 conversations—rituals will extract to People/
- Navigate projects via [01_Projects/✱ Projects.md](01_Projects/✱ Projects.md)
- Add context to People/ files directly if needed
- Use backlinks panel to see connections

**Evening:**
1. Obsidian: Complete Day.md sections (Wins, Insights, Completed)
2. Terminal: `claude skill run rituals/review/daily-review` (archives & synthesizes)

### Key Features

**Graph View (`Cmd+Shift+G`):**
- Color-coded by PARA category
- Temporal notes (blue) are larger
- Historical brain (purple) is smaller
- Shows knowledge connections across time
- Hover nodes to see glow effects

**Backlinks Panel:**
- See all references to current note
- Track project mentions across time
- Find related people and insights
- Automatically updated as you write

**Calendar Plugin:**
- Visual dots show daily writing activity
- Week view for Weekly archives
- Click dates to navigate

**Dataview Hubs:**
- [03_Resources/Brain/✱ Home.md](03_Resources/Brain/✱ Home.md): Central Hub - control center
- [01_Projects/✱ Projects.md](01_Projects/✱ Projects.md): Projects Hub - overview with health indicators
- [02_Areas/People/✱ People.md](02_Areas/People/✱ People.md): People Hub - relationship tracking
- [02_Areas/Insights/✱ Insights.md](02_Areas/Insights/✱ Insights.md): Insights Hub - thematic learnings

**Quick Navigation:**
- `[[Day]]` - Today's working note
- `[[Week]]` - This week's note
- `[[Month]]` - This month's note
- `[[Quarter]]` - This quarter's note
- Use wikilinks `[[project-name]]`, `[[person-name]]` to connect notes

### Hotkeys

| Hotkey | Action |
|--------|--------|
| `Cmd+Shift+D` | Open Day.md |
| `Cmd+Shift+W` | Open Week.md |
| `Cmd+Shift+M` | Open Month.md |
| `Cmd+Shift+Q` | Open Quarter.md |
| `Cmd+Shift+H` | Open ✱ Home.md |
| `Cmd+Shift+G` | Open graph view |
| `Cmd+O` | Quick switcher |
| `Cmd+[` | Navigate back |
| `Cmd+]` | Navigate forward |

### Rituals vs Obsidian

| Task | Tool |
|------|------|
| Daily planning | Claude CLI |
| Daily review & archival | Claude CLI |
| Writing during day | Obsidian |
| Browsing projects | Obsidian |
| Graph visualization | Obsidian |
| Creating project notes | Obsidian (uses templates) |
| Weekly/Monthly/Quarterly review | Claude CLI |
| Synthesis to Brain/Cold | Claude CLI |

### Setup Notes

**Community Plugins Installed:**
- **Dataview**: Powers dynamic dashboards with queries
- **Calendar**: Visual navigation and activity tracking
- **Periodic Notes**: Quick access to Week/Month/Quarter notes
- **Templater**: Auto-applies templates in PARA folders

**CSS Snippets Enabled:**
Enable these in Settings → Appearance → CSS Snippets:
- `graph-styling.css`: Color-coded graph nodes by PARA category
- `dashboard-styling.css`: Polished dashboard layouts
- `periodic-notes.css`: Enhanced temporal note formatting

**Daily Notes Configuration:**
- Points to single [Day.md](03_Resources/Brain/Hot/Day.md) (not dated files)
- Maintains 2bd's single-file Hot architecture
- Week/Month/Quarter/Year notes also use static filenames

**Template System:**
Templater automatically applies templates when creating files:
- New file in `01_Projects/` → uses [project.md](03_Resources/_Templates/para/project.md)
- New file in `02_Areas/People/` → uses [person.md](03_Resources/_Templates/para/person.md)
- New file in `02_Areas/Insights/` → uses [insight.md](03_Resources/_Templates/para/insight.md)
