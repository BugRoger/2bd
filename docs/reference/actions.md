---
title: "Actions reference"
description: "One-shot commands you invoke on demand."
---

Actions are discrete helpers you run when needed, unlike rituals which follow a schedule.

## Available actions

### init

Bootstrap or configure 2bd.

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

### create-project

Initialize a new project file.

```bash
claude skill run create-project --args "Project Name"
```

Creates a project file at `01_Projects/YYYY-MM-DD-project-name.md` with:
- End date in filename (for sorting)
- Project template structure
- Link in ✱ Projects.md hub

### archive-project

Archive a completed project.

```bash
claude skill run archive-project --args "project-name"
```

Moves project to `04_Archives/` and updates:
- ✱ Projects.md hub
- Any linked notes

### onboard-person

Create a new person dossier through guided interview.

```bash
claude skill run onboard-person
```

Walks through:
- Basic information
- Role and relationship
- Communication preferences
- Key context to remember

Creates file at `02_Areas/People/FirstNameL.md`.

## Running actions

```bash
# Always from engine directory
cd ~/Code/2bd-engine

# Pattern: claude skill run {action-name} [--args "arguments"]
claude skill run create-project --args "Q1 Launch"
```

## Action vs ritual

| Aspect | Actions | Rituals |
|--------|---------|---------|
| Trigger | On demand | Scheduled |
| Frequency | As needed | Daily/weekly/etc |
| Purpose | Discrete task | System maintenance |
| Examples | Create project | Morning planning |
