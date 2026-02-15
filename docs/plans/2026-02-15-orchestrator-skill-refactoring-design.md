# Orchestrator Skill Refactoring Design

**Date:** 2026-02-15
**Status:** Approved
**Type:** Comprehensive refactoring

## Overview

Refactor all rituals, sub-skills, and commands to remove session/memory logic and adopt the new prose-driven orchestration pattern. This includes folding archive sub-skills into their parent review rituals and removing all QMD references.

## Motivation

The orchestrator has migrated to a conversation-based pattern where all context is pre-loaded into the conversation history. Skills should:
- Use natural prose instead of implementation directives
- Reference context naturally ("Review the calendar" not "Load calendar.md from session")
- Eliminate memory.md and session directory references
- Simplify architecture by inlining simple operations

## Scope

### Files to Update

**Rituals (8 files):**
- review-daily (fold in archive-daily logic)
- planning-weekly, review-weekly (fold in archive-weekly logic)
- planning-monthly, review-monthly (fold in archive-monthly logic)
- planning-quarterly, review-quarterly (fold in archive-quarterly logic)
- planning-yearly, review-yearly (fold in archive-yearly logic)

Note: planning-daily already updated, verify compliance

**Sub-skills (8 files):**
- write-captive-note
- append-changelog
- extract-to-areas
- update-semantic
- fetch-calendar
- project-sync-* (outlook, finder, vault)
- resolve-references
- apply-writing-style

**Commands (5 files):**
- init
- migrate
- create-project
- archive-project
- onboard-person

**Documentation (3 files):**
- DEVELOPING.md
- CLAUDE.md
- README.md

### Files to Delete

**Archive sub-skills (5 directories):**
- `.claude/skills/_sub/archive-daily/`
- `.claude/skills/_sub/archive-weekly/`
- `.claude/skills/_sub/archive-monthly/`
- `.claude/skills/_sub/archive-quarterly/`
- `.claude/skills/_sub/archive-yearly/`

**Total:** 21 files to refactor, 5 directories to delete

## Design Principles

### 1. Natural Prose Style

Skills describe what happens in flowing prose, not step-by-step directives.

**Before:**
```markdown
### 1. Get Vault Path

Check for `--vault=` argument, otherwise ask:
"Where should I create your vault?"
Store as `$VAULT`.
```

**After:**
```markdown
### Vault Path

Get the vault path from `--vault=` argument or ask the user. The path should be a folder that syncs (OneDrive, iCloud, Dropbox).

Validate the path exists. Warn if inside a git repo (vaults should not be in repos).
```

### 2. Natural Context References

Skills reference context as if it's already available (because the orchestrator pre-loads it).

**Before:**
```markdown
Read memory.md to see what context is available.
Load Today.md from vault (path in memory.md).
```

**After:**
```markdown
Load Today.md for the target date.
```

### 3. Declarative File Operations

Describe file operations in prose, not bash commands.

**Before:**
```markdown
```bash
cp "${SESSION_DIR}/plan.md" "${VAULT}/00_Brain/Captive/Today.md"
```
```

**After:**
```markdown
Write Today.md to Captive with the completed plan.
```

### 4. Structured Output Preserved

Sub-skills can return structured data in markdown code blocks for machine parsing.

```markdown
After writing, return structured output:

```json
{
  "success": true,
  "path": "/vault/00_Brain/Captive/Today.md",
  "bytes_written": 4096
}
```
```

### 5. Inline Simple Operations

Simple sub-skill operations should be folded into their parent skill for clarity.

**Before (review-daily):**
```markdown
Use `archive-daily` sub-skill to move Today.md to Periodic/Daily/.
```

**After (review-daily):**
```markdown
Archive Today.md to Periodic/Daily/{date}.md. Transform the content into archive format, verify the directory exists, and write the file. Call append-changelog to record the archival. Replace Today.md with an archived placeholder linking to the archive.
```

## Conversion Patterns

### Pattern A: Review Rituals

**Key transformations:**
1. Add `orchestrated: true` to frontmatter
2. Remove all "Read memory.md" and "path in memory.md" references
3. Inline archive logic in Persist phase (fold in archive-* sub-skill)
4. Use natural context references throughout

**Archive integration example:**
```markdown
## Persist

Archive Today.md to Periodic/Daily/{date}.md. Transform the content into archive format, verify the directory exists, and write the file. Call append-changelog to record the archival. Replace Today.md with an archived placeholder linking to the archive.

Use update-semantic sub-skill for each approved semantic note update.

Report completion and suggest next steps.
```

### Pattern B: Sub-skills

**Key transformations:**
1. Convert numbered steps to flowing prose
2. Remove bash code blocks (describe operations instead)
3. Keep JSON output in markdown code blocks
4. No session/memory references

**Example transformation:**

**Before:**
```markdown
### 1. Validate Paths

Verify required directories exist:

```bash
ls -d "$VAULT/00_Brain/Captive/"
```

If missing, create it:
```bash
mkdir -p "$VAULT/00_Brain/Captive/"
```
```

**After:**
```markdown
Receive the vault path, target filename, and content to write.

Validate that the Captive directory exists in the vault. If missing, create it.

Check if the target file already exists. If it does, compare content. Return an error if content differs and ask whether to overwrite.

Write the content to Captive/{filename}. Verify the write succeeded by reading back the file.

Return structured output in a markdown code block with success status, file path, and bytes written.
```

### Pattern C: Commands

Commands follow ritual pattern if they need vault context, or remain utility-focused if simple.

**Complex commands (init, migrate):**
- Add `orchestrated: true` if they need vault context
- Use prose for flow description
- Remove session/memory logic

**Simple commands (create-project):**
- May not need orchestration
- Convert to prose style
- Focus on clarity

## Special Cases

### Sub-skills That Spawn Other Sub-skills

Keep the spawning pattern but use prose language:

```markdown
After writing the update, call append-changelog to record the modification in the file's changelog section.
```

The orchestrator handles Task tool invocation naturally.

### QMD Removal

Remove all references to QMD (query/search system):
- Context sections: Remove "QMD search results if available"
- Conditional logic: Remove "if QMD results are available"
- DEVELOPING.md: Remove fetch-qmd examples
- orchestrator/SKILL.md: Remove QMD-related examples

### Coaching.md References

Skill-local documentation references (e.g., review-daily referencing its own coaching.md) stay as-is. These are not session/memory references.

### Test/Dev Skills

Update or delete test-orchestrator in _dev/ to match new pattern.

## Documentation Updates

### DEVELOPING.md

1. Remove all memory.md and session directory references
2. Update sub-skill list (remove archive-* entries)
3. Remove QMD/fetch-qmd examples
4. Update prose-driven orchestration examples
5. Update sub-skill creation guidance

### CLAUDE.md

1. Verify orchestration guidance matches implementation
2. Remove QMD references
3. Update any example skill patterns

### README.md

1. Check for memory/session/QMD mentions in user-facing docs
2. Update if needed

## Success Criteria

1. **No memory.md references** - Zero mentions across all skills
2. **No session directory references** - Zero mentions of session paths or temp files
3. **No QMD references** - Zero mentions of QMD/query system
4. **Archive sub-skills removed** - 5 directories deleted
5. **Prose style throughout** - All skills use natural prose, not directives
6. **Orchestration flags correct** - Skills with context needs have `orchestrated: true`
7. **Documentation updated** - DEVELOPING.md, CLAUDE.md, README.md reflect changes
8. **Planning-daily verified** - Ensure existing file matches pattern

## Implementation Approach

Execute in category batches:
1. Review rituals (8 files) - highest priority, user-facing
2. Sub-skills (8 files) - dependencies for rituals
3. Commands (5 files) - one-shot utilities
4. Documentation (3 files) - reflect all changes
5. Cleanup (5 directories) - delete obsolete archive sub-skills

## Trade-offs

**Pros:**
- Consistent patterns across all skills
- Simpler architecture (fewer files, no session overhead)
- More readable prose style
- Easier maintenance

**Cons:**
- Large change set to review
- Need to verify all skills still work correctly
- Archive logic duplicated across review rituals (acceptable for clarity)

## Next Steps

Use writing-plans skill to create detailed implementation plan with file-by-file conversion checklist.
