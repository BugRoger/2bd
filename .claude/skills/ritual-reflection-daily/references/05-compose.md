# Compose

Prepare all updates before persisting. This phase synthesizes the session into actionable changes.

## Semantic Note Updates

Review session content for updates to crystallized knowledge:

### People Files

From 1:1 meetings and interactions:
- New context about their situation
- Topics discussed, commitments made
- Relationship development notes

For each person mentioned, prepare update to `02_Areas/People/{name}.md`.

### Project Files

From wins and priority completion:
- Milestone progress
- Blocker updates
- Next steps identified

For each project touched, prepare update to `01_Projects/{project}.md`.

### Insight Notes

From Key Insight if it's evergreen:
- Does this insight belong in Semantic storage?
- Is it a recurring pattern worth crystallizing?
- Does it connect to an existing insight note?

If yes, prepare update to `00_Brain/Semantic/Insights/{topic}.md`.

## Archive Preparation

Transform Today.md into archive format:

1. **Preserve all frontmatter** with final values:
   - Add `evening_energy: [High/Medium/Low]` from check-in
   - Add `priorities_completed: [N/M]` from status review

2. **Keep all H2 sections** intact:
   - Daily Brief (with completion annotations)
   - Meetings (with full notes)
   - Journal (with Wins and Insights)
   - Changelog

3. **Ensure completeness**:
   - All meeting notes captured
   - All wins and insights filled
   - Changelog has review entry

## Present for Approval

Show the user:

1. **Semantic updates** — each target file and proposed content
2. **Archive preview** — key sections of the archive format
3. **Completion summary** — priorities completed, wins captured, insights crystallized

Get explicit approval before proceeding to Persist.

Proceed to Persist after approval.
