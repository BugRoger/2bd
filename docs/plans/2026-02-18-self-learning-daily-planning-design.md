# Self-Learning Daily Planning Ritual

Design for adding self-learning capabilities to the daily planning skill.

## Problem

The current daily planning skill has hardcoded reference files and static templates. User preferences, coaching style, and behavioral patterns are not learned over time. The experience remains the same regardless of how the user actually engages with it.

## Goals

1. Learn what the user actually uses vs skips
2. Adapt coaching style to what resonates
3. Evolve templates based on user modifications
4. Keep skill logic stable while vault content evolves

## Approach: Insight-Driven Skill

Single insights file in the vault captures learned preferences. The skill reads insights at startup and adapts behavior. The review ritual observes patterns and proposes updates. Templates evolve in the vault; skill code stays fixed.

## Design

### Insights File

Location: `$VAULT/00_Brain/Systemic/Insights/planning-daily.md`

```markdown
---
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
---

# Daily Planning Insights

Learned preferences for the daily planning ritual.

## Session Style

<!-- How the user prefers to run planning sessions -->

## Priorities

<!-- Priority count, categories used, framing preferences -->

## Coaching Style

<!-- Question types that resonate, phrasing, engagement patterns -->

## Meeting Templates

<!-- 1:1 style, group style, sections used/skipped -->

## Behavioral Patterns

<!-- Correlations: energy, day types, what predicts good days -->

## Observations Log

<!-- Raw observations from recent sessions, timestamped -->

## Pending Proposals

<!-- Suggested changes awaiting user confirmation -->
```

Starts empty. Sections grow organically as patterns emerge.

### Learning Mechanisms

Three mechanisms working together:

**Implicit Observation (planning-daily)**
- Which questions the user engages with vs skips
- How they rephrase suggested priorities
- Whether they accept or modify suggestions
- Template modifications (sections added/removed/rephrased)

**Explicit Prompts (occasional)**
- When a pattern reaches threshold (e.g., 3 occurrences), ask for confirmation
- User confirms → moves from observation to confirmed insight

**Review-Time Synthesis (review-daily)**
- Analyzes what was filled in vs left empty
- Patterns across multiple days
- Proposes insight updates with rationale

### Template Evolution

Current template stays as baseline (start rich, learn to simplify).

Learning direction:
- Observe what gets skipped → propose removal
- Observe what gets shortened → propose simplification
- Observe what gets expanded → reinforce value
- Observe what gets added manually → propose making standard
- Observe phrasing changes → adopt user's style

Meeting templates inlined into vault template so they can evolve per-user.

### Skill Architecture

**Setup step adds:**
1. Load insights file
2. Load template from vault (not hardcoded)

**Reference files become defaults:**
- `session-flow.md` → default workflow, insights adapt behavior
- `priorities-framework.md` → default framework, insights adapt behavior
- `meeting-templates.md` → removed (inlined in vault template)

**New Observe step (after Persist):**
- Compare generated Today.md with user's final version
- Record observations to insights file
- When patterns reach confidence: propose template changes
- Can edit vault template directly with user approval

**What stays fixed (engine):**
- SKILL.md workflow steps
- Reference files as defaults
- Sub-skill invocations

**What evolves (vault):**
- Insights file (learned preferences)
- Template file (evolved structure)
- Meeting templates (within template)

### Coaching Style Evolution

Observe also captures coaching patterns:
- Questions that got engaged with vs skipped
- Phrasing user responded to
- Whether suggestions were accepted or overridden
- Conversation depth per topic

Insights describe coaching preferences in prose. Future sessions adapt naturally based on descriptions.

### Influence Model

**Real-Time Adaptation:**
Skill reads insights during Setup and adapts session behavior.

**Periodic Template Proposals:**
When insights accumulate, propose template changes. User approves → vault template updated.

### Bootstrap

Start with current template (rich baseline). Learn what to simplify over time. No special first-run experience needed.

## Files Changed

**Engine (skill code):**
- `.claude/skills/ritual-planning-daily/SKILL.md` — add Setup/Observe steps
- `.claude/skills/ritual-planning-daily/references/meeting-templates.md` — remove
- `.claude/skills/ritual-review-daily/SKILL.md` — add observation synthesis

**Vault (user content):**
- `$VAULT/00_Brain/Systemic/Insights/planning-daily.md` — new file
- `$VAULT/00_Brain/Systemic/Templates/Captive/today.md` — inline meeting templates

**Scaffold:**
- `scaffold/00_Brain/Systemic/Insights/planning-daily.md` — empty template for new users
- `scaffold/00_Brain/Systemic/Templates/Captive/today.md` — update with inlined templates

## Success Criteria

1. After 2 weeks of use, insights file contains meaningful observations
2. Template has evolved at least once based on user patterns
3. Coaching questions feel personalized, not generic
4. User can read insights file and recognize their preferences
