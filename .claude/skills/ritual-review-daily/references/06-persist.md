# Persist

Execute all approved changes. Archive Today.md to Periodic and update semantic notes.

## Execute Semantic Updates

For each approved update from Compose phase:

### People Files
1. Read `02_Areas/People/{name}.md`
2. Append or update relevant sections
3. Write entire file back
4. Log change

### Project Files
1. Read `01_Projects/{project}.md`
2. Update progress, blockers, next steps
3. Write entire file back
4. Log change

### Insight Notes
1. Read or create `00_Brain/Semantic/Insights/{topic}.md`
2. Add or update insight content
3. Write entire file back
4. Log change

## Archive Today.md

1. **Ensure directory exists**: `00_Brain/Periodic/Daily/`

2. **Write archive**:
   - Target: `00_Brain/Periodic/Daily/{date}.md` (date in YYYY-MM-DD format)
   - Content: Full Today.md with all session updates
   - Verify write succeeded

3. **Append changelog** (call append-changelog sub-skill):
   - skill: "review-daily"
   - action: "Archived"
   - summary: "from Captive/Today.md"

## Replace Today.md

Replace `00_Brain/Captive/Today.md` with archived placeholder:

```markdown
---
archived: {date}
---

# Archived

This day has been archived to [[00_Brain/Periodic/Daily/{date}]].

Run `/ritual-planning-daily` to start a new day.
```

Substitute `{date}` with target date in YYYY-MM-DD format.

## Report Completion

Summarize what was done:
- Archive location and date
- Semantic updates executed
- Day summary (energy trajectory, priorities completed, key wins)

Suggest next steps:
- Daily planning for tomorrow if needed
- Week.md updates if patterns emerged
- New insight notes if warranted

If directives were not available, suggest running `/init`.

Proceed to Observe.
