# Brief: Plan Weekly

Generate week ahead brief with context and leadership intention.

## Context to Load

1. Read `vault/00_Brain/Captive/Quarter.md` for quarterly focus
2. Read `vault/00_Brain/Systemic/Coaching/leadership/weekly.md`
3. Read calendar for the week (via @_assistant-calendar)

## Process

1. Analyze calendar:
   - Meeting density by day
   - Focus time blocks
   - Key commitments
   - Energy arc

2. Generate brief:
   - This quarter's theme (from Quarter.md)
   - Growth edge (from leadership coaching)
   - Week shape summary
   - Key commitments
   - Leadership intention

## Output

Write to `vault/00_Brain/Synthetic/Assistants/brief/{date}-plan-weekly.md`:

```markdown
# Brief: plan(weekly) {date}

## Status
ok

## Section
### Weekly Brief

**This Quarter's Theme:** {From Quarter.md}

**Growth Edge:** {From leadership coaching}

{Week shape narrative: busy days, focus days, key meetings}

### Key Commitments
- {Commitment 1} — {Day}
- {Commitment 2} — {Day}
- {Commitment 3} — {Day}

### Intention
**{One word}** — {Brief explanation for the week}

## Observations
- {Calendar patterns, energy considerations}

## Timestamp
{ISO timestamp}
```
