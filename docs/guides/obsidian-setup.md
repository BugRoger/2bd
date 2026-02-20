---
title: "Obsidian setup"
description: "Configure Obsidian for the best 2bd experience."
---

2bd uses Obsidian as the primary interface for writing and browsing. Claude CLI handles ritual execution.

## Recommended hotkeys

Set these in Obsidian Settings → Hotkeys:

| Hotkey | Action | Command |
|--------|--------|---------|
| `Cmd+Shift+D` | Open Today.md | Open daily note |
| `Cmd+Shift+W` | Open Week.md | Quick switcher → Week.md |
| `Cmd+Shift+M` | Open Month.md | Quick switcher → Month.md |
| `Cmd+Shift+Q` | Open Quarter.md | Quick switcher → Quarter.md |
| `Cmd+Shift+H` | Open ✱ Home.md | Quick switcher → ✱ Home.md |
| `Cmd+Shift+G` | Open graph view | Graph view |

## Core plugins

Enable these in Settings → Core plugins:

- **Daily notes** — For `Cmd+Shift+D` hotkey
- **Templates** — For manual template insertion
- **Quick switcher** — For fast navigation
- **Graph view** — For visualizing connections
- **Backlinks** — For seeing what links to current note

## Community plugins

These enhance the 2bd experience:

### Templater

**What it does:** Automatically applies templates when creating files in specific folders.

**Configuration:**
- Enable "Trigger Templater on new file creation"
- Set folder templates:
  - `01_Projects/` → uses `project.md`
  - `02_Areas/People/` → uses `person.md`
  - `02_Areas/Insights/` → uses `insight.md`

### Calendar

**What it does:** Visual calendar for navigating daily notes.

**Configuration:**
- Point to `00_Brain/Periodic/Daily/` for daily notes
- Use format `YYYY-MM-DD` for file names

### Dataview

**What it does:** Query and display data from your notes.

**Use cases:**
- List active projects
- Show recent People interactions
- Track insights by theme

## Daily notes configuration

Settings → Core plugins → Daily notes:

| Setting | Value |
|---------|-------|
| Date format | `YYYY-MM-DD` |
| New file location | `00_Brain/Periodic/Daily` |
| Template file location | Leave empty (rituals prepare Today.md) |

> ⚠️ **Warning:** Don't use Obsidian's daily notes for creating Today.md. The planning ritual handles this. The daily notes plugin is just for the `Cmd+Shift+D` hotkey.

## Appearance

Obsidian themes that work well with 2bd's structure:

- **Minimal** — Clean, distraction-free
- **Things** — Task-focused
- **Sanctum** — Warm, readable

## File explorer

Organize your sidebar:

1. Expand `00_Brain/Captive/` — Your working space
2. Collapse `00_Brain/Periodic/` — Archives (access via search)
3. Pin `✱ Home.md` to quick access
