---
title: "Skills"
description: "How to create and structure Claude skills."
---

Skills are the building blocks of 2bd. There are three types: [rituals](/development/rituals) (scheduled routines), [actions](/development/actions) (one-shot helpers), and internal skills (sub-skills not user-facing).

## Skill architecture

Skills use a flat structure with naming conventions:

```
.claude/skills/
├── ritual-planning-daily/    # Rituals: ritual- prefix
│   └── SKILL.md
├── init/                     # Actions: no prefix
├── _fetch-calendar/          # Internal: _ prefix
└── ...
```

| Type | Prefix | Purpose |
|------|--------|---------|
| Rituals | `ritual-*` | Scheduled routines |
| Actions | (none) | One-shot helpers |
| Internal | `_*` | Sub-skills, not user-facing |

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
