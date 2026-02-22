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

1. Ada reads the assistant's SKILL.md frontmatter
2. Checks if `timescales.{action}` includes current `{timescale}`
3. If yes: invokes the assistant
4. If no: skips (no invocation, no output file)

## Adding Timescale Support

To add support for a new timescale:
1. Add timescale to frontmatter array
2. Create instruction file: `{action}/{timescale}.md`
