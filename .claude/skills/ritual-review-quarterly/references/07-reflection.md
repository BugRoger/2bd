# Reflection

Self-learning phase for ritual improvement.

## Storage Locations

Observations are stored in two locations:

- **Synthetic**: `$VAULT/00_Brain/Synthetic/review-quarterly.md` - active observations being collected
- **Semantic**: `$VAULT/00_Brain/Semantic/review-quarterly.md` - crystallized insights that have graduated

## Diff Analysis

Compare the completed Quarter.md against the template:

- Which H3 sections were added, removed, or renamed?
- Which sections consistently get more/less content?
- What structural patterns emerge in user modifications?

Note deviations as observations with context.

## Session Review

Analyze interaction patterns from this review session:

- **Response length**: Which questions got detailed vs. brief answers?
- **Rephrasing**: Which questions needed clarification?
- **Skips**: Which sections did the user want to skip?
- **Enthusiasm**: Where did energy increase in the conversation?

## Auto-Clustering

Group new observations with existing ones by semantic similarity:

- Check Synthetic/review-quarterly.md for existing clusters
- Add new observations to matching clusters
- Create new clusters for novel patterns
- Update cluster confidence based on recurrence

Cluster structure:
```markdown
## Cluster: [Theme]
Confidence: [1-5]
Sessions: [count]
Observations:
- [observation 1]
- [observation 2]
```

## Graduation Check

Review clusters for graduation eligibility:

**Graduation criteria:**
- Confidence >= 4.5
- Stable for 3+ sessions
- Clear, actionable pattern

**Graduation process:**
1. Present graduated cluster to user
2. User synthesizes into insight
3. Move insight to Semantic/review-quarterly.md
4. Apply to template H3 structure if applicable

## Template Evolution

When insights graduate, consider template updates:

- Add H3 sections users consistently create
- Rename H3s to match user language
- Reorder sections based on usage patterns
- Remove H3s that are consistently skipped

H2 sections remain stable (template contract). Only H3 structure evolves.

## Record Observations

Append session observations to Synthetic/review-quarterly.md:

```markdown
## Session: YYYY-MM-DD

### Observations
- [observation 1]
- [observation 2]

### Clusters Updated
- [cluster name]: [new confidence]
```
