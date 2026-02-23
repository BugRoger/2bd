# Ritual Flow

## Planning Ritual

```
User: "Ada, run my morning ritual"
         │
         ▼
Ada parses: action=plan, timescale=daily
         │
         ▼
Ada reads assistants.yaml → [goals, calendar, journal, ...]
         │
         ▼
For each assistant:
├─ Invoke _assistant-goals (plan, daily)
├─ Invoke _assistant-calendar (plan, daily)
├─ Invoke _assistant-journal (plan, daily)
├─ Invoke _assistant-achievements (plan, daily)
├─ Invoke _assistant-relationships (plan, daily)
└─ Invoke _assistant-projects (plan, daily)
         │
         ▼
Invoke compose (plan, daily)
         │
         ▼
Synthesizes brief + Assembles → Captive/Today.md
         │
         ▼
Invoke _assistant-learn (daily)
         │
         ▼
"Your day is ready, Michi."
```

## Reflection Ritual

Same flow with action=reflect, outputs to Periodic/{timescale}/

Note: Brief synthesis only happens for plan actions, not reflect.

## Timescale Mapping

| Trigger Phrase | Action | Timescale |
|----------------|--------|-----------|
| "morning ritual" | plan | daily |
| "plan my day" | plan | daily |
| "reflect on today" | reflect | daily |
| "end of day" | reflect | daily |
| "plan my week" | plan | weekly |
| "weekly reflection" | reflect | weekly |
| "plan the quarter" | plan | quarterly |
| "quarterly reflection" | reflect | quarterly |
| "plan the year" | plan | yearly |
| "yearly reflection" | reflect | yearly |

## Assistant Timescale Support

Each assistant declares its supported timescales in SKILL.md frontmatter.

See @_specs/timescales.md for the contract.

Ada reads this declaration and skips assistants that don't support the current action+timescale.
