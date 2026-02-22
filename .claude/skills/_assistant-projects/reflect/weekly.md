# Projects: Reflect Weekly

Review project health for the week.

## Context to Load

1. Read this week's project plan
2. Read daily project reflections
3. Read `vault/00_Brain/Semantic/Assistants/projects/memory.md` if exists

## Process

1. Review project health:
   - Which projects advanced?
   - Which are stuck?
   - Any projects to archive?

## Output

Write to `vault/00_Brain/Synthetic/Assistants/projects/{date}-reflect-weekly.md`:

```markdown
# Projects: reflect(weekly) {date}

## Status
ok

## Section
### Project Health

**Healthy:**
- {Project} — {Why}

**At risk:**
- {Project} — {Why}

**Consider archiving:**
- {Project} — {Why}

## Observations
- {Project patterns}

## Timestamp
{ISO timestamp}
```
