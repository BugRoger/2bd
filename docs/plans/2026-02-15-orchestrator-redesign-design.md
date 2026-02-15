# Orchestrator Redesign: Prose-Driven Context Assembly

**Date:** 2026-02-15
**Status:** Design
**Context:** Simplifying skill orchestration by separating declarative intent from implementation

---

## Problem

The current orchestrator design has unnecessary complexity:

1. **Skills reference implementation details** - they know about session files, sub-skills, and data formats
2. **JSON parsing overhead** - subagents format as JSON, orchestrator parses, then inline phases re-read as prose
3. **Variable interpolation** - complex pattern matching to pass values between phases
4. **Redundant file operations** - copying vault files to session when direct reads would work
5. **Tight coupling** - skills break if orchestration mechanics change

**Core insight:** LLMs naturally read and synthesize markdown. We're building a context pipeline for Claude to read, not a data processing system.

---

## Design Principles

### 1. Pure Declarative Skills

Skills declare WHAT they need in prose. Zero knowledge of HOW it's obtained.

**Example:**
```markdown
## What I Need

- Calendar events for the day
- User's directives and preferences
- Today.md file for this day
- People files for anyone with 1:1 meetings
- Active project files
```

No mention of: session files, sub-skills, paths, formats, or orchestration mechanics.

### 2. Smart Orchestrator

Orchestrator reads skill needs and:
- Resolves time arguments ("next monday" → 2026-02-17)
- Determines how to fulfill each need (external API, vault path, scanning)
- Spawns appropriate workers
- Builds session with available context

### 3. Markdown All The Way

- Subagents return markdown (natural for LLMs)
- Session files are markdown
- Inline phases read markdown
- No JSON parsing, no variable interpolation
- Simple pattern matching only when absolutely necessary

### 4. Minimal Session Files

Only create session files for **external data** that must be fetched:
- calendar.md (from macOS Calendar API)
- resources.md (from QMD search)

Vault files stay in the vault. Reference them with full paths.

### 5. Memory as Index

`memory.md` serves as the session table of contents:
- What external data was fetched
- What vault files are available (with full paths)
- What's missing or optional

---

## Architecture

### Data Flow

```
User: claude skill run planning-daily "next monday"
  ↓
Orchestrator
  ├─ Resolves: "next monday" → 2026-02-17
  ├─ Creates session: /tmp/2bd-session-abc123/
  ├─ Reads skill needs from SKILL.md
  └─ Plans fulfillment strategy
  ↓
Parallel Subagent Spawns
  ├─ fetch-calendar → calendar.md (external API)
  ├─ fetch-resources → resources.md (QMD API)
  └─ resolve-references → discovers vault paths
  ↓
Orchestrator writes memory.md
  ├─ External data: calendar.md, resources.md
  ├─ Vault references: full paths with status
  └─ Summary of what's available
  ↓
Inline Phase Execution
  ├─ Read memory.md (see what's available)
  ├─ Read external data (calendar.md, resources.md)
  ├─ Read vault files (Week.md, People/Sarah.md, etc.)
  └─ User interaction + synthesis
  ↓
Write Phase
  └─ Write results back to vault
```

### Session Structure

```
/tmp/2bd-session-abc123/
├── memory.md              # Session index (orchestrator-written)
├── dates.md               # Date resolution (orchestrator-internal)
├── calendar.md            # External: fetched events
└── resources.md           # External: QMD search results
```

**Note:** `dates.md` is orchestrator-internal. Skills never reference it. Subagents may read it to coordinate work, but it's not part of the public session API.

### memory.md Format

```markdown
# Session Memory: planning-daily (2026-02-17)

Planning for: Monday, February 17, 2026 (next monday)

## External Data Available

### Calendar Events (calendar.md)
3 events fetched for 2026-02-17:
- 09:00-09:30: Team standup
- 14:00-15:00: 1:1 with Sarah Chen
- 16:00-17:00: Design review

### QMD Resources (resources.md)
5 documents found related to meetings and active projects

## Vault Files Available

### Configuration & Directives
- **Directives**: /Users/me/vault/00_Brain/Systemic/Directives/profile.md ✓

### Working Notes
- **Today.md**: /Users/me/vault/00_Brain/Captive/Today.md (new - will create)
- **Week.md**: /Users/me/vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /Users/me/vault/00_Brain/Captive/Month.md ✓

### People (from calendar 1:1s)
- **Sarah Chen**: /Users/me/vault/02_Areas/People/Sarah Chen.md ✓
- **John Smith**: /Users/me/vault/02_Areas/People/John Smith.md ✗ (no file - suggest creating)

### Projects (active)
- **quarterly-planning**: /Users/me/vault/01_Projects/2026-03-31-quarterly-planning.md ✓
- **hiring-round**: /Users/me/vault/01_Projects/2026-02-20-hiring-round.md ✓

## Summary
- Found: 4 external data sources, 9 vault references
- Missing: 1 person file (John Smith)
- Ready for planning session
```

**Key:** Full paths to all vault files so inline phase can directly Read them.

---

## Skill Structure

### Minimal Frontmatter

```yaml
---
name: planning-daily
description: Morning ritual for planning the day
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---
```

### Declarative Needs Section

```markdown
## What I Need

- Calendar events for the day
- User's directives and preferences
- QMD search results for documents related to meetings and projects
- Today.md file for this day (may not exist yet)
- Week.md for weekly context
- Month.md for monthly context
- People files for anyone with 1:1 meetings
- Active project files
```

**Orchestrator interprets this prose to determine:**
- Which sub-skills to spawn (`_sub/fetch-calendar`, `_sub/fetch-resources`)
- Which vault paths to resolve (`Week.md` → `$VAULT/00_Brain/Captive/Week.md`)
- What entity resolution is needed (people from calendar, projects from vault)

### Inline Phase Instructions

```markdown
## Planning Session

Greet the user. We're planning their day.

Review their calendar and upcoming meetings.
Check their weekly goals and monthly themes.
See what projects are active.

Guide them through:
- What's the leadership intention for today?
- What are the top priorities?
- Which meetings need preparation?
- Where's the focus time?

Generate their day plan.
```

**Inline agent interprets naturally:**
- "Review their calendar" → Read memory.md, see calendar.md exists, Read it
- "Check their weekly goals" → Read memory.md, see Week.md path, Read it
- "See what projects are active" → Read memory.md, see project paths, Read them

### Write Phase Instructions

```markdown
## Save the Plan

Write the plan to Today.md in the vault for this day.
```

**Orchestrator spawns write subagent** with context:
- Target file path (resolved from time context)
- Content to write (from inline phase)

---

## Orchestrator Responsibilities

### 1. Argument Resolution

Parse flexible time expressions:

| Input | Resolution |
|-------|------------|
| (empty) | today |
| `tomorrow` | today + 1 day |
| `next monday` | next Monday from today |
| `last week` | previous week (Mon-Sun) |
| `YYYY-MM-DD` | specific date |
| `YYYY-Www` | specific ISO week |

Write to `dates.md` for internal coordination:
```yaml
target_date: 2026-02-17
target_scope: day
week: 2026-W08
day_of_week: Monday
relative: next monday
resolved_at: 2026-02-15T10:30:00
```

### 2. Need Analysis

Parse skill's "What I Need" section:

| Need Pattern | Fulfillment Strategy |
|--------------|---------------------|
| "Calendar events" | Spawn `_sub/fetch-calendar` with resolved date |
| "QMD search" | Spawn `_sub/fetch-resources` |
| "Today.md file" | Resolve vault path for target date |
| "Week.md" | Resolve static vault path |
| "People files for 1:1s" | Spawn resolver to parse calendar, find files |
| "Active project files" | Spawn resolver to scan vault |
| "Directives" | Resolve static vault paths |

### 3. Subagent Orchestration

Spawn subagents with enriched context:

```markdown
[Subagent prompt constructed by orchestrator]

You are fulfilling a need for the planning-daily ritual.

Context:
- Planning for: 2026-02-17 (Monday, next monday)
- Session directory: /tmp/2bd-session-abc123/

Need from skill:
"Calendar events for the day"

Your task:
Fetch calendar events for 2026-02-17 using the macOS Calendar API.
Write the results to calendar.md in the session directory.

Format as natural markdown (events, times, attendees).
```

**Note:** Orchestrator translates abstract needs ("for the day") into concrete instructions ("for 2026-02-17").

### 4. Memory Assembly

After subagents complete, write `memory.md`:
- List external data files created
- List vault files found (with full paths)
- Note what's missing or optional
- Provide context summary

### 5. Inline Phase Execution

Execute inline phase prose in main conversation:
- Load skill's inline instructions
- Provide session directory path
- Claude interprets instructions naturally
- Reads memory.md, then loads context as needed

---

## Sub-Skills

### Fetch Sub-Skills (External Data)

**Purpose:** Call external APIs, write results to session

**Examples:**
- `_sub/fetch-calendar` - macOS Calendar API via ekctl
- `_sub/fetch-resources` - QMD document search

**Output:** Markdown files in session directory (calendar.md, resources.md)

**No synthesis.** Just fetch raw data and format as readable markdown.

### Resolve Sub-Skill (Vault References)

**Purpose:** Discover vault file paths based on declarative needs

**Example:** `_sub/resolve-references`

**Input:** Prose instructions from skill's "What I Need" section + session context

**Process:**
1. Read skill needs: "People files for 1:1 meetings"
2. Read calendar.md to extract people names
3. Scan vault for matching People/*.md files
4. Write results with full paths to references.md

**Output:** Added to memory.md by orchestrator (full paths with status)

### Write Sub-Skills (Vault Updates)

**Purpose:** Write content back to vault

**Example:** `_sub/write-to-vault`

**Input:**
- Content to write (from inline phase)
- Target path (resolved by orchestrator)

**Process:**
1. Check if file exists (ask before overwriting)
2. Write content
3. Report success

---

## Example: Weekly Review

### Skill Definition

```markdown
---
name: weekly-review
description: Review and archive a week's work
argument-hint: "[target: (empty)|last week|YYYY-Www]"
---

# Weekly Review

Help the user review their week and archive it.

## What I Need

- All daily archive files for the week being reviewed (Mon-Fri)
- Week.md file with the week's goals and notes
- Month.md and Quarter.md for broader context
- People files for significant interactions this week
- Project files that were active or mentioned this week

## Review Session

Greet the user. We're reviewing their week.

Load their week summary and daily archives.

Guide reflection on:
- How did you embody your leadership intentions?
- What were the wins (personal, organizational, strategic)?
- What insights emerged?
- Which people had significant interactions?
- What projects moved forward?
- What's carrying forward to next week?

Generate the weekly archive content.

## Archive

Write the archive to the appropriate weekly file in Periodic.
Update People files with interaction notes.
Update Project files with progress notes.
```

### Orchestrator Resolution

**User runs:** `claude skill run weekly-review "last week"`

**Orchestrator:**
1. Resolves "last week" → 2026-W06 (Feb 3-9, 2026)
2. Writes dates.md with week range and workday list
3. Parses needs:
   - "All daily archive files" → resolve paths for Mon-Fri of target week
   - "Week.md" → static vault path
   - "People files for interactions" → scan daily archives for people mentions
   - "Project files active" → scan daily archives for project links
4. Spawns `_sub/resolve-references` with enriched context
5. Writes memory.md with all discovered paths

### memory.md Output

```markdown
# Session Memory: weekly-review (2026-W06)

Reviewing: Week of February 3-9, 2026 (last week)

## Daily Archives Found

- **2026-02-03**: /vault/00_Brain/Periodic/Daily/2026-02-03.md ✓
- **2026-02-04**: /vault/00_Brain/Periodic/Daily/2026-02-04.md ✓
- **2026-02-05**: /vault/00_Brain/Periodic/Daily/2026-02-05.md ✗ (not reviewed)
- **2026-02-06**: /vault/00_Brain/Periodic/Daily/2026-02-06.md ✓
- **2026-02-07**: /vault/00_Brain/Periodic/Daily/2026-02-07.md ✓

Coverage: 4 of 5 workdays reviewed

## Context Files

- **Week.md**: /vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /vault/00_Brain/Captive/Month.md ✓
- **Quarter.md**: /vault/00_Brain/Captive/Quarter.md ✓

## People (from daily archives)

- **Sarah Chen**: /vault/02_Areas/People/Sarah Chen.md ✓ (1:1 on Mon, Thu)
- **Michael Torres**: /vault/02_Areas/People/Michael Torres.md ✓ (team sync)
- **Jane Doe**: /vault/02_Areas/People/Jane Doe.md ✗ (new - suggest creating)

## Projects (from daily archives)

- **quarterly-planning**: /vault/01_Projects/2026-03-31-quarterly-planning.md ✓
- **hiring-round**: /vault/01_Projects/2026-02-20-hiring-round.md ✓

## Ready

All required context available. Missing review for Feb 5 - proceed with partial week?
```

### Inline Phase Execution

Claude reads the skill's "Review Session" prose:
```markdown
Load their week summary and daily archives.
```

Claude interprets:
1. Read memory.md → see Week.md path and daily archive paths
2. Read Week.md from vault
3. Read each daily archive from vault (4 available)
4. Proceed with reflection dialogue

---

## Benefits

### For Skill Authors

- **Write pure intent** - no implementation knowledge needed
- **Natural prose** - describe what you need, not how to get it
- **Maintainable** - skills don't break when orchestration changes
- **Composable** - same needs work across different rituals

### For Orchestrator

- **Clear separation** - intent vs implementation
- **Flexible fulfillment** - multiple strategies for same need
- **Testable** - can mock external data, test with different vault states
- **Extensible** - new need types without changing existing skills

### For Performance

- **Minimal context** - inline phases start lean, load incrementally
- **Parallel fetching** - all external data gathered simultaneously
- **Direct reads** - no copying vault files, just reference paths
- **No parsing overhead** - markdown stays markdown

### For Debugging

- **Transparent** - memory.md shows exactly what's available
- **Inspectable** - session directory persists for debugging
- **Traceable** - clear lineage from need → fulfillment → usage

---

## Migration Path

### Phase 1: Orchestrator Implementation

1. Build prose parser for "What I Need" sections
2. Implement argument resolution (time expressions)
3. Implement need fulfillment strategies
4. Implement memory.md assembly

### Phase 2: Sub-Skill Updates

1. Update fetch-calendar to write natural markdown (remove JSON)
2. Create resolve-references sub-skill
3. Update/remove synthesis sub-skills (projects-summary, etc.)

### Phase 3: Skill Migration

1. Rewrite planning-daily to pure prose
2. Rewrite review-daily to pure prose
3. Rewrite planning-weekly and review-weekly
4. Continue with monthly/quarterly/yearly

### Phase 4: Cleanup

1. Remove phases.yaml files
2. Remove old orchestrator code
3. Update CLAUDE.md and DEVELOPING.md

---

## Open Questions

### 1. Subagent Coordination

For complex needs like "people files for 1:1 meetings":
- Single smart resolver that reads calendar.md and resolves paths?
- Multiple specialized resolvers (resolve-people, resolve-projects)?

**Recommendation:** Single smart resolver (`_sub/resolve-references`) with prose instructions.

### 2. Error Handling

If calendar.md fetch fails:
- Skip it and note in memory.md?
- Retry with fallback?
- Fail the whole ritual?

**Recommendation:** Mark as unavailable in memory.md, let inline phase adapt gracefully.

### 3. Session Lifecycle

When to clean up `/tmp/2bd-session-*/` directories?
- Immediately after ritual completes?
- Keep for debugging (user-configurable retention)?

**Recommendation:** Keep last 10 sessions, auto-cleanup older ones.

### 4. Caching

Should calendar.md be cached if ritual runs twice in quick succession?

**Recommendation:** No caching initially. Add later if needed.

---

## Success Criteria

- [ ] Skills contain zero orchestration knowledge
- [ ] Session contains only external data (no vault copies)
- [ ] memory.md contains full paths to all references
- [ ] Inline phases load context incrementally
- [ ] No JSON parsing anywhere
- [ ] No variable interpolation (minimal pattern matching only)
- [ ] planning-daily and review-daily work with new orchestrator
- [ ] Context window usage reduced vs current design

---

## Next Steps

1. Write implementation plan
2. Create working prototype with planning-daily
3. Test with various arguments ("tomorrow", "next week", etc.)
4. Validate context window usage
5. Migrate remaining rituals
