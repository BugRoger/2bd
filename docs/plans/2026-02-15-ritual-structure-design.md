# Ritual Structure Design

**Date:** 2026-02-15
**Status:** Approved
**Audience:** Claude (AI) for ritual creation and maintenance

## Purpose

Document the canonical 6-phase structure that all rituals follow. This provides a consistent pattern for creating new rituals and maintaining existing ones.

## The Problem

Current rituals use inconsistent section naming:
- "What I Need" vs "Declare" vs no header at all
- "Pre-Flight Check" vs "Validate" vs "Setup"
- "Planning Session" vs "Interactive Review" vs "Session"
- "Generate Plan" vs "Build and Save Plan" vs "Synthesis" vs "Compose"
- Some rituals have Confirm→Write, others have Write→Confirm

This inconsistency makes it harder to understand ritual structure at a glance and creates confusion when creating new rituals.

## The Solution

All rituals follow a universal 6-phase lifecycle with canonical section names.

### Phase 1: Context

**Section header:** `## Context`

Declare what context is needed in natural prose. The orchestrator interprets these needs and loads all required context before ritual execution begins.

**Current mapping:**
- Currently named "What I Need" in most rituals
- Will be renamed to "Context"

**Typical content:**
```markdown
## Context

- Calendar events for the target period
- User's directives and preferences
- Week.md, Month.md, Quarter.md for hierarchical context
- People files for anyone with 1:1 meetings
- Active project files
```

**Orchestrator behavior:**
- Parses prose declarations
- Spawns sub-skills to fetch external data (calendar, etc.)
- Resolves vault file paths
- Pre-loads all context into conversation
- Builds memory.md as session index

---

### Phase 2: Validate

**Section header:** `## Validate`

Check prerequisites and state before proceeding. Ensure it's safe to execute the ritual.

**Current mapping:**
- Currently "Pre-Flight Check" in most rituals
- Will be renamed to "Validate"

**Typical checks:**
- Date alignment verification
- Existing file detection
- Archive state confirmation
- Data loss warnings
- Offer alternatives if state is unsafe

**Example:**
```markdown
## Validate

Check if Today.md already exists for the target date. If it does:
- Check if its date is in the past (older than target date)
- Warn about potential data loss if not archived
- Suggest running review-daily first
- Ask whether to: review, update, or start fresh

Proceed only when state is validated.
```

---

### Phase 3: Session

**Section header:** `## Session`

Interactive guided conversation with the user. This is where the ritual does its primary work.

**Current mapping:**
- Currently "Planning Session" (planning rituals)
- Currently "Interactive Review" (review rituals)
- Will be unified to "Session"

**Core elements:**
- Personalized greeting using directives (preferred_name)
- Present loaded context to user
- Ask questions, gather input, facilitate reflection
- Planning rituals: ask about priorities, intentions, constraints
- Review rituals: guide reflection on wins, insights, patterns

**Subsections allowed:**
Rituals may use subsections within Session to organize the conversation flow. These are ritual-specific and not part of the canonical structure.

**Example subsections:**
```markdown
## Session

Greet the user using their preferred name from directives.

### Review Context
Present calendar and hierarchical context.

### Priorities
Identify the three key outcomes for today.

### Meetings
Review calendar and enrich 1:1 contexts.
```

---

### Phase 4: Compose

**Section header:** `## Compose`

Build the complete artifact in memory. Generate all content, fill templates, prepare everything for persistence.

**Current mapping:**
- Currently "Generate Plan" (planning-daily, early draft)
- Currently "Build and Save Plan" (planning-daily, current)
- Currently "Synthesis" (review rituals)
- Will be unified to "Compose"

**Purpose:**
- Create the complete output structure
- Fill templates with session data
- Generate coaching prompts
- For reviews: spawn sub-skills to analyze and extract semantic notes
- Prepare everything but don't write yet

**Clarification:**
In current rituals, some combine compose + persist into a single section (e.g., "Build and Save Plan"). When refactoring, split these into two distinct phases.

---

### Phase 5: Persist

**Section header:** `## Persist`

Execute file operations. Write to vault, update changelogs.

**Current mapping:**
- Currently embedded in "Build and Save Plan" or "Generate Plan"
- Currently "Write" in some review rituals
- Will be extracted to explicit "Persist" section

**Requirements:**
- Document what files will be written and where
- Execute write operations
- Use sub-skills for complex operations (archive, update-semantic)
- Update changelog entries via append-changelog sub-skill

**Example:**
```markdown
## Persist

Write Today.md to Captive with the generated plan content.

Update changelog: planning-daily created Today.md.
```

**For review rituals:**
```markdown
## Persist

Use archive-weekly sub-skill to move Week.md to Periodic/Weekly/.

Use update-semantic sub-skill for each approved semantic note update.

Update Week.md with archived marker in frontmatter.
```

---

### Phase 6: Confirm

**Section header:** `## Confirm`

Summarize what was done. Verify user is ready to proceed or acknowledge completion.

**Current mapping:**
- Currently "Confirm" in all rituals
- Remains "Confirm"

**Purpose:**
- Summarize key outcomes of the ritual
- Show what was persisted
- Suggest next steps
- Provide closure

**NOT an approval gate:**
This is verification after persistence, not before. Files have already been written. This phase provides summary and next-step guidance.

**Example:**
```markdown
## Confirm

After writing, summarize:
- The three priorities
- The leadership intention
- Number of meetings prepared

Suggest time-blocking strategies if helpful.

Confirm with the user that their day is planned.
```

---

## Canonical Phase Summary

| Phase | Section Name | Purpose | Gate? |
|-------|--------------|---------|-------|
| 1 | `## Context` | Declare context needs (orchestrator loads) | No |
| 2 | `## Validate` | Check prerequisites and state | Yes (proceed only when safe) |
| 3 | `## Session` | Interactive guided conversation | No |
| 4 | `## Compose` | Build artifact in memory | No |
| 5 | `## Persist` | Write to vault | No |
| 6 | `## Confirm` | Summarize and suggest next steps | No |

---

## Design Principles

### Universal Application

These phases apply to ALL rituals:
- Planning rituals (daily, weekly, monthly, quarterly, yearly)
- Review rituals (daily, weekly, monthly, quarterly, yearly)
- Any future ritual types

No special cases. No ritual-specific variations in phase names.

### Section Names Match Phase Names

The section header in the SKILL.md file must exactly match the phase name:
- ✓ `## Context`
- ✗ `## What I Need`
- ✗ `## Declare Needs`

### Subsections Are Flexible

Within each phase (especially Session and Compose), rituals may use subsections to organize content. These are ritual-specific and not part of the canonical structure.

**Example:**
```markdown
## Session

### Review Context
...

### Priorities
...

### Meetings
...
```

These subsections (`### Review Context`, `### Priorities`, etc.) are fine and expected. The canonical structure only specifies the top-level `##` sections.

### Separation of Compose and Persist

The previous pattern of combining "build and save" into one phase is deprecated. Compose and Persist must be separate phases.

**Reasoning:**
- Clearer separation of concerns
- Easier to understand what's happening when
- Consistent with the universal structure
- Better for sub-skill delegation (Persist can spawn write sub-skills)

---

## Migration Impact

### Rituals Requiring Updates

All 10 existing rituals need section name updates:

**Planning rituals (5):**
1. planning-daily
2. planning-weekly
3. planning-monthly
4. planning-quarterly
5. planning-yearly

**Review rituals (5):**
1. review-daily
2. review-weekly
3. review-monthly
4. review-quarterly
5. review-yearly

### Types of Changes

**Context phase:**
- Rename "What I Need" → "Context"

**Validate phase:**
- Rename "Pre-Flight Check" → "Validate"

**Session phase:**
- Rename "Planning Session" → "Session"
- Rename "Interactive Review" → "Session"

**Compose phase:**
- Extract composition logic from combined sections
- Rename "Generate Plan" → "Compose"
- Rename "Synthesis" → "Compose"
- For "Build and Save Plan", split into Compose + Persist

**Persist phase:**
- Create new "Persist" section from extracted write logic
- Rename "Write" → "Persist"

**Confirm phase:**
- No changes (already "Confirm" in most rituals)

---

## Benefits

### For Claude (AI)

- Clear pattern to follow when creating new rituals
- Easy to identify which phase a ritual is in
- Consistent structure for maintenance and debugging
- Scannable at a glance

### For Developers

- Understand ritual flow without reading implementation details
- Know where to look for specific functionality
- Consistent pattern across all ritual types

### For the System

- Orchestrator can potentially automate phase transitions
- Sub-skills know when they're invoked (during Compose vs Persist)
- Changelog entries can reference canonical phase names

---

## Future Considerations

### Potential Orchestration Improvements

With canonical phases, the orchestrator could:
- Automatically handle Context loading (already does this)
- Provide phase-level hooks (before Validate, after Compose, etc.)
- Add timing/telemetry per phase
- Offer phase-level error handling

These are not part of this design but become possible with canonical structure.

### Phase Additions

If future rituals need additional phases, they should be:
- Universal (apply to all ritual types)
- Single-word names
- Inserted in the appropriate position in the lifecycle

Do not add ritual-specific phases. Use subsections instead.

---

## Implementation

See implementation plan (created via writing-plans skill) for detailed steps to:
1. Add "Ritual Structure" reference section to DEVELOPING.md
2. Update all 10 ritual SKILL.md files with canonical phase names
3. Verify rituals still function correctly after refactoring
