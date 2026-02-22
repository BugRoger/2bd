# Goals: Plan Yearly

Guide Annual Goals selection aligned with Vision.

## Context to Load

1. Read previous year's reflection if exists
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Reflect on past year:
   - What worked?
   - What didn't?
   - What changed?

2. Interactive conversation:
   - Ask: "What's your theme for this year?"
   - Ask: "What 5-7 major goals would make this year successful?"
   - For each: "Why does this matter?"

3. Finalize Annual Goals:
   - Year theme
   - 5-7 goals with why

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-yearly.md`:

```markdown
# Goals: plan(yearly) {date}

## Status
ok

## Section
### Annual Goals

**Theme:** {Year theme}

**Goal 1:** {Goal}
- Why: {Why this matters}

**Goal 2:** {Goal}
- Why: {Why this matters}

(etc.)

## Observations
- {Any patterns noticed}

## Timestamp
{ISO timestamp}
```
