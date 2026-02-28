# Relationships: Plan Daily

Generate touchpoint draft.

## Context to Load

1. Fetch today's calendar events
2. Read person dossiers from `vault/02_Areas/People/`
3. Check for birthdays or special dates

## Output

Write to `vault/00_Brain/Synthetic/Assistants/relationships/daily-draft.md`:

```markdown
## Relationships

**Today's Touchpoints:**
{List people you're meeting with today from calendar}

<!-- ASK:relationships-touchpoints
Anyone else you want to connect with today?
-->

**Birthdays/Special Dates:**
{If any found from calendar or dossiers}
```
