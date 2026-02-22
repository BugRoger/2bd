---
title: "How it works"
description: "The daily rhythm that keeps your system running itself."
---

## The ritual loop

2bd operates on a simple cycle: **plan → work → reflect → archive**.

This loop is powered by the [GPS methodology](/overview/gps-methodology) — Goal, Plan, System — which cascades from yearly vision down to daily execution.

![Planning and review cycles across time scales](/images/how-it-works.svg)

## Ada and her assistants

Ada is your Executive Assistant who coordinates rituals. She manages a team of domain-specific assistants:

| Assistant | Handles |
|-----------|---------|
| brief | Context synthesis, leadership intention |
| goals | 1-3-5, Major Moves, Quests, Annual Goals |
| calendar | Meeting prep and review |
| journal | Reflection and personal insights |
| achievements | Win capture and impact evidence |
| relationships | People touchpoints |
| projects | Project status tracking |

### How Ada runs a ritual

1. Parse the action (plan/reflect) and timescale
2. Run each assistant's action for that timescale
3. Each assistant writes to `Synthetic/Assistants/{name}/`
4. Compose outputs into Captive (plan) or Periodic (reflect)
5. Learn patterns from observations

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
────────────────────             ────────────────────────────
Today.md   ──reflect──►           Daily/YYYY-MM-DD.md
Week.md    ──reflect──►           Weekly/YYYY-Www.md
Quarter.md ──reflect──►           Quarterly/YYYY-QN.md
Year.md    ──reflect──►           Yearly/YYYY.md
```

Daily insights feed into weekly reviews. Weekly patterns inform quarterly direction. The system synthesizes upward automatically.

## Self-learning

Ada's learn assistant analyzes patterns across all assistants:

1. **Observe** — Each assistant records observations
2. **Cluster** — Similar patterns are grouped
3. **Graduate** — High-confidence clusters move to Semantic
4. **Remember** — Graduated insights inform future sessions

Your rituals evolve to match how you actually work.
