# Relationships: Plan Daily

Identify people touchpoints for today.

## Context to Load

1. Read today's calendar for meetings
2. Read `vault/00_Brain/Semantic/People/` for relevant dossiers
3. Read `vault/00_Brain/Semantic/Assistants/relationships/memory.md` if exists

## Process

1. From calendar:
   - Who will you interact with today?
   - Any special context to remember?

2. Proactive outreach:
   - Anyone you've been meaning to contact?
   - Any follow-ups due?

## Output

Write to `vault/00_Brain/Synthetic/Assistants/relationships/{date}-plan-daily.md`:

```markdown
# Relationships: plan(daily) {date}

## Status
ok

## Section
### People Touchpoints

**Scheduled:**
- {Person} — {Context/Meeting}

**Proactive:**
- {Person} — {Why reach out}

## Observations
- {Relationship patterns}

## Timestamp
{ISO timestamp}
```
