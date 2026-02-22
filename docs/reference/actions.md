---
title: "Actions reference"
description: "One-shot commands you invoke on demand."
---

Actions are discrete helpers you run when needed, unlike rituals which follow a schedule.

## Quick reference

```bash
# Initialize or configure
claude skill run init --args "fresh --vault=~/path"     # New vault
claude skill run init --args "reconnect --vault=~/path" # Existing vault
claude skill run init --args "profile"                   # Update profile

# Projects
/project create "Project Name"
/project archive "project-name"

# People
/person onboard "firstname-lastname"
```

## Available actions

### init

Bootstrap or configure 2bd. Creates [directives](/development/directives) for personalizing Claude.

```bash
# Create new vault
claude skill run init --args "fresh --vault=~/OneDrive/2bd-vault"

# Connect existing vault
claude skill run init --args "reconnect --vault=~/OneDrive/2bd-vault"

# Update user profile
claude skill run init --args "profile"
```

| Argument | Purpose |
|----------|---------|
| `fresh --vault=PATH` | Create new vault at path |
| `reconnect --vault=PATH` | Connect to existing vault |
| `profile` | Update user profile and AI personality |

### project

Manage project lifecycle.

```bash
/project create "Project Name"
/project archive "project-name"
```

| Subaction | Purpose |
|-----------|---------|
| `create "Name"` | Create new project file at `01_Projects/YYYY-MM-DD-name.md` |
| `archive "slug"` | Move project to `04_Archives/` with summary |

### person

Manage people in your network.

```bash
/person onboard "firstname-lastname"
```

| Subaction | Purpose |
|-----------|---------|
| `onboard "name"` | Create person dossier via guided interview |

Creates file at `02_Areas/People/firstname-lastname.md`.

## Running actions

```bash
# Always from engine directory
cd ~/Code/2bd-engine

# Pattern: /skill [action] [arguments]
/project create "Q1 Launch"
```

## Action vs ritual

| Aspect | Actions | Rituals |
|--------|---------|---------|
| Trigger | On demand | Scheduled |
| Frequency | As needed | Daily/weekly/etc |
| Purpose | Discrete task | System maintenance |
| Examples | Create project | Morning planning |

## Related

- [Actions development](/development/actions) — Creating custom actions
- [Skills](/development/skills) — Understanding skill types
- [How Ada works](/ada/how-it-works) — Scheduled ritual commands
