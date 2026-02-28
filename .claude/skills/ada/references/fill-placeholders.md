# Placeholder Filling

Replace placeholders in draft files with user answers.

## Input

- Draft file path: `vault/00_Brain/Synthetic/Assistants/{name}/{timescale}-draft.md`
- Answer map: `{placeholder_id: user_answer}`

## Process

1. Read draft file content
2. For each placeholder ID in answer map:
   - Find: `<!-- ASK:{id}\n{question}\n-->`
   - Replace with: `{user_answer}`
3. Write updated content back to draft file

## Example

Before:
```markdown
## Goals

<!-- ASK:goals-priority
What's your top priority today?
-->
```

After (with answer "Launch feature"):
```markdown
## Goals

Launch feature
```

## Error Handling

- Missing placeholders: log warning, continue
- Missing answers: leave placeholder in place
- Write failures: report error, fail gracefully
