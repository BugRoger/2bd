# Persist

Execute confirmed writes from the compose phase.

## Archive Quarter.md

Transform and archive to Periodic/Quarterly/:

1. **Ensure directory exists**: Create Periodic/Quarterly/ if needed

2. **Transform content**: Convert Quarter.md to archive format per quarterly.md template:
   - Add `archived: YYYY-MM-DD` to frontmatter
   - Add Weekly Summary section with links to Periodic/Weekly/
   - Add Synthesis section with quarter theme, key accomplishments, strategic patterns, next quarter setup

3. **Write archive**: Save to `Periodic/Quarterly/YYYY-QN.md`

4. **Verify write**: Confirm file exists and content is correct

5. **Record archival**: Append to Changelog:
   ```
   - YYYY-MM-DD HH:MM - Archived via quarterly-review ritual
   ```

## Replace Captive Quarter.md

Replace Quarter.md in Captive with archived placeholder:

```markdown
---
quarter: YYYY-QN
archived: true
---

This quarter has been archived.

See: [[00_Brain/Periodic/Quarterly/YYYY-QN|Quarterly Archive]]
```

## Apply Semantic Updates

For each approved semantic note update:

1. Read current file content
2. Locate target section
3. Append or update content
4. Write updated file
5. Verify write succeeded

## Update Year.md

If significant patterns emerged, update Year.md:
- Add quarter summary to `## Quarterly Progress`
- Update `## Annual Wins` if major accomplishments
- Note any shifts in annual trajectory

## Completion Report

Report what was persisted:
- Archive location and summary
- Semantic notes updated
- Year.md updates (if any)

Suggest next steps:
- Quarterly planning when ready for next quarter
- Yearly review if end of year approaching
- Year.md updates for significant pattern shifts

If directives were not available, suggest running `/init`.
