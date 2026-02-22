# Brief: Plan Daily

Generate morning brief with context and leadership intention.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for weekly focus
2. Read `vault/00_Brain/Systemic/Coaching/leadership/daily.md`
3. Read calendar for today (via @_assistant-calendar)

## Process

1. Analyze calendar:
   - Meeting load
   - Focus time available
   - Energy demands

2. Generate brief:
   - Today's focus (from weekly context)
   - Growth edge (from leadership coaching)
   - Day shape summary
   - Top 3 priorities
   - Leadership intention

## Output

Write to `vault/00_Brain/Synthetic/Assistants/brief/{date}-plan-daily.md`:

```markdown
# Brief: plan(daily) {date}

## Status
ok

## Section
### Daily Brief

**This Week's Focus:** {From Week.md}

**Growth Edge:** {From leadership coaching}

{Day shape narrative: meetings, focus time, energy}

### Priorities
1. {Priority 1} — {Why it matters today}
2. {Priority 2} — {Why it matters today}
3. {Priority 3} — {Why it matters today}

### Intention
**{One word}** — {Brief explanation}

## Observations
- {Calendar patterns, energy considerations}

## Timestamp
{ISO timestamp}
```
