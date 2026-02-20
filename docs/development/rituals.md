---
title: "Rituals"
description: "How to create and modify rituals."
---

## Ritual types

| Type | Prefix | Purpose |
|------|--------|---------|
| Planning | `ritual-planning-*` | Prepare Captive notes from templates |
| Review | `ritual-review-*` | Archive Captive notes to Periodic |

## Creating a ritual

1. Create skill folder: `.claude/skills/ritual-{type}-{period}/`

2. Add `SKILL.md` with frontmatter:

   ```yaml
   ---
   name: ritual-planning-weekly
   description: Prepare Week.md with weekly focus
   disable-model-invocation: true
   allowed-tools: Read, Write, Bash(*)
   ---
   ```

3. Document the ritual flow and outcomes

4. Test: `claude skill run ritual-planning-weekly`

## Ritual structure

Rituals follow a three-phase pattern:

```
.claude/skills/ritual-{type}-{period}/
├── SKILL.md                    # Table of contents
└── references/
    ├── 00-setup.md             # Load context, validate
    ├── 10-core.md              # Main ritual logic
    └── 20-observe.md           # Self-learning
```

| Phase | Purpose |
|-------|---------|
| **Setup** | Load directives, calendar, vault files, validate prerequisites |
| **Core** | Interactive session, compose artifacts, persist |
| **Observe** | Record observations for self-learning |

## Template contracts

Each ritual has a `template-contract.md` defining:
- Which template it uses
- Required sections
- Optional sections
- Section update rules

This ensures rituals interact with templates predictably.
