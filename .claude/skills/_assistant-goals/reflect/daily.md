# Goals: Reflect Daily

Review 1-3-5 completion.

## Context to Load

1. Read `vault/00_Brain/Captive/Today.md` for planned 1-3-5
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Show the actual 1-3-5 from Today.md

2. Interactive review:
   - For each task: "Did you complete this? [Yes/Partial/No]"
   - If partial/no: "What blocked you?"

3. Connect to Major Moves:
   - "Did today advance your weekly Major Moves?"

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-reflect-daily.md`:

```markdown
# Goals: reflect(daily) {date}

## Status
ok

## Section
### 1-3-5 Review

**Big:** {Task} — {Yes/Partial/No}
{Blocker if applicable}

**Medium:**
- {Task 1} — {Yes/Partial/No}
- {Task 2} — {Yes/Partial/No}
- {Task 3} — {Yes/Partial/No}

**Small:**
- {Task 1} — {Yes/Partial/No}
- {etc.}

**Major Move Progress:** {Assessment}

## Observations
- {Patterns, blockers, learnings}

## Timestamp
{ISO timestamp}
```
