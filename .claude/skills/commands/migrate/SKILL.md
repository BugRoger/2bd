---
name: migrate
description: Migrate from combined repo to engine+vault setup. Use when you have an existing 2bd repo with personal content mixed in, and want to separate it into engine (git) and vault (OneDrive).
argument-hint: "--vault=/path/to/new/vault"
---

# Migrate Action

Helps existing 2bd users migrate from a combined repository to the separated engine+vault architecture.

## Overview

**Before:** Single repo with engine code + personal content mixed together.

**After:**
- Engine repo (here) — clean, shareable, git-tracked
- Vault (synced folder) — personal content, no git

---

## Workflow

### Vault Path

Get the vault path from `--vault=` argument or ask the user. The path should be a folder that syncs (OneDrive, iCloud, Dropbox).

Validate the path exists. Warn if inside a git repo (vaults should not be in repos). Error if the folder already has files.

### Scaffold

Create the vault from the scaffold structure.

### Content Migration

Copy existing personal content from the repo to the vault:

- **Captive notes** — Daily working files, Flash captures
- **Periodic archives** — Daily, Weekly, Monthly, Quarterly, Yearly
- **Semantic & Synthetic** — Long-term knowledge and active drafts
- **Directives** — User profile and AI personality
- **Projects** — Active project files
- **Areas** — People and Insights
- **Archives** — Completed/inactive content

### Engine Config

Write `.claude/config.md` with the vault path.

### Report

Count and report what was copied: Captive notes, Periodic archives, Projects, People files, Directives.

### Cleanup Instructions

Provide cleanup commands for the user to run manually:
- Delete personal content from the engine repo (now in vault)
- Remove content directories (now only in scaffold/)
- Commit the cleaned engine
- Open vault in Obsidian and verify
- Test skills work

---

## Safety

The migrate action only *copies* files to the vault. Nothing is deleted from the engine until the user manually runs the cleanup commands. Original files remain as a rollback option.
