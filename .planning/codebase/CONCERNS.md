# Codebase Concerns

**Analysis Date:** 2026-02-28

## Tech Debt

### External File Path Dependencies in Skill Logic

**Issue:** Multiple skill references depend on vault folder structure and external file paths that must exist at runtime. The system assumes a specific directory structure (e.g., `vault/00_Brain/Systemic/Ada/section-order.md`, `vault/00_Brain/Systemic/Directives/human.md`) but these are user-managed files, not code-controlled.

- Files: `/.claude/skills/ada/references/compose/compose.md` (line 12), `/.claude/skills/ada/references/compose/assembly.md` (line 16), `/.claude/skills/ada/references/setup/init.md` (lines 31-33)
- Impact: If a user moves or deletes key vault files, Ada operations silently fail or skip sections with no clear error message
- Fix approach: Add explicit file existence checks at the start of compose and plan sequences with user-facing warnings

### Implicit Dependencies on Vault File Names

**Issue:** Skills reference files by exact name (e.g., `section-order.md`, `assistants.yaml`) without checking for existence first. Typos or renamed files break workflows.

- Files: `/.claude/skills/ada/references/compose/compose.md` (lines 12, 20)
- Impact: Compose fails to load section ordering or assistant configuration, resulting in incomplete or missing sections in output
- Fix approach: Create a vault validation phase that runs at the start of Ada setup and before each ritual

### Fragile Entity Learning Persistence

**Issue:** Reflect workflows persist entity learnings by appending to `## Insights` sections in vault files, but assumes these sections exist and uses simple append logic without conflict detection.

- Files: `/.claude/skills/ada/references/reflect/daily.md` (lines 37-42), `/.claude/skills/ada/references/reflect/quarterly.md` (lines 37-42)
- Impact: If a user manually edits the Insights section or the file structure changes, learnings may not persist correctly or may corrupt existing insights
- Fix approach: Add explicit section creation/validation and use merge logic instead of append

### State Inconsistency Between Ritual Actions

**Issue:** Plan and Reflect rituals both generate output files but the assembly logic in compose assumes specific file locations and naming conventions. If an assistant output file is missing or malformed, the entire composition can fail.

- Files: `/.claude/skills/ada/references/compose/assembly.md` (lines 26-31), `/.claude/skills/ada/references/compose/compose.md` (lines 10-24)
- Impact: A single assistant failure during planning can result in missing sections in the final Captive file with no clear recovery path
- Fix approach: Implement graceful section substitution and provide detailed audit log of what was included/excluded

## Known Bugs

### Missing Vault Validation on Config

**Bug description:** The init flow checks for directives existence but doesn't validate that the vault path actually points to a valid Second Brain structure before proceeding with scaffold copy.

- Symptoms: User provides invalid path → scaffold copies but to wrong location → subsequent rituals read from wrong location
- Files: `/.claude/skills/ada/references/setup/init.md` (lines 51, 55)
- Trigger: Run Ada setup, provide path that exists but isn't a valid vault structure
- Workaround: Manually verify vault path and check for 00_Brain/Systemic directory before running other rituals

### Brief Synthesis Dependencies Not Documented

**Bug description:** The compose process mentions reading from `vault/00_Brain/Captive/Week.md` (weekly focus) but this file may not exist if user hasn't done a weekly plan yet.

- Symptoms: Daily plan compose fails to synthesize brief because source file doesn't exist
- Files: `/.claude/skills/ada/references/compose/compose.md` (line 29)
- Trigger: Run daily plan before running weekly plan
- Workaround: Create basic Week.md file in vault/00_Brain/Captive/ before first daily plan

### Timescale Declaration Not Enforced

**Bug description:** The timescales spec in `_specs/timescales.md` notes that IDE warnings about unsupported attributes are expected, but there's no runtime validation that a SKILL.md frontmatter actually declares required timescales correctly.

- Symptoms: Ada calls an assistant with a timescale it doesn't support (because frontmatter declaration was missing), assistant returns error
- Files: `/.claude/skills/_specs/timescales.md` (line 32), `/.claude/skills/ada/SKILL.md` (lines 40-49)
- Trigger: Manually edit an assistant's SKILL.md and forget to update timescales array
- Workaround: Always check assistant SKILL.md frontmatter before adding to plan/reflect sequences

## Security Considerations

### Vault Path Stored in Plain Text Config

**Risk:** The vault path is stored in `.claude/config.md` in plain text. If this file is committed (which it shouldn't be), it exposes user's system paths.

- Files: `/.claude/config.md`, `/.claude/config.md.template`
- Current mitigation: `.claude/` is not in main codebase commits (based on git history), but the template exists
- Recommendations:
  - Add `.claude/config.md` to root `.gitignore` if not already there
  - Document that this file is user-specific and must not be committed
  - Consider encrypting the vault path or storing it in a system keychain

### Custom Directives May Contain Sensitive Information

**Risk:** User profile directive files (`human.md`, `ada.md`) may contain sensitive personal or professional information about the user, their goals, or coaching insights.

- Files: `vault/00_Brain/Systemic/Directives/human.md` and `ada.md` (user-managed, not in this repo)
- Current mitigation: These are in user's vault, not in the 2bd repository
- Recommendations:
  - Document in setup flow that these files are sensitive and should be excluded from any cloud backups that aren't encrypted
  - Add note to README about vault security best practices

## Performance Bottlenecks

### Sequential Assistant Execution with No Parallelization

**Problem:** All plan/reflect sequences execute assistants one-at-a-time, waiting for each to complete before starting the next. For daily plans with 6 assistants + compose + 6 learn assistants = 13 sequential calls.

- Files: `/.claude/skills/ada/references/plan/daily.md`, `/.claude/skills/ada/references/reflect/daily.md`
- Cause: Sequences are defined as linear lists with no parallel execution capability in Claude Code skill system
- Improvement path:
  - Investigate if Claude Code supports concurrent skill invocation
  - If not, consider grouping independent assistants (e.g., goals + calendar can run in parallel) and redesigning sequence structure

### Vault File I/O on Every Ritual

**Problem:** Each ritual reads multiple vault files (section-order.md, assistants.yaml, coaching context files) sequentially. For daily rituals, this happens every morning.

- Files: `/.claude/skills/ada/references/compose/compose.md` (lines 12, 20, 29-30)
- Cause: No caching mechanism for vault configuration between ritual invocations
- Improvement path:
  - Cache vault configuration in memory or in a temp file during ritual execution
  - Implement vault change detection to invalidate cache only when files actually change

## Fragile Areas

### Compose Assembly Logic

**Component/Module:** Assembly and composition of assistant outputs into Captive files

- Files: `/.claude/skills/ada/references/compose/assembly.md`, `/.claude/skills/ada/references/compose/compose.md`
- Why fragile:
  - Depends on exact section heading format (`## Section`) in assistant outputs
  - Depends on section order file existing and being formatted correctly
  - Depends on all assistant outputs being present (no graceful degradation)
  - Brief synthesis pulls from multiple sources that may not exist
- Safe modification:
  - Always test with missing assistant output files
  - Add detailed logging of what sections were found/skipped
  - Create test vault structure to validate before pushing changes
- Test coverage: Not applicable (skill-based system, no unit tests)

### Setup Initialization and Vault Scaffolding

**Component/Module:** Ada setup flow and vault structure creation

- Files: `/.claude/skills/ada/references/setup/init.md`
- Why fragile:
  - Creates new directory structure in user's vault that could overwrite existing files
  - No rollback mechanism if scaffolding fails halfway through
  - Assumes all templates are present in `assets/scaffold/`
- Safe modification:
  - Always validate that source templates exist before copying
  - Create backup of target directory before scaffolding
  - Log all file operations for audit trail
- Test coverage: Must be tested with fresh vault paths and with pre-existing structures

### Entity Learning Aggregation During Reflect

**Component/Module:** Collecting and persisting entity learnings from reflect workflows

- Files: `/.claude/skills/ada/references/reflect/daily.md` (lines 22-42), and similar in weekly/quarterly/yearly
- Why fragile:
  - Assumes all assistants return findings with specific section format
  - Appends to user entity files without merge conflict detection
  - No validation that entity files exist before appending
- Safe modification:
  - Add existence checks for entity files before append operations
  - Implement conflict detection when multiple learnings target same entity
  - Store learnings in staging area first, then commit after user review
- Test coverage: Test with entities that have existing insights and new learnings

## Scaling Limits

### Linear Growth of Assistants Increases Ritual Duration

**Resource/System:** Number of domain assistants in plan/reflect sequences

- Current capacity: 6 assistants + compose + 6 learn = 13 sequential skill invocations per reflect cycle
- Limit: Each additional assistant adds sequential time to the ritual. Daily rituals could exceed 5-10 minutes per assistant
- Scaling path:
  - Implement assistant groups that can run in parallel
  - Add caching for unchanged entities (people, projects) that don't need re-evaluation every ritual
  - Consider lazy evaluation for learn phase (only run on weekly/quarterly reflects)

### Vault Structure Assumed Linear

**Resource/System:** Vault directory structure and file organization

- Current capacity: Linear folder structure with categories (People, Projects, Areas)
- Limit: No hierarchical organization; adding subcategories breaks path assumptions
- Scaling path:
  - Document vault structure as a contract in `_specs/vault-structure.md`
  - Implement path resolution function that can handle variations
  - Allow configuration of top-level category names

## Dependencies at Risk

### OneDrive Symlink Architecture

**Risk:** The system relies on `vault/` being a symlink to user's OneDrive Second Brain folder. OneDrive sync issues or path changes break the entire system.

- Impact: Any OneDrive outage or sync failure prevents Ada from reading/writing to vault
- Migration plan:
  - Add abstraction layer for vault access that doesn't hardcode OneDrive
  - Support local folder sync tools as alternatives
  - Document how to update vault path in `.claude/config.md`

### Custom Frontmatter in SKILL.md

**Risk:** The timescales frontmatter attribute is custom and not part of Claude Code's official skill schema. Future Claude Code versions may not parse it correctly.

- Impact: If Claude Code updates its SKILL.md parser, the `timescales` attribute could be silently ignored
- Migration plan:
  - Move timescale declarations to separate YAML config files in each skill directory
  - Add validation script that checks all skills for missing timescale configs
  - Document this as non-standard and why it's necessary

## Missing Critical Features

### No Ritual Scheduling or Automation

**Feature gap:** Ada rituals must be manually invoked. There's no scheduling mechanism to prompt for daily/weekly/quarterly reflects.

- Problem: Users forget to run rituals; insights gap from missed periods
- Blocks: Can't provide proactive coaching or notifications

### No Conflict Detection in Vault Modifications

**Feature gap:** Multiple rituals could theoretically modify the same entity file concurrently if Ada runs while user is editing.

- Problem: Last-write-wins could lose user edits or learnings
- Blocks: Can't reliably persist entity learnings in multi-user or multi-session scenarios

### No Ritual Audit Trail

**Feature gap:** While compose writes logs, there's no persistent audit of all ritual invocations and their outcomes.

- Problem: User can't see which assistants failed or which sections were skipped
- Blocks: Can't debug why specific sections are missing from periodic files

## Test Coverage Gaps

### Vault Structure Validation

**Untested area:** Initialization with incomplete or corrupted vault structures

- What's not tested:
  - Setup when vault path already has partial directory structure
  - Setup when template files are missing from `.claude/skills/ada/assets/scaffold/`
  - Rituals when vault files are deleted during execution
- Files: `/.claude/skills/ada/references/setup/init.md`, `/.claude/skills/ada/references/compose/compose.md`
- Risk: Users with unusual vault configurations could encounter silent failures
- Priority: High — affects first-run experience

### Assistant Output Format Variations

**Untested area:** Assistants that produce non-standard output formats

- What's not tested:
  - Assistant returns no `## Section` heading
  - Assistant returns malformed YAML in status field
  - Assistant returns extremely long sections that exceed file system limits
- Files: `/.claude/skills/ada/references/compose/assembly.md`
- Risk: Malformed assistant output could corrupt Captive files
- Priority: High — affects data integrity

### Error Recovery Paths

**Untested area:** What happens when individual assistants fail during rituals

- What's not tested:
  - Assistant timeout/network error during daily plan
  - Compose fails after some assistants succeed
  - Learn phase fails after reflect completes
- Files: `/.claude/skills/ada/references/plan/daily.md`, `/.claude/skills/ada/references/reflect/daily.md`
- Risk: Partial state (some sections written, some missing) with no clear recovery mechanism
- Priority: Medium — error handling exists but recovery paths unclear

### Entity Learning Persistence Edge Cases

**Untested area:** Persisting learnings to entity files in various states

- What's not tested:
  - Entity file missing when appending insights
  - Entity file without `## Insights` section
  - Multiple learnings appending to same entity in single ritual
  - User manually editing entity file while ritual is running
- Files: `/.claude/skills/ada/references/reflect/daily.md` (lines 37-42)
- Risk: Lost learnings or corrupted entity files
- Priority: Medium — affects long-term value accumulation

---

*Concerns audit: 2026-02-28*
