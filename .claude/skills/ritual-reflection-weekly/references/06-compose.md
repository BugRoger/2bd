# Compose

Prepare semantic note updates and archive format based on the completed review.

## Semantic Note Preparation

Based on review phases, identify updates for semantic notes:

### People Updates

From People Review phase:
- Interaction logs to append
- Current topic updates
- Follow-up items to add
- Relationship notes

For each Person file update, prepare:
```
File: 02_Areas/People/Sarah Chen.md
Section: ## Interactions
Content:
- 2026-W08: Discussed Q2 roadmap, aligned on priorities. Follow-up: review proposal by Feb 28.
```

### Project Updates

From wins and priorities:
- Milestone completions
- Status changes
- Key decisions made

For each Project file update, prepare:
```
File: 01_Projects/2026-01-15-project-alpha.md
Section: ## Progress
Content:
- 2026-W08: Completed phase 2, shipped feature X ahead of schedule
```

### Insight Notes

From synthesis phases:
- Leadership patterns worth crystallizing
- Recurring themes across weeks
- Learnings to preserve

For significant insights, prepare:
```
File: 00_Brain/Semantic/Insights/leadership-patterns.md
Section: ## Observations
Content:
- 2026-W08: Best embodiment when mornings protected for deep work
```

## Archive Format

Prepare Week.md transformation for archival:

### Archive Structure

The archive preserves:
- All frontmatter (with `archived: true` added)
- Complete content of all sections
- Changelog entries

### Archive Location

Target: `00_Brain/Periodic/Weekly/YYYY-Www.md`

Example: `00_Brain/Periodic/Weekly/2026-W08.md`

## Present Proposals

Show user all proposed changes:

### Semantic Updates

List each update with:
- Target file
- Section to update
- Content preview

### Archive Preview

Show:
- Archive destination path
- Week summary highlights
- Confirmation of content to preserve

### Options

Offer:
- **Proceed all** — Archive and apply all semantic updates
- **Archive only** — Skip semantic updates
- **Review each** — Approve updates individually
- **Cancel** — Exit without changes (Week.md already updated with synthesis)

Proceed to Persist after user selection.
