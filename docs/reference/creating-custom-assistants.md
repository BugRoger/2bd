---
title: "Creating Custom Assistants"
description: "Build your own domain assistants for Ada"
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

## Assistant architecture

Assistants are conceptual domains that flow through all timescales. Each assistant has its own section in templates and its own phase in rituals.

```
Ritual Structure:
├── Common: Setup
├── Assistant: Brief
├── Assistant: Goals
├── Assistant: Calendar
├── Assistant: Journal
├── Assistant: Achievements
├── Assistant: Relationships
├── Assistant: Projects
├── Common: Compose
├── Common: Persist
└── Common: Learning
```

Assistants are processed sequentially. Each assistant:
- Has a consistent `## {Assistant}` section in templates
- Has a phase file per timescale in rituals
- Cascades independently through timescales

## Draft Mode

Assistants run in **draft mode** during parallel execution.

### Draft Mode Contract

Each assistant must:

1. **Load context** - Read vault files autonomously
2. **Analyze** - Synthesize what it knows
3. **Generate draft** - Create section with placeholders for unknowns
4. **Write output** - Save to `Synthetic/Assistants/{name}/{timescale}-draft.md`

### Placeholder Syntax

Use HTML comments for questions:

```markdown
## Goals

Based on your week goals, here's the focus:

<!-- ASK:goals-priority
What's your #1 priority today?
-->
```

**Placeholder ID format:** `{assistant}-{question-key}`
- Must be unique within assistant
- Use kebab-case: `goals-top-priority`
- Descriptive but concise

### Output Location

```
vault/00_Brain/Synthetic/Assistants/{assistant-name}/{timescale}-draft.md
```

Examples:
- `Synthetic/Assistants/goals/daily-draft.md`
- `Synthetic/Assistants/calendar/weekly-draft.md`

### Status Frontmatter

Include status in draft:

```markdown
---
status: ok | error
assistant: goals
action: plan | reflect
timescale: daily | weekly | quarterly | yearly
timestamp: 2026-02-28T10:30:00Z
error: "error message if status=error"
---
```

### Context Sources

Assistants should read:
- Higher timescale notes (daily reads Week.md, weekly reads Quarter.md)
- Relevant vault sections (projects, people, etc.)
- Assistant memory: `Semantic/Assistants/{name}/memory.md`

### Example Conversion

**Before (interactive):**
```markdown
Ask the user: "What's your top priority?"
Write answer to section.
```

**After (draft mode):**
```markdown
Load Week.md to see weekly goals.
Identify potential priorities.
Write draft:

Based on weekly Major Moves:
- Launch feature (deadline Friday)
- Hire engineer (pipeline building)

<!-- ASK:goals-priority
What's your #1 priority for today?
-->
```

## Assistant matrix

| Assistant | Daily | Weekly | Quarterly | Yearly |
|-----------|-------|--------|-----------|--------|
| **Brief** | Day shape + context from Week | Week overview + context from Quarter | Quarter context from Year | Year context + prior year synthesis |
| **Goals** | 1-3-5 (1 big, 3 medium, 5 small) | Major Moves (which Quests to advance) | Quests (90-day goals) | Compass (Life Compass, 3-Year Sketch, Why, Anti-Goals) |
| **Calendar** | Daily Meetings (prep, context, notes) | Weekly Meetings (week's key meetings) | — | — |
| **Journal** | Check-In (energy, mindset, intention) | Pulse Check (patterns, growth edge) | Pivot (adjust approach, themes) | Vision (leadership identity, development focus) |
| **Achievements** | Capture (log wins) | Acknowledge (synthesize daily wins) | Leverage (what wins enable) | Celebrate (year-defining achievements) |
| **Relationships** | Touchpoints (birthdays, personal moments) | Connections (1:1 prep, notes) | Network (key relationships, stakeholders) | Circle (inner circle, mentors, sponsors) |
| **Projects** | Tasks (active project tasks) | Progress (status updates) | Portfolio (active projects, health) | — |

Use `—` for timescales where the assistant does not apply.

## Adding a new assistant

1. **Define the matrix row** — For each timescale, define the section name (`## {AssistantName}`) and intent
2. **Add template sections** — Add `## {AssistantName}` to each Captive template where the assistant applies
3. **Create phase files** — For each timescale, create `.claude/skills/ritual-planning-{timescale}/references/{NN}-{assistantname}.md`
4. **Update SKILL.md** — Add the new phase to the ritual's table of contents
5. **Update template contract** — Add the new section to the template contract in SKILL.md

## Coach system

Each assistant has a coach that provides guidance and learns from usage.

### Coach files

| Component | Path | Purpose |
|-----------|------|---------|
| Guidance | `Systemic/Coaching/{Assistant}/{timescale}.md` | Static guidance, prompts, agent selection |
| Insights (raw) | `Synthetic/Coaching/{Assistant}/insights.md` | Observations, clusters |
| Insights (crystallized) | `Semantic/Coaching/{Assistant}/insights.md` | Graduated, human-validated learnings |

### Learning flow

1. Each assistant phase captures observations → `Synthetic/Coaching/{Assistant}/insights.md`
2. Observations auto-cluster with confidence scoring (0-5)
3. Clusters graduate when confidence ≥ 4.5 AND stable for 3+ sessions
4. User crystallizes insight → `Semantic/Coaching/{Assistant}/insights.md`
5. Crystallized insights inform guidance updates

## Related

- [Creating Custom Rituals](/reference/creating-custom-rituals) - Creating scheduled rituals
- [Templates](/reference/templates) - Template structure for rituals
