# Projects: Plan Daily

Generate project task draft.

## Context to Load

1. Read active project files from `vault/01_Projects/`
2. Read `vault/00_Brain/Semantic/Assistants/projects/memory.md`

## Output

Write to `vault/00_Brain/Synthetic/Assistants/projects/daily-draft.md`:

```markdown
## Projects

**Active Projects:**
{List projects with upcoming deadlines or status=in-progress}

<!-- ASK:projects-focus
Which project(s) are you working on today?
-->

<!-- ASK:projects-blockers
Any blockers or dependencies?
-->
```
