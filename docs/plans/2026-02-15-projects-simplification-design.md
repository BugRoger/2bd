# Projects Simplification Design

Simplify project fetching to focus on active, short-lived projects by creating a dedicated vault-specific skill with sensible defaults and removing projects from long-term planning rituals.

**Date:** 2026-02-15
**Status:** Approved

---

## Goals

1. Focus project fetching on active projects by default
2. Remove projects from quarterly and yearly planning (wrong timescale)
3. Rename skill to clarify it's vault-specific
4. Keep flexibility to fetch archived projects when needed

---

## Philosophy

Projects are tactical, short-lived initiatives (typically ≤4 weeks). They belong in daily, weekly, and monthly planning. Quarterly and yearly planning operate at a strategic level where individual projects are noise, not signal.

Archived projects remain accessible but don't clutter active planning by default.

---

## Architecture Changes

### Skill Structure

**Rename:**
- From: `_sub/fetch-projects`
- To: `_sub/fetch-projects-vault`

**Arguments:**
- `scope` - Optional: `active` (default) | `archived` | `all`
- Default behavior: Return only active projects from `01_Projects/`

**Capabilities Preserved:**
- Can still fetch archived projects with `scope=archived`
- Can fetch both with `scope=all`
- All existing data structure and output format unchanged

### Ritual Changes

**Keep Projects In:**
- `rituals/planning-daily` - Uses `fetch-projects-vault`
- `rituals/planning-weekly` - Uses `fetch-projects-vault`
- `rituals/planning-monthly` - Uses `fetch-projects-vault`

**Remove Projects From:**
- `rituals/planning-quarterly` - Remove `fetch-active-projects` phase
- `rituals/planning-yearly` - Remove `fetch-active-projects` phase

**Command Updates:**
- `commands/create-project` - Use `fetch-projects-vault`
- `commands/archive-project` - Use `fetch-projects-vault`, no logic changes

---

## Detailed Changes

### 1. Skill Renaming

**File Operations:**
```bash
mv .claude/skills/_sub/fetch-projects/ .claude/skills/_sub/fetch-projects-vault/
```

**File Updates:**
- Update `SKILL.md` frontmatter: `name: fetch-projects-vault`
- Update description to emphasize vault-specific source
- Document default scope: `active`

### 2. Phase Files to Update

| File | Change |
|------|--------|
| `rituals/planning-daily/phases.yaml` | Change skill name to `fetch-projects-vault` |
| `rituals/planning-weekly/phases.yaml` | Change skill name to `fetch-projects-vault` |
| `rituals/planning-monthly/phases.yaml` | Change skill name to `fetch-projects-vault` |
| `rituals/planning-quarterly/phases.yaml` | **Remove** entire `fetch-active-projects` subagent |
| `rituals/planning-yearly/phases.yaml` | **Remove** entire `fetch-active-projects` subagent |
| `commands/create-project/phases.yaml` | Change skill name to `fetch-projects-vault` |
| `commands/archive-project/phases.yaml` | Change skill name to `fetch-projects-vault` |

### 3. Other References

- `_sub/gather-key-dates/SKILL.md` - Update if it references `fetch-projects`
- Documentation files - Update any references to old skill name

---

## Backwards Compatibility

### Breaking Changes

- External references to `_sub/fetch-projects` will break
- Internal ritual references to `fetch-active-projects` will be updated

### Migration Path

This is a personal system, so breaking changes are acceptable. All updates happen atomically in a single commit.

---

## Testing Strategy

### Ritual Testing

```bash
# Verify projects load in short-term rituals
claude skill run rituals/planning-daily
claude skill run rituals/planning-weekly
claude skill run rituals/planning-monthly

# Verify projects removed from long-term rituals
claude skill run rituals/planning-quarterly
claude skill run rituals/planning-yearly

# Verify commands still work
claude skill run commands/create-project
claude skill run commands/archive-project
```

### Scope Argument Testing

Test that scope argument still works:
- Default (no args) - Returns active projects only
- `scope=active` - Returns active projects
- `scope=archived` - Returns archived projects
- `scope=all` - Returns both active and archived

### Rollback Plan

Single atomic commit preferred for easy revert if issues arise.

---

## Benefits

| Benefit | Impact |
|---------|--------|
| **Faster rituals** | No archived folder scanning by default |
| **Clearer mental model** | Projects = active work only |
| **Simpler defaults** | Most common use case is the default |
| **Future-proof** | Scope argument allows archived access when needed |
| **Right timescale** | Projects in tactical rituals, not strategic ones |

---

## Implementation Scope

### In Scope

- Rename skill to `fetch-projects-vault`
- Update all phase.yaml references
- Remove projects from quarterly/yearly rituals
- Update documentation

### Out of Scope

- Changes to `archive-project` command logic
- Changes to project template or structure
- Changes to project data format
