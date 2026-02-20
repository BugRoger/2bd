# Month Summary

Synthesize the month's data into a clear summary. This is the executive overview — present it, let the user absorb it.

## Process

1. Aggregate data from loaded weekly archives
2. Synthesize patterns and metrics
3. Present summary for user validation

## Content

### Weeks Reviewed

Count and list the weeks covered:
- Number of weeks with archives
- Weeks with complete vs partial data
- Any gaps in weekly coverage

Present naturally — "Four full weeks reviewed, with one partial week at month end."

### Energy Trend

From weekly archive frontmatter `energy_trend`:
- Track progression across weeks (rising, stable, declining)
- Note significant shifts and their timing
- Overall month energy pattern

Present the arc — "Energy started high, dipped mid-month around the product launch, recovered in final week."

### Outcome Completion

From Month.md Key Outcomes and weekly progress:
- Count outcomes completed, partial, deferred
- Note which outcomes had consistent weekly progress
- Flag outcomes that stalled or pivoted

### Key Dates Met

From Month.md Key Dates and weekly archives:
- Deadlines hit vs missed
- Major events that happened as planned
- Surprises or reschedules

### Meeting Load

From weekly archives:
- Total meetings across weeks
- Meeting-heavy vs focus week distribution
- Calendar health trend

## Update Month.md

After presenting the summary:

1. Read `00_Brain/Captive/Month.md`
2. Replace or create `## Month Summary` section with synthesized content
3. Write entire file back to `00_Brain/Captive/Month.md`

### Section Format

```markdown
## Month Summary

**Weeks Reviewed:** N weeks (W01-W04)
**Energy Arc:** [Summary of energy trend across month]
**Outcome Completion:** N/3 complete, N partial, N deferred
**Key Dates:** N/N met

### Overview
[2-3 sentence narrative of the month's shape]
```

Ask user: "Does this summary capture how the month felt?"

Proceed to Outcome Review.
