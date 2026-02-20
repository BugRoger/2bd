---
title: "Actions"
description: "How to create one-shot helper actions."
---

## Creating an action

1. Create skill folder: `.claude/skills/{action-name}/`

2. Add `SKILL.md` with frontmatter:

   ```yaml
   ---
   name: create-project
   description: Initialize a new project file
   disable-model-invocation: false
   allowed-tools: Read, Write
   argument-hint: "Project Name"
   ---
   ```

3. Write clear `description` so Claude knows when to use it

4. Test: `claude skill run create-project --args "Project Name"`

## Action vs ritual

| Aspect | Actions | Rituals |
|--------|---------|---------|
| Trigger | On demand | Scheduled |
| Frequency | As needed | Daily/weekly/etc |
| Purpose | Discrete task | System maintenance |
| Prefix | None | `ritual-` |
