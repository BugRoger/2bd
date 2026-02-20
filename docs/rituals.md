# Rituals

Rituals are scheduled operations that drive the productivity loop. This document defines the canonical structure all rituals follow.

## Anatomy

A ritual skill consists of:

```
.claude/skills/ritual-{name}/
  SKILL.md              # Table of contents with phase links
  references/
    00-setup.md         # Always first: load context, validate
    01-{phase}.md       # Core phases (ritual-specific)
    ...
    NN-observe.md       # Always last: self-learning
```

**SKILL.md** is a numbered table of contents:

```markdown
1. [Setup](references/00-setup.md)
2. [Phase Name](references/01-phase.md)
...
N. [Observe](references/NN-observe.md)
```

Phases execute in order. Each ritual is self-contained.

## Phase Pattern

Every ritual follows Setup -> Core Phases -> Observe:

| Phase | Purpose |
|-------|---------|
| **Setup** | Load context (sub-skills, files, derived data), validate state, initialize output |
| **Core** | Ritual-specific work (interactive or non-interactive) |
| **Observe** | Learn from session, evolve templates |

Setup always runs first. Observe always runs last. Core phases vary by ritual.

## Template Contract

Each ritual declares which H2 sections its phases update:

```markdown
## Template Contract

| Phase | Updates |
|-------|---------|
| Daily Brief | `## Daily Brief` |
| Meetings | `## Meetings` |
```

| Principle | Rule |
|-----------|------|
| H2 = stable | Phases reference H2 sections only |
| H3 = dynamic | Structure within H2s can evolve |
| Single owner | Each H2 has exactly one owning phase |

## Self-Learning Pipeline (Observe)

Observe enables rituals to learn from user behavior through a six-step pipeline.

### Step 1: Diff Analysis

Compare output against template. For each H2 section, note:
- H3s added, removed, or renamed
- Content patterns (bullet types, ordering, emphasis)
- Structural divergence from template examples

Record observations with type `user-modification` or `skill-generated`.

### Step 2: Session Review

Track interaction patterns during the ritual:
- Questions answered vs skipped
- Response length (brief vs expansive)
- Rephrasing of suggestions
- Explicit feedback

Record observations with type `session-interaction`.

### Step 3: Auto-Cluster

System groups observations by semantic similarity:
1. Suggest 2-3 clusters with example observations
2. Present with confidence score (0-5)
3. User reviews/renames cluster names
4. Record cluster state (name, members, confidence, stability flag)

### Step 4: Monitor Graduation

Clusters graduate automatically when:
- Confidence >= 4.5
- Membership stable for 3+ sessions

On graduation: notify user, prune cluster and observations from Synthetic, transition to Step 5.

### Step 5: Crystallize

User synthesizes the graduated cluster:
1. System presents cluster with observation lineage
2. User answers: "What does this pattern mean?"
3. System writes insight to Semantic with status `forming`

### Step 6: Template Evolution

Apply crystallized insights to templates:
- Minor changes (H3 additions, reordering): auto-evolve
- Major changes: flag for discussion
- Update insight status to `active` when applied

## Storage Paths

| Type | Path | Purpose |
|------|------|---------|
| Observations | `$VAULT/00_Brain/Synthetic/{ritual-name}/observations.md` | Raw observations and active clusters |
| Insights | `$VAULT/00_Brain/Semantic/{ritual-name}/insights.md` | Crystallized patterns |
| Coaching | `$VAULT/00_Brain/Systemic/Coaching/{domain}.md` | Cross-ritual guidance (planning, review, leadership) |

## Living Templates

Templates are living examples, not frozen structures:

- **H2 sections are contracts** - phases reference these, never change them
- **H3 structure is dynamic** - Observe can add, rename, reorder within H2s
- **Evolution flow**: observation -> cluster -> graduation -> crystallization -> template update

Templates start as sensible defaults. User behavior shapes them over time through the Observe pipeline.

## Reference Implementation

See `.claude/skills/ritual-planning-daily/` for the canonical implementation demonstrating all patterns.
