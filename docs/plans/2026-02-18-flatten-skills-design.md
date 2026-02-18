# Flatten Skills Structure

**Date:** 2026-02-18
**Status:** Approved
**Problem:** Skills not recognized by Claude Code as slash commands due to nested folder structure

## Context

Claude Code expects skills at `.claude/skills/<skill-name>/SKILL.md` but current structure has an extra nesting level: `.claude/skills/<category>/<skill-name>/SKILL.md`. This prevents skill discovery.

## Decision

Flatten all skills to top level with naming conventions:
- **Commands:** Keep original names (`init/`, `create-project/`)
- **Rituals:** Prefix with `ritual-` (`ritual-planning-daily/`, `ritual-review-weekly/`)
- **Internal:** Prefix with `_` (`_orchestrator/`, `_fetch-calendar/`)

Move auxiliary files to `scaffold/00_Brain/Systemic/` for vault sync, reference via `$VAULT/` at runtime.

## New Structure

### Skills Layout

```
.claude/skills/
├── _orchestrator/SKILL.md
├── _fetch-calendar/SKILL.md
├── _resolve-references/SKILL.md
├── _write-captive-note/SKILL.md
├── _append-changelog/SKILL.md
├── _extract-to-areas/SKILL.md
├── _update-semantic/SKILL.md
├── _project-sync-vault/SKILL.md
├── _project-sync-outlook/SKILL.md
├── _project-sync-finder/SKILL.md
├── _apply-writing-style/SKILL.md
├── _test-orchestrator/SKILL.md
├── init/SKILL.md
├── create-project/SKILL.md
├── archive-project/SKILL.md
├── migrate/SKILL.md
├── onboard-person/SKILL.md
├── ritual-planning-daily/SKILL.md
├── ritual-planning-weekly/SKILL.md
├── ritual-planning-monthly/SKILL.md
├── ritual-planning-quarterly/SKILL.md
├── ritual-planning-yearly/SKILL.md
├── ritual-review-daily/SKILL.md
├── ritual-review-weekly/SKILL.md
├── ritual-review-monthly/SKILL.md
├── ritual-review-quarterly/SKILL.md
└── ritual-review-yearly/SKILL.md
```

### Auxiliary Files

**Current locations:**
- `commands/init/templates/*.md`
- `rituals/review-*/coaching.md`
- `_sub/fetch-calendar/calendars.json`

**New locations in scaffold:**
```
scaffold/00_Brain/Systemic/
├── Templates/
│   └── Directives/
│       ├── user-profile.md
│       └── ai-personality.md
├── Coaching/
│   ├── review-daily.md
│   ├── review-monthly.md
│   ├── review-quarterly.md
│   └── review-yearly.md
└── Config/
    └── calendars.json
```

**Runtime references:** Skills reference `$VAULT/00_Brain/Systemic/...` paths.

## Reference Updates

### Auxiliary File References

| Skill | Old Reference | New Reference |
|-------|---------------|---------------|
| `init` | `templates/user-profile.md` | `scaffold/.../Templates/Directives/user-profile.md` |
| `init` | `templates/ai-personality.md` | `scaffold/.../Templates/Directives/ai-personality.md` |
| `ritual-review-daily` | `coaching.md` | `$VAULT/00_Brain/Systemic/Coaching/review-daily.md` |
| `ritual-review-monthly` | `coaching.md` | `$VAULT/00_Brain/Systemic/Coaching/review-monthly.md` |
| `ritual-review-quarterly` | `coaching.md` | `$VAULT/00_Brain/Systemic/Coaching/review-quarterly.md` |
| `ritual-review-yearly` | `coaching.md` | `$VAULT/00_Brain/Systemic/Coaching/review-yearly.md` |
| `_fetch-calendar` | `calendars.json` | `$VAULT/00_Brain/Systemic/Config/calendars.json` |

### Internal Skill References

| Old Path | New Path |
|----------|----------|
| `_sub/fetch-calendar` | `_fetch-calendar` |
| `_sub/resolve-references` | `_resolve-references` |
| `_sub/write-captive-note` | `_write-captive-note` |
| `_sub/append-changelog` | `_append-changelog` |
| `_sub/extract-to-areas` | `_extract-to-areas` |
| `_sub/update-semantic` | `_update-semantic` |
| `_sub/project-sync-vault` | `_project-sync-vault` |
| `_sub/project-sync-outlook` | `_project-sync-outlook` |
| `_sub/project-sync-finder` | `_project-sync-finder` |
| `_sub/apply-writing-style` | `_apply-writing-style` |
| `_core/orchestrator` | `_orchestrator` |
| `_dev/test-orchestrator` | `_test-orchestrator` |

## Documentation Updates

| File | Changes |
|------|---------|
| `CLAUDE.md` | Quick reference paths, key paths section |
| `README.md` | Skill invocation examples |
| `DEVELOPING.md` | Skill architecture, path conventions |

**Example change in CLAUDE.md:**
```bash
# Before
claude skill run rituals/planning-daily
claude skill run commands/init --args "profile"

# After
claude skill run ritual-planning-daily
claude skill run init --args "profile"
```

## Not Changing

- Skill content and behavior
- Orchestration pattern
- Vault structure
- Config file location (`.claude/config.md`)

## Success Criteria

- All user-facing skills appear in Claude Code's `/skills` list
- `/ritual-planning-daily` invokes the daily planning skill
- `/init` invokes the init command
- Internal skills (`_*`) do not appear as slash commands
- Auxiliary files sync to vault and are readable at runtime
