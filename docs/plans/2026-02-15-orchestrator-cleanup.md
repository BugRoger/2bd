# Orchestrator Refactoring Cleanup Plan

**Date:** 2026-02-15
**Status:** Planning
**Goal:** Clean up all skills and _sub/ directories after orchestrator refactoring

## Context

The orchestrator refactoring introduced prose-driven orchestration where:
- Skills declare context needs in natural language
- The orchestrator handles session creation, date resolution, and context loading
- All context is pre-loaded into the conversation before skill execution
- Skills no longer need explicit fetch/gather sub-skills or phases

**Reference Implementation:** [rituals/planning-daily](../../.claude/skills/rituals/planning-daily/SKILL.md)

## Current State

### Skills Inventory

**Rituals (10 total):**
- ✅ `planning-daily` - Already migrated (canonical pattern)
- ⏳ `review-daily` - Needs migration
- ⏳ `planning-weekly` - Needs migration
- ⏳ `review-weekly` - Needs migration (uses old phases)
- ⏳ `planning-monthly` - Needs migration
- ⏳ `review-monthly` - Needs migration
- ⏳ `planning-quarterly` - Needs migration
- ⏳ `review-quarterly` - Needs migration (recently refactored with phases)
- ⏳ `planning-yearly` - Needs migration
- ⏳ `review-yearly` - Needs migration (recently refactored with phases)

**Commands (5 total):**
- ⏳ `init` - Review for orchestrator compatibility
- ⏳ `create-project` - Review for orchestrator compatibility
- ⏳ `archive-project` - Review for orchestrator compatibility
- ⏳ `migrate` - Review for orchestrator compatibility
- ⏳ `onboard-person` - Review for orchestrator compatibility

### _sub/ Skills Inventory

**Orchestration (now handled by orchestrator):**
- 🗑️ `create-session` - DELETE (orchestrator handles)
- 🗑️ `resolve-dates` - DELETE (orchestrator handles)
- 🗑️ `fetch-config` - DELETE (orchestrator handles)

**Fetch Skills (orchestrator handles via Context section):**
- 🗑️ `fetch-directives` - DELETE
- 🗑️ `fetch-calendar` - KEEP (complex external API call, spawned by orchestrator)
- 🗑️ `fetch-today-content` - DELETE
- 🗑️ `fetch-week-content` - DELETE
- 🗑️ `fetch-month-content` - DELETE
- 🗑️ `fetch-quarter-content` - DELETE
- 🗑️ `fetch-year-content` - DELETE
- 🗑️ `fetch-active-projects` - DELETE
- 🗑️ `fetch-projects-vault` - DELETE
- 🗑️ `fetch-dates` - DELETE (duplicate of resolve-dates?)

**Gather Skills (orchestrator handles via Context section):**
- 🗑️ `gather-week-context` - DELETE
- 🗑️ `gather-month-context` - DELETE
- 🗑️ `gather-quarter-context` - DELETE
- 🗑️ `gather-year-context` - DELETE
- 🗑️ `gather-key-dates` - DELETE

**Archive Skills (legitimate operations):**
- ✅ `archive-daily` - KEEP
- ✅ `archive-weekly` - KEEP
- ✅ `archive-monthly` - KEEP
- ✅ `archive-quarterly` - KEEP
- ✅ `archive-yearly` - KEEP

**Semantic Operations (legitimate operations):**
- ✅ `extract-to-areas` - KEEP (creates People file updates)
- ✅ `update-semantic` - KEEP (appends to semantic notes)
- ✅ `write-captive-note` - KEEP (creates Today.md, Week.md, etc.)
- ✅ `append-changelog` - KEEP (appends to changelog sections)
- ✅ `resolve-references` - KEEP (resolves wikilinks and embeds)

**Writing & Presentation:**
- ✅ `apply-writing-style` - KEEP (applies Strunk & White style)

**Project Sync (legitimate operations):**
- ✅ `project-sync-finder` - KEEP (syncs Finder tags)
- ✅ `project-sync-outlook` - KEEP (syncs Outlook categories)
- ✅ `project-sync-vault` - KEEP (syncs vault metadata)

## Migration Pattern

### Old Pattern (review-weekly, review-yearly)

```markdown
## Validate
Load from vault...
Check state...

## Session
Guide through reflection...

## Compose
Spawn sub-skills...

## Persist
Execute writes...

## Confirm
Present changes...
```

### New Pattern (planning-daily)

```markdown
## Context
- Calendar events for the day
- User's directives and preferences
- Today.md file (may not exist)
- Week.md for weekly context
- People files for 1:1 meetings

## Validate
Check if files exist...
Verify state...

## Session
Guide through planning...

## Compose
Build the complete file...

## Persist
Write files...

## Confirm
Summarize and confirm...
```

### Key Changes

1. **Context Section** - Declare all needs in natural language
2. **No Fetch/Gather Calls** - All context pre-loaded by orchestrator
3. **Reference Naturally** - "Review the calendar" not "Load calendar.md"
4. **Simplified Phases** - Remove explicit orchestration mechanics
5. **Direct File References** - "Load Week.md from vault (path in memory.md)"

## Cleanup Tasks

### Phase 1: Delete Redundant _sub/ Skills

**Orchestration (3 files):**
- [ ] Delete `_sub/create-session/`
- [ ] Delete `_sub/resolve-dates/`
- [ ] Delete `_sub/fetch-config/`

**Fetch Skills (9 files):**
- [ ] Delete `_sub/fetch-directives/`
- [ ] Delete `_sub/fetch-today-content/`
- [ ] Delete `_sub/fetch-week-content/`
- [ ] Delete `_sub/fetch-month-content/`
- [ ] Delete `_sub/fetch-quarter-content/`
- [ ] Delete `_sub/fetch-year-content/`
- [ ] Delete `_sub/fetch-active-projects/`
- [ ] Delete `_sub/fetch-projects-vault/`
- [ ] Delete `_sub/fetch-dates/`

**Gather Skills (5 files):**
- [ ] Delete `_sub/gather-week-context/`
- [ ] Delete `_sub/gather-month-context/`
- [ ] Delete `_sub/gather-quarter-context/`
- [ ] Delete `_sub/gather-year-context/`
- [ ] Delete `_sub/gather-key-dates/`

**Total: 17 _sub/ skills to delete**

### Phase 2: Migrate Daily Rituals

**Priority: High** (most frequently used)

- [ ] Migrate `rituals/review-daily/`
  - Add Context section
  - Remove fetch/gather calls
  - Reference pre-loaded context naturally
  - Keep archive-daily sub-skill calls

### Phase 3: Migrate Weekly Rituals

- [ ] Migrate `rituals/planning-weekly/`
  - Add Context section
  - Remove phases
  - Reference pre-loaded context naturally

- [ ] Migrate `rituals/review-weekly/`
  - Add Context section
  - Remove phases (Validate, Session, Compose, Persist, Confirm)
  - Remove gather-week-context calls
  - Remove fetch-week-content calls
  - Keep archive-weekly, extract-to-areas, update-semantic calls

### Phase 4: Migrate Monthly Rituals

- [ ] Migrate `rituals/planning-monthly/`
- [ ] Migrate `rituals/review-monthly/`

### Phase 5: Migrate Quarterly Rituals

- [ ] Migrate `rituals/planning-quarterly/`
- [ ] Migrate `rituals/review-quarterly/`
  - Recently refactored with canonical phases
  - Remove phases
  - Add Context section

### Phase 6: Migrate Yearly Rituals

- [ ] Migrate `rituals/planning-yearly/`
- [ ] Migrate `rituals/review-yearly/`
  - Recently refactored with canonical phases
  - Remove phases
  - Add Context section

### Phase 7: Review Commands

- [ ] Review `commands/init/`
- [ ] Review `commands/create-project/`
- [ ] Review `commands/archive-project/`
- [ ] Review `commands/migrate/`
- [ ] Review `commands/onboard-person/`

### Phase 8: Update Documentation

- [ ] Update [CLAUDE.md](../../CLAUDE.md)
  - Remove references to fetch/gather patterns
  - Document prose-driven orchestration as canonical
  - Update context pre-loading explanation

- [ ] Update [DEVELOPING.md](../../DEVELOPING.md)
  - Remove fetch/gather sub-skill patterns
  - Document new orchestration model
  - Update sub-skill creation guidance
  - Add migration guide for old skills

- [ ] Update [README.md](../../README.md) if user-visible changes

### Phase 9: Clean Up Worktrees

**Note:** Worktree _sub/ directories are stale copies

- [ ] Verify main branch is canonical source
- [ ] Note that worktree skills will sync on next merge
- [ ] No immediate action needed (will be deleted in Phase 1 on main)

## Success Criteria

- [ ] All rituals use prose-driven orchestration pattern
- [ ] No skills manually call create-session or resolve-dates
- [ ] No skills manually call fetch-* or gather-* for simple vault file access
- [ ] All skills declare context needs in natural language
- [ ] Documentation reflects new orchestration model
- [ ] 17 redundant _sub/ skills deleted
- [ ] fetch-calendar remains (complex external operation)
- [ ] All archive-* skills remain (legitimate operations)
- [ ] All semantic operation skills remain (extract-to-areas, update-semantic, etc.)

## Notes

### Keep vs Delete Decision Tree

**DELETE if:**
- Orchestrator can fulfill the need (session, dates, vault files, directives)
- The skill just reads simple vault files
- The skill aggregates data that orchestrator can load

**KEEP if:**
- Complex external API call (fetch-calendar)
- Actual file operations (archive-*, write-*, append-*)
- Semantic transformations (extract-to-areas, update-semantic)
- External system integration (project-sync-*)
- Presentation logic (apply-writing-style)

### Migration Complexity

**Low:** planning-* skills (mostly context loading)
**Medium:** review-daily (some archive logic)
**High:** review-weekly, review-monthly, review-quarterly, review-yearly (complex phase structure)

## Implementation Order

1. **Verify planning-daily** as canonical reference
2. **Delete redundant _sub/ skills** (Phase 1) - removes clutter
3. **Migrate review-daily** (Phase 2) - most frequently used
4. **Migrate weekly** (Phase 3) - next most frequent
5. **Migrate monthly** (Phase 4)
6. **Migrate quarterly/yearly** (Phases 5-6) - recently refactored
7. **Review commands** (Phase 7) - lower priority
8. **Update docs** (Phase 8) - reflects all changes
9. **Note worktrees** (Phase 9) - will sync automatically

## Risk Mitigation

- Keep one old skill (review-weekly) as reference until all migrations complete
- Test each migration with actual ritual execution
- Verify fetch-calendar still works after cleanup
- Check that archive-* skills still get called properly
- Ensure semantic operations (extract-to-areas, update-semantic) remain functional
