---
title: "Vault structure"
description: "Complete reference for vault organization."
---

The vault stores your notes organized by [metabolic state](/overview/concepts#metabolic-states). See [Core concepts](/overview/concepts) for the reasoning behind this organization.

## Top-level structure

```
2bd-vault/
├── 00_Brain/          # Core system
├── 01_Projects/       # Active work
├── 02_Areas/          # Ongoing domains
├── 04_Archives/       # Completed work
└── .obsidian/         # Obsidian config
```

## 00_Brain: Core system

The heart of 2bd. Organized by metabolic state.

```
00_Brain/
├── ✱ Home.md              # Central hub
├── Captive/               # Working notes
│   ├── Today.md
│   ├── Week.md
│   ├── Month.md
│   ├── Quarter.md
│   └── Year.md
├── Periodic/              # Archives
│   ├── Daily/             # YYYY-MM-DD.md
│   ├── Weekly/            # YYYY-Www.md
│   ├── Monthly/           # YYYY-MM.md
│   ├── Quarterly/         # YYYY-QN.md
│   └── Yearly/            # YYYY.md
├── Semantic/              # Crystallized knowledge
│   └── {ritual-name}/     # Created on first use
│       └── insights.md
├── Synthetic/             # Active drafts
│   └── {ritual-name}/     # Created on first use
│       └── observations.md
└── Systemic/              # Infrastructure
    ├── Templates/
    ├── Directives/
    └── Coaching/
```

## 01_Projects: Active work

```
01_Projects/
├── ✱ Projects.md          # Project hub
├── 2026-03-15-launch.md   # End-date prefix for sorting
├── 2026-06-30-migration.md
└── ...
```

Projects use end-date prefix so nearest deadlines sort first.

## 02_Areas: Ongoing domains

```
02_Areas/
├── People/
│   ├── ✱ People.md        # People hub
│   ├── EstherS.md         # FirstNameL format
│   └── ...
└── Insights/
    ├── ✱ Insights.md      # Insights hub
    ├── leadership.md      # lowercase-with-hyphens
    └── ...
```

## Naming conventions

| Type | Format | Example |
|------|--------|---------|
| Hubs | `✱ Title.md` | `✱ Home.md` |
| Daily | `YYYY-MM-DD.md` | `2026-02-08.md` |
| Weekly | `YYYY-Www.md` | `2026-W06.md` |
| Monthly | `YYYY-MM.md` | `2026-02.md` |
| Quarterly | `YYYY-QN.md` | `2026-Q1.md` |
| Yearly | `YYYY.md` | `2026.md` |
| Projects | `YYYY-MM-DD-name.md` | `2026-03-15-launch.md` |
| People | `FirstNameL.md` | `EstherS.md` |
| Insights | `lowercase-hyphens.md` | `leadership.md` |

## Hubs

Central navigation notes marked with `✱` prefix:

| Hub | Location | Purpose |
|-----|----------|---------|
| ✱ Home | `00_Brain/` | Central navigation |
| ✱ Projects | `01_Projects/` | Active work overview |
| ✱ People | `02_Areas/People/` | Relationship notes |
| ✱ Insights | `02_Areas/Insights/` | Thematic learnings |

All hubs share a navigation bar:
```markdown
[[00_Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | ...
```

## Systemic folders

### Templates

```
Systemic/Templates/
├── Captive/           # today.md, week.md, etc.
├── Periodic/          # daily.md, weekly.md, etc.
├── Projects/          # project.md
└── Areas/
    ├── People/        # person.md
    └── Insights/      # insight.md
```

### Directives

```
Systemic/Directives/
├── user-profile.md    # Who you are
└── ai-personality.md  # How Claude communicates
```

### Coaching

```
Systemic/Coaching/
├── planning.md        # Planning ritual guidance
├── review.md          # Review ritual guidance
└── leadership.md      # Leadership coaching prompts
```

## Related

- [Core concepts](/overview/concepts) — Understanding metabolic states
- [Templates](/development/templates) — Modifying templates
- [Directives](/development/directives) — Personalizing Claude
- [Naming conventions](/reference/naming-conventions) — Detailed naming rules
