# Ritual Refactoring Design

Date: 2026-02-22

## Problem

Current ritual system has significant duplication:
- 8 ritual skills (4 planning + 4 reflection) with ~11 reference files each
- Ritual references duplicate assistant logic
- Templates mixed between skills and vault

## Decision

Approach B: Ada + Minimal Rituals
- Two thin wrapper skills (/planning, /reflection) for discoverability
- Ada as sole orchestrator with sequencing logic
- Assistants self-contained with plan/reflect/learn actions
- Compose assembles Synthetic outputs into Captive

## Architecture

### Entry Points

```
User: "/planning daily" or "Ada, plan my day"
         |
         v
    +----------+
    | planning | (thin wrapper)
    +----+-----+
         | invokes Ada with action=plan, timescale=daily
         v
    +----------+
    |   Ada    | (orchestrator)
    +----+-----+
         | reads sequence, invokes assistants in order
         v
    +-----------------+
    | _assistant-*    | writes to Synthetic
    +-----------------+
         |
         v
    +-----------------+
    | _assistant-compose | assembles into Captive
    +-----------------+
```

### Data Flow

```
Systemic/Assistants/{name}/     -> templates, config (read)
Semantic/Assistants/{name}/     -> memory (read)
Synthetic/Assistants/{name}/    -> working outputs (write)
Captive/{timescale}.md          -> assembled result (compose writes)
```

## Skill Structure

### Thin Wrappers

**planning/SKILL.md:**
```markdown
---
name: planning
description: Run a planning ritual. Invokes Ada.
argument-hint: "[timescale: daily|weekly|quarterly|yearly]"
---

# Planning

Invoke Ada with action=plan and the specified timescale.
Default timescale: daily
```

**reflection/SKILL.md:**
```markdown
---
name: reflection
description: Run a reflection ritual. Invokes Ada.
argument-hint: "[timescale: daily|weekly|quarterly|yearly]"
---

# Reflection

Invoke Ada with action=reflect and the specified timescale.
Default timescale: daily
```

### Ada Orchestrator

```
ada/
├── SKILL.md
└── references/
    ├── ritual-flow.md
    ├── plan/
    │   ├── daily.md
    │   ├── weekly.md
    │   ├── quarterly.md
    │   └── yearly.md
    └── reflect/
        ├── daily.md
        ├── weekly.md
        ├── quarterly.md
        └── yearly.md
```

Each sequence file lists assistants in order for that action/timescale.

### Assistant Structure

Each assistant has three actions across four timescales:

```
_assistant-goals/
├── SKILL.md
├── references/
│   └── 1-3-5-method.md
├── plan/
│   ├── daily.md
│   ├── weekly.md
│   ├── quarterly.md
│   └── yearly.md
├── reflect/
│   ├── daily.md
│   ├── weekly.md
│   ├── quarterly.md
│   └── yearly.md
├── learn/
│   ├── daily.md
│   ├── weekly.md
│   ├── quarterly.md
│   └── yearly.md
└── templates/
    └── section.md
```

**SKILL.md pattern:**
```markdown
---
name: _assistant-goals
description: Goals assistant. 1-3-5 (daily), Major Moves (weekly), Quests (quarterly), Annual Goals (yearly).
---

# Goals Assistant

## Actions
- **Plan:** [daily](plan/daily.md) | [weekly](plan/weekly.md) | [quarterly](plan/quarterly.md) | [yearly](plan/yearly.md)
- **Reflect:** [daily](reflect/daily.md) | [weekly](reflect/weekly.md) | [quarterly](reflect/quarterly.md) | [yearly](reflect/yearly.md)
- **Learn:** [daily](learn/daily.md) | [weekly](learn/weekly.md) | [quarterly](learn/quarterly.md) | [yearly](learn/yearly.md)

## Protocol
Follow @_assistant-protocol for output format and knowledge model.
```

## Vault Structure

### After Refactoring

```
vault/00_Brain/Systemic/
├── Assistants/
│   ├── goals/
│   │   └── templates/
│   │       └── section.md
│   ├── calendar/
│   │   └── templates/
│   │       └── section.md
│   ├── journal/
│   ├── brief/
│   ├── achievements/
│   ├── relationships/
│   └── projects/
├── Config/
│   └── ada.yaml
└── Templates/
    └── Captive/
        ├── today.md
        ├── week.md
        ├── quarter.md
        └── year.md
```

### Deletions

- `vault/00_Brain/Systemic/Coaching/` - entire folder

## Skill Changes

| Action | Skills |
|--------|--------|
| Delete | ritual-planning-daily |
| Delete | ritual-planning-weekly |
| Delete | ritual-planning-quarterly |
| Delete | ritual-planning-yearly |
| Delete | ritual-reflection-daily |
| Delete | ritual-reflection-weekly |
| Delete | ritual-reflection-quarterly |
| Delete | ritual-reflection-yearly |
| Delete | _assistant-learn |
| Add | planning |
| Add | reflection |
| Expand | All _assistant-* get learn/ phase |
| Refactor | Ada gets orchestration sequences |

**Net change:** 26 skills -> 19 skills (-7)

## Out of Scope

- `_assistant-coaching` - future work (coaching removed from current structure)

## Implementation Notes

1. Assistants write to `Synthetic/Assistants/{name}/{date}-{action}-{timescale}.md`
2. Compose reads all Synthetic outputs, assembles into Captive
3. Learn action graduates patterns from Synthetic to Semantic memory
4. Init scaffolds `Systemic/Assistants/{name}/templates/` into vault
