---
name: init
description: Bootstrap or configure 2bd. Use 'fresh' to set up a new vault, 'reconnect' to link an existing vault, or 'profile' to update your user profile.
argument-hint: "[fresh --vault=/path | reconnect --vault=/path | profile]"
metadata:
  orchestrated: true
---

# Init Action

Manages the connection between the 2bd engine and the user's vault.

## Context

- Engine configuration (if exists)
- Vault structure validation
- Existing directive files (user-profile.md, ai-personality.md)

## Mode Detection

Parse arguments to determine mode:

- **fresh** — Set up a new vault from scratch
- **reconnect** — Link an existing vault (e.g., after moving to a new computer)
- **profile** — Update user profile without changing vault connection
- **no mode** — Auto-detect based on current state

Auto-detect by checking whether config exists and vault path is valid, then suggest the appropriate mode.

---

## Fresh Install

Set up a new vault from scratch.

Start by getting the vault path from `--vault=` argument or asking the user. The path should be a folder that syncs (OneDrive, iCloud, Dropbox). Example: `~/OneDrive/2bd-vault`.

Validate the path exists. Warn if inside a git repo (vaults should not be in repos). Warn if the folder already has files and offer to merge or choose a different path.

Copy the scaffold structure to the vault path. This creates:
- Hub files (✱ Home.md, ✱ Projects.md, ✱ People.md, ✱ Insights.md)
- Templates (Captive + Periodic + PARA)
- Directory structure with .gitkeep placeholders

Write `.claude/config.md` with the vault path.

Run the profile interview to gather user information and preferences.

Confirm the vault is ready and suggest next steps: open in Obsidian, run `/daily-planning`.

---

## Reconnect

Link an existing vault.

Get the vault path from `--vault=` argument or ask the user.

Validate the vault structure exists (00_Brain/, Systemic/Templates/). If missing, suggest fresh install instead.

Write `.claude/config.md` with the vault path.

Check if user-profile.md exists in Directives. If not, offer to run the profile interview.

Confirm reconnection and suggest `/daily-planning`.

---

## Profile Only

Update user profile without changing vault connection.

Check that vault is configured. Error if no vault is configured.

Check for existing profiles in Directives. Ask for confirmation before overwriting.

Run the profile interview.

---

## Profile Interview

Conduct a conversational interview to gather user information. Ask questions one section at a time.

### User Profile

Gather information about:

**Basic Identity** — Name, preferred name, role, what they do.

**Work Context** — Primary focus areas, team/org context, communication style.

**Goals & Growth** — Key goals for the year, leadership identity (the leader they're becoming), growth edge (where discomfort lives).

**Coaching Context** — Patterns to watch (behaviors that don't serve them), grounding questions, what success looks like.

Write to `$VAULT/00_Brain/Systemic/Directives/user-profile.md` using the template.

### AI Personality

Gather preferences for:

**Communication Style** — Formality level, directness, humor preference.

**Coaching Approach** — Support vs challenge balance, proactive input level, feedback delivery style.

**Interaction Patterns** — Questions vs suggestions, autonomy level, disagreement handling.

Write to `$VAULT/00_Brain/Systemic/Directives/ai-personality.md` using the template.

### Summary

After creating both files, summarize what was captured (profile highlights, personality settings) and suggest running `/daily-planning`.
