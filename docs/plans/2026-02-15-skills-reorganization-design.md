# Skills Reorganization Design

Flatten skills directory to 1 level deep with consistent verb-noun naming.

**Date:** 2026-02-15
**Status:** Approved

---

## Goals

1. Flatten structure from 5 levels to 2 levels (Category → Skill)
2. Apply consistent verb-noun naming convention
3. Group related skills lexically (planning-* sorts together, review-* sorts together)
4. Align with agent skill best practices

---

## Target Structure

```
.claude/skills/
├── _core/
│   └── orchestrator/
├── _dev/
│   └── sync-templates/
├── _sub/
│   ├── archive-daily/
│   ├── archive-monthly/
│   ├── archive-quarterly/
│   ├── archive-weekly/
│   ├── archive-yearly/
│   ├── extract-to-areas/
│   ├── fetch-active-projects/
│   ├── fetch-calendar/
│   ├── fetch-config/
│   ├── fetch-dates/
│   ├── fetch-directives/
│   ├── fetch-month-content/
│   ├── fetch-quarter-content/
│   ├── fetch-today-content/
│   ├── fetch-week-content/
│   ├── fetch-year-content/
│   ├── gather-month-context/
│   ├── gather-quarter-context/
│   ├── gather-week-context/
│   ├── gather-year-context/
│   ├── update-semantic/
│   └── write-captive-note/
├── commands/
│   ├── init/
│   ├── migrate/
│   └── onboard-person/
└── rituals/
    ├── planning-daily/
    ├── planning-monthly/
    ├── planning-quarterly/
    ├── planning-weekly/
    ├── planning-yearly/
    ├── review-daily/
    ├── review-monthly/
    ├── review-quarterly/
    ├── review-weekly/
    └── review-yearly/
```

---

## Naming Convention

### Pattern: verb-noun

All skills follow verb-noun ordering for lexical grouping.

### Category Changes

| Category | Old | New |
|----------|-----|-----|
| User actions | `actions/` | `commands/` |
| Internal sub-skills | `_sub/fetch/`, `_sub/synthesis/`, `_sub/write/` | `_sub/` (flat) |
| Rituals | `rituals/planning/`, `rituals/review/` | `rituals/` (flat) |

### Skill Renames

| Old Path | New Path |
|----------|----------|
| `_sub/fetch/get-active-projects/` | `_sub/fetch-active-projects/` |
| `_sub/fetch/get-calendar/` | `_sub/fetch-calendar/` |
| `_sub/fetch/get-config/` | `_sub/fetch-config/` |
| `_sub/fetch/get-dates/` | `_sub/fetch-dates/` |
| `_sub/fetch/get-directives/` | `_sub/fetch-directives/` |
| `_sub/fetch/get-month-content/` | `_sub/fetch-month-content/` |
| `_sub/fetch/get-quarter-content/` | `_sub/fetch-quarter-content/` |
| `_sub/fetch/get-today-content/` | `_sub/fetch-today-content/` |
| `_sub/fetch/get-week-content/` | `_sub/fetch-week-content/` |
| `_sub/fetch/get-year-content/` | `_sub/fetch-year-content/` |
| `_sub/synthesis/extract-to-areas/` | `_sub/extract-to-areas/` |
| `_sub/synthesis/gather-month-context/` | `_sub/gather-month-context/` |
| `_sub/synthesis/gather-quarter-context/` | `_sub/gather-quarter-context/` |
| `_sub/synthesis/gather-week-context/` | `_sub/gather-week-context/` |
| `_sub/synthesis/gather-year-context/` | `_sub/gather-year-context/` |
| `_sub/write/archive-daily/` | `_sub/archive-daily/` |
| `_sub/write/archive-monthly/` | `_sub/archive-monthly/` |
| `_sub/write/archive-quarterly/` | `_sub/archive-quarterly/` |
| `_sub/write/archive-weekly/` | `_sub/archive-weekly/` |
| `_sub/write/archive-yearly/` | `_sub/archive-yearly/` |
| `_sub/write/captive-note/` | `_sub/write-captive-note/` |
| `_sub/write/update-semantic/` | `_sub/update-semantic/` |
| `actions/init/` | `commands/init/` |
| `actions/migrate/` | `commands/migrate/` |
| `actions/person-onboard/` | `commands/onboard-person/` |
| `rituals/planning/daily-planning/` | `rituals/planning-daily/` |
| `rituals/planning/monthly-planning/` | `rituals/planning-monthly/` |
| `rituals/planning/quarterly-planning/` | `rituals/planning-quarterly/` |
| `rituals/planning/weekly-planning/` | `rituals/planning-weekly/` |
| `rituals/planning/yearly-planning/` | `rituals/planning-yearly/` |
| `rituals/review/daily-review/` | `rituals/review-daily/` |
| `rituals/review/monthly-review/` | `rituals/review-monthly/` |
| `rituals/review/quarterly-review/` | `rituals/review-quarterly/` |
| `rituals/review/weekly-review/` | `rituals/review-weekly/` |
| `rituals/review/yearly-review/` | `rituals/review-yearly/` |

---

## Reference Updates

### phases.yaml Files

All `phases.yaml` files reference sub-skills by path. Update all occurrences:

| Old Reference | New Reference |
|---------------|---------------|
| `_sub/fetch/get-config` | `_sub/fetch-config` |
| `_sub/fetch/get-dates` | `_sub/fetch-dates` |
| `_sub/fetch/get-directives` | `_sub/fetch-directives` |
| `_sub/fetch/get-calendar` | `_sub/fetch-calendar` |
| `_sub/fetch/get-today-content` | `_sub/fetch-today-content` |
| `_sub/fetch/get-week-content` | `_sub/fetch-week-content` |
| `_sub/fetch/get-month-content` | `_sub/fetch-month-content` |
| `_sub/fetch/get-quarter-content` | `_sub/fetch-quarter-content` |
| `_sub/fetch/get-year-content` | `_sub/fetch-year-content` |
| `_sub/fetch/get-active-projects` | `_sub/fetch-active-projects` |
| `_sub/synthesis/gather-week-context` | `_sub/gather-week-context` |
| `_sub/synthesis/gather-month-context` | `_sub/gather-month-context` |
| `_sub/synthesis/gather-quarter-context` | `_sub/gather-quarter-context` |
| `_sub/synthesis/gather-year-context` | `_sub/gather-year-context` |
| `_sub/write/captive-note` | `_sub/write-captive-note` |
| `_sub/write/archive-daily` | `_sub/archive-daily` |
| `_sub/write/archive-weekly` | `_sub/archive-weekly` |
| `_sub/write/archive-monthly` | `_sub/archive-monthly` |
| `_sub/write/archive-quarterly` | `_sub/archive-quarterly` |
| `_sub/write/archive-yearly` | `_sub/archive-yearly` |

### Documentation Files

| File | Updates Needed |
|------|----------------|
| `CLAUDE.md` | Quick Reference paths, Key Paths section |
| `README.md` | Usage examples, skill paths |
| `DEVELOPING.md` | Architecture section, skill creation examples |

---

## Impact Summary

| Change Type | Count |
|-------------|-------|
| Directories to move | 39 |
| Category renames | 1 (`actions` → `commands`) |
| Skill renames (verb-noun order) | 1 (`person-onboard` → `onboard-person`) |
| Sub-skill prefix changes | 12 (`get-*` → `fetch-*`, `captive-note` → `write-captive-note`) |
| Ritual renames | 10 (`daily-planning` → `planning-daily`, etc.) |
| phases.yaml updates | 10 files |
| Documentation updates | 3 files |
