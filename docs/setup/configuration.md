---
title: "Configuration"
description: "Customize your vault, profile, and integrations."
---

## Vault path

The engine stores your vault path in `.claude/config.md` (git-ignored):

```markdown
vault_path: /Users/you/OneDrive/2bd-vault
```

To change it:

```bash
claude skill run init --args "reconnect --vault=/new/path"
ln -sf /new/path ./vault
```

## User profile

Personalize how Claude interacts with you:

```bash
claude skill run init --args "profile"
```

This creates directives in your vault:
- **user-profile.md** — Your name, role, goals, growth edge
- **ai-personality.md** — Formality, directness, coaching style

## Obsidian setup

### Hotkeys

| Hotkey | Action |
|--------|--------|
| `Cmd+Shift+D` | Open Today.md |
| `Cmd+Shift+W` | Open Week.md |
| `Cmd+Shift+M` | Open Month.md |
| `Cmd+Shift+Q` | Open Quarter.md |
| `Cmd+Shift+H` | Open ✱ Home.md |

### Templater

If using the Templater plugin, configure folder templates:
- New file in `01_Projects/` → uses project.md
- New file in `02_Areas/People/` → uses person.md

## Calendar integration (macOS)

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
