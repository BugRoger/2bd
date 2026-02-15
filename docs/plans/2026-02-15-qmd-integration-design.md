# QMD Integration Design

**Date:** 2026-02-15
**Status:** Approved
**Epic:** External Resource Search

## Problem

2bd manages a markdown vault, but users often have a second knowledge base containing documents—PDFs, PowerPoints, Excel files—stored separately. Planning rituals should surface relevant documents based on today's calendar and active projects.

## Solution

Integrate QMD (an on-device semantic search engine) via its MCP server. A new sub-skill `fetch-resources` queries QMD during planning rituals and returns relevant document snippets.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Claude Code                               │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ planning-daily  │───▶│ fetch-resources │                     │
│  │ planning-weekly │    │   (sub-skill)   │                     │
│  └─────────────────┘    └────────┬────────┘                     │
│                                  │ MCP tool call                │
└──────────────────────────────────┼──────────────────────────────┘
                                   ▼
                    ┌──────────────────────────┐
                    │      QMD MCP Server      │
                    │  qmd_deep_search         │
                    │  qmd_get                 │
                    └──────────┬───────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │  resources  │  │   vault     │  │   other     │
     │ (documents) │  │ (markdown)  │  │ collections │
     └─────────────┘  └─────────────┘  └─────────────┘
```

**Components:**

- **QMD MCP Server**: Runs as a Claude Code MCP server, auto-started when needed
- **`fetch-resources` sub-skill**: Builds context-aware queries and calls QMD MCP tools
- **QMD collections**: Document knowledge base indexed as named collections

## Configuration

### Global Config (`.claude/config.md`)

```markdown
## External Resources

### QMD (Document Search)
qmd_enabled: true
qmd_collections:
  - name: resources
    path: /path/to/your/resources
    context: "Work documents: presentations, reports, architecture docs"
  - name: vault
    path: $VAULT
    context: "Personal knowledge base, notes, archives"
    enabled: false
qmd_settings:
  max_results: 5
  search_mode: deep
```

### Claude Code MCP Config (`~/.claude/settings.json`)

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

## Sub-skill: `fetch-resources`

**Location:** `.claude/skills/_sub/fetch-resources/`

**Inputs:**
- Calendar events (meetings, 1:1s)
- Active projects
- Current period context

**Query construction:**
The sub-skill builds semantic queries from context:

```
Context: "1:1 with Sarah, Q1 budget review meeting, Project Alpha standup"
     ↓
Queries:
  - "Sarah recent discussions decisions"
  - "Q1 budget planning financials"
  - "Project Alpha status architecture"
```

**MCP tools used:**
- `qmd_deep_search` — semantic search with reranking
- `qmd_get` — fetch document snippets

**Output format:**

```markdown
## Reference Materials

Based on today's calendar and active projects:

### For: 1:1 with Sarah
- **Q4 Performance Review.pdf** (85% relevance)
  > Key discussion points: growth areas, promotion timeline...

### For: Q1 Budget Review
- **2026 Budget Proposal.xlsx** (92% relevance)
  > Summary: Proposed 15% increase for engineering headcount...
```

## Ritual Integration

**Rituals that call `fetch-resources`:**

| Ritual | Context passed | Use case |
|--------|---------------|----------|
| `planning-daily` | Today's calendar, active projects | Docs relevant to today's meetings |
| `planning-weekly` | Week's focus areas, key meetings | Strategic docs for the week |

**Phase integration (planning-daily `phases.yaml`):**

```yaml
phases:
  - name: setup
    parallel: true
    subagents:
      - skill: _sub/fetch-config
        store_as: CONFIG
      - skill: _sub/fetch-dates
        store_as: DATES
      - skill: _sub/fetch-directives
        store_as: DIRECTIVES

  - name: gather
    depends_on: [setup]
    parallel: true
    subagents:
      - skill: _sub/fetch-calendar
        args: "{{DATES.today}}"
        store_as: CALENDAR
      - skill: _sub/fetch-resources
        args: "{{DATES.today}}"
        store_as: RESOURCES
        optional: true

  - name: interact
    depends_on: [gather]
    inline: true
```

## Error Handling

| Scenario | Behavior |
|----------|----------|
| QMD not installed | Return empty with installation suggestion |
| No collections configured | Return empty with setup instructions |
| MCP server not configured | Fall back to CLI mode |
| No relevant documents found | Return "No relevant documents for today's context" |
| Query timeout | 30s timeout, return partial results or empty |

**First-run message:**

```markdown
## Reference Materials

> QMD document search is not configured. To enable:
> 1. Install: `bun install -g https://github.com/tobi/qmd`
> 2. Add collection: `qmd collection add /path/to/docs --name resources`
> 3. Configure: Add `qmd_enabled: true` to `.claude/config.md`
> See README.md § QMD Integration for details.
```

## Documentation Updates

**README.md** gains a new section under Integrations:

### QMD (Document Search)

2bd searches external document collections (PDFs, PowerPoints, etc.) using QMD, an on-device semantic search engine.

#### Prerequisites

- [Bun](https://bun.sh/) runtime
- ~2GB disk space for ML models

#### Setup

1. **Install QMD:**
   ```bash
   bun install -g https://github.com/tobi/qmd
   ```

2. **Create a collection:**
   ```bash
   qmd collection add /path/to/your/documents --name resources
   qmd context add qmd://resources "Description of what these documents contain"
   ```

3. **Generate embeddings:**
   ```bash
   qmd embed
   ```

4. **Configure Claude Code MCP:**
   Add to `~/.claude/settings.json`:
   ```json
   {
     "mcpServers": {
       "qmd": {
         "command": "qmd",
         "args": ["mcp"]
       }
     }
   }
   ```

5. **Configure 2bd:**
   Add to `.claude/config.md`:
   ```markdown
   ### QMD (Document Search)
   qmd_enabled: true
   qmd_collections:
     - name: resources
       path: /path/to/your/documents
       context: "Your description here"
   ```

6. **Verify:**
   ```bash
   qmd query "test search"
   ```

#### Optional: Index Your Vault

```bash
qmd collection add "$VAULT" --name vault --glob "**/*.md"
qmd embed
```

Then enable in config:
```markdown
qmd_collections:
  - name: vault
    path: $VAULT
    context: "Personal knowledge base"
    enabled: true
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `.claude/skills/_sub/fetch-resources/SKILL.md` | Create |
| `.claude/skills/_sub/fetch-resources/prompts/query-builder.md` | Create |
| `.claude/skills/rituals/planning-daily/phases.yaml` | Modify |
| `.claude/skills/rituals/planning-weekly/phases.yaml` | Modify |
| `.claude/config.md` | Document new fields |
| `README.md` | Add QMD integration section |
