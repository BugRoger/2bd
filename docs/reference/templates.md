---
title: "Templates reference"
description: "Template structure and customization guide."
---

Templates live in your vault at `00_Brain/Systemic/Templates/`. Customize them freely—they're yours.

## Template locations

| Type | Path | Used for |
|------|------|----------|
| Captive | `Templates/Captive/` | Working notes (today, week, month, quarter, year) |
| Periodic | `Templates/Periodic/` | Archive notes (daily, weekly, monthly, quarterly, yearly) |
| Projects | `Templates/Projects/` | New project files |
| People | `Templates/Areas/People/` | Person dossiers |
| Insights | `Templates/Areas/Insights/` | Insight notes |

## Captive template structure

All Captive templates share a consistent structure:

### Standard sections

| Section | Purpose |
|---------|---------|
| Context From Above | Goals from parent timescale |
| Key Outcomes | 3 priorities (Personal → Organisational → Strategic) |
| Progress | Nested period summaries |
| Carry Forward | Items for next period |
| Wins | What went well by category |
| Reflections | Insights and learnings |
| Changelog | Audit trail of ritual modifications |

### Special sections by timescale

| Template | Additional sections |
|----------|---------------------|
| today.md | Leadership Intention, Meetings, Capture |
| week.md | Coaching Check-in |
| month.md | Coaching Check-in |
| quarter.md | Coaching Themes (Patterns to Watch, Questions That Serve Me) |
| year.md | Leadership Development (Current Focus, Identity, Growth Edge) |

## The three categories

Order matters—Personal first counters "putting yourself last":

| Category | Focus | Examples |
|----------|-------|----------|
| **Personal** | Individual growth, energy, leadership | Executive presence, boundaries, habits |
| **Organisational** | Team, structure, culture, people | Hiring, delegation, team health |
| **Strategic** | Initiatives, projects, business outcomes | Delivery, roadmap, metrics |

## Customizing templates

Templates are living documents. Customize freely, but:

> ⚠️ **Warning:** Don't change H2 section names. Rituals reference these for updates. Changing them breaks the template contract.

Safe to change:
- H3 subsections within H2s
- Bullet content and examples
- Additional context or prompts

The self-learning system will evolve your templates over time based on how you actually use them.

## Changelog section

Every template includes a `## Changelog` at the bottom:

```markdown
## Changelog

- `2026-02-15 09:32` **planning-daily** — Rewrote Focus, Context From Above sections
```

This audit trail shows when rituals modified the file. Don't delete it.
