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
- For fresh install: scaffold templates from assets/scaffold/
- For profile: directive templates from vault ($VAULT/00_Brain/Systemic/Templates/Directives/)

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

Copy the assets/scaffold structure to the vault path. This creates:
- Hub files (✱ Home.md, ✱ Projects.md, ✱ People.md, ✱ Insights.md)
- Templates in Systemic/Templates/ (users can customize these)
- Coaching prompts, config schemas
- Directory structure with .gitkeep placeholders

After this copy, the vault is self-contained. All skills will reference the vault directly—templates, coaching prompts, and config all live in the vault now.

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

Write to `$VAULT/00_Brain/Systemic/Directives/user-profile.md` using the template from vault (`$VAULT/00_Brain/Systemic/Templates/Directives/user-profile.md`).

### AI Personality

Gather preferences for:

**Communication Style** — Formality level, directness, humor preference.

**Coaching Approach** — Support vs challenge balance, proactive input level, feedback delivery style.

**Interaction Patterns** — Questions vs suggestions, autonomy level, disagreement handling.

Write to `$VAULT/00_Brain/Systemic/Directives/ai-personality.md` using the template from vault (`$VAULT/00_Brain/Systemic/Templates/Directives/ai-personality.md`).

### Coaching Preferences

Gather coach personality preferences:

**Coach Character** — "Who is your coach?"
- Work wife (knows everything, supportive, occasionally calls you out)
- Brutally honest sparring partner (no sugar-coating, pushes hard)
- Executive assistant with career ambitions (sharp, efficient, subtly competitive)
- Wise mentor (patient, asks questions, lets you arrive at answers)
- Emo teenager (dramatic about wins, melancholic about setbacks, surprisingly insightful)
- Drill sergeant (structure, accountability, no excuses)
- Or: describe your ideal coach character

**Coach Ego** — "How much personality should your coach have?"
- Invisible (pure facilitation, no character)
- Subtle (light touches of personality)
- Present (distinct voice, occasional opinions)
- Strong (full character, will push back, has views)

**Challenge Level** — "How much push do you want?"
- Gentle nudges → Balanced → Direct confrontation

**Celebration Style** — "How should wins be acknowledged?"
- Understated → Genuine enthusiasm → Over-the-top

These preferences populate the `## Coaching Persona` section in `ai-personality.md`.

### Summary

After creating both files, summarize what was captured (profile highlights, personality settings) and suggest running `/daily-planning`.
