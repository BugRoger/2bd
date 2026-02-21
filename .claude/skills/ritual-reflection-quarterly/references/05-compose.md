# Compose

Prepare all outputs from the quarterly review.

## Semantic Note Updates

Based on the completed review, prepare updates for semantic notes.

### People Updates

From quarter's relationship patterns:
- Key collaborators who emerged
- Relationship dynamics that shifted
- 1:1 themes across the quarter

Prepare structured proposals:
```
File: People/[name].md
Section: ## Relationship History
Content: [Quarter summary of interactions]
```

### Project Updates

From outcome completion and strategic progress:
- Project milestones achieved
- Status changes
- Lessons learned per project

Prepare structured proposals:
```
File: Projects/[project].md
Section: ## Progress Log
Content: [Quarter progress summary]
```

### Insight Updates

From key learnings and pattern recognition:
- Leadership insights
- Strategic realizations
- Process improvements discovered

Prepare structured proposals:
```
File: Insights/[topic].md
Section: ## Observations
Content: [Crystallized insight]
```

## Archive Format

Prepare Quarter.md transformation to archive format.

Archive includes:
- Preserved frontmatter with `archived: YYYY-MM-DD` added
- Quarter Overview (preserved)
- Key Dates (preserved)
- Weekly Summary with links to weekly archives
- Wins This Quarter (preserved)
- Reflections (preserved)
- Synthesis section (new, from review)
- Changelog (preserved)

## Confirmation Preview

Present all proposed changes for user approval:

1. **Archive destination**: Periodic/Quarterly/YYYY-QN.md
2. **Semantic updates**: List each file, section, and content preview
3. **Quarter.md replacement**: Archived placeholder

Options:
- **Proceed all** - archive and apply all updates
- **Archive only** - skip semantic updates
- **Review each** - approve individually
- **Cancel** - exit without changes
