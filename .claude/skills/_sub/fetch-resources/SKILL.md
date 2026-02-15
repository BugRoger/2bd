---
name: fetch-resources
description: Search external document collections via QMD for context relevant to planning rituals. Returns document snippets matching calendar events and active projects.
disable-model-invocation: true
allowed-tools: Read, Bash(*), mcp__qmd__(*)
argument-hint: "[context: calendar events, projects, or search terms]"
---

# Fetch Resources Sub-Skill

Searches external document collections (PDFs, PowerPoints, etc.) using QMD semantic search. Returns relevant snippets for use in planning rituals.

## Prerequisites

1. **QMD** installed (`bun install -g https://github.com/tobi/qmd`)
2. **QMD MCP server** configured in Claude Code settings
3. **Collections** indexed (`qmd collection add /path --name name`)
4. **2bd config** has QMD enabled in `.claude/config.md`

## Arguments

Parse from `$ARGUMENTS`:
- `context`: JSON or text describing what to search for (calendar events, projects, focus areas)
- `max_results`: Maximum documents to return (default: 5)

## Execution Steps

### 1. Read Configuration

Read `.claude/config.md` and extract QMD settings:

```markdown
### QMD (Document Search)
qmd_enabled: true
qmd_collections:
  - name: resources
    path: /path/to/resources
    context: "Description"
    enabled: true
qmd_settings:
  max_results: 5
  search_mode: deep
```

If `qmd_enabled` is false or missing, return graceful degradation message.

### 2. Check QMD Availability

Verify QMD is installed:

```bash
which qmd
```

If not found, return setup instructions.

### 3. Build Search Queries

From the context argument, extract searchable entities:

**From calendar events:**
- Person names from 1:1s → "Sarah discussions decisions"
- Meeting topics → "budget review financials"
- Project names → "Project Alpha architecture"

**From active projects:**
- Project names and descriptions
- Current milestone context

Generate 1-3 semantic queries based on context.

### 4. Execute Search

For each query, use QMD MCP tools if available:

```
Tool: qmd_deep_search
Arguments:
  query: "Sarah recent discussions decisions"
  collections: ["resources"]
  limit: 3
```

If MCP tools unavailable, fall back to CLI:

```bash
qmd query "Sarah recent discussions decisions" --collection resources --limit 3 --format json
```

### 5. Process Results

For each result:
1. Extract document title and path
2. Get relevance score
3. Fetch snippet via `qmd_get` or `qmd get`
4. Group by the context entity (meeting, project)

### 6. Return Output

**JSON format:**

```json
{
  "success": true,
  "results": [
    {
      "context": "1:1 with Sarah",
      "documents": [
        {
          "title": "Q4 Performance Review.pdf",
          "path": "/path/to/Q4 Performance Review.pdf",
          "relevance": 0.85,
          "snippet": "Key discussion points: growth areas, promotion timeline..."
        }
      ]
    }
  ],
  "summary": {
    "queries_executed": 2,
    "documents_found": 3,
    "collections_searched": ["resources"]
  }
}
```

**Markdown format** (for direct inclusion in notes):

```markdown
## Reference Materials

> Based on today's calendar and projects

### For: 1:1 with Sarah
- **Q4 Performance Review.pdf** (85%)
  > Key discussion points: growth areas, promotion timeline...

### For: Q1 Budget Review
- **2026 Budget Proposal.xlsx** (92%)
  > Proposed 15% increase for engineering headcount...
```

## Error Handling

| Condition | Response |
|-----------|----------|
| QMD not installed | Return setup instructions |
| QMD not configured | Return config instructions |
| No collections enabled | Return "No QMD collections configured" |
| MCP unavailable | Fall back to CLI |
| No results found | Return "No relevant documents found" |
| Query timeout (30s) | Return partial results |

## Graceful Degradation

If QMD is not set up, return:

```json
{
  "success": false,
  "error": "qmd_not_configured",
  "message": "QMD document search is not configured.",
  "setup_hint": "See README.md § QMD Integration for setup instructions."
}
```

## Usage by Other Skills

Planning rituals invoke this sub-skill with context:

```yaml
- skill: _sub/fetch-resources
  type: explore
  args: "context={{CALENDAR}},{{PROJECTS}}"
  output: RESOURCES
  optional: true
  on_error: "Document search unavailable."
```
