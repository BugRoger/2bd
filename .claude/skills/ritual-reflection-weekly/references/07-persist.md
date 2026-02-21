# Persist

Execute approved changes: archive Week.md and update semantic notes.

## Archive Week.md

### Ensure Directory

Check that `00_Brain/Periodic/Weekly/` exists. Create if needed.

### Transform Content

1. Read `00_Brain/Captive/Week.md`
2. Update frontmatter:
   - Add `archived: true`
   - Add `archived_date: YYYY-MM-DD`
3. Preserve all content

### Write Archive

1. Write to `00_Brain/Periodic/Weekly/YYYY-Www.md`
2. Verify write succeeded by reading back

### Update Captive Week.md

Replace Week.md in Captive with archived placeholder:

```markdown
---
week: YYYY-Www
archived: true
archived_to: Periodic/Weekly/YYYY-Www.md
---

# Week YYYY-Www

This week has been archived.

**Archive location:** [[Periodic/Weekly/YYYY-Www|View archive]]

**Next week:** [[Week|Plan next week]]
```

### Record Archival

Invoke `append-changelog` sub-skill:
- skill: "review-weekly"
- action: "Archived"
- summary: "Week YYYY-Www from Captive/Week.md to Periodic/Weekly/"

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
Weekly Review Complete

Archived: Week 2026-W08 → Periodic/Weekly/2026-W08.md

Semantic Updates:
- People/Sarah Chen.md: Added interaction log
- Projects/project-alpha.md: Updated progress
- Insights/leadership-patterns.md: Added observation

Next Steps:
- Weekly planning when ready
- Quarter.md update suggested (new pattern observed)
```

## Graceful Degradation

If directives were not available during the session, suggest:

"Consider running `/init` to set up your profile for richer coaching context."

Proceed to Reflection.
