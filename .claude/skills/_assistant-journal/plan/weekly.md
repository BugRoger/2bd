# Journal: Plan Weekly

Generate weekly intention draft with placeholders for reflection.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for context
2. Read `vault/00_Brain/Semantic/Assistants/journal/memory.md` if exists

## Draft Generation

1. Review recent patterns from memory
2. Generate reflection prompts based on weekly themes
3. Create draft with open-ended placeholders

## Output

Write to `vault/00_Brain/Synthetic/Assistants/journal/weekly-draft.md`:

```markdown
## Journal

### Weekly Intention

<!-- ASK:journal-feeling
How are you feeling about the week ahead?
-->

<!-- ASK:journal-intention
What intention do you want to set for this week?
-->

<!-- ASK:journal-by-friday
What's one thing you want to be true by Friday?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: journal
action: plan
timescale: weekly
timestamp: {ISO timestamp}
---
```
