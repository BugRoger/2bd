# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**2bd (Second Brain Daemon)** is a personal knowledge and productivity system built as a collection of Claude Skills. It helps manage rituals (scheduled routines like daily reviews, weekly planning) and actions through structured interactions with Claude.

## Architecture

### Core Concepts

- **Rituals**: Scheduled routines that drive the engine (daily review, weekly planning, monthly reflection, etc.) - provide structure and rhythm to knowledge work
- **Actions**: Discrete one-shot helpers that can be triggered within rituals or standalone - change Living Notes or interact with related tools
- **Skills**: Claude Skills that implement rituals and actions, callable from Claude Code CLI or Claude.ai

### Repository Structure

This repository is organized around Claude Skills rather than traditional source code:

```
/00_Brain/         # System files and temporal organization
  /Current/        # Active Living Notes
  /Day/            # Daily templates (day-01.md through day-31.md)
  /Month/          # Monthly templates (january-december)
  /Quarter/        # Quarterly templates (q1-q4)
/01_Projects/      # PARA: Active projects (single files with end-dates)
/02_Areas/         # PARA: Ongoing responsibilities (organized in subfolders)
  /Health/
  /Career/
  /Relationships/
/03_Resources/     # PARA: Reference materials (single files)
/04_Archives/      # PARA: Completed/inactive items
/.claude/          # Claude-specific configuration
  /skills/         # Claude Skill definitions
    /rituals/      # Scheduled routine skills (manual invocation only)
      /planning/   # Forward-looking rituals (daily, weekly, yearly)
      /review/     # Reflective rituals (daily, weekly, monthly, quarterly, yearly)
    /actions/      # One-shot helper skills (auto-invocable)
```

### Skill File Structure

Each skill is in its own folder with:
- **`SKILL.md`** (required): Main skill definition with YAML frontmatter and instructions
- **`template.md`** (optional): Template for consistent output formatting
- **`examples/`** (optional): Example outputs for reference
- **`scripts/`** (optional): Helper scripts Claude can execute

Example skill structure:
```
daily-review/
├── SKILL.md           # Main skill definition
├── template.md        # Output template
└── examples/
    └── sample.md      # Example review
```

### Skill Organization

Each skill should be self-contained with:
- **Clear purpose:** Name and description that indicates when to use it
- **YAML frontmatter:** Configuration in SKILL.md (name, description, allowed-tools, etc.)
- **Instructions:** Markdown content Claude follows when skill is invoked
- **Templates/examples:** Optional supporting files for consistent outputs
- **Integration points:** Document how skills compose with other skills

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

Can use substitutions:
- $ARGUMENTS or $0, $1, etc.
- !`command` for dynamic context injection
```

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
3. Create `template.md` for consistent output format
4. Specify required context (previous reviews, calendar, tasks) using `!`command`` syntax
5. Document the ritual flow and expected outcomes
6. Test with `/ritual-name` command

### Creating New Actions

When adding a new action skill:
1. Create folder in `.claude/skills/actions/`
2. Add `SKILL.md` with frontmatter:
   - Keep `disable-model-invocation: false` (allow auto-invocation)
   - Write clear, specific `description` so Claude knows when to use it
   - Add `argument-hint` to guide users
   - Define `allowed-tools` for streamlined execution
3. Keep instructions focused and composable
4. Document integration with rituals (how they can call this action)
5. Test both manual (`/action-name`) and automatic (conversational) invocation

### Skill Dependencies

Track which skills depend on or enhance others. Rituals often compose multiple actions, so document these relationships clearly.

## Working with 2bd

### Key Files

- **System folder:** `00_Brain/`
  - Current Living Notes: `00_Brain/Current/*.md`
  - Daily templates: `00_Brain/Day/` (day-01.md through day-31.md)
  - Monthly templates: `00_Brain/Month/` (january.md through december.md)
  - Quarterly templates: `00_Brain/Quarter/` (q1.md through q4.md)
- **PARA folders:** `01_Projects/`, `02_Areas/` (with subfolders), `03_Resources/`, `04_Archives/`
- **Skills:** `.claude/skills/rituals/` (with `planning/` and `review/` subfolders) and `.claude/skills/actions/`
  - Each skill has its own folder with `SKILL.md` (required) and optional supporting files
  - Rituals: Manual invocation only (`disable-model-invocation: true`)
    - Planning rituals: Forward-looking (daily, weekly, yearly)
    - Review rituals: Reflective (daily, weekly, monthly, quarterly, yearly)
  - Actions: Auto-invocable based on conversational context

### Skill Testing

When modifying skills:
- Test manual invocation: `/skill-name` from Claude Code CLI
- Test auto-invocation: Conversational requests that match the description
- Verify template rendering with realistic data
- Ensure ritual flows work end-to-end (context gathering → generation → file updates → archival)
- Check integration with any external tools (calendar, task managers, note-taking apps)
- Validate `allowed-tools` permissions are sufficient
- Test argument handling: `$ARGUMENTS`, `$0`, `$1`, etc.
- Verify dynamic context injection: `!`command`` syntax works

### Personal Knowledge System Philosophy

2bd follows a "second brain" approach:
- Rituals provide rhythm and structure (they drive the engine)
- Actions are building blocks for workflows (one-shot helpers)
- The system augments memory and planning, not replacing human judgment
- Skills should be opinionated about productivity best practices while remaining flexible
