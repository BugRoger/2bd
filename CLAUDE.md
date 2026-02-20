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

**[Full docs →](https://2bd.l48a.de/development/skills)**

For skill creation, templates, rituals, and guidelines, see the Development tab in docs.

## Docs Linking (Mintlify)

Docs are hosted on Mintlify (2bd.l48a.de).

- **Internal doc links** in `docs/**/*.md`: root-relative, no `.md`/`.mdx` (example: `[Config](/configuration)`)
- **Section cross-references**: use anchors on root-relative paths (example: `[Hooks](/configuration#hooks)`)
- **Headings and anchors**: avoid em dashes and apostrophes — they break Mintlify anchor links
- **When asked for links**: reply with full `https://2bd.l48a.de/...` URLs (not root-relative)
- **When you touch docs**: end the reply with the `https://2bd.l48a.de/...` URLs you referenced
- **README (GitHub)**: keep absolute docs URLs so links work on GitHub
- **Content must be generic**: no personal device names/hostnames/paths; use placeholders like `user@gateway-host`

When working with documentation, read the mintlify skill.
