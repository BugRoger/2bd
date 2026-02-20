# Compose

Prepare semantic note updates and archive format based on the completed review.

## Semantic Note Preparation

Based on review phases, identify updates for semantic notes:

### People Updates

From weekly archives and monthly patterns:
- Interaction summaries to crystallize
- Relationship trajectory notes
- Follow-up items completed or pending
- Trust level evolution

For each Person file update, prepare:
```
File: 02_Areas/People/Sarah Chen.md
Section: ## Monthly Summary
Content:
- 2026-02: Strong collaboration month. Weekly 1:1s focused on career development. Trust level increasing. Follow-up: promotion discussion in March.
```

### Project Updates

From outcome review and strategic progress:
- Monthly milestone completions
- Status changes
- Key decisions made
- Quarter progress contribution

For each Project file update, prepare:
```
File: 01_Projects/2026-01-15-project-alpha.md
Section: ## Monthly Progress
Content:
- 2026-02: Phase 2 complete. Shipped feature X. Blocked by dependency on team Y resolved mid-month. On track for Q1 delivery.
```

### Insight Notes

From synthesis across phases:
- Leadership patterns worth crystallizing
- Recurring monthly themes
- Strategic learnings
- Coaching breakthroughs

For significant insights, prepare:
```
File: 00_Brain/Semantic/Insights/leadership-patterns.md
Section: ## Observations
Content:
- 2026-02: Monthly themes compound — February's "Foundation" theme built on January's cleanup. Planning themes 2-3 months out creates continuity.
```

## Archive Format

Prepare Month.md transformation for archival:

### Archive Structure

The archive preserves:
- All frontmatter (with `archived: true` and `archived_date: YYYY-MM-DD` added)
- Complete content of all sections including new review sections
- Changelog entries

### Archive Location

Target: `00_Brain/Periodic/Monthly/YYYY-MM.md`

Example: `00_Brain/Periodic/Monthly/2026-02.md`

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
- Month summary highlights
- Confirmation of content to preserve

### Options

Offer:
- **Proceed all** — Archive and apply all semantic updates
- **Archive only** — Skip semantic updates
- **Review each** — Approve updates individually
- **Cancel** — Exit without archiving (Month.md already updated with synthesis)

Proceed to Persist after user selection.
