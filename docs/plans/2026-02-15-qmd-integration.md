# QMD Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable 2bd planning rituals to surface relevant documents from external collections via QMD semantic search.

**Architecture:** QMD runs as an MCP server. A new `fetch-resources` sub-skill queries it during planning rituals. Configuration lives in `.claude/config.md` alongside vault path.

**Tech Stack:** QMD (semantic search), MCP protocol, YAML phases, markdown skills

**Design Doc:** [2026-02-15-qmd-integration-design.md](2026-02-15-qmd-integration-design.md)

---

## Task 1: Create fetch-resources Sub-skill

**Files:**
- Create: `.claude/skills/_sub/fetch-resources/SKILL.md`

**Step 1: Create skill directory**

```bash
mkdir -p .claude/skills/_sub/fetch-resources
```

**Step 2: Write the sub-skill**

Create `.claude/skills/_sub/fetch-resources/SKILL.md`:

```markdown
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
```

**Step 3: Verify file created**

```bash
cat .claude/skills/_sub/fetch-resources/SKILL.md | head -20
```

Expected: Shows frontmatter with name: fetch-resources

**Step 4: Commit**

```bash
git add .claude/skills/_sub/fetch-resources/SKILL.md
git commit -m "feat(skills): add fetch-resources sub-skill for QMD integration"
```

---

## Task 2: Create Query Builder Prompt

**Files:**
- Create: `.claude/skills/_sub/fetch-resources/prompts/query-builder.md`

**Step 1: Create prompts directory**

```bash
mkdir -p .claude/skills/_sub/fetch-resources/prompts
```

**Step 2: Write query builder prompt**

Create `.claude/skills/_sub/fetch-resources/prompts/query-builder.md`:

```markdown
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
```

**Step 3: Verify file created**

```bash
ls -la .claude/skills/_sub/fetch-resources/prompts/
```

Expected: Shows query-builder.md

**Step 4: Commit**

```bash
git add .claude/skills/_sub/fetch-resources/prompts/query-builder.md
git commit -m "feat(skills): add query builder prompt for fetch-resources"
```

---

## Task 3: Update planning-daily phases.yaml

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/phases.yaml:26-34`

**Step 1: Read current gather phase**

```bash
sed -n '22,55p' .claude/skills/rituals/planning-daily/phases.yaml
```

**Step 2: Add fetch-resources to gather phase**

Insert after the fetch-calendar entry (around line 33):

```yaml
      - skill: _sub/fetch-resources
        type: explore
        args: "context={{CALENDAR}},{{PROJECTS}}"
        output: RESOURCES
        optional: true
        on_error: "Document search unavailable. Configure QMD to enable."
```

The gather phase should now include fetch-resources alongside fetch-calendar, fetch-week-content, etc.

**Step 3: Verify the change**

```bash
grep -A2 "fetch-resources" .claude/skills/rituals/planning-daily/phases.yaml
```

Expected: Shows the fetch-resources entry with type: explore

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/phases.yaml
git commit -m "feat(rituals): add fetch-resources to daily planning gather phase"
```

---

## Task 4: Update planning-weekly phases.yaml

**Files:**
- Modify: `.claude/skills/rituals/planning-weekly/phases.yaml:26-34`

**Step 1: Read current gather phase**

```bash
sed -n '22,65p' .claude/skills/rituals/planning-weekly/phases.yaml
```

**Step 2: Add fetch-resources to gather phase**

Insert after the fetch-calendar entry:

```yaml
      - skill: _sub/fetch-resources
        type: explore
        args: "context={{CALENDAR}},{{PROJECTS}},{{MONTH}}"
        output: RESOURCES
        optional: true
        on_error: "Document search unavailable. Configure QMD to enable."
```

**Step 3: Verify the change**

```bash
grep -A2 "fetch-resources" .claude/skills/rituals/planning-weekly/phases.yaml
```

Expected: Shows the fetch-resources entry

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-weekly/phases.yaml
git commit -m "feat(rituals): add fetch-resources to weekly planning gather phase"
```

---

## Task 5: Update planning-daily SKILL.md

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 1: Read current Planning Session section**

```bash
sed -n '38,60p' .claude/skills/rituals/planning-daily/SKILL.md
```

**Step 2: Add Reference Materials to context presentation**

After "Active Projects" in the Hierarchical Context section, add:

```markdown
**Reference Materials** (from QMD search):
- Documents relevant to today's meetings
- Project-related artifacts
- Contextual snippets for preparation
```

**Step 3: Update Generate section**

In the Generate section, add Reference Materials to the list of sections to fill:

```markdown
- **Reference Materials** with QMD search results (if available)
```

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "docs(rituals): document Reference Materials in daily planning"
```

---

## Task 6: Update README.md with QMD Integration

**Files:**
- Modify: `README.md` (Integrations section, after Calendar)

**Step 1: Locate insertion point**

```bash
grep -n "### GitHub" README.md
```

Find the line number for the GitHub section. Insert QMD section before it.

**Step 2: Add QMD Integration section**

Insert before `### GitHub`:

```markdown
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
   First run downloads models (~2GB) and indexes documents.

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

Planning rituals use QMD to:
- Surface documents relevant to today's meetings
- Find project-related artifacts for context
- Provide reference snippets in the planning session

#### Optional: Index Your Vault

To enable semantic search across your markdown vault:

```bash
qmd collection add "$VAULT" --name vault --glob "**/*.md"
qmd embed
```

Then enable in `.claude/config.md`:
```markdown
qmd_collections:
  - name: vault
    path: $VAULT
    context: "Personal knowledge base"
    enabled: true
```

```

**Step 3: Verify insertion**

```bash
grep -A5 "### QMD" README.md
```

Expected: Shows the QMD section header and prerequisites

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add QMD integration guide to README"
```

---

## Task 7: Document Config Schema

**Files:**
- Modify: `CLAUDE.md` (Key Paths section)

**Step 1: Read current Key Paths section**

```bash
grep -A20 "### Key Paths" CLAUDE.md
```

**Step 2: Add External Resources config documentation**

In the section describing `.claude/config.md`, add:

```markdown
**External Resources config** (optional fields in `.claude/config.md`):

```markdown
### QMD (Document Search)
qmd_enabled: true|false
qmd_collections:
  - name: collection_name
    path: /absolute/path
    context: "Description for search"
    enabled: true|false
qmd_settings:
  max_results: 5
  search_mode: deep|search|vsearch
```
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add QMD config schema to CLAUDE.md"
```

---

## Task 8: End-to-End Verification

**Step 1: Install QMD (if not installed)**

```bash
bun install -g https://github.com/tobi/qmd
```

**Step 2: Create test collection**

```bash
qmd collection add /tmp/test-docs --name test
echo "# Test Document\n\nThis is about budget planning for Q1." > /tmp/test-docs/budget.md
qmd embed
```

**Step 3: Test QMD search**

```bash
qmd query "budget planning" --collection test
```

Expected: Returns budget.md with relevance score

**Step 4: Add QMD config to 2bd**

Add to `.claude/config.md`:

```markdown
### QMD (Document Search)
qmd_enabled: true
qmd_collections:
  - name: test
    path: /tmp/test-docs
    context: "Test documents"
```

**Step 5: Run planning-daily**

```bash
claude skill run rituals/planning-daily
```

Verify: Ritual completes, RESOURCES variable is populated (or graceful degradation message if MCP not configured)

**Step 6: Clean up test collection**

```bash
qmd collection remove test
rm -rf /tmp/test-docs
```

Remove test config from `.claude/config.md`

---

## Summary

| Task | Files | Commits |
|------|-------|---------|
| 1 | `.claude/skills/_sub/fetch-resources/SKILL.md` | 1 |
| 2 | `.claude/skills/_sub/fetch-resources/prompts/query-builder.md` | 1 |
| 3 | `.claude/skills/rituals/planning-daily/phases.yaml` | 1 |
| 4 | `.claude/skills/rituals/planning-weekly/phases.yaml` | 1 |
| 5 | `.claude/skills/rituals/planning-daily/SKILL.md` | 1 |
| 6 | `README.md` | 1 |
| 7 | `CLAUDE.md` | 1 |
| 8 | Verification (no commit) | 0 |

**Total: 7 commits**
