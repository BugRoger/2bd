# Streamline Planning-Daily Skill

**Date:** 2026-02-15
**Status:** Design approved, ready for implementation

## Problem

The planning-daily skill references orchestrator mechanics (memory.md, SESSION_DIR, plan.md). This couples the skill to implementation details and makes the prose harder to read.

## Solution

Remove all orchestrator references from the skill. The orchestrator loads context into conversation before execution. The skill describes the planning conversation naturally, with no mention of how context arrived or where files are stored.

## Architecture

### Current Flow

1. Orchestrator creates session directory
2. Orchestrator writes memory.md with file paths
3. Skill reads memory.md to find context
4. Skill writes plan.md to session directory
5. Skill uses bash to copy plan.md to vault

### New Flow

1. Orchestrator loads all context into conversation
2. Skill references context naturally ("the calendar", "Week.md")
3. Skill says "Write Today.md to Captive"
4. Orchestrator handles vault path resolution and file writing

## Changes to Planning-Daily Skill

### Remove These References

- `memory.md` - context is already loaded
- `SESSION_DIR` - no session directory needed
- `plan.md` - no intermediate file
- Bash commands for copying files
- "Paths in memory.md" phrases
- "Load from session" instructions

### Change This Section

**Current:**
```markdown
## Pre-Flight Check

Read memory.md to see what context is available.

If memory.md doesn't contain expected vault paths, resolve them directly from .claude/config.md vault_path configuration.
```

**New:**
```markdown
## Pre-Flight Check

Check if Today.md already exists for the target date.
```

### Change This Section

**Current:**
```markdown
## Save to Vault

Use bash to write plan.md to Today.md in vault. The orchestrator provides the session directory path in the SESSION_DIR environment variable:

```bash
vault_path=$(grep "vault_path:" .claude/config.md | cut -d' ' -f2)
cp "${SESSION_DIR}/plan.md" "${vault_path}/00_Brain/Captive/Today.md"
```
```

**New:**
```markdown
## Save Plan

Write Today.md to Captive.
```

### Throughout the Skill

**Current phrasing:**
- "Load Week.md from vault (path in memory.md)"
- "Load that person's file (path in memory.md)"
- "If QMD search results are available in session"
- "Write the generated plan to plan.md in the session directory"

**New phrasing:**
- "Review Week.md"
- "Review their People file"
- "If QMD results are available"
- "Write Today.md with the generated plan"

## Orchestrator Changes

The orchestrator already handles most of this. Document the pattern:

### Context Loading

Before executing the skill, the orchestrator:
1. Parses "What I Need" section
2. Fetches external data (calendar, QMD)
3. Loads vault files (Week.md, directives, People files)
4. Adds all context to conversation

The skill executes with everything already present.

### File Writing

When the skill says "Write Today.md to Captive":
1. Orchestrator knows vault path from config
2. Orchestrator resolves Captive to `{vault_path}/00_Brain/Captive/`
3. Orchestrator writes the file

## Documentation Updates

### CLAUDE.md

Add this to the prose-driven orchestration section:

```markdown
**Context is pre-loaded:** The orchestrator loads all context before skill execution. Skills reference context naturally ("the calendar", "Week.md") without mentioning memory.md or session directories.

**File writing is declarative:** Skills say "Write Today.md to Captive" and the orchestrator handles path resolution.
```

### DEVELOPING.md

Update the "Prose-Driven Orchestration" section:

**Current:**
> Inline phases read incrementally as needed

**New:**
> Skills reference context naturally. The orchestrator has already loaded everything into the conversation before execution.

Add new subsection:

```markdown
### Skill Writing Pattern

Skills describe the work naturally:

**Context references:**
- "Review the calendar" (not "Load calendar.md from session")
- "Check Week.md" (not "Load Week.md from path in memory.md")
- "If QMD results are available" (not "If resources.md exists in session")

**File writing:**
- "Write Today.md to Captive" (not bash commands with $SESSION_DIR)
- "Update Week.md" (not path resolution)

The orchestrator translates these natural phrases into file operations.
```

## Benefits

1. **Cleaner skill prose** - reads like instructions, not implementation
2. **No coupling** - skill doesn't depend on session structure
3. **Easier to understand** - someone reading the skill sees the planning flow
4. **Flexible implementation** - orchestrator can change how it loads context

## Implementation Order

1. Update CLAUDE.md and DEVELOPING.md with the new pattern
2. Update planning-daily skill to remove orchestrator references
3. Test that orchestrator correctly interprets the simplified prose
4. Apply same pattern to other rituals (planning-weekly, review-daily, etc.)

## Testing

Run `claude skill run rituals/planning-daily` and verify:
- Context loads correctly (calendar, directives, Week.md)
- Skill references context naturally
- Today.md writes to correct vault location
- No references to memory.md or SESSION_DIR in skill output
