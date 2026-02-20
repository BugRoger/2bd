---
title: "Prerequisites"
description: "What you need before installing 2bd."
---

## Required

### Claude Code CLI

Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's CLI for Claude.

### Obsidian

[Obsidian](https://obsidian.md) is the recommended editor for browsing and writing in your vault. It's free and works on all platforms.

2bd works with any markdown editor, but Obsidian's features (graph view, templates, hotkeys) integrate well with the workflow.

### Cloud sync folder

2bd stores your notes in a cloud-synced folder so they follow you across devices:

- **OneDrive** (recommended)
- iCloud Drive
- Dropbox
- Google Drive

Choose a path like `~/OneDrive/2bd-vault` or `~/Library/CloudStorage/OneDrive/2bd-vault`.



### Calendar integration (macOS)

Fetch calendar events using `ekctl`:

1. **Install ekctl**

   ```bash
   brew install schappim/tap/ekctl
   ```

2. **Grant calendar access** when prompted

3. **List and alias calendars**

   ```bash
   ekctl list calendars
   ekctl alias set work "YOUR-WORK-CALENDAR-ID"
   ekctl alias set personal "YOUR-PERSONAL-CALENDAR-ID"
   ```

4. **Configure the skill**

   Edit `.claude/skills/fetch-calendar/calendars.json`:

   ```json
   {
     "calendars": ["work", "personal"],
     "default_scope": "today"
   }
   ```

Planning rituals will pre-populate meetings in Today.md.
