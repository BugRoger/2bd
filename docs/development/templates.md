---
title: "Templates"
description: "How templates work and how to modify them."
---

Templates define the structure of your working notes. [Rituals](/development/rituals) use templates to create Captive notes and declare which sections they update through [template contracts](/development/rituals#template-contracts).

## Template locations

Templates live in your vault at `$VAULT/00_Brain/Systemic/Templates/`:

| Type | Path | Used for |
|------|------|----------|
| Captive | `Templates/Captive/` | today.md, week.md, etc. |
| Periodic | `Templates/Periodic/` | daily.md, weekly.md, etc. |
| Projects | `Templates/Projects/` | project.md |
| People | `Templates/Areas/People/` | person.md |

## Scaffold vs vault

The scaffold (`.claude/skills/init/assets/scaffold/`) is the source template for new vaults. After init, users customize their vault's templates.

Use `_sync-templates` to propagate changes between vault and scaffold during development.

## Standard sections

All Captive templates share consistent structure:

| Section | Purpose |
|---------|---------|
| Context From Above | Goals from parent timescale |
| Key Outcomes | 3 priorities (Personal → Organisational → Strategic) |
| Progress | Nested period summaries |
| Carry Forward | Items for next period |
| Wins | What went well by category |
| Reflections | Insights and learnings |
| Changelog | Audit trail |

## The three categories

Order matters—Personal first:

| Category | Focus |
|----------|-------|
| **Personal** | Individual growth, energy, leadership |
| **Organisational** | Team, structure, culture |
| **Strategic** | Initiatives, projects, outcomes |

## Changelog section

Every template includes `## Changelog` at the bottom:

```markdown
- `2026-02-15 09:32` **planning-daily** — Rewrote Focus, Context From Above
```

Format: backtick timestamp, bold skill name, em-dash, action and sections.

## Template contracts

Rituals declare which sections they update:

- **H2 sections are stable** — Never change these names
- **H3 structure is dynamic** — Can evolve through self-learning
- **Single ownership** — Each H2 has exactly one owning phase

## Related

- [Rituals](/development/rituals) — How rituals use templates
- [Vault structure](/reference/vault-structure) — Where templates live
- [Configuration](/setup/configuration) — Customizing templates
