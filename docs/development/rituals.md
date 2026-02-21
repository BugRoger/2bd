---
title: "Rituals"
description: "How to create and modify rituals."
---

Rituals are [skills](/development/skills) that run on a schedule, driving the 2bd productivity loop. See [How it works](/overview/how-it-works) for the ritual cycle.

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
    └── 20-reflection.md        # Self-learning
```

| Phase | Purpose |
|-------|---------|
| **Setup** | Load directives, calendar, vault files, validate prerequisites |
| **Core** | Interactive session, compose artifacts, persist |
| **Reflection** | Record observations for self-learning |

## Template contracts

Each ritual has a `template-contract.md` defining:
- Which template it uses
- Required sections
- Optional sections
- Section update rules

This ensures rituals interact with templates predictably.

## Agent instructions

When building or modifying rituals, follow these patterns extracted from existing rituals.

### Phase execution

Each phase follows a consistent pattern:

1. **Load** — Read required files at phase start
2. **Process** — Transform data, interact with user if needed
3. **Update** — Write changes to target file
4. **Transition** — Explicit "Proceed to [Next Phase]" statement

Never skip the transition statement. It signals phase completion and guides the agent.

### File operations

- Always read before write. Never assume file state.
- Write the entire file back, not partial updates.
- Use "Replace `## Section`" language to clarify intent.
- Read templates from `00_Brain/Systemic/Templates/`

### Interactive vs non-interactive phases

**Interactive phases** (like Check-In):
- Gather information through conversation
- Adapt phrasing from insights
- Ask one natural question, not checklists
- Follow up once if something is missing

**Non-interactive phases** (like Daily Brief):
- Present, do not negotiate
- Synthesize context into narrative
- No interaction—let user absorb

### Skill invocation

Rituals invoke other skills by name for reusable operations:

```markdown
1. Invoke skill `_resolve-dates` with argument (default: today)
2. Invoke skill `_fetch-calendar` for target date
```

Skills prefixed with `_` are internal—not user-invocable via `/skillname`.

### Context loading order

Load context in this order:

1. **Skills** — Invoke `_resolve-dates`, `_fetch-calendar`
2. **Configuration** — Read `00_Brain/Systemic/Directives/user-profile.md`, `00_Brain/Systemic/Directives/ai-personality.md`
3. **Semantic knowledge** — Read `00_Brain/Semantic/planning-daily/insights.md`
4. **Planning context** — Read `00_Brain/Captive/Week.md`, `00_Brain/Captive/Quarter.md`
5. **Derived context** — Glob and read files referenced by calendar (e.g., `02_Areas/People/*.md` for 1:1s)

### Validation gates

Setup phases should validate prerequisites:

```markdown
Check if `00_Brain/Captive/Today.md` exists for target date:
1. If exists → warn, offer Abort or Start fresh
2. If abort → end session
3. If start fresh → continue
```

Offer clear options. Do not proceed silently.

### Template contract awareness

Rituals update specific H2 sections. Document which phases update which sections:

| Phase | Updates |
|-------|---------|
| Daily Brief | `## Daily Brief` |
| Meetings | `## Meetings` |
| Journal | `## Journal` |

H3 structure within sections is dynamic and can evolve through the Reflection phase.

### Reflection phase patterns

Self-learning rituals include a Reflection phase that:

1. **Diff analysis** — Compare `00_Brain/Captive/Today.md` against `00_Brain/Systemic/Templates/Captive/today.md`
2. **Session review** — Analyze user interaction patterns
3. **Auto-cluster** — Group observations by semantic similarity
4. **Auto-graduate** — Monitor clusters for maturity criteria
5. **Crystallize** — User synthesizes insight when cluster graduates
6. **Template evolution** — Apply insights to templates

Record observations to `00_Brain/Synthetic/planning-daily/observations.md` with this format:

```
- YYYY-MM-DD | type | section | observation | interpretation
```

Types: `user-modification`, `skill-generated`, `session-interaction`

### Persona guidance

Give the agent a clear persona at phase start:

> You're an eager executive assistant about to help plan the day. You've already seen the calendar. You know what sessions follow.

This shapes tone, initiative level, and interaction style.

## Related

- [Skills](/development/skills) — Skill architecture and creation
- [Templates](/development/templates) — Template structure and contracts
- [Rituals reference](/reference/rituals) — Complete ritual command reference
