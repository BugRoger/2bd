---
title: "Hooks and Integrations"
description: "Connect 2bd with your calendar and other tools"
---

## Calendar Integration

2bd can read your calendar to provide meeting prep and day-shape analysis.

### Setup

1. Configure your calendar source in your vault's `00_Brain/Systemic/Directives/`
2. Ada will automatically pull calendar events during planning rituals

### What You Get

- Meeting prep before each meeting
- Day-shape analysis (focus time vs meeting load)
- Post-meeting reflection prompts

## Claude Code Hooks

2bd uses Claude Code hooks to trigger actions at specific points.

### Available Hooks

| Hook | When It Runs | What It Does |
|------|--------------|--------------|
| Session start | When you start Claude | Loads your context |
| Pre-meeting | Before scheduled meetings | Generates meeting prep |

### Configuring Hooks

Hooks are configured in `.claude/hooks/`. See [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) for details.

## Related

- [Settings and Directives](/configuration/settings-and-directives) - Core configuration
- [Installation](/configuration/installation) - Initial setup
