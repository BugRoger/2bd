---
name: orchestrator
description: Internal orchestrator for executing skills with prose-driven context assembly. Interprets "What I Need" sections and coordinates fulfillment subagents.
disable-model-invocation: false
internal: true
---

# Orchestrator

This skill orchestrates the execution of other skills that declare needs in prose using the "What I Need" pattern. It interprets needs naturally using Claude's understanding, spawns fulfillment subagents, and builds context for the skill's execution.

## When to Use

When executing a skill that has a "## What I Need" section, use orchestration. If no such section exists, execute the skill directly.

## Orchestration Flow

The orchestrator follows these steps to prepare context and execute an orchestrated skill:

### 1. Create Session

Use `_sub/create-session` to create a temporary session directory.

```bash
session_dir=$(_sub/create-session <skill-name>)
# Returns: /tmp/2bd-session-<skill>-<timestamp>
```

Store the session path for all subsequent operations.

### 2. Resolve Time Arguments

Use `_sub/resolve-dates` with skill arguments to handle flexible time expressions.

This creates `${session}/dates.md` with concrete dates:
- Resolves "tomorrow", "next monday", "last week", etc.
- Provides target_date, scope, relative description
- Generates workdays list for week scopes

### 3. Parse Needs

Read the skill's "## What I Need" section and interpret each bullet point using Claude's natural understanding.

Identify need types by reading the prose:

| Prose Pattern | Need Type | Fulfillment |
|--------------|-----------|-------------|
| "Calendar events" | Calendar data | `_sub/fetch-calendar` |
| "Week.md" / "Month.md" / "Today.md" | Vault file references | `_sub/resolve-references` |
| "People files for 1:1 meetings" | Entity resolution | `_sub/resolve-references` |
| "Active project files" | Entity resolution | `_sub/resolve-references` |
| "Directives" / "preferences" | User directives | `_sub/resolve-references` |

The orchestrator uses Claude's intelligence to interpret needs - no rigid parsing required.

### 4. Spawn Fulfillment Subagents (Parallel)

For each need type identified, spawn the appropriate fulfillment subagent:

**fetch-calendar:**
```
Task(
  description: "Fetch calendar events for {target_date}",
  prompt: <fetch-calendar SKILL.md + session dir>,
  subagent_type: "Explore"
)
```
Writes: `${session}/calendar.md`

**resolve-references:**
```
Task(
  description: "Resolve vault paths and entity references",
  prompt: <resolve-references SKILL.md + needs prose + session dir>,
  subagent_type: "Explore"
)
```
Returns: Markdown with categorized paths (static files, people, projects)

Spawn these in parallel using multiple Task tool calls in a single message.

### 5. Build Memory

After subagents complete, construct `${session}/memory.md` as the session index.

Memory.md contains:
- **External data files** (calendar.md) with descriptions
- **Vault file references** with full paths and availability status
- **Entity files** (people, projects) discovered by resolve-references

**Example memory.md:**
```markdown
# Session Context for Daily Planning

## Session Files (External Data)
- **calendar.md**: Calendar events for 2026-02-15

## Vault References (Static Files)
- **Week.md**: /Users/me/vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /Users/me/vault/00_Brain/Captive/Month.md ✓
- **Today.md**: /Users/me/vault/00_Brain/Captive/Today.md ✗ (new file)

## Entities
### People (from calendar 1:1s)
- **Sarah Chen**: /Users/me/vault/02_Areas/People/Sarah Chen.md ✓

### Projects (active)
- **quarterly-planning**: /Users/me/vault/01_Projects/2026-03-31-quarterly-planning.md ✓
```

Memory.md serves as a map - files stay in their original locations, session only contains references and external data.

### 6. Execute Inline Phase

Find the first markdown section after "What I Need" (typically "## Planning Session" or "## Review Session").

Execute this prose in the main conversation context with:
- Session directory path available
- Instruction: "Read memory.md first to see what's available"

Claude interprets the skill prose naturally:
- Reads memory.md to understand available context
- Loads session files (calendar.md, resources.md) from session directory
- Reads vault files using full paths from memory.md
- Proceeds with user interaction as described in the prose

**No rigid execution order** - Claude loads files incrementally as needed by the conversation flow.

## Example Execution

**Skill declares needs in prose:**

```markdown
## What I Need

- Calendar events for the day
- Week.md for weekly context
- People files for anyone with 1:1 meetings
```

**Orchestrator interprets and executes:**

1. **Create session**
   ```
   session_dir: /tmp/2bd-session-planning-daily-20260215-093000
   ```

2. **Resolve dates**
   - Argument: (empty) → today
   - Creates: `${session}/dates.md`
   ```markdown
   target_date: 2026-02-15
   scope: day
   relative: today
   ```

3. **Parse needs**
   - "Calendar events" → spawn fetch-calendar
   - "Week.md" → spawn resolve-references
   - "People files for 1:1 meetings" → spawn resolve-references (with calendar context)

4. **Spawn subagents (parallel)**
   ```
   Task(fetch-calendar) → writes calendar.md
   Task(resolve-references) → returns vault paths
   ```

5. **Build memory.md**
   ```markdown
   # Session Context

   ## Session Files
   - **calendar.md**: Calendar events for 2026-02-15

   ## Vault References
   - **Week.md**: /Users/me/vault/00_Brain/Captive/Week.md ✓

   ## People (from calendar)
   - **Sarah Chen**: /Users/me/vault/02_Areas/People/Sarah Chen.md ✓
   ```

6. **Execute inline phase**
   - Read skill's next section: "## Planning Session"
   - Execute prose with session context:

   ```markdown
   ## Planning Session

   Greet the user.
   Review their calendar from the session.
   Load Week.md from the vault (path in memory.md).
   For each 1:1, load the person's file.
   Guide planning conversation.
   ```

   - Claude interprets naturally:
     1. Reads memory.md
     2. Sees calendar.md → reads from session
     3. Sees Week.md path → reads from vault
     4. Sees Sarah Chen path → reads from vault
     5. Proceeds with planning dialogue

## Key Principles

**Skills declare WHAT they need, not HOW to get it:**
- "Calendar events" not "spawn fetch-calendar subagent"
- "Week.md for context" not "read ${VAULT}/00_Brain/Captive/Week.md"

**Orchestrator handles all fulfillment:**
- Interprets prose using Claude's natural understanding
- Coordinates parallel subagent spawning
- Assembles unified context view

**Session structure is simple:**
```
/tmp/2bd-session-{skill}-{timestamp}/
├── memory.md       # Index of available context
├── dates.md        # Resolved time context
└── calendar.md     # External: calendar events
```

**Vault files stay in vault:**
- memory.md contains full paths, not copies
- Skills read incrementally from vault as needed
- Session only contains external data that can't be vault-resident

## Sub-Skills Available

| Sub-Skill | Purpose | Output |
|-----------|---------|--------|
| `_sub/create-session` | Create temp session directory | Returns session path |
| `_sub/resolve-dates` | Parse time expressions | Writes dates.md |
| `_sub/fetch-calendar` | Get calendar events | Writes calendar.md |
| `_sub/resolve-references` | Vault paths + entity discovery | Returns markdown with paths |

## Error Handling

**Graceful degradation:**
- If calendar unavailable, note in memory.md and proceed
- If vault file doesn't exist, mark as ✗ (new file)

**Sub-skill failures:**
- Log warning
- Mark need as unavailable in memory.md
- Continue with remaining needs
- Inline phase adapts to what's available

## Notes

- This orchestrator is **internal** — users invoke the parent skill, not the orchestrator directly
- Skills without "## What I Need" sections continue to work as before (no orchestration)
- The orchestrator pattern is opt-in per skill
- Session cleanup: OS handles /tmp cleanup automatically
- Debugging: Session directory persists for inspection after execution
- Parallel execution: All fulfillment subagents spawn simultaneously for performance

## Implementation Status

**Active Implementation (2026-02-15):**
- Prose-driven orchestration is fully implemented
- All required sub-skills exist (create-session, resolve-dates, resolve-references, fetch-calendar)
- Skills migrated: planning-daily
- Ready for additional skill migrations
