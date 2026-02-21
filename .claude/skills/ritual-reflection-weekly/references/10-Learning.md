# Learning

Learn from the session to improve future rituals.

## Step 1: Session Review

Analyze user interaction patterns during the ritual.

### What to Track Per Track

For each track phase:
- Engagement level
- Skipped or rushed sections
- Explicit feedback

### Record Observations

For each track with notable observations, append to `00_Brain/Synthetic/Coaching/{Track}/insights.md` ## Observations:

Format: `- YYYY-MM-DD | type | observation | interpretation`

## Step 2: Auto-Cluster

For each track's insights file:
1. Read observations
2. Group by semantic similarity
3. Update clusters with confidence scores

## Step 3: Monitor Graduation

- If confidence ≥ 4.5 AND stable 3+ sessions → flag for crystallization
- Notify user of ready clusters

## Step 4: Crystallize (If Triggered)

When cluster graduates:
1. Present cluster with observation lineage
2. User synthesizes the pattern
3. Write to `00_Brain/Semantic/Coaching/{Track}/insights.md`
4. Prune from Synthetic

## Step 5: Apply Insights

### Coach Updates

Review crystallized insights for guidance changes:
- Minor → suggest update to `00_Brain/Systemic/Coaching/{Track}/weekly.md`
- Major → flag for discussion

### Template Updates

Review for template changes:
- H3 additions → apply to template
- H2 changes → reject (contract)

Ritual complete.
