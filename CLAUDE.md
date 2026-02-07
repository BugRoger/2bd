# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**2bd (Second Brain Daemon)** is a personal knowledge system that runs itself—powered by Claude Skills, driven by rituals, stored in markdown. It uses Claude Skills to automate productivity rituals, maintaining **Living Notes** (Day.md, Week.md, Month.md, Quarter.md) through scheduled **Rituals**, organizing everything using the **PARA method** in plain markdown files.

## Architecture

### Core Concepts

- **Rituals**: Scheduled routines that drive the engine (daily planning, daily review, weekly planning, weekly review, monthly review, quarterly review, yearly planning, yearly review)
- **Actions**: Discrete one-shot helpers triggered on-demand (e.g., create-project)
- **Living Notes**: Continuously evolving documents that get updated by rituals (Day.md, Week.md, Month.md, Quarter.md)
- **Skills**: Claude Skills that implement rituals and actions, callable from Claude Code CLI or Claude.ai

### Repository Structure

This repository follows the PARA method with a two-tier brain system:

```
2bd/
│
├── 00_Brain/                # User's active working space
│   └── Current/             # Living temporal notes (user works here)
│       ├── Day.md           # Today's working note
│       ├── Week.md          # This week's working note
│       ├── Month.md         # This month's working note
│       └── Quarter.md       # This quarter's working note
│
├── 01_Projects/             # PARA: Active projects (deadline-driven)
│   ├── 2026-06-30-launch-2bd.md
│   ├── 2026-06-30-q2-okrs.md
│   └── 2026-12-31-home-renovation.md
│
├── 02_Areas/                # PARA: Insights and People living notes
│   ├── Insights/            # Theme-based insights extracted from temporal notes
│   │   ├── leadership.md
│   │   ├── productivity.md
│   │   └── team-dynamics.md
│   └── People/              # Living notes for individuals
│       ├── john-doe.md
│       ├── jane-smith.md
│       └── sarah-chen.md
│
├── 03_Resources/            # PARA: Living historical brain (year-agnostic)
│   ├── _Templates/          # Meta-resource: Template library (underscore prefix)
│   │   ├── current/         # Templates for 00_Brain/Current/ notes
│   │   │   ├── Day.md
│   │   │   ├── Week.md
│   │   │   ├── Month.md
│   │   │   └── Quarter.md
│   │   ├── para/            # Templates for PARA method files
│   │   │   ├── project.md
│   │   │   ├── person.md
│   │   │   └── insight.md
│   │   ├── resources/       # Templates for Resources/Brain/ synthesis notes
│   │   │   ├── day.md
│   │   │   ├── month.md
│   │   │   ├── quarter.md
│   │   │   └── year.md
│   │   └── archives/
│   │       └── week.md
│   └── Brain/
│       ├── Days/            # 366 files: 01-01.md through 12-31.md
│       │   ├── 01-01.md     # Accumulates all Jan 1 synthesis across years
│       │   ├── 01-02.md     # Accumulates all Jan 2 synthesis across years
│       │   └── ...          # (through 12-31.md)
│       ├── Months/          # 12 files: 01-january.md through 12-december.md
│       │   ├── 01-january.md
│       │   ├── 02-february.md
│       │   └── ...
│       ├── Quarters/        # 4 files: q1.md through q4.md
│       │   ├── q1.md
│       │   ├── q2.md
│       │   ├── q3.md
│       │   └── q4.md
│       └── Year.md          # Multi-year accumulation of yearly synthesis
│
├── 04_Archives/             # PARA: Backup snapshots (ephemeral notes only)
│   ├── Brain/
│   │   └── Weekly/          # Archived weekly notes (ISO 8601: YYYY-Www.md)
│   │       └── 2026/
│   │           ├── 2026-W01.md
│   │           ├── 2026-W02.md
│   │           └── ...
│   └── Projects/            # Completed projects
│       └── 2025-12-15-old-website.md
│
└── .claude/                 # Claude-specific configuration
    └── skills/
        ├── rituals/         # Scheduled routine skills
        │   ├── planning/    # Forward-looking rituals
        │   │   ├── daily-planning/
        │   │   ├── weekly-planning/
        │   │   └── yearly-planning/
        │   └── review/      # Reflective rituals
        │       ├── daily-review/
        │       ├── weekly-review/
        │       ├── monthly-review/
        │       ├── quarterly-review/
        │       └── yearly-review/
        └── actions/         # One-shot helper skills
            └── create-project/
```

### Naming Conventions

- **Meta-resources:** Underscore prefix for system/template files: `_Templates/`, `_Guides/`
- **Current Working Notes:** In `00_Brain/Current/`, capitalized (Day.md, Week.md, Month.md, Quarter.md)
- **Resources Brain (Year-Agnostic Living Notes):**
  - Days: `MM-DD.md` format (01-01.md through 12-31.md, includes leap day 02-29.md)
  - Months: `NN-monthname.md` format (01-january.md through 12-december.md)
  - Quarters: `qN.md` format (q1.md through q4.md)
  - Year: `Year.md` (single file, multi-year accumulation)
- **People:** In `02_Areas/People/`, lowercase-with-hyphens (john-doe.md, jane-smith.md)
- **Insights:** In `02_Areas/Insights/`, lowercase-with-hyphens (leadership.md, productivity.md)
- **Projects:** End-date first for lexical sorting: `YYYY-MM-DD-project-name.md`
- **Archives (Weekly):** ISO 8601 week format: `YYYY/YYYY-Www.md` (e.g., 2026/2026-W06.md)
- **Folders:** Numbered for sorting (`00_`, `01_`, `02_`, `03_`, `04_`)
- **Skills:** Each skill in own folder with `SKILL.md` and optional supporting files

### Templates

All note templates are stored in `03_Resources/_Templates/`:

- **current/**: Templates for Tier 1 working notes (Day.md, Week.md, Month.md, Quarter.md)
- **para/**: Templates for PARA method files (project.md, person.md, insight.md)
- **resources/**: Templates for Tier 2 synthesis notes (day.md, month.md, quarter.md, year.md)
- **archives/**: Template for archived weekly notes (week.md)

**Usage:** Copy templates to appropriate locations and fill in placeholders. Templates include YAML frontmatter, section headers, and example content to guide usage.

### Two-Tier Brain System

**Tier 1 (00_Brain/Current/)** - Your active working space. Write here throughout the day/week/month/quarter. Messy, unstructured, stream of consciousness is OK. Rituals read from here.

**Tier 2 (03_Resources/Brain/)** - Living historical notes that accumulate synthesis **across years**. Rituals write synthesized content here. Structured, curated, high-signal.

### Year-Agnostic Accumulation

- `03_Resources/Brain/Days/02-15.md` contains synthesis from **ALL** Feb 15ths (2026, 2027, 2028...)
- `03_Resources/Brain/Months/03-march.md` contains synthesis from **ALL** Marchs across years
- Enables long-term pattern recognition: "What do I always work on in Q4?" or "What happens every February 15th?"
- Multi-year insights emerge naturally over time

### Synthesis Workflow

1. User works in `00_Brain/Current/` notes (Day, Week, Month, Quarter)
2. Review rituals extract and synthesize:
   - Temporal patterns → append to `03_Resources/Brain/{period}/{file}.md`
   - Thematic insights → append to `02_Areas/Insights/{theme}.md`
   - People mentions → append to `02_Areas/People/{person}.md`
   - Project updates → append to `01_Projects/{project}.md`
3. Week notes get backed up to `04_Archives/Brain/Weekly/` (ephemeral safety net)
4. Current note cleared for next period

### Ephemeral vs. Living

- **Week notes** are ephemeral → backed up to Archives, synthesis goes to monthly Resources note
- **Day/Month/Quarter notes** go directly to Resources (living, accumulating notes)
- No archives needed for Day/Month/Quarter - they live forever in Resources/Brain

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

- **Templates:** `03_Resources/_Templates/` - All note templates organized by category
- **Current working space:** `00_Brain/Current/`
  - Day.md, Week.md, Month.md, Quarter.md
- **Living historical brain:** `03_Resources/Brain/`
  - Days/ (01-01.md through 12-31.md, 366 files)
  - Months/ (01-january.md through 12-december.md)
  - Quarters/ (q1.md through q4.md)
  - Year.md
- **PARA folders:**
  - `01_Projects/` - Active projects with end-dates
  - `02_Areas/Insights/` - Theme-based insights
  - `02_Areas/People/` - Living notes for individuals
  - `03_Resources/` - Reference materials
  - `04_Archives/Brain/Weekly/` - Archived weekly notes
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
- Two-tier system: messy working notes (Tier 1) → structured synthesis (Tier 2)
- Year-agnostic accumulation enables multi-year pattern recognition
