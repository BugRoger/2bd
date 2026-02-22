---
title: "Skills"
description: "How to create and structure Claude skills."
---

Skills are the building blocks of 2bd. Ada is the central orchestrator that owns all logic. Entity skills and aliases dispatch to Ada.

## Skill architecture

Skills use a flat structure with naming conventions:

```
.claude/skills/
├── ada/                      # Orchestrator - owns all logic
│   ├── SKILL.md
│   └── references/
│       ├── plan/daily.md     # Ritual sequences
│       ├── project/create.md # Entity actions
│       └── person/onboard.md
├── project/                  # Alias → dispatches to Ada
├── person/                   # Alias → dispatches to Ada
├── planning/                 # Alias → /ada plan
├── _assistant-goals/         # Internal assistant
└── _util-resolve-date/       # Internal utility
```

| Prefix | Type | User-invokable |
|--------|------|----------------|
| (none) | Entity/Alias | Yes |
| `_assistant-*` | Assistant | No |
| `_util-*` | Utility | No |

## Skill file structure

Each skill lives in its own folder with `SKILL.md`:

```markdown
---
name: skill-name
description: What this skill does and when to use it
disable-model-invocation: false
allowed-tools: Read, Write, Bash(*)
argument-hint: "[argument description]"
---

# Skill Instructions

Instructions Claude follows when invoked.
```

## Writing style

Skills read as prose describing *what happens*, not scripts with directives.

**Do:**
- Write descriptive prose: "Load the vault path from context. Validate the structure exists."
- Organize into sections describing flow
- Reference context naturally

**Don't:**
- Use template syntax: `{{VAULT}}`, `{{#if}}`
- Use imperative directives: "Ask:", "Check:", numbered steps
- Include bash code blocks for file operations

## Creating a skill

1. Create folder: `.claude/skills/{skill-name}/`
2. Add `SKILL.md` with frontmatter
3. Write instructions as prose
4. Test: `claude skill run {skill-name}`

## Related

- [Rituals](/development/rituals) — Creating scheduled rituals
- [Actions](/development/actions) — Creating one-shot actions
- [Templates](/development/templates) — Template structure for rituals
