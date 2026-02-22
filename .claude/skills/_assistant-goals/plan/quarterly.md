# Goals: Plan Quarterly

Guide Quests selection aligned with Annual Goals.

## Context to Load

1. Read `vault/00_Brain/Captive/Year.md` for Annual Goals
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Show context:
   - Annual Goals (from Year.md)
   - Vision for grounding

2. Interactive conversation:
   - Ask: "Which 3-5 Annual Goals will you advance this quarter?"
   - For each: "What would meaningful progress look like?"
   - Ask: "What's the theme for this quarter?"

3. Finalize Quests:
   - 3-5 goals to advance
   - Each with success criteria
   - Quarter theme

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-plan-quarterly.md`:

```markdown
# Goals: plan(quarterly) {date}

## Status
ok

## Section
### Quarterly Quests

**Theme:** {Quarter theme}

**Quest 1:** {Goal name}
- Success: {What meaningful progress looks like}

**Quest 2:** {Goal name}
- Success: {What meaningful progress looks like}

(etc.)

## Observations
- {Any patterns noticed}

## Timestamp
{ISO timestamp}
```
