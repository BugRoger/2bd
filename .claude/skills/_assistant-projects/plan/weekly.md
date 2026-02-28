# Projects: Plan Weekly

Generate project status draft with placeholders.

## Context to Load

1. Read `vault/01_Projects/` for active projects
2. Read this week's Major Moves for project alignment
3. Read `vault/00_Brain/Semantic/Assistants/projects/memory.md` if exists

## Enrich via Obsidian CLI

Check if CLI is available:

```bash
obsidian version 2>/dev/null
```

If available (exit code 0):

1. **Discover projects dynamically:**
   ```bash
   obsidian search query="path:01_Projects" limit=20
   ```

2. **Get related context for each active project:**
   ```bash
   obsidian backlinks file="01_Projects/{project-name}"
   ```
   Surface connections to quarterly goals, team members, blockers.

If unavailable, continue with static context only.

## Draft Generation

1. Review all active projects from Projects folder (or CLI search results)
2. Extract Major Moves for alignment check
3. Include backlink context if available
4. Generate draft with project context and placeholders

## Output

Write to `vault/00_Brain/Synthetic/Assistants/projects/weekly-draft.md`:

```markdown
## Projects

**Active Projects:**
{List projects from vault/01_Projects/ with status=in-progress}

**This Week's Major Moves:**
{Extract from Week.md}

{If CLI enrichment available:}
**Project Connections:**
{Backlinks showing how projects connect to goals and people}

### Project Status

<!-- ASK:projects-status
For each active project, what's the status and this week's goal?
-->

<!-- ASK:projects-milestones
What are the key milestones coming up?
-->

<!-- ASK:projects-risks
Any projects at risk or blocked?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: projects
action: plan
timescale: weekly
timestamp: {ISO timestamp}
---
```
