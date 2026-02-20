# Persist

Execute confirmed writes from the compose phase.

## Archive Year.md

Transform and archive to Periodic/Yearly/:

1. **Ensure directory exists**: Create Periodic/Yearly/ if needed

2. **Transform content**: Convert Year.md to archive format:
   - Add `archived: YYYY-MM-DD` to frontmatter
   - Add Quarterly Summary section with links to Periodic/Quarterly/
   - Ensure all review sections are populated
   - Include the defining year narrative prominently

3. **Write archive**: Save to `Periodic/Yearly/YYYY.md`

4. **Verify write**: Confirm file exists and content is correct

5. **Record archival**: Append to Changelog:
   ```
   - YYYY-MM-DD HH:MM - Archived via yearly-review ritual
   ```

## Replace Captive Year.md

Replace Year.md in Captive with archived placeholder:

```markdown
---
year: YYYY
archived: true
---

This year has been archived.

See: [[00_Brain/Periodic/Yearly/YYYY|Yearly Archive]]
```

## Apply Semantic Updates

For each approved semantic note update:

1. Read current file content
2. Locate target section
3. Append or update content
4. Write updated file
5. Verify write succeeded

## Completion Report

Report what was persisted:
- Archive location and year narrative
- Semantic notes updated (count and files)
- Crystallized insights added

Suggest next steps:
- Yearly planning when ready for the new year
- Multi-year reflection if significant milestones reached (5 years, decade)
- Share the year's narrative with relevant people if appropriate
- Consider what the year taught you about planning

If directives were not available, suggest running `/init`.
