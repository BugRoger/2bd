---
name: person
description: People management. Subactions: onboard.
argument-hint: "[action: onboard] [args...]"
metadata:
  orchestrated: true
---

# Person

Manage people in your network.

## Usage

- `/person onboard "firstname-lastname"` — Create person dossier

## Dispatch

Parse first argument and load corresponding reference:
- `onboard` → [references/onboard.md](references/onboard.md)

If no subaction provided, show usage and ask which action to run.
