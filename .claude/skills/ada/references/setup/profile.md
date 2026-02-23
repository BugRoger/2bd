# Setup Profile

Re-run the profile interview to update human.md and/or ada.md. Same conversational approach as init, but skip introduction and scaffold.

## Context

- Vault must already be configured
- Load existing human.md and ada.md to show current values

## Tone

Follow the same conversational tone from [init.md](init.md) — Samantha from "Her": curious, warm, not performative.

---

## Flow

### 1. Determine Scope

Ask what the user wants to update:

> "Would you like to update your profile (human.md), my personality settings (ada.md), or both?"

Present options:
- **Profile only** — Update your basic info, work context, goals
- **Personality only** — Update how I interact with you
- **Both** — Full refresh

### 2. Profile Interview (if selected)

Load current `$VAULT/00_Brain/Systemic/Directives/human.md` and show existing values.

Present current values in a friendly summary before asking what's changed:

> "Here's what I have for you currently: [summarize key points]. What would you like to update?"

Conversational interview — ask what's changed:

- **Basic Identity** — Name, preferred name, role, what they do
- **Work Context** — Focus areas, team/org context, communication style
- **Goals & Growth** — Key goals, leadership identity, growth edge
- **Coaching Context** — Patterns to watch, grounding questions, what success looks like

Update the file with changes while preserving unchanged sections.

### 3. Personality Interview (if selected)

Load current `$VAULT/00_Brain/Systemic/Directives/ada.md` and show existing values.

Present current values in a friendly summary before asking what's changed:

> "Here's what I have for you currently: [summarize key points]. What would you like to update?"

Ask what's changed:

- **Character** — "Who should I be for you?"
- **Presence** — How much personality
- **Challenge Level** — How directly should I push back
- **Celebration Style** — How should I acknowledge wins
- **Communication** — Formality, directness, humor

Update the file with changes while preserving unchanged sections.

### 4. Completion

Summarize what was updated. Confirm the files were written.

Suggest continuing with their work:

> "Your settings are updated. Ready to continue with your day?"
