# Relationships: Plan Weekly

Generate relationship intentions draft with placeholders.

## Context to Load

1. Read this week's calendar for scheduled interactions
2. Read `vault/00_Brain/Semantic/People/` for key relationships
3. Read `vault/00_Brain/Semantic/Assistants/relationships/memory.md` if exists

## Draft Generation

1. Review calendar for scheduled interactions
2. Identify key relationships from People folder
3. Generate draft with placeholders for intention setting

## Output

Write to `vault/00_Brain/Synthetic/Assistants/relationships/weekly-draft.md`:

```markdown
## Relationships

**Scheduled This Week:**
{List people from calendar}

**Key Relationships:**
{List important people from People folder}

### Relationship Intentions

<!-- ASK:relationships-priority
Who deserves focused time this week? What's your intention for each?
-->

<!-- ASK:relationships-maintenance
Any quick touchpoints to maintain connections?
-->

<!-- ASK:relationships-repairs
Any relationship repairs or concerns to address?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: relationships
action: plan
timescale: weekly
timestamp: {ISO timestamp}
---
```
