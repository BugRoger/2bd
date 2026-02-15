---
name: sync-templates
description: Bidirectional sync between scaffold templates and vault templates with interactive merge
disable-model-invocation: true
allowed-tools: Read, Write, Glob, Bash(diff *), AskUserQuestion
---

# Sync Templates

Synchronize templates between the engine scaffold and the user's vault. Shows diffs and prompts for each changed file.

## Setup

Load config using `_sub/fetch-config` to get the vault path.

## Template Locations

Compare these paired locations:

| Scaffold (Engine) | Vault (User) |
|-------------------|--------------|
| `scaffold/.../Templates/Captive/*.md` | `$VAULT/.../Templates/Captive/*.md` |
| `scaffold/.../Templates/Periodic/*.md` | `$VAULT/.../Templates/Periodic/*.md` |
| `scaffold/.../Templates/para/*.md` | `$VAULT/.../Templates/para/*.md` |

## Sync Logic

For each template file, determine status:

- **Identical** — Files match exactly. Skip.
- **Scaffold only** — File exists only in scaffold. Offer to copy to vault.
- **Vault only** — File exists only in vault. Offer to copy to scaffold.
- **Different** — Both exist but differ. Show diff, ask for direction.

## Interactive Merge

For files that differ, present the diff and offer three choices:

- **Pull** — Copy from vault to scaffold (bring user customizations to engine)
- **Push** — Copy from scaffold to vault (apply engine updates to vault)
- **Skip** — Leave both unchanged

## Summary

After processing all files, report counts: synced (identical), pulled, pushed, skipped.

## Notes

Development skill for engine maintenance. Always shows diffs before making changes. Never overwrites without confirmation.
