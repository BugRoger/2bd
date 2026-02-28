# Journal: Plan Daily

Generate check-in draft with placeholders for reflection.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for week context
2. Read `vault/00_Brain/Semantic/Assistants/journal/memory.md` for patterns
3. Read yesterday's daily note from Periodic if exists

## Draft Generation

1. Review recent patterns from memory
2. Generate reflection prompts based on weekly themes
3. Create draft with open-ended placeholders

## Output

Write to `vault/00_Brain/Synthetic/Assistants/journal/daily-draft.md`:

```markdown
## Journal

**Morning Check-In**

<!-- ASK:journal-energy
How's your energy level this morning? (1-10 and why)
-->

<!-- ASK:journal-mindset
What's your mindset as you start today?
-->

<!-- ASK:journal-intention
What's your intention for today? (one word + why)
-->

**From Yesterday:**
{If yesterday note exists, extract key insights}
```

## Status

Add frontmatter:
```
---
status: ok
assistant: journal
action: plan
timescale: daily
timestamp: {ISO timestamp}
---
```
