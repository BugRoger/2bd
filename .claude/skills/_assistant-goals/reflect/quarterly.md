# Goals: Reflect Quarterly

Review Quests progress.

## Context to Load

1. Read `vault/00_Brain/Captive/Quarter.md` for planned Quests
2. Read weekly reflections from this quarter
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Show the Quests from Quarter.md

2. Interactive review:
   - For each Quest: "What progress did you make?"
   - Rate: Met / Partial / Missed
   - If partial/missed: "What got in the way?"

3. Annual Goals alignment:
   - "Did this quarter advance your Annual Goals?"

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-reflect-quarterly.md`:

```markdown
# Goals: reflect(quarterly) {date}

## Status
ok

## Section
### Quests Review

**Theme:** {Quarter theme}

**Quest 1:** {Goal} — {Met/Partial/Missed}
- Success criteria: {Original criteria}
- Actual: {What happened}

**Quest 2:** {Goal} — {Met/Partial/Missed}
- Success criteria: {Original criteria}
- Actual: {What happened}

(etc.)

**Annual Goals Progress:** {Assessment}

## Observations
- {Patterns, blockers, learnings}

## Timestamp
{ISO timestamp}
```
