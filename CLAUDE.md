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

## Agent-Specific Notes

- **High-confidence answers only**: verify in code; do not guess
- **Multi-agent safety**: do not create/apply/drop git stash entries unless explicitly requested (includes `git pull --rebase --autostash`)
- **Multi-agent safety**: assume other agents may be working; keep unrelated WIP untouched; avoid cross-cutting state changes
- **Multi-agent safety**: do not create/remove/modify git worktree checkouts (or edit `.worktrees/*`) unless explicitly requested
- **Multi-agent safety**: do not switch branches or check out a different branch unless explicitly requested
- **Multi-agent safety**: running multiple agents is OK as long as each agent has its own session
- **When user says "push"**: you may `git pull --rebase` to integrate latest changes (never discard other agents' work)
- **When user says "commit"**: scope to your changes only
- **When user says "commit all"**: commit everything in grouped chunks
- **Unrecognized files**: keep going; focus on your changes and commit only those
- **Reports**: focus on your edits; avoid guard-rail disclaimers unless truly blocked; end with brief "other files present" note only if relevant
