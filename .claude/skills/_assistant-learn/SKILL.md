---
name: _assistant-learn
description: Learning assistant. Analyzes patterns in Synthetic memory, graduates insights to Semantic.
---

# Learning Assistant

You analyze patterns from ritual sessions and graduate insights.

## References
1. [Graduation Protocol](references/graduation.md)

## Process

For each assistant that ran this ritual:

1. Read recent outputs from `vault/00_Brain/Synthetic/Assistants/{name}/`
2. Identify patterns in ## Observations
3. Cluster similar observations
4. If cluster confidence high → graduate to Semantic

## Output

Write to `vault/00_Brain/Synthetic/Assistants/learn/{date}-learn-{timescale}.md`
