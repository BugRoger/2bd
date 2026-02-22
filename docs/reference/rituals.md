---
title: "Rituals reference"
description: "Complete list of all rituals and when to run them."
---

## Quick reference

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

## Ada multi-assistant architecture

Ada coordinates domain-specific assistants to run rituals:

| Assistant | Domain | Plan | Reflect |
|-----------|--------|------|---------|
| brief | Context and intention | Daily, Weekly | Daily, Weekly |
| goals | 1-3-5, Major Moves, Quests | Daily, Weekly, Quarterly, Yearly | All |
| calendar | Meeting prep and review | Daily, Weekly | Daily, Weekly |
| journal | Reflection and insights | Daily, Weekly | All |
| achievements | Win capture | Daily, Weekly | All |
| relationships | People touchpoints | Daily, Weekly | Daily, Weekly |
| projects | Project status | Daily, Weekly | Daily, Weekly |

### How Ada works

1. Parse action (plan/reflect) and timescale
2. Run each assistant in sequence
3. Compose outputs into Captive (plan) or Periodic (reflect)
4. Analyze patterns for learning

## Planning rituals

| Ritual | Trigger | Prepares | GPS Components |
|--------|---------|----------|----------------|
| Daily | `/planning daily` | Captive/Today.md | 1-3-5 |
| Weekly | `/planning weekly` | Captive/Week.md | Major Moves |
| Quarterly | `/planning quarterly` | Captive/Quarter.md | Quests |
| Yearly | `/planning yearly` | Captive/Year.md | Annual Goals |

### What planning rituals do

1. Load context from higher timescales
2. Fetch calendar events (if configured)
3. Run each assistant's plan action
4. Compose outputs into Captive note
5. Analyze patterns for learning

## Reflection rituals

| Ritual | Trigger | Archives to |
|--------|---------|-------------|
| Daily | `/reflection daily` | Periodic/Daily/ |
| Weekly | `/reflection weekly` | Periodic/Weekly/ |
| Quarterly | `/reflection quarterly` | Periodic/Quarterly/ |
| Yearly | `/reflection yearly` | Periodic/Yearly/ |

### What reflection rituals do

1. Run each assistant's reflect action
2. Compose outputs into Periodic archive
3. Extract insights to Semantic layer
4. Record observations for self-learning
5. Graduate patterns when confidence high

## Related

- [Rituals development](/development/rituals) — Creating custom rituals
- [How it works](/overview/how-it-works) — The ritual cycle explained
- [GPS methodology](/overview/gps-methodology) — Goal, Plan, System framework
- [Templates reference](/reference/templates) — What each template contains
- [Actions reference](/reference/actions) — One-shot commands

