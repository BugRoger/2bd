# Observe

Learn from the session to improve future planning rituals.

## Step 1: Diff Analysis

Compare the final Today.md against the template to identify evolution patterns.

### Load Files

1. Read `00_Brain/Captive/Today.md` (user's final version)
2. Read `00_Brain/Systemic/Templates/Captive/today.md` (current template)

### Compare Structure

For each H2 section (Daily Brief, Meetings, Journal):
- H3s added, removed, or renamed
- Content patterns (bullet types, ordering, emphasis)
- Structural divergence from template examples

Note: H2 sections are fixed contracts. Only analyze H3 and content changes.

### Document-Level Observations

Record observations with type `user-modification` or `skill-generated`:
- `user-modification`: Changes user made after skill generated content
- `skill-generated`: How phases produced content differently than template examples

## Step 2: Session Review

Analyze user's interaction patterns during the ritual.

### What to Track

- Questions answered vs skipped during Check-In
- Response length (brief vs expansive)
- Rephrasing of suggestions (accepted, modified, rejected)
- Explicit feedback ("this is too much", "I like this")
- Engagement level with meeting prep prompts

### Session-Level Observations

Record observations with type `session-interaction`:
- Conversational preferences
- Engagement patterns per phase
- Feedback signals

## Step 3: Record Observations

Append observations to `00_Brain/Synthetic/planning-daily.md`.

### Observation Format

```
- YYYY-MM-DD | type | section | evidence | tags
```

- **type**: `user-modification`, `skill-generated`, or `session-interaction`
- **section**: `Daily Brief`, `Meetings`, `Journal`, or `Check-In`
- **evidence**: Specific change or behavior observed
- **tags**: Semantic categories (e.g., `friction-capture`, `prefers-concise`, `skips-energy`)

### Semantic Tagging

Assign tags based on the conceptual meaning, not literal text:
- "user adds Blockers section" → `friction-capture`
- "user shortens intention" → `prefers-concise`
- "user skips energy question" → `minimal-checkin`

## Step 4: Cluster & Score

Group observations by semantic similarity and calculate confidence.

### Clustering Rules

- Group observations with same or related tags
- Similar-but-not-identical patterns cluster together
- Example: `friction-capture` clusters "adds Blockers", "adds Challenges", "adds Obstacles"

### Confidence Scoring

- Each observation in a cluster adds to confidence
- Recent observations weight slightly higher
- Threshold for graduation: 5+ observations or 3+ in last 10 sessions

## Step 5: Graduate to Semantic

When a cluster crosses confidence threshold, crystallize the insight.

### Graduation Process

1. Read `00_Brain/Synthetic/planning-daily.md`
2. Identify clusters crossing confidence threshold
3. For each graduating cluster:
   - Run deeper analysis: What does this pattern mean for the user?
   - Synthesize into prose insight
   - Append to appropriate section in `00_Brain/Semantic/planning-daily.md`
   - Remove graduated observations from Synthetic (keep cluster summary)

### Semantic File Sections

- **Session Style**: How user prefers to interact with the ritual
- **Content Preferences**: Patterns in Today.md structure and content
- **Template Adaptations**: Log of template changes made

## Step 6: Template Evolution

Apply high-confidence insights to evolve the template.

### Check for Evolution

1. Read `00_Brain/Semantic/planning-daily.md`
2. Identify insights that imply template changes
3. Classify change impact:
   - **Minor**: H3 additions, content pattern changes, reordering
   - **Unclear**: Anything not obviously minor

### Apply Changes

- **Minor changes**: Auto-evolve template, notify user in next Check-In
- **Unclear changes**: Ask user for confirmation before applying

### Update Template

1. Read `00_Brain/Systemic/Templates/Captive/today.md`
2. Apply the change to relevant H2 section
3. Write updated template
4. Log change in Template Adaptations section of Semantic file

Note: H2 sections (Daily Brief, Meetings, Journal, Changelog) never change. Only H3 structure and content within sections evolve.
