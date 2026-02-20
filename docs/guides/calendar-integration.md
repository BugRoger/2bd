---
title: "Calendar integration"
description: "Connect your calendar for automatic meeting population."
---

2bd can fetch calendar events from macOS Calendar using the `ekctl` CLI tool. Planning rituals use this to pre-populate your Meetings section.

## Setup

1. **Install ekctl**

   ```bash
   brew install schappim/tap/ekctl
   ```

2. **Grant calendar access**

   On first run, grant permission when macOS asks.

3. **List your calendars**

   ```bash
   ekctl list calendars
   ```

   Note the IDs of calendars you want to include.

4. **Create aliases**

   ```bash
   ekctl alias set work "YOUR-WORK-CALENDAR-ID"
   ekctl alias set personal "YOUR-PERSONAL-CALENDAR-ID"
   ```

   Aliases make calendar references readable.

5. **Configure the skill**

   Edit `.claude/skills/fetch-calendar/calendars.json`:

   ```json
   {
     "calendars": ["work", "personal"],
     "default_scope": "today",
     "settings": {
       "work_hours": { "start": "09:00", "end": "18:00" },
       "min_focus_block_minutes": 30,
       "one_on_one_patterns": ["1:1", "1-1"]
     }
   }
   ```

6. **Test**

   ```bash
   ekctl list events --calendar work \
     --from "$(date -v0H -v0M -v0S +%Y-%m-%dT%H:%M:%S%z)" \
     --to "$(date -v23H -v59M -v59S +%Y-%m-%dT%H:%M:%S%z)"
   ```

## What calendar integration provides

Planning rituals use calendar data to:

- **Pre-populate Meetings section** — Events appear with time, title, and attendees
- **Identify 1:1s** — Meetings matching `one_on_one_patterns` get the 1:1 template
- **Calculate focus blocks** — Shows available time between meetings

## Configuration options

| Setting | Purpose |
|---------|---------|
| `calendars` | Array of calendar aliases to include |
| `default_scope` | Default time range (`today`, `week`) |
| `work_hours` | Define your working hours for focus block calculation |
| `min_focus_block_minutes` | Minimum gap to count as a focus block |
| `one_on_one_patterns` | Strings that identify 1:1 meetings |

## Without calendar integration

If you don't configure calendar integration, planning rituals still work. The Meetings section will be empty, and you can fill it manually.

> **Note:** Calendar integration is macOS-only via `ekctl`. Windows and Linux users can still use 2bd without this feature.
