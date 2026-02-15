---
name: orchestrator
description: Internal orchestrator for executing skills with prose-driven context assembly. Interprets "## Context" sections and loads all context into conversation.
disable-model-invocation: false
internal: true
---

# Orchestrator

This skill orchestrates the execution of other skills that declare context needs in prose. It interprets needs naturally, coordinates fulfillment, and loads all context into the conversation before skill execution.

## When to Use

When executing a skill with frontmatter containing `orchestrated: true`, use orchestration. If this flag is absent, execute the skill directly.

## Orchestration Flow

The orchestrator follows these steps:

### 1. Check for Context Section

Look for a section named `## Context` in the skill file. If absent, proceed directly to inline execution without context loading.

If present, the Context section contains prose declarations like:

```markdown
## Context

- Calendar events for the day
- User's directives and preferences
- Week.md for weekly context
- People files for anyone with 1:1 meetings
- Active project files
```

### 2. Resolve Date Arguments

If the skill accepts time arguments (e.g., "tomorrow", "next monday", "2026-02-15"), resolve them to concrete dates.

Use `_sub/resolve-dates` to parse flexible time expressions:

```
Task(
  description: "Resolve date argument '{arg}' for {skill-name}",
  prompt: <resolve-dates SKILL.md + skill args>,
  subagent_type: "Explore"
)
```

The subagent returns resolved date information:
- `target_date`: YYYY-MM-DD
- `scope`: day | week | month
- `relative`: "today" | "tomorrow" | etc.
- `workdays`: list of dates (for week scope)

Store this information for use in context assembly.

### 3. Parse Context Needs

Read the Context section and interpret each need using Claude's natural understanding.

Identify need types by reading the prose:

| Prose Pattern | Need Type | Fulfillment |
|--------------|-----------|-------------|
| "Calendar events" | Calendar data | `_sub/fetch-calendar` |
| "Week.md" / "Month.md" / "Today.md" | Vault file references | `_sub/resolve-references` |
| "People files for 1:1 meetings" | Entity resolution | `_sub/resolve-references` |
| "Active project files" | Entity resolution | `_sub/resolve-references` |
| "Directives" / "preferences" | User directives | `_sub/resolve-references` |

The orchestrator uses Claude's intelligence to interpret needs - no rigid parsing required.

### 4. Spawn Fulfillment Sub-Agents (Parallel)

For each need type identified, spawn the appropriate fulfillment sub-agent using the Task tool.

**fetch-calendar:**
```
Task(
  description: "Fetch calendar events for {target_date}",
  prompt: <fetch-calendar SKILL.md + target date>,
  subagent_type: "Explore"
)
```
Returns: Calendar events as markdown

**resolve-references:**
```
Task(
  description: "Resolve vault paths and entity references",
  prompt: <resolve-references SKILL.md + needs prose + target date>,
  subagent_type: "Explore"
)
```
Returns: Markdown with categorized paths (directives, working notes, people, projects)

Spawn these in parallel using multiple Task tool calls in a single message.

### 5. Load Context Into Conversation

After sub-agents complete, load all resolved context into the conversation:

1. **Load external data** (calendar events) directly into conversation
2. **Read vault files** using full paths from resolve-references
3. **Read entity files** (people, projects) as needed

All context becomes part of the conversation history - no session files, no memory.md index.

**Example context loading:**

After sub-agents return with:
- Calendar: 3 events for 2026-02-15
- Vault paths: Week.md exists at /vault/00_Brain/Captive/Week.md
- People: Sarah Chen at /vault/02_Areas/People/Sarah Chen.md

The orchestrator loads this into conversation:

```
Loading context for planning-daily:

Calendar Events (2026-02-15):
- 09:00-10:00: Team standup
- 14:00-15:00: 1:1 with Sarah Chen
- 16:00-17:00: Project review

Week.md:
[contents of Week.md]

Sarah Chen (Person):
[contents of Sarah Chen.md]
```

### 6. Execute Skill Prose

Find the first markdown section after `## Context` (typically `## Planning Session` or `## Review Session`).

Execute this prose in the current conversation with all context already loaded.

Claude interprets the skill prose naturally:
- All context is already present in conversation history
- References like "Review the calendar" work naturally
- "Check Week.md" accesses already-loaded content
- No file operations needed within the skill prose

**No rigid execution order** - the skill prose guides the interaction naturally with all context available.

### 7. Generate Summary Message

After skill execution completes, generate a summary message for the conversation history:

```markdown
---
**Orchestrator Summary: {skill-name}**

**Context Loaded:**
- Calendar: {N} events for {date}
- Week.md: Loaded from Captive
- People: Sarah Chen
- Directives: User preferences loaded

**Actions Taken:**
- Created Today.md in Captive
- Updated Week.md with planning notes
- User completed planning session

**Status:** Complete
---
```

This summary documents what the orchestrator did for debugging and conversation continuity.

## Example Execution

**Skill with orchestrated context:**

```markdown
---
name: planning-daily
orchestrated: true
---

## Context

- Calendar events for the day
- Week.md for weekly context
- People files for anyone with 1:1 meetings
- User's directives and preferences

## Planning Session

Greet the user warmly.
Review today's calendar and highlight any 1:1 meetings.
Check Week.md for weekly context and priorities.
For each 1:1, reference the person's file to prepare talking points.
Guide the user through planning their day.
Write Today.md to Captive with the plan.
```

**Orchestrator executes:**

1. **Detect orchestration flag** → `orchestrated: true`

2. **Check for Context section** → Found

3. **Resolve dates**
   - Argument: (none) → defaults to today
   - Spawn resolve-dates → returns 2026-02-15

4. **Parse needs**
   - "Calendar events" → fetch-calendar
   - "Week.md" → resolve-references
   - "People files for 1:1 meetings" → resolve-references (with calendar context)
   - "Directives" → resolve-references

5. **Spawn sub-agents (parallel)**
   ```
   Task(fetch-calendar) → returns calendar events
   Task(resolve-references) → returns vault paths + entity files
   ```

6. **Load context into conversation**
   ```
   Loading context for planning-daily:

   Calendar Events (2026-02-15):
   - 09:00-10:00: Team standup
   - 14:00-15:00: 1:1 with Sarah Chen
   - 16:00-17:00: Project review

   Week.md:
   [contents loaded from /vault/00_Brain/Captive/Week.md]

   Sarah Chen:
   [contents loaded from /vault/02_Areas/People/Sarah Chen.md]

   User Directives:
   [contents loaded from profile.md]
   ```

7. **Execute Planning Session prose**
   - All context is already in conversation
   - Skill prose guides natural interaction
   - User and Claude collaborate on planning
   - Today.md written to Captive using Write tool

8. **Generate summary message**
   ```markdown
   ---
   **Orchestrator Summary: planning-daily**

   **Context Loaded:**
   - Calendar: 3 events for 2026-02-15
   - Week.md: Weekly context loaded
   - People: Sarah Chen (1:1 at 14:00)
   - Directives: User preferences loaded

   **Actions Taken:**
   - Created Today.md in Captive
   - User completed daily planning session

   **Status:** Complete
   ---
   ```

## Key Principles

**Skills declare WHAT they need, not HOW to get it:**
- "Calendar events" not "spawn fetch-calendar subagent"
- "Week.md for context" not "read ${VAULT}/00_Brain/Captive/Week.md"

**Orchestrator handles all fulfillment:**
- Interprets prose using Claude's natural understanding
- Coordinates parallel sub-agent spawning
- Loads all context into conversation

**State is conversation history:**
- No session directories
- No memory.md index files
- Context lives in conversation
- Summary message documents orchestration actions

**Skills reference context naturally:**
- "Review the calendar" (context already loaded)
- "Check Week.md" (already present in conversation)
- "Load the person's file" (already loaded if referenced in context)

## Sub-Skills Available

| Sub-Skill | Purpose | Output |
|-----------|---------|--------|
| `_sub/resolve-dates` | Parse time expressions | Returns date info as markdown |
| `_sub/fetch-calendar` | Get calendar events | Returns calendar events as markdown |
| `_sub/resolve-references` | Vault paths + entity discovery | Returns paths and file locations |

## Error Handling

**Graceful degradation:**
- If calendar unavailable, note in summary and proceed without it
- If vault file doesn't exist, note in summary and skill adapts
- Missing entities: skill proceeds with available context

**Sub-agent failures:**
- Log warning in summary message
- Mark need as unavailable
- Continue with remaining needs
- Skill adapts to what's available

**Example degraded execution:**
```markdown
---
**Orchestrator Summary: planning-daily**

**Context Loaded:**
- Calendar: ⚠ Unavailable (fetch-calendar failed)
- Week.md: Loaded successfully
- People: No 1:1s scheduled
- Directives: User preferences loaded

**Actions Taken:**
- Created Today.md without calendar context
- User completed planning with manual calendar review

**Status:** Complete (degraded)
---
```

## Implementation Notes

- This orchestrator is **internal** — users invoke the parent skill, not the orchestrator
- Skills without `orchestrated: true` execute directly without orchestration
- The orchestration pattern is opt-in per skill
- Conversation history is the only state - no cleanup needed
- All context loading happens before skill prose execution
- Summary messages document orchestrator actions for debugging

## Migration from Session-Based Orchestration

**Before (session-based):**
- Created `/tmp/2bd-session-{skill}-{timestamp}/`
- Wrote memory.md as index
- Skills read from session directory
- Session cleanup required

**After (conversation-based):**
- No session directories
- All context in conversation history
- Skills reference context naturally
- Summary message documents actions
- No cleanup required

Skills using the old pattern will need:
1. Frontmatter: Add `orchestrated: true`
2. Section rename: `## What I Need` → `## Context`
3. Natural references: Remove file path references, use natural language
4. File operations: Use Write tool for vault files (orchestrator resolves paths)
