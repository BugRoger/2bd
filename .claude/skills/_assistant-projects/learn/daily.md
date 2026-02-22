# Projects: Learn Daily

Analyze project patterns and graduate insights to Semantic memory.

## Context to Load

1. Read recent outputs from `vault/00_Brain/Synthetic/Assistants/projects/` (last 7 days)
2. Read `vault/00_Brain/Semantic/Assistants/projects/memory.md` if exists

## Process

1. Scan ## Observations from recent outputs
2. Identify recurring patterns:
   - Blocker patterns: What types of blockers recur?
   - Velocity patterns: Which projects move fast/slow?
   - Next action patterns: What gets done vs. deferred?
3. Cluster similar observations (3+ = consider, 5+ = flag for graduation)

## Graduation

If cluster confidence high:
1. Present to user: "I noticed {pattern} across {N} days. Evidence: {dates}"
2. Ask: "What does this pattern mean to you?"
3. Write synthesized insight to `vault/00_Brain/Semantic/Assistants/projects/memory.md`

## Output

Write to `vault/00_Brain/Synthetic/Assistants/projects/{date}-learn-daily.md`:

```markdown
# Projects: learn(daily) {date}

## Status
ok

## Clusters Found

### {Pattern title}
**Confidence:** {N} observations
**Evidence:**
- {date}: {observation}
- {date}: {observation}

**Ready for graduation:** {Yes/No}

## Graduated This Session
- {Insight title} -> memory.md (or "None")

## Timestamp
{ISO timestamp}
```
