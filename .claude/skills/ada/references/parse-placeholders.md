# Placeholder Parsing

Parse HTML comment placeholders from assistant draft files.

## Placeholder Format

Assistants write placeholders as:
```
<!-- ASK:unique-id
Question text goes here?
-->
```

## Parsing Process

1. Read draft content from `vault/00_Brain/Synthetic/Assistants/{name}/{timescale}-draft.md`
2. Extract placeholders using regex: `<!-- ASK:(\S+)\n(.*?)\n-->`
3. Build question map: `{id: question_text}`
4. Return map for orchestration

## Example

Input:
```
<!-- ASK:goals-priority
What's your top priority today?
-->
```

Output:
```
{
  "goals-priority": "What's your top priority today?"
}
```

## Error Handling

- Malformed placeholders: log warning, skip
- Duplicate IDs: log warning, use first occurrence
- Empty questions: skip placeholder
