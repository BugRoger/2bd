# Query Builder

Transform planning context into semantic search queries.

## Input Context

You receive:
- **Calendar events**: Meeting titles, attendees, times
- **Active projects**: Names, descriptions, milestones
- **Period focus**: Weekly theme, monthly goals

## Query Construction Rules

1. **One query per distinct entity** (person, project, topic)
2. **Include related terms**, not just exact names
3. **Prioritize** by relevance to today's activities
4. **Limit** to 3 queries maximum

## Examples

**Input:**
```json
{
  "calendar": [
    {"title": "1:1 with Sarah", "is_one_on_one": true},
    {"title": "Q1 Budget Review", "is_one_on_one": false}
  ],
  "projects": [
    {"name": "Project Alpha", "milestone": "Architecture review"}
  ]
}
```

**Output queries:**
1. "Sarah performance feedback career development" (for 1:1 prep)
2. "Q1 budget planning headcount financials" (for meeting prep)
3. "Project Alpha architecture design decisions" (for project context)

## Query Formulation

For **people** (1:1s):
- Include: name, role relationship, recent topics
- Pattern: "{name} {relationship context} {likely discussion topics}"

For **meetings**:
- Include: meeting topic, related business terms
- Pattern: "{topic} {domain terms} {expected outcomes}"

For **projects**:
- Include: project name, current phase, deliverables
- Pattern: "{project} {phase} {key artifacts}"

## Output Format

Return as JSON array:

```json
{
  "queries": [
    {
      "query": "Sarah performance feedback career",
      "context": "1:1 with Sarah",
      "priority": 1
    }
  ]
}
```
