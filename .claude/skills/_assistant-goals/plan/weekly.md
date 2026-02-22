# Goals: Plan Weekly

Guide Major Moves selection aligned with Quarterly Quests.

## Context to Load

1. Read `vault/00_Brain/Captive/Quarter.md` for Quests
2. Read `vault/00_Brain/Captive/Year.md` for Annual Goals (grounding)
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Show context:
   - Quarterly Quests (from Quarter.md)
   - Annual Goals for grounding

2. Interactive conversation:
   - Ask: "Which 2-3 Quests will you advance this week?"
   - For each: "What does progress look like by Friday?"
   - Validate realistic scope given calendar

3. Finalize Major Moves:
   - 2-3 Quests to advance
   - Each with progress target

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-weekly.md`:

```markdown
# Goals: plan(weekly) {date}

## Status
ok

## Section
### Major Moves

**Quest 1:** {Quest name}
- Target: {What progress looks like by Friday}

**Quest 2:** {Quest name}
- Target: {What progress looks like by Friday}

**Quest 3:** {Quest name} (optional)
- Target: {What progress looks like by Friday}

## Observations
- {Any patterns noticed}

## Timestamp
{ISO timestamp}
```
