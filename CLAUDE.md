# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**2bd (Second Brain Daemon)** is a personal knowledge system that runs itself—powered by Claude Skills, driven by rituals, stored in markdown. It uses Claude Skills to automate productivity rituals, organizing information by **Metabolic State** (energy velocity and temporal density) rather than just topic.

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
- **Actions**: Discrete one-shot helpers triggered on-demand (e.g., create-project)
- **Captive Notes**: Working documents (Today.md, Week.md, Month.md, Quarter.md, Year.md)
- **Periodic Notes**: Unique consecutive archives (2026-02-08.md, 2026-W06.md, etc.)
- **Hubs**: Central navigation notes that organize content by domain (✱ Home, ✱ Projects, ✱ People, ✱ Insights)
- **Skills**: Claude Skills that implement rituals and actions, callable from Claude Code CLI or Claude.ai

### Repository Structure

```
2bd/
│
├── 00_Brain/                    # Metabolic state hierarchy
│   ├── ✱ Home.md                # Central Hub - links to all domains
│   ├── Captive/                 # Sensory/Intake - working notes
│   │   ├── Today.md             # Current day working note
│   │   ├── Week.md              # Current week working note
│   │   ├── Month.md             # Current month working note
│   │   ├── Quarter.md           # Current quarter working note
│   │   ├── Year.md              # Current year working note
│   │   └── Flash/               # Raw unstructured stimuli
│   ├── Synthetic/               # Short-term/Executive - active project work
│   ├── Periodic/                # Episodic/Rhythm - timeline archives
│   │   ├── Daily/               # YYYY-MM-DD.md (e.g., 2026-02-08.md)
│   │   ├── Weekly/              # gggg-[W]ww.md (e.g., 2026-W06.md)
│   │   ├── Monthly/             # YYYY-MM.md (e.g., 2026-02.md)
│   │   ├── Quarterly/           # YYYY-[Q]Q.md (e.g., 2026-Q1.md)
│   │   └── Yearly/              # YYYY.md (e.g., 2026.md)
│   ├── Semantic/                # Long-term/Reference - crystallized knowledge
│   └── Systemic/                # Procedural/Structure - templates, SOPs
│       └── Templates/
│           ├── Captive/         # Templates for working notes
│           └── Periodic/        # Templates for archives
│
├── 01_Projects/                 # PARA: Active projects (deadline-driven)
│   ├── ✱ Projects.md            # Projects Hub - navigation for all projects
│   └── ...
│
├── 02_Areas/                    # PARA: People and Insights
│   ├── Insights/                # AI-generated thematic patterns
│   │   ├── ✱ Insights.md        # Insights Hub - navigation for themes
│   │   └── ...
│   └── People/                  # Living notes for individuals
│       ├── ✱ People.md          # People Hub - navigation for relationships
│       └── ...
│
├── 03_Resources/                # PARA: Templates
│   └── _Templates/
│       └── para/                # Templates for PARA method files
│
├── 04_Archives/                 # PARA: Completed projects
│   └── Projects/                # Completed projects
│
└── .claude/                     # Claude-specific configuration
    └── skills/
        ├── rituals/             # Scheduled routine skills
        └── actions/             # One-shot helper skills
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

## Working with 2bd

### Key Files

- **Central Hub:** `00_Brain/✱ Home.md`
- **Captive notes (active workspace):** `00_Brain/Captive/`
  - Today.md, Week.md, Month.md, Quarter.md, Year.md
- **Periodic archives:** `00_Brain/Periodic/`
  - Daily/, Weekly/, Monthly/, Quarterly/, Yearly/
- **Templates:**
  - `00_Brain/Systemic/Templates/Captive/` - Working note templates
  - `00_Brain/Systemic/Templates/Periodic/` - Archive templates
  - `03_Resources/_Templates/para/` - PARA templates
- **Hubs:**
  - `01_Projects/✱ Projects.md` - Projects navigation
  - `02_Areas/People/✱ People.md` - People navigation
  - `02_Areas/Insights/✱ Insights.md` - Insights navigation
- **Skills:** `.claude/skills/rituals/` and `.claude/skills/actions/`

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
