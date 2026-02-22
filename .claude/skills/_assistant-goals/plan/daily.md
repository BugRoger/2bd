# Goals: Plan Daily

Guide 1-3-5 selection aligned with Major Moves.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for Major Moves
2. Read `vault/00_Brain/Captive/Quarter.md` for Quests (grounding)
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Show context:
   - This week's Major Moves (from Week.md)
   - Quarterly Quests for grounding

2. Interactive conversation:
   - Ask: "What's the one thing that would make today a win?"
   - Validate connection to Major Move
   - Ask: "What 3 medium tasks support that?"
   - Ask: "Any small tasks to capture?"

3. Finalize 1-3-5:
   - 1 Big (must connect to Major Move)
   - 3 Medium
   - 5 Small

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-daily.md`:

```markdown
# Goals: plan(daily) {date}

## Status
ok

## Section
### 1-3-5

**Must do:**
- {Big task} → {Major Move it supports}

**Should do:**
- {Medium 1}
- {Medium 2}
- {Medium 3}

**Could do:**
- {Small 1}
- {Small 2}
- {Small 3}
- {Small 4}
- {Small 5}

## Observations
- {Any patterns noticed}

## Timestamp
{ISO timestamp}
```
