# Projects: Reflect Daily

Generate reflection draft comparing planned project focus to actual progress with placeholders.

## Context to Load

1. Read plan output: `vault/00_Brain/Synthetic/Assistants/projects/{date}-plan-daily.md` or draft
2. Read capture note `vault/00_Brain/Captive/Today.md` — find project content
3. Read `vault/00_Brain/Semantic/Assistants/projects/memory.md` if exists

## Draft Generation

1. Extract planned project focus from plan output
2. Extract actual project progress from capture note if available
3. Generate draft with placeholders for reflection

## Output

Write to `vault/00_Brain/Synthetic/Assistants/projects/daily-reflect-draft.md`:

```markdown
## Projects

**Planned Focus:**
{Extract from plan}

**From Today's Note:**
{Extract project progress if available}

### Reflection

<!-- ASK:projects-progress
What progress did you make on projects today?
-->

<!-- ASK:projects-blockers
Any blockers or dependencies you encountered?
-->

<!-- ASK:projects-unplanned
Any unplanned project work?
-->

<!-- ASK:projects-learnings
Any insights about projects from today?
-->

### Entity Learnings

{Auto-extract projects mentioned}

<!-- ASK:projects-entity-insights
Any specific insights about individual projects?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: projects
action: reflect
timescale: daily
timestamp: {ISO timestamp}
---
```
