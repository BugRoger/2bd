# Relationships: Plan Daily

Generate touchpoint draft.

## Context to Load

1. Fetch today's calendar events
2. Read person dossiers from `vault/02_Areas/People/`
3. Check for birthdays or special dates

## Enrich via Obsidian CLI

Check if CLI is available:

```bash
obsidian version 2>/dev/null
```

If available (exit code 0):

1. **Get backlinks for people you're meeting today:**
   ```bash
   obsidian backlinks file="02_Areas/People/{PersonName}"
   ```
   Surface recent context, shared history, open threads.

2. **Search for recent mentions:**
   ```bash
   obsidian search query="{PersonName}" limit=5
   ```
   Find where this person came up recently in notes.

If unavailable, continue with static dossier context only.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/relationships/daily-draft.md`:

```markdown
## Relationships

**Today's Touchpoints:**
{List people you're meeting with today from calendar}
{If CLI enrichment available, add recent context from backlinks}

<!-- ASK:relationships-touchpoints
Anyone else you want to connect with today?
-->

**Birthdays/Special Dates:**
{If any found from calendar or dossiers}
```
