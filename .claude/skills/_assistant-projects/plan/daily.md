# Projects: Plan Daily

Generate project task draft.

## Context to Load

1. Read active project files from `vault/01_Projects/`
2. Read `vault/00_Brain/Semantic/Assistants/projects/memory.md`

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
   Use results to identify active projects instead of directory listing.

2. **Get related context for key projects:**
   ```bash
   obsidian backlinks file="01_Projects/{project-name}"
   ```
   Add backlinks to draft context (related goals, people, mentions).

If unavailable, continue with static context only.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/projects/daily-draft.md`:

```markdown
## Projects

**Active Projects:**
{List projects with upcoming deadlines or status=in-progress}

{If CLI enrichment available, add:}
**Related Context:**
{Backlinks showing connections to goals, people, recent mentions}

<!-- ASK:projects-focus
Which project(s) are you working on today?
-->

<!-- ASK:projects-blockers
Any blockers or dependencies?
-->
```
