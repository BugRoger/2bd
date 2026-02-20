# Persist

Execute approved changes: archive Month.md and update semantic notes.

## Archive Month.md

### Ensure Directory

Check that `00_Brain/Periodic/Monthly/` exists. Create if needed.

### Transform Content

1. Read `00_Brain/Captive/Month.md`
2. Update frontmatter:
   - Add `archived: true`
   - Add `archived_date: YYYY-MM-DD`
3. Preserve all content including review sections

### Write Archive

1. Write to `00_Brain/Periodic/Monthly/YYYY-MM.md`
2. Verify write succeeded by reading back

### Update Captive Month.md

Replace Month.md in Captive with archived placeholder:

```markdown
---
month: YYYY-MM
archived: true
archived_to: Periodic/Monthly/YYYY-MM.md
---

# Month YYYY-MM

This month has been archived.

**Archive location:** [[Periodic/Monthly/YYYY-MM|View archive]]

**Next month:** [[Month|Plan next month]]
```

### Record Archival

Invoke `append-changelog` sub-skill:
- skill: "review-monthly"
- action: "Archived"
- summary: "Month YYYY-MM from Captive/Month.md to Periodic/Monthly/"

## Apply Semantic Updates

For each approved semantic update from Compose phase:

### People Files

Invoke `update-semantic` sub-skill for each:
- target: People file path
- section: Target H2 section
- content: Prepared content

### Project Files

Invoke `update-semantic` sub-skill for each:
- target: Project file path
- section: Target H2 section
- content: Prepared content

### Insight Notes

Invoke `update-semantic` sub-skill for each:
- target: Insight file path
- section: Target H2 section
- content: Prepared content

## Completion Report

Summarize what was persisted:

```
Monthly Review Complete

Archived: Month 2026-02 → Periodic/Monthly/2026-02.md

Semantic Updates:
- People/Sarah Chen.md: Added monthly summary
- Projects/project-alpha.md: Updated monthly progress
- Insights/leadership-patterns.md: Added observation

Next Steps:
- Monthly planning when ready for next month
- Quarterly review approaching (end of Q1)
- Quarter.md update suggested based on patterns observed
```

## Graceful Degradation

If directives were not available during the session, suggest:

"Consider running `/init` to set up your profile for richer coaching context."

Proceed to Reflection.
