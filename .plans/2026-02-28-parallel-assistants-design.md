# Parallel Assistant Execution - Design Document

**Date:** 2026-02-28
**Status:** Approved
**Approach:** Draft-and-Fill Architecture

---

## Motivation

Convert Ada's sequential assistant execution to parallel execution for:
- **Performance** - Reduce ritual execution time by ~70-80%
- **Architectural elegance** - Reflect that assistants are conceptually independent

---

## Architecture Overview

### Current State (Sequential)

```
Ada → Goals Assistant (interact) → output
    → Calendar Assistant (interact) → output
    → Journal Assistant (interact) → output
    → Projects Assistant (interact) → output
    → ... etc
    → Compose all outputs
```

### Target State (Parallel Draft-and-Fill)

```
Ada → Spawn all assistants in parallel
    ↓
    ├─ Goals Agent → draft with placeholders
    ├─ Calendar Agent → draft with placeholders
    ├─ Journal Agent → draft with placeholders
    └─ ... etc
    ↓
Ada collects all drafts
    ↓
Ada extracts all placeholders
    ↓
Ada intelligently orders questions
    ↓
Ada asks user questions, collects answers
    ↓
Ada fills placeholders with answers
    ↓
Ada composes final note from filled sections
```

### Key Architectural Changes

1. **Assistants become autonomous agents** - Each runs independently using Agent tool with `run_in_background: true`
2. **Output shifts from interactive to declarative** - Assistants write draft sections with placeholders, not final content
3. **Ada gains orchestration intelligence** - She decides question order based on draft analysis
4. **Single composition point** - All placeholders filled before final compose
5. **Graceful degradation** - Failed agents don't block ritual completion

---

## Placeholder Format

### Syntax

Assistants use HTML comment syntax for placeholders:

```markdown
## Goals

Based on your week goals, here's what I recommend focusing on:

<!-- ASK:goals-top-priority
What's your #1 priority for today?
-->

Your meetings today:
- 9am: Sprint Planning
- 2pm: 1:1 with Sarah

<!-- ASK:calendar-prep-focus
Which meeting needs the most preparation?
-->
```

### Structure

Each placeholder contains:
- **Unique ID** (e.g., `goals-top-priority`) - for tracking and filling
- **Question text** - what Ada asks the user
- **Optional metadata** (future: required/optional, dependencies)

### Rationale for HTML Comments

- Native markdown - doesn't break rendering
- Invisible to user if accidentally viewed before filling
- Easy to parse with regex: `<!-- ASK:(\S+)\n(.*?)\n-->`
- Doesn't interfere with template structure

### Example After Filling

```markdown
## Goals

Based on your week goals, here's what I recommend focusing on:

Launch the new feature - this is blocking the team.

Your meetings today:
- 9am: Sprint Planning
- 2pm: 1:1 with Sarah

Sprint Planning needs prep - need to review the backlog first.
```

---

## Agent Implementation

### Agent Output Location

Each assistant agent writes its draft to:
```
vault/00_Brain/Synthetic/Assistants/{assistant-name}/{timescale}-draft.md
```

Examples:
- `Synthetic/Assistants/goals/daily-draft.md`
- `Synthetic/Assistants/calendar/weekly-draft.md`
- `Synthetic/Assistants/journal/quarterly-draft.md`

### Agent Transformation

Each assistant's `plan/{timescale}.md` and `reflect/{timescale}.md` needs to:

1. **Load context** - Read vault (higher timescales, relevant files)
2. **Analyze** - Synthesize what it knows from existing data
3. **Generate draft** - Write template section with placeholders for unknowns
4. **Write output** - Save to `Synthetic/Assistants/{name}/{timescale}-draft.md`

**Example transformation:**

**Before (interactive mode):**
```markdown
Ask the user: "What's your top priority today?"
Record their answer in the Goals section.
```

**After (draft mode):**
```markdown
Load Week.md to see weekly goals.
Identify potential priorities from week context.
Write draft:
  - Show weekly goal context
  - Add placeholder: <!-- ASK:goals-top-priority
    What's your #1 priority today?
    -->
```

### Agent Launch

Ada uses the Agent tool to spawn all assistants in parallel:

```
Single message with multiple Agent calls:

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run _assistant-goals plan daily in draft mode"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run _assistant-calendar plan daily in draft mode"
)

... etc for all assistants
```

All agents launch simultaneously for true parallelism.

---

## Ada's Orchestration Logic

### Phase 1: Draft Collection

1. **Launch all agents** - Single message with multiple Agent calls
2. **Wait for completion** - Use TaskOutput to collect results
3. **Handle failures** - If agent fails, note it and continue with others
4. **Read drafts** - Load all `Synthetic/Assistants/*/daily-draft.md` files

### Phase 2: Placeholder Extraction

Parse all drafts to build a question map:

```
Regex: <!-- ASK:(\S+)\n(.*?)\n-->

Result:
{
  "goals-top-priority": "What's your #1 priority today?",
  "calendar-prep-focus": "Which meeting needs most preparation?",
  "journal-energy": "How's your energy level right now?",
  ...
}
```

### Phase 3: Intelligent Question Ordering

Ada decides question order using heuristics:

1. **Context-setting first** - Broad questions (energy, mindset) before specific ones
2. **Dependency awareness** - If one answer informs another, order accordingly
3. **Natural flow** - Group related questions (all calendar, then all goals)
4. **Domain coherence** - Keep assistant questions together when it makes sense

Example ordering:
```
1. Journal questions (set emotional context)
2. Goals questions (establish priorities)
3. Calendar questions (tactical planning)
4. Projects questions (execution details)
5. Relationships questions (touchpoint planning)
6. Achievements questions (win capture)
```

Ada has discretion to adapt based on context and conversation flow.

### Phase 4: User Interaction

Ada conducts the conversation:
- Asks questions in the determined order
- Provides context from draft analysis
- Collects and validates answers
- Maps each answer to its placeholder ID

### Phase 5: Placeholder Filling

After collecting all answers:

1. For each draft file in `Synthetic/Assistants/*/{timescale}-draft.md`:
2. Load the draft content
3. Replace each `<!-- ASK:id\n...\n-->` with corresponding answer text
4. Write filled content back to draft file

---

## Composition Phase

### Loading Filled Sections

Ada reads all filled drafts in section order:

1. Read `vault/00_Brain/Systemic/Ada/section-order.md`
2. For each assistant in order:
   - Read `Synthetic/Assistants/{assistant}/{timescale}-draft.md`
   - Extract the section content (e.g., "## Goals" section)
3. Collect all sections in order

### Assembling Final Note

**For plan rituals:**
1. Load `ada/templates/{timescale}.md` (base template with frontmatter, navigation, changelog)
2. Insert filled sections in defined order
3. Write to `vault/00_Brain/Captive/{working-note}.md`:
   - Daily → Today.md
   - Weekly → Week.md
   - Quarterly → Quarter.md
   - Yearly → Year.md

**For reflect rituals:**
1. Load `ada/templates/{timescale}.md` (base template)
2. Insert filled sections in defined order
3. Write to `vault/00_Brain/Periodic/{archive}/`:
   - Daily → Daily/YYYY-MM-DD.md
   - Weekly → Weekly/YYYY-Www.md
   - Quarterly → Quarterly/YYYY-QN.md
   - Yearly → Yearly/YYYY.md

### Handling Missing Sections

If an assistant agent failed or produced empty output:
- Skip that section in composition
- Add note at bottom: "Note: {Assistant} section unavailable due to error"
- Continue with remaining sections

---

## Error Handling & Edge Cases

### Agent Failures

**Timeout handling:**
- Default timeout: 2 minutes per agent
- If agent times out: log warning, continue with others
- User sees: "Calendar section unavailable (timeout)"

**Error handling:**
- If agent throws error: capture it, continue with others
- Ada reports: "Goals assistant encountered an error: {brief message}"
- Partial results still usable if agent wrote draft before failing

### Placeholder Issues

**Unfilled placeholders:**
- If Ada misses filling a placeholder (bug or user skip):
  - Leave placeholder visible in final note
  - User can manually edit or re-run ritual
  - Example: `<!-- ASK:goals-priority\nWhat's your top priority?\n-->` remains

**Duplicate IDs:**
- If two assistants use same placeholder ID: Ada fills with same answer
- Design assumption: IDs scoped by assistant (e.g., `goals-priority` vs `calendar-priority`)
- If collision detected: Ada warns but proceeds

**Malformed placeholders:**
- If placeholder doesn't match regex:
  - Ada logs warning but doesn't fail
  - Content appears in final note as-is
  - Example: `<!-- ASK missing colon -->` shows as comment

### Empty Drafts

If assistant produces empty draft:
- Ada skips that section in composition
- Reports: "{Assistant} produced no content"
- Common case: Calendar assistant when no meetings scheduled

### Recovery

If entire ritual fails mid-process:
- Draft files persist in `Synthetic/Assistants/`
- User can inspect what was generated
- Can manually compose or re-run ritual
- No data loss

---

## Testing Strategy

### Unit Testing

**Assistant draft generation:**
- Test each assistant in isolation
- Verify draft output format
- Check placeholder syntax correctness
- Validate context loading (reads correct files)

**Placeholder parsing:**
- Test regex extraction on various formats
- Verify ID uniqueness detection
- Test malformed placeholder handling

**Placeholder filling:**
- Test replacement logic
- Verify multiline answers work
- Test edge cases (empty answers, special characters)

### Integration Testing

**Full ritual flow:**
- Run daily plan ritual end-to-end
- Verify all assistants launch in parallel
- Check final composed note structure
- Confirm all placeholders filled

**Error scenarios:**
- Test with one agent failing
- Test with multiple agent failures
- Test with missing vault files
- Verify graceful degradation

### Performance Testing

**Parallelism validation:**
- Measure sequential time (current architecture)
- Measure parallel time (new architecture)
- Verify actual speedup (target: ~70-80% faster)
- Check that agents actually run concurrently (not accidentally sequential)

**Metrics to track:**
- Individual agent execution time
- Total parallel execution time
- Question ordering quality
- Composition phase time

### Manual Testing

**User experience:**
- Test question flow feels natural
- Verify Ada's ordering makes sense
- Check that context from drafts enriches questions
- Test on all timescales (daily, weekly, quarterly, yearly)
- Test all ritual types (plan and reflect)

---

## Migration & Rollout Strategy

### Phased Rollout

**Phase 1: Foundation (Week 1)**
- Add placeholder parsing logic to Ada
- Create draft mode support in assistant protocol
- Test with single assistant (calendar - simplest one)
- Validate draft-and-fill cycle works

**Phase 2: Parallel Infrastructure (Week 2)**
- Add Agent tool launching logic to Ada
- Implement background agent collection
- Test with 2-3 assistants in parallel
- Verify error handling for failures

**Phase 3: Full Migration (Week 3)**
- Convert all assistants to draft mode
- Update all plan/{timescale}.md and reflect/{timescale}.md files
- Test all timescales (daily, weekly, quarterly, yearly)
- Performance validation

**Phase 4: Polish (Week 4)**
- Refine Ada's question ordering logic
- Optimize agent timeout settings
- Update documentation
- Remove old sequential code paths

### Backward Compatibility

**During transition:**
- Keep both modes available: `draft_mode: true/false` flag
- Default to sequential (current) until all assistants migrated
- Allow per-assistant migration (some parallel, some sequential)

**Feature flag:**
```yaml
# vault/00_Brain/Systemic/Config/ada.yaml
parallel_execution: false  # switch to true when ready
```

### Rollback Plan

If parallel execution causes issues:
1. Set `parallel_execution: false` in config
2. Falls back to sequential execution
3. Draft files remain but unused
4. No data loss - rituals continue working

### Documentation Updates

Files to update:
- `.claude/skills/ada/SKILL.md` - document draft mode
- `.claude/skills/_assistant-*/SKILL.md` - update with draft mode behavior
- `docs/ada/how-ada-works.md` - explain parallel execution
- `docs/reference/creating-custom-assistants.md` - placeholder syntax guide
- `CLAUDE.md` - add any new rules or patterns

---

## File Changes Summary

### New Files
- None - uses existing file structure

### Modified Files

**Ada orchestration:**
- `.claude/skills/ada/references/plan/daily.md` - add parallel launch + orchestration
- `.claude/skills/ada/references/plan/weekly.md` - add parallel launch + orchestration
- `.claude/skills/ada/references/plan/quarterly.md` - add parallel launch + orchestration
- `.claude/skills/ada/references/plan/yearly.md` - add parallel launch + orchestration
- `.claude/skills/ada/references/reflect/daily.md` - add parallel launch + orchestration
- `.claude/skills/ada/references/reflect/weekly.md` - add parallel launch + orchestration
- `.claude/skills/ada/references/reflect/quarterly.md` - add parallel launch + orchestration
- `.claude/skills/ada/references/reflect/yearly.md` - add parallel launch + orchestration

**Assistant implementations (7 assistants × 2 actions × 4 timescales = 56 files):**
- `.claude/skills/_assistant-goals/plan/*.md` - convert to draft mode
- `.claude/skills/_assistant-goals/reflect/*.md` - convert to draft mode
- `.claude/skills/_assistant-calendar/plan/*.md` - convert to draft mode
- `.claude/skills/_assistant-calendar/reflect/*.md` - convert to draft mode
- `.claude/skills/_assistant-journal/plan/*.md` - convert to draft mode
- `.claude/skills/_assistant-journal/reflect/*.md` - convert to draft mode
- `.claude/skills/_assistant-achievements/plan/*.md` - convert to draft mode
- `.claude/skills/_assistant-achievements/reflect/*.md` - convert to draft mode
- `.claude/skills/_assistant-relationships/plan/*.md` - convert to draft mode
- `.claude/skills/_assistant-relationships/reflect/*.md` - convert to draft mode
- `.claude/skills/_assistant-projects/plan/*.md` - convert to draft mode
- `.claude/skills/_assistant-projects/reflect/*.md` - convert to draft mode

**Documentation:**
- `docs/ada/how-ada-works.md` - explain parallel execution
- `docs/reference/creating-custom-assistants.md` - placeholder syntax
- `.claude/skills/ada/SKILL.md` - draft mode documentation
- `.claude/skills/_assistant-*/SKILL.md` - update descriptions

---

## Success Criteria

### Performance
- [ ] Ritual execution time reduced by 70-80%
- [ ] All assistants run in parallel (not sequential)
- [ ] Agent failures don't block ritual completion

### Functionality
- [ ] All placeholders filled correctly
- [ ] Final notes have same structure as before
- [ ] User interaction feels natural
- [ ] Error handling works gracefully

### Quality
- [ ] No data loss on failures
- [ ] All timescales work (daily, weekly, quarterly, yearly)
- [ ] Both plan and reflect rituals work
- [ ] Documentation updated and clear

### User Experience
- [ ] Question ordering feels intelligent
- [ ] Context from drafts enriches conversation
- [ ] No confusing prompts or errors
- [ ] Rituals complete successfully

---

## Open Questions

None - all design questions resolved during brainstorming.

---

## Next Steps

1. Create implementation plan (invoke writing-plans skill)
2. Begin Phase 1: Foundation work
3. Test with single assistant
4. Iterate and expand to all assistants
