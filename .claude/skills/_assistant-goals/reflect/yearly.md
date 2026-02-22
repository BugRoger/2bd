# Goals: Reflect Yearly

Review Annual Goals progress.

## Context to Load

1. Read `vault/00_Brain/Captive/Year.md` for Annual Goals
2. Read quarterly reflections from this year
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Show the Annual Goals from Year.md

2. Interactive review:
   - For each Goal: "What progress did you make?"
   - Rate: Met / Partial / Missed
   - "What did you learn about yourself?"

3. Vision alignment:
   - "Did this year move you toward your larger vision?"
   - "What's different about who you are now?"

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-reflect-yearly.md`:

```markdown
# Goals: reflect(yearly) {date}

## Status
ok

## Section
### Annual Goals Review

**Theme:** {Year theme}

**Goal 1:** {Goal} — {Met/Partial/Missed}
- Why it mattered: {Original why}
- Actual: {What happened}
- Learning: {What you learned}

**Goal 2:** {Goal} — {Met/Partial/Missed}
- Why it mattered: {Original why}
- Actual: {What happened}
- Learning: {What you learned}

(etc.)

### Year Summary
{Narrative of the year's journey}

## Observations
- {Patterns, blockers, major learnings}

## Timestamp
{ISO timestamp}
```
