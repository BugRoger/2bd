# Relationships: Plan Weekly

Generate relationship intentions draft with placeholders.

## Context to Load

1. Read this week's calendar for scheduled interactions
2. Read `vault/02_Areas/People/` for key relationships
3. Read `vault/00_Brain/Semantic/Assistants/relationships/memory.md` if exists

## Enrich via Obsidian CLI

Check if CLI is available:

```bash
obsidian version 2>/dev/null
```

If available (exit code 0):

1. **Get backlinks for key relationships:**
   ```bash
   obsidian backlinks file="02_Areas/People/{PersonName}"
   ```
   Surface relationship history, shared projects, recent interactions.

2. **Search for recent mentions of important people:**
   ```bash
   obsidian search query="{PersonName}" limit=10
   ```
   Understand recent context and touchpoints.

If unavailable, continue with static context only.

## Draft Generation

1. Review calendar for scheduled interactions
2. Identify key relationships from People folder
3. Include backlink context if CLI enrichment available
4. Generate draft with placeholders for intention setting

## Output

Write to `vault/00_Brain/Synthetic/Assistants/relationships/weekly-draft.md`:

```markdown
## Relationships

**Scheduled This Week:**
{List people from calendar}

**Key Relationships:**
{List important people from People folder}
{If CLI enrichment available, add recent context from backlinks}

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
