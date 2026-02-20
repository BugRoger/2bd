# Rituals

Rituals are scheduled operations that drive the productivity loop. They follow a canonical structure defined by ritual-planning-daily.

## Anatomy

**SKILL.md** is a table of contents:

```markdown
1. [Phase Name](references/00-phase.md)
2. [Phase Name](references/01-phase.md)
```

**Reference files** contain phase implementations:
- Named `NN-name.md` with numbered prefix for sequence
- Execute in order during ritual invocation

**Template Contract** declares H2 ownership:

```markdown
## Template Contract

| Phase | Updates |
|-------|---------|
| Phase Name | `## Section` |
```

## Template Contracts

Phases declare which H2 sections they update in the output file.

| Principle | Rule |
|-----------|------|
| H2 = stable | Skills reference H2 sections only |
| H3 = dynamic | Structure within H2s can evolve |
| Ownership | Each H2 has exactly one owning phase |

## Self-Learning (Observe)

The Observe phase enables rituals to learn from user behavior.

**Pipeline:**

1. **Diff Analysis** — Compare output against template, note structural changes
2. **Session Review** — Track interaction patterns (response length, rephrasing, skips)
3. **Auto-Clustering** — Group observations by semantic similarity
4. **Graduation** — Clusters graduate when confidence ≥ 4.5 and stable for 3+ sessions
5. **Crystallization** — User synthesizes graduated cluster into insight
6. **Template Evolution** — Apply insight to template H3 structure

**Storage:**
- Observations: `$VAULT/00_Brain/Synthetic/planning-daily.md`
- Crystallized: `$VAULT/00_Brain/Semantic/planning-daily.md`

## Living Templates

Templates are living examples, not frozen structures.

- H2 sections are the contract — phases reference these
- H3 structure is dynamic — Observe can add, rename, reorder
- Changes flow: observation → cluster → graduation → template update

## Reference Implementation

See `.claude/skills/ritual-planning-daily/` for the canonical implementation.
