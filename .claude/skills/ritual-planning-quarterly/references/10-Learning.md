# Learning

Learn from the session to improve future rituals. Two learning targets: Coach and Template.

## Step 1: Session Review

Analyze user interaction patterns during the ritual.

### What to Track Per Track

For each track phase (Brief, Goals, Journal, Achievements, Relationships, Projects):
- Response engagement (detailed vs brief)
- Suggestions accepted, modified, or rejected
- Explicit feedback signals
- Time spent (short = efficient or disengaged?)

### Record Observations

For each track with notable observations, append to `00_Brain/Synthetic/Coaching/{Track}/insights.md` ## Observations:

Format: `- YYYY-MM-DD | type | observation | interpretation`

Types:
- `session-interaction` — How user engaged with this track
- `content-preference` — What content style resonated
- `skip-signal` — Track was rushed or skipped

## Step 2: Template Diff

Compare final Quarter.md against template.

### What to Track

- H3 sections added, removed, or renamed
- Content patterns changed
- Structure divergence

### Record Observations

Append to `00_Brain/Synthetic/Coaching/Template/insights.md` ## Observations:

Format: `- YYYY-MM-DD | type | section | observation | interpretation`

Types:
- `user-modification` — Changes user made after generation
- `skill-generated` — How phases produced differently than template

## Step 3: Auto-Cluster (Per Track)

For each track's insights file:
1. Read `00_Brain/Synthetic/Coaching/{Track}/insights.md` ## Observations
2. Group by semantic similarity
3. Update ## Clusters with:
   - Cluster name
   - Member observations
   - Confidence score (0-5)
   - Stability flag

## Step 4: Monitor Graduation

For each track's clusters:
- If confidence ≥ 4.5 AND stable 3+ sessions → flag for crystallization
- Notify user: "Cluster '[name]' in {Track} ready for crystallization"

## Step 5: Crystallize (If Triggered)

When cluster graduates:
1. Present cluster with observation lineage
2. User synthesizes: "What does this pattern mean?"
3. Write to `00_Brain/Semantic/Coaching/{Track}/insights.md`
4. Prune from Synthetic

## Step 6: Apply Insights

### Coach Updates

Review `00_Brain/Semantic/Coaching/{Track}/insights.md` for guidance changes:
- If clear and minor → suggest update to `00_Brain/Systemic/Coaching/{Track}/quarterly.md`
- If major → flag for discussion

### Template Updates

Review `00_Brain/Semantic/Coaching/Template/insights.md` for template changes:
- If H3 addition or content pattern → apply to `00_Brain/Systemic/Templates/Captive/Quarter.md`
- If H2 change → reject (H2 is contract)

Ritual complete.
