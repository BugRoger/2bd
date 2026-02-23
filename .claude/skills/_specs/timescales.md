# Timescale Declaration

## Frontmatter Contract

Every assistant SKILL.md must declare supported timescales in frontmatter:

```yaml
---
name: _assistant-example
description: Example assistant...
timescales:
  plan: [daily, weekly]
  reflect: [daily, weekly, quarterly, yearly]
---
```

## Valid Timescales

- `daily` — Morning/evening rituals
- `weekly` — Week planning/reflection
- `quarterly` — Quarter planning/reflection
- `yearly` — Annual planning/reflection

## How Ada Uses This

1. Ada reads the assistant's SKILL.md file directly (using Read tool)
2. Parses YAML frontmatter to extract `timescales`
3. Checks if `timescales.{action}` includes current `{timescale}`
4. If yes: invokes the assistant
5. If no: skips (no invocation, no output file)

**Note:** The `timescales` attribute is custom — not part of Claude Code's built-in skill schema. IDE warnings about "unsupported attribute" are expected. Ada reads files directly, bypassing Claude Code's skill loader, so custom frontmatter works.

## Adding Timescale Support

To add support for a new timescale:
1. Add timescale to frontmatter array
2. Create instruction file: `{action}/{timescale}.md`
