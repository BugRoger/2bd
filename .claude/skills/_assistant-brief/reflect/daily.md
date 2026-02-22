# Brief: Reflect Daily

Summarize the day's events and learnings.

## Context to Load

1. Read `vault/00_Brain/Captive/Today.md` for planned priorities
2. Read other assistant reflections from today

## Process

1. Gather day summary:
   - What meetings happened?
   - What was accomplished?
   - What surprised you?

2. Generate summary:
   - Day narrative
   - Wins
   - Challenges
   - Tomorrow's carry-forward

## Output

Write to `vault/00_Brain/Synthetic/Assistants/brief/{date}-reflect-daily.md`:

```markdown
# Brief: reflect(daily) {date}

## Status
ok

## Section
### Day Summary

{Narrative of how the day unfolded}

### Wins
- {Win 1}
- {Win 2}

### Challenges
- {Challenge 1}

### Carry Forward
- {What needs attention tomorrow}

## Observations
- {Patterns, surprises, learnings}

## Timestamp
{ISO timestamp}
```
