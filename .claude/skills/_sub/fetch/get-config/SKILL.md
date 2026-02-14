---
name: get-config
description: Read engine configuration to get vault path. Called by all skills that need to access vault files.
disable-model-invocation: true
---

# Get Config

This sub-skill reads the engine configuration file to get the vault path.

## Instructions

1. Read `.claude/config.md` from the engine root directory

2. Parse the `vault_path:` line to extract the path value

3. Verify the vault path exists:
   - If it doesn't exist, report error: "Vault not found at {path}. Run `/init` to configure."

4. Return the vault path for use in file operations

## Output

Provide the vault path as `$VAULT` for the calling skill to use in all file operations.

Example: If config contains `vault_path: /Users/me/OneDrive/vault`, then `$VAULT` = `/Users/me/OneDrive/vault`

## Error Cases

- **Config file missing**: "No config.md found. Run `/init fresh --vault=/path` to set up."
- **vault_path not set**: "vault_path not configured. Run `/init` to configure."
- **Vault directory missing**: "Vault not found at {path}. Check path or run `/init reconnect`."
