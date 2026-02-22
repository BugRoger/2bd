# Ritual Flow

## Planning Ritual

```
User: "Ada, run my morning ritual"
         │
         ▼
Ada parses: action=plan, timescale=daily
         │
         ▼
Ada reads ada.yaml → [brief, goals, calendar, journal, ...]
         │
         ▼
For each assistant:
├─ Invoke _assistant-brief (plan, daily)
├─ Invoke _assistant-goals (plan, daily)
├─ Invoke _assistant-calendar (plan, daily)
├─ Invoke _assistant-journal (plan, daily)
├─ Invoke _assistant-achievements (plan, daily)
├─ Invoke _assistant-relationships (plan, daily)
└─ Invoke _assistant-projects (plan, daily)
         │
         ▼
Invoke _assistant-compose (plan, daily)
         │
         ▼
Assembles → Captive/Today.md
         │
         ▼
Invoke _assistant-learn (daily)
         │
         ▼
"Your day is ready, Michi."
```

## Reflection Ritual

Same flow with action=reflect, outputs to Periodic/{timescale}/

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

## Assistant Subset by Timescale

Not all assistants run at all timescales:

| Assistant | Daily | Weekly | Quarterly | Yearly |
|-----------|-------|--------|-----------|--------|
| brief | ✓ | ✓ | - | - |
| goals | ✓ | ✓ | ✓ | ✓ |
| calendar | ✓ | ✓ | - | - |
| journal | ✓ | ✓ | ✓ | ✓ |
| achievements | ✓ | ✓ | ✓ | ✓ |
| relationships | ✓ | ✓ | - | - |
| projects | ✓ | ✓ | - | - |
