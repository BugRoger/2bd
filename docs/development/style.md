---
title: "Style guide"
description: "Writing guidelines and guardrails for skills and documentation."
---

## Skill writing style

Skills read as prose, not scripts.

**Do:**
- Descriptive prose: "Load the vault path. Validate the structure."
- Section-based flow: Context, Validate, Session, Compose, Persist
- Natural references: "Review the calendar", "Load Week.md"

**Don't:**
- Template syntax: `{{VAULT}}`, `{{#if}}`
- Phase markers: `<!-- phase:name -->`
- Imperative directives: "Ask:", "Check:", numbered steps
- Inline file structure examples

## GitHub workflow

### Labels

| Label | Description | Color |
|-------|-------------|-------|
| `type:epic` | Large initiative | Purple |
| `type:story` | User-facing capability | Blue |
| `type:task` | Implementation work | Cyan |
| `type:bug` | Something broken | Red |
| `type:chore` | Maintenance | Gray |
| `type:docs` | Documentation | Green |

### Scope labels

| Label | Description |
|-------|-------------|
| `scope:skill` | Skill implementation |
| `scope:ritual` | Planning or reflection ritual |
| `scope:template` | Template files |
| `scope:integration` | External integration |

## For agents

When implementing features:

1. **Read the design** — Check `.plans/` for design docs
2. **Use worktrees** — Always use `superpowers:using-git-worktrees`
3. **Follow TDD** — Use `superpowers:test-driven-development`
4. **Load directives** — Read from `$VAULT/00_Brain/Systemic/Directives/`
5. **Update changelog** — After modifying any note
