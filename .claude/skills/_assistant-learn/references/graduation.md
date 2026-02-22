# Graduation Protocol

## Synthetic → Semantic

When observations cluster with high confidence:

1. Present cluster to user with evidence
2. User synthesizes: "What does this pattern mean?"
3. Write insight to `vault/00_Brain/Semantic/Assistants/{name}/memory.md`
4. Prune observations from Synthetic

## Confidence Scoring

- 3+ similar observations = consider clustering
- 5+ observations in cluster = flag for graduation
- User confirmation required for graduation

## Memory File Format

`vault/00_Brain/Semantic/Assistants/{name}/memory.md`:

```markdown
# {Name} Memory

## Insights

### {Insight title}
{Synthesized insight}
- Evidence: {dates of supporting observations}
- Graduated: {date}

(etc.)
```

## Learning Output Format

Write to `vault/00_Brain/Synthetic/Assistants/learn/{date}-learn-{timescale}.md`:

```markdown
# Learn: {timescale} {date}

## Status
ok

## Clusters Found

### {Assistant}: {Pattern title}
**Confidence:** {3-5+} observations
**Evidence:**
- {date}: {observation}
- {date}: {observation}

**Ready for graduation:** {Yes/No}

## Graduated This Session
- {Assistant}: {Insight} → memory.md

## Observations
- {Meta-patterns across assistants}

## Timestamp
{ISO timestamp}
```
