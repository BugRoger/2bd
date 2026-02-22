# Goals: Reflect Weekly

Review Major Moves progress.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for planned Major Moves
2. Read daily reflections from this week
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Show the Major Moves from Week.md

2. Interactive review:
   - For each Major Move: "What progress did you make?"
   - Rate: Met / Partial / Missed
   - If partial/missed: "What got in the way?"

3. Quest alignment:
   - "Did this week move your Quarterly Quests forward?"

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-reflect-weekly.md`:

```markdown
# Goals: reflect(weekly) {date}

## Status
ok

## Section
### Major Moves Review

**Move 1:** {Quest} — {Met/Partial/Missed}
- Target was: {Original target}
- Actual: {What happened}

**Move 2:** {Quest} — {Met/Partial/Missed}
- Target was: {Original target}
- Actual: {What happened}

(etc.)

**Quest Progress:** {Assessment of quarterly momentum}

## Observations
- {Patterns, blockers, learnings}

## Timestamp
{ISO timestamp}
```
