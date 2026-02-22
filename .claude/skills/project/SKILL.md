---
name: project
description: Project lifecycle management. Subactions: create, archive.
argument-hint: "[action: create|archive] [args...]"
metadata:
  orchestrated: true
---

# Project

Manage project lifecycle.

## Usage

- `/project create "Project Name"` — Create a new project
- `/project archive "project-slug"` — Archive completed project

## Dispatch

Parse first argument and load corresponding reference:
- `create` → [references/create.md](references/create.md)
- `archive` → [references/archive.md](references/archive.md)

If no subaction provided, show usage and ask which action to run.
