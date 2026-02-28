# Collect Drafts

Read all assistant drafts and extract placeholders.

## Process

1. Identify active assistants from section order:
   - Read `vault/00_Brain/Systemic/Ada/section-order.md`
   - Parse assistant list for current timescale

2. For each assistant:
   - Check if draft exists: `vault/00_Brain/Synthetic/Assistants/{name}/{timescale}-draft.md`
   - If exists: read content
   - If missing: log warning, mark assistant as failed

3. Extract placeholders from all drafts:
   - Use @ada/references/parse-placeholders
   - Build combined question map: `{assistant-id: question}`

4. Track failed assistants for error reporting

## Output Format

```
{
  "drafts": {
    "goals": {
      "path": "vault/00_Brain/Synthetic/Assistants/goals/daily-draft.md",
      "content": "...",
      "placeholders": ["goals-priority", "goals-energy"]
    },
    "calendar": {
      "path": "...",
      "content": "...",
      "placeholders": ["calendar-prep", "calendar-focus"]
    }
  },
  "failed": ["achievements"],  // if any failed
  "all_questions": {
    "goals-priority": "What's your top priority?",
    "calendar-prep": "Which meeting needs prep?",
    ...
  }
}
```

## Error Handling

- Draft file missing: add to failed list, continue
- Draft malformed: log error, skip assistant
- No placeholders: valid (assistant needed no input)
