---
title: "How Ada works"
description: "Your executive assistant and the ritual loop that keeps your system running."
---

## Ada is your interface

Ada is your Executive Assistant - the primary way you interact with 2bd. Rather than managing templates, archives, and workflows manually, you simply talk to Ada. She coordinates everything behind the scenes.

When you say "Ada, run my morning ritual" or invoke `/ada plan daily`, Ada orchestrates a team of specialized assistants to prepare your day, fetch calendar context, and compose your working notes.

## The ritual loop

2bd operates on a simple cycle: **plan - work - reflect - archive**.

This loop is powered by the [GPS methodology](/ada/goals) - Goal, Plan, System - which cascades from yearly vision down to daily execution.

![Planning and review cycles across time scales](/images/how-it-works.svg)

## Metabolic states

2bd organizes notes by **metabolic state** - how active and volatile they are - rather than by topic.

| State | Purpose | Location |
|-------|---------|----------|
| **Captive** | Working notes - high-velocity, volatile intake | `00_Brain/Captive/` |
| **Synthetic** | Active drafts - projects in progress | `00_Brain/Synthetic/` |
| **Periodic** | Archives - the permanent timeline | `00_Brain/Periodic/` |
| **Semantic** | Reference - crystallized knowledge | `00_Brain/Semantic/` |
| **Systemic** | Structure - templates, workflows | `00_Brain/Systemic/` |

Metabolic states solve the "where does this go?" problem by organizing around **information lifecycle**. Fresh notes go to Captive. Active work lives in Synthetic. Completed work archives to Periodic. The system moves information naturally without you deciding where things belong.

## Ada's assistant team

Ada manages a team of domain-specific assistants:

| Assistant | Handles |
|-----------|---------|
| brief | Context synthesis, leadership intention |
| goals | 1-3-5, Major Moves, Quests, Annual Goals |
| calendar | Meeting prep and review |
| journal | Reflection and personal insights |
| achievements | Win capture and impact evidence |
| relationships | People touchpoints |
| projects | Project status tracking |

Each assistant specializes in one domain and knows how to handle that domain across all timescales.

## How rituals run

### The orchestration process

1. Parse the action (plan/reflect) and timescale
2. Run each assistant's action for that timescale
3. Each assistant writes to `Synthetic/Assistants/{name}/`
4. Compose outputs into Captive (plan) or Periodic (reflect)
5. Learn patterns from observations

### Quick reference

```bash
# Planning rituals
/planning           # Plan today (default)
/planning daily     # Morning ritual
/planning weekly    # Monday
/planning quarterly # Start of quarter
/planning yearly    # Start of year

# Reflection rituals
/reflection         # Reflect on today (default)
/reflection daily   # Evening ritual
/reflection weekly  # Sunday
/reflection quarterly # End of quarter
/reflection yearly  # End of year
```

### Planning rituals

Run in the morning (or start of period):

```bash
/ada plan daily      # or "Ada, run my morning ritual"
/ada plan weekly
/ada plan quarterly
/ada plan yearly
```

Each assistant:
- Loads context from higher timescales
- Runs interactive conversation with you
- Writes structured output to Synthetic

### Reflection rituals

Run in the evening (or end of period):

```bash
/ada reflect daily   # or "Ada, let's reflect on today"
/ada reflect weekly
/ada reflect quarterly
/ada reflect yearly
```

Each assistant:
- Reviews planned vs actual
- Captures insights and patterns
- Records observations for learning

## Time scales

The loop runs at four scales, each nesting into the next:

| Scale | Planning | Reflection | Working note | Archive |
|-------|----------|--------|--------------|---------|
| Daily | Morning | Evening | Today.md | Daily/ |
| Weekly | Monday | Sunday | Week.md | Weekly/ |
| Quarterly | Start | End of quarter | Quarter.md | Quarterly/ |
| Yearly | January | December | Year.md | Yearly/ |

## Information flow

```
Captive (composed by Ada)        Periodic (archived by Ada)
--------------------             ----------------------------
Today.md   --reflect-->           Daily/YYYY-MM-DD.md
Week.md    --reflect-->           Weekly/YYYY-Www.md
Quarter.md --reflect-->           Quarterly/YYYY-QN.md
Year.md    --reflect-->           Yearly/YYYY.md
```

Daily insights feed into weekly reviews. Weekly patterns inform quarterly direction. The system synthesizes upward automatically.

## Self-learning

Ada's learn assistant analyzes patterns across all assistants:

1. **Observe** - Each assistant records observations
2. **Cluster** - Similar patterns are grouped
3. **Graduate** - High-confidence clusters move to Semantic
4. **Remember** - Graduated insights inform future sessions

Your rituals evolve to match how you actually work.
