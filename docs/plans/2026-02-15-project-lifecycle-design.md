# Project Lifecycle Skill Design

Create and archive projects across multiple tools with a pluggable sync architecture.

**Date:** 2026-02-15
**Status:** Approved
**Issue:** #2

---

## Goals

1. Scaffold extensible project lifecycle skills
2. Implement vault sync only (MVP)
3. Prepare architecture for Finder and Outlook sync (future)
4. Sequential sync phases for partial success and easy debugging

---

## Skill Structure

```
.claude/skills/
├── commands/
│   ├── create-project/
│   │   ├── SKILL.md
│   │   └── phases.yaml
│   └── archive-project/
│       ├── SKILL.md
│       └── phases.yaml
└── _sub/
    ├── fetch-projects/          # List active projects
    ├── project-sync-vault/      # MVP: Create/archive in vault
    ├── project-sync-finder/     # Future: Finder folders
    └── project-sync-outlook/    # Future: Outlook folders
```

All `project-sync-*` sub-skills share the same interface:
- Input: project data + action (create/archive)
- Output: success/failure + path created

---

## create-project Flow

```yaml
phases:
  # Phase 0: Setup
  - name: setup
    parallel: true
    subagents:
      - skill: _sub/fetch-config
      - skill: _sub/fetch-directives (optional)
      - skill: _sub/fetch-projects  # Duplicate detection

  # Phase 1: Interactive wizard (inline)
  - name: interact
    depends_on: [setup]
    inline: true

  # Phase 2: Generate project data (inline)
  - name: generate
    depends_on: [interact]
    inline: true

  # Phase 3+: Sequential syncs
  - name: sync-vault
    depends_on: [generate]
    subagents:
      - skill: _sub/project-sync-vault
        args: "action=create project={{PROJECT}}"

  - name: sync-finder      # Future
    depends_on: [sync-vault]
    optional: true

  - name: sync-outlook     # Future
    depends_on: [sync-finder]
    optional: true

  # Final: Confirm
  - name: confirm
    depends_on: [sync-vault]
    inline: true
```

### Interactive Wizard Questions

1. **Project Name** (required) — Natural language, auto-generates slug
2. **Due Date** (required) — Smart parsing: "end of March", "2026-03-31", "in 2 weeks"
3. **Quick Purpose** (required) — One sentence for the Goal section
4. **Key Outcomes** (optional) — 1-3 bullet points
5. **Related People** (optional) — Links to `02_Areas/People/`

---

## archive-project Flow

```yaml
phases:
  # Phase 0: Setup
  - name: setup
    parallel: true
    subagents:
      - skill: _sub/fetch-config
      - skill: _sub/fetch-projects

  # Phase 1: Select project (inline)
  - name: select
    depends_on: [setup]
    inline: true

  # Phase 2: Final summary (inline)
  - name: interact
    depends_on: [select]
    inline: true

  # Phase 3: Generate archive data (inline)
  - name: generate
    depends_on: [interact]
    inline: true

  # Phase 4+: Sequential syncs
  - name: sync-vault
    depends_on: [generate]
    subagents:
      - skill: _sub/project-sync-vault
        args: "action=archive project={{PROJECT}}"

  - name: sync-finder      # Future
    depends_on: [sync-vault]
    optional: true

  - name: sync-outlook     # Future
    depends_on: [sync-finder]
    optional: true

  # Final: Confirm
  - name: confirm
    depends_on: [sync-vault]
    inline: true
```

### Archive Interaction

1. Select from active projects list
2. Capture: key wins, lessons learned, follow-up items
3. Move project file to `04_Archives/Projects/`
4. Update status in frontmatter

---

## Sub-skill Interfaces

### fetch-projects

```
Input:
  - vault: path

Output:
  - active_projects[]: name, slug, due_date, path, status
  - archived_projects[]: same fields
  - overdue[]: projects past due date
  - due_soon[]: projects due within 2 weeks
```

Reads from `01_Projects/` and `04_Archives/Projects/`.

---

### project-sync-vault

```
Input:
  - action: "create" | "archive"
  - vault: path
  - project: { name, slug, due_date, purpose, outcomes[], people[] }

Output (create):
  - success: boolean
  - path: created file path
  - error: message if failed

Output (archive):
  - success: boolean
  - archive_path: new location
  - error: message if failed
```

**Create:** Writes to `01_Projects/YYYY-MM-DD-{slug}.md` using project template.
**Archive:** Moves to `04_Archives/Projects/`, updates frontmatter status.

---

### project-sync-finder (future)

```
Input: same as project-sync-vault
Output: same pattern

Create: mkdir ~/Projects/YYYY-MM-DD-{slug}/{Assets,Documents}
Archive: mv to ~/Projects/_Archive/
```

---

### project-sync-outlook (future)

```
Input: same as project-sync-vault
Output: same pattern

Create: Create mail folder under Projects/
Archive: Move folder to Projects/Archive/
```

---

## Scope

### MVP (Phase 1)

- `commands/create-project` — full implementation
- `commands/archive-project` — full implementation
- `_sub/fetch-projects` — full implementation
- `_sub/project-sync-vault` — full implementation

### Future (Phase 2+)

- `_sub/project-sync-finder` — stub now, implement later
- `_sub/project-sync-outlook` — stub now, implement later

---

## Issue #2 Updates

Original issue scope was too large. This design splits it:

**Keep in Phase 1:**
- #3 — Implement create-project
- #4 — Implement archive-project
- #5 — Implement fetch-projects (was get-projects)
- #8 — Update documentation

**Move to Phase 2/3 backlog:**
- #6 — Finder integration
- #7 — Outlook integration

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Sync strategy | Sequential phases | Partial success possible, easier debugging |
| Sub-skill naming | `project-sync-*` | Lexical grouping |
| Interface | Shared across all syncs | Easy to add new tools |
| Future tools | Optional phases | No main skill changes needed |
| Interaction | Interactive wizard | Original issue requirement |
