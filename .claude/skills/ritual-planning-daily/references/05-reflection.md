# Reflection

Learn from the session to improve future planning rituals. Observations flow freely into Synthetic, cluster automatically, graduate when mature, and crystallize into template insights.

## Step 1: Diff Analysis

Compare the final Today.md against the template to identify structural changes.

### Load Files

1. Read `00_Brain/Captive/Today.md` (user's final version)
2. Read `00_Brain/Systemic/Templates/Captive/today.md` (current template)

### Compare Structure

For each H2 section (Daily Brief, Meetings, Journal):
- H3s added, removed, or renamed
- Content patterns (bullet types, ordering, emphasis)
- Structural divergence from template examples

Note: H2 sections are fixed contracts. Only analyze H3 and content changes.

### Record Observations

Append to `00_Brain/Synthetic/planning-daily/observations.md` ## Observations with type `user-modification` or `skill-generated`:
- `user-modification`: Changes user made after skill generated content
- `skill-generated`: How phases produced content differently than template examples

Format: `- YYYY-MM-DD | type | section | observation text | optional interpretation notes`

Example: `- 2026-02-20 | user-modification | Daily Brief | Added "Blockers" section after Priorities | First time; might indicate friction awareness`

## Step 2: Session Review

Analyze user's interaction patterns during the ritual.

### What to Track

- Questions answered vs skipped during Check-In
- Response length (brief vs expansive)
- Rephrasing of suggestions (accepted, modified, rejected)
- Explicit feedback ("this is too much", "I like this")
- Engagement level with meeting prep prompts

### Record Observations

Append to `00_Brain/Synthetic/planning-daily/observations.md` ## Observations with type `session-interaction`:
- Conversational preferences
- Engagement patterns per phase
- Feedback signals

Format: `- YYYY-MM-DD | session-interaction | section | observation text | optional interpretation notes`

Example: `- 2026-02-20 | session-interaction | Check-In | Answered all questions but kept responses very brief | Time pressure or preference for conciseness?`

## Step 3: Auto-Cluster

The system automatically groups observations by semantic similarity.

### Process

1. Read `00_Brain/Synthetic/planning-daily/observations.md` ## Observations
2. Run semantic grouping to suggest 2-3 potential clusters with example observations
3. Present clusters to user:
   - Suggested cluster name (auto-generated from observation themes)
   - Example observations in each cluster
   - Confidence score (0-5, based on observation count and recency weighting)
4. User reviews suggested names and optionally renames clusters or rejects groupings
5. System records cluster state in `00_Brain/Synthetic/planning-daily/observations.md` ## Clusters:
   - Cluster name (user-approved)
   - Member observations (full list)
   - Confidence score (calculated)
   - Stability flag (unchanged member count over past 3 sessions: yes/no)

### What This Means

- No user effort categorizing observations during observe sessions
- Pattern discovery is system-driven, not user-predetermined
- Novel patterns emerge rather than fitting into predefined boxes
- Clusters can reorganize as new evidence arrives

## Step 4: Monitor for Auto-Graduation

Periodically check cluster maturity (no human action needed until graduation).

### Graduation Criteria

A cluster graduates when:
- Confidence ≥ 4.5/5 (calculated from observation count and recency weighting)
- AND membership stable for 3+ sessions (no new observations added or removed)

### Graduation Process

When criteria met:
1. System identifies graduating cluster
2. Notifies user: "Cluster '[name]' is ready for crystallization"
3. Removes cluster from `00_Brain/Synthetic/planning-daily/observations.md` ## Clusters (prune)
4. Removes member observations from `00_Brain/Synthetic/planning-daily/observations.md` ## Observations (prune)
5. Transitions to Step 5 (Crystallization)

### Why Auto-Graduation?

- Removes manual work of flagging when clusters are ready
- User only makes decisions when insights are crystallizing, not during clustering
- Keeps cognitive overhead low until patterns are solid

## Step 5: Crystallize & Graduate to Semantic

When a cluster reaches graduation criteria, user synthesizes the insight and notes implications.

### Crystallization Process

1. System presents graduated cluster with:
   - Cluster name
   - Observation lineage: count and date range (e.g., "5 observations from 2026-02-15 to 2026-02-20")
   - List of member observations for reference

2. User answers: **"What does this pattern mean for your planning?"**
   - Write 1-2 sentence synthesis of the insight
   - Note any template changes this suggests (e.g., "add Blockers section to Daily Brief")
   - Note uncertainty if needed (e.g., "might indicate time pressure OR preference for conciseness")

3. System writes to `00_Brain/Semantic/planning-daily/insights.md` with structure:

```markdown
## cluster-name

**Pattern:** [User's synthesis, 1-2 sentences]

**Observations:** N from YYYY-MM-DD to YYYY-MM-DD
[Bullet list of key evidence]

**Template Implications:**
[User's notes about template changes suggested]

**Status:** forming (pending template decision) | active (implemented)
```

### User Only Reviews When Crystallizing

- No review of clustering step (automatic)
- No review of graduation criteria (automatic)
- Only review when synthesis matters: moving insight into template

## Step 6: Template Evolution

Review Semantic file for template changes suggested by crystallized insights.

### Process

1. Read `00_Brain/Semantic/planning-daily/insights.md`
2. For each cluster's "Template Implications" notes:
   - If clear and minor (H3 additions, content reordering, example changes): auto-evolve template
   - If unclear or major: flag for discussion before applying

3. When applying minor changes:
   - Read `00_Brain/Systemic/Templates/Captive/today.md`
   - Apply change to relevant H2 section
   - Write updated template
   - Update cluster Status to "active"
   - Log change in cluster's "Template Implications" (add date and result)

### Note on Structure

- H2 sections (Daily Brief, Meetings, Journal, Changelog) never change
- Only H3 structure and content within sections evolve
- Template remains a living example that observation clusters shape over time
