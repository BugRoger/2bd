# CLAUDE.md

Quick reference for Claude Code when working with this repository.

## Commands

```bash
claude skill run ritual-planning-daily   # morning
claude skill run ritual-review-daily     # evening
claude skill run init --args "profile"   # update profile
claude skill run create-project          # new project
```

## Vault Path

Read from `.claude/config.md`:

```markdown
vault_path: /Users/you/OneDrive/2bd-vault
```

Use `$VAULT` prefix when referencing vault files.

## Key Paths

| Path | Purpose |
|------|---------|
| `.claude/skills/` | All skills |
| `$VAULT/00_Brain/Captive/` | Working notes |
| `$VAULT/00_Brain/Periodic/` | Archives |
| `$VAULT/00_Brain/Systemic/Templates/` | Templates |
| `$VAULT/00_Brain/Systemic/Directives/` | User profile |

## Documentation

**[Full docs →](https://2bd.mintlify.app/development/skills)**

For skill creation, templates, rituals, and guidelines, see the Development tab in docs.
