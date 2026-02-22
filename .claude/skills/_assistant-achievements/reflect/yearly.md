# Achievements: Reflect Yearly

Capture the year's accomplishments.

## Context to Load

1. Read quarterly achievement reflections from this year
2. Read `vault/00_Brain/Semantic/Assistants/achievements/memory.md` if exists

## Process

1. Synthesize year:
   - Biggest accomplishments
   - Career impact
   - Evidence for promotion/review

## Output

Write to `vault/00_Brain/Synthetic/Assistants/achievements/{date}-reflect-yearly.md`:

```markdown
# Achievements: reflect(yearly) {date}

## Status
ok

## Section
### Year's Accomplishments

**Biggest wins:**
- {Achievement} — {Impact}

**Career impact:**
- {How this advances your career}

**Evidence:**
- {Concrete metrics/outcomes}

## Observations
- {Achievement patterns}

## Timestamp
{ISO timestamp}
```
