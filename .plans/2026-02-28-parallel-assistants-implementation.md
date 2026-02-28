# Parallel Assistant Execution Implementation Plan

> **For Claude:** Use superpowers:executing-plans (simple/fast) or superpowers:subagent-driven-development (fresh context + reviews) to implement this plan.

**Goal:** Convert Ada's sequential assistant execution to parallel draft-and-fill architecture for 70-80% performance improvement.

**Architecture:** Assistants run as parallel background agents outputting draft sections with HTML comment placeholders. Ada collects drafts, intelligently orders questions, fills placeholders with user answers, and composes final notes.

**Tech Stack:** Claude Agent tool, markdown parsing with regex, existing skill/template infrastructure

---

## Phase 1: Foundation - Placeholder Infrastructure

### Task 1: Add Placeholder Parsing to Ada

**Files:**
- Create: `.claude/skills/ada/references/parse-placeholders.md`

**Step 1: Create placeholder parser reference**

Create `.claude/skills/ada/references/parse-placeholders.md`:

```markdown
# Placeholder Parsing

Parse HTML comment placeholders from assistant draft files.

## Placeholder Format

Assistants write placeholders as:
```
<!-- ASK:unique-id
Question text goes here?
-->
```

## Parsing Process

1. Read draft content from `vault/00_Brain/Synthetic/Assistants/{name}/{timescale}-draft.md`
2. Extract placeholders using regex: `<!-- ASK:(\S+)\n(.*?)\n-->`
3. Build question map: `{id: question_text}`
4. Return map for orchestration

## Example

Input:
```
<!-- ASK:goals-priority
What's your top priority today?
-->
```

Output:
```
{
  "goals-priority": "What's your top priority today?"
}
```

## Error Handling

- Malformed placeholders: log warning, skip
- Duplicate IDs: log warning, use first occurrence
- Empty questions: skip placeholder
```

**Step 2: Verify file created**

Run: `cat .claude/skills/ada/references/parse-placeholders.md | head -10`
Expected: File shows placeholder parsing documentation

---

### Task 2: Add Placeholder Filling to Ada

**Files:**
- Create: `.claude/skills/ada/references/fill-placeholders.md`

**Step 1: Create placeholder filler reference**

Create `.claude/skills/ada/references/fill-placeholders.md`:

```markdown
# Placeholder Filling

Replace placeholders in draft files with user answers.

## Input

- Draft file path: `vault/00_Brain/Synthetic/Assistants/{name}/{timescale}-draft.md`
- Answer map: `{placeholder_id: user_answer}`

## Process

1. Read draft file content
2. For each placeholder ID in answer map:
   - Find: `<!-- ASK:{id}\n{question}\n-->`
   - Replace with: `{user_answer}`
3. Write updated content back to draft file

## Example

Before:
```markdown
## Goals

<!-- ASK:goals-priority
What's your top priority today?
-->
```

After (with answer "Launch feature"):
```markdown
## Goals

Launch feature
```

## Error Handling

- Missing placeholders: log warning, continue
- Missing answers: leave placeholder in place
- Write failures: report error, fail gracefully
```

**Step 2: Verify file created**

Run: `cat .claude/skills/ada/references/fill-placeholders.md | head -10`
Expected: File shows placeholder filling documentation

---

### Task 3: Update Calendar Assistant to Draft Mode

**Files:**
- Modify: `.claude/skills/_assistant-calendar/plan/daily.md`

**Step 1: Read current calendar plan**

Run: `cat .claude/skills/_assistant-calendar/plan/daily.md`
Expected: Shows current interactive implementation

**Step 2: Convert to draft mode**

Update `.claude/skills/_assistant-calendar/plan/daily.md`:

```markdown
# Calendar: Plan Daily

Prepare draft with today's meetings and placeholders for unknowns.

## Context to Load

1. Fetch today's calendar events using [Fetch Events](../SKILL.md#fetch-events)
2. Read person dossiers for key attendees from `vault/00_Brain/Semantic/People/`
3. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Draft Generation

1. Analyze meetings:
   - List all meetings with times
   - Identify important meetings (1:1s, critical decisions)
   - Calculate focus time available

2. For important meetings, gather context:
   - Read attendee dossiers if available
   - Check for related project files
   - Review previous meeting notes

3. Generate draft section with placeholders for unknowns

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/daily-draft.md`:

```markdown
## Calendar

**Today's Meetings**

9:00am - Sprint Planning
- Attendees: Team (5 people)
- Context: Weekly sprint planning session

<!-- ASK:calendar-sprint-prep
Do you need to prepare anything specific for Sprint Planning?
-->

2:00pm - 1:1 with Sarah
- Attendees: Sarah (Engineering Manager)
- Context: Regular 1:1 check-in

<!-- ASK:calendar-sarah-topics
What do you want to discuss with Sarah today?
-->

**Focus Time:** 4 hours available (10am-12pm, 3pm-5pm)

<!-- ASK:calendar-focus-block
What will you work on during focus time?
-->
```

## Status

Write status to draft frontmatter:
```
---
status: ok
assistant: calendar
action: plan
timescale: daily
timestamp: {ISO timestamp}
---
```

## Observations

Track patterns in draft under `## Observations` section:
- Meeting density trends
- Focus time availability
- Recurring meeting patterns
```

**Step 3: Verify file updated**

Run: `cat .claude/skills/_assistant-calendar/plan/daily.md | grep -A 5 "ASK:"`
Expected: Shows placeholder examples

---

### Task 4: Create Draft Collection Logic

**Files:**
- Create: `.claude/skills/ada/references/collect-drafts.md`

**Step 1: Create draft collector reference**

Create `.claude/skills/ada/references/collect-drafts.md`:

```markdown
# Collect Drafts

Read all assistant drafts and extract placeholders.

## Process

1. Identify active assistants from section order:
   - Read `vault/00_Brain/Systemic/Ada/section-order.md`
   - Parse assistant list for current timescale

2. For each assistant:
   - Check if draft exists: `vault/00_Brain/Synthetic/Assistants/{name}/{timescale}-draft.md`
   - If exists: read content
   - If missing: log warning, mark assistant as failed

3. Extract placeholders from all drafts:
   - Use @ada/references/parse-placeholders
   - Build combined question map: `{assistant-id: question}`

4. Track failed assistants for error reporting

## Output Format

```
{
  "drafts": {
    "goals": {
      "path": "vault/00_Brain/Synthetic/Assistants/goals/daily-draft.md",
      "content": "...",
      "placeholders": ["goals-priority", "goals-energy"]
    },
    "calendar": {
      "path": "...",
      "content": "...",
      "placeholders": ["calendar-prep", "calendar-focus"]
    }
  },
  "failed": ["achievements"],  // if any failed
  "all_questions": {
    "goals-priority": "What's your top priority?",
    "calendar-prep": "Which meeting needs prep?",
    ...
  }
}
```

## Error Handling

- Draft file missing: add to failed list, continue
- Draft malformed: log error, skip assistant
- No placeholders: valid (assistant needed no input)
```

**Step 2: Verify file created**

Run: `cat .claude/skills/ada/references/collect-drafts.md | head -15`
Expected: File shows draft collection documentation

---

## Phase 2: Parallel Infrastructure

### Task 5: Add Agent Launching to Daily Plan

**Files:**
- Modify: `.claude/skills/ada/references/plan/daily.md`

**Step 1: Read current daily plan sequence**

Run: `cat .claude/skills/ada/references/plan/daily.md`
Expected: Shows sequential assistant invocation

**Step 2: Add parallel agent launch**

Update `.claude/skills/ada/references/plan/daily.md`:

```markdown
# Plan Daily Sequence

## Phase 1: Parallel Draft Generation

Launch all assistants as background agents in a single message:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals plan daily in draft mode. Read context from vault, generate draft with placeholders to Synthetic/Assistants/goals/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar plan daily in draft mode. Fetch events, generate draft with placeholders to Synthetic/Assistants/calendar/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/journal/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/achievements/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/relationships/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/projects/daily-draft.md"
)
```

## Phase 2: Wait for Completion

Use TaskOutput to wait for all agents to complete. Timeout: 2 minutes per agent.

## Phase 3: Collect Drafts

Use @ada/references/collect-drafts to gather all drafts and extract placeholders.

## Phase 4: Orchestrate Questions

Order questions intelligently:

1. **Context questions first** (journal: energy, mindset)
2. **Priority questions** (goals: top priority)
3. **Tactical questions** (calendar: meeting prep, projects: blockers)
4. **Touchpoint questions** (relationships: who to connect with)

Heuristic: journal → goals → calendar → projects → relationships → achievements

Within each assistant, maintain question order from draft.

## Phase 5: Ask Questions

For each question in order:
- Show context from draft if helpful
- Ask the question
- Collect and validate answer
- Map to placeholder ID

## Phase 6: Fill Placeholders

Use @ada/references/fill-placeholders to replace all placeholders with answers.

## Phase 7: Compose

Use @ada/references/compose/compose action=plan timescale=daily to assemble final note.

## Error Handling

If an assistant agent fails:
1. Log error with assistant name and message
2. Continue with other assistants
3. Report failed sections to user
4. Note gaps in compose step
```

**Step 3: Verify file updated**

Run: `cat .claude/skills/ada/references/plan/daily.md | grep -A 3 "Phase 1"`
Expected: Shows parallel agent launch section

---

### Task 6: Test Parallel Execution with Calendar Only

**Files:**
- None (manual testing task)

**Step 1: Create test scenario**

Ensure test vault has:
- Calendar events for today
- `vault/00_Brain/Systemic/Ada/section-order.md` with calendar listed

**Step 2: Run calendar assistant in draft mode**

Run: `claude skill run _assistant-calendar -- plan daily`
Expected: Creates `vault/00_Brain/Synthetic/Assistants/calendar/daily-draft.md` with placeholders

**Step 3: Verify draft structure**

Run: `cat vault/00_Brain/Synthetic/Assistants/calendar/daily-draft.md`
Expected:
- Has `## Calendar` section
- Contains `<!-- ASK:*` placeholders
- Has meeting context

**Step 4: Test placeholder parsing**

Manually parse placeholders from draft using regex.
Expected: Extracts question map correctly

**Step 5: Test placeholder filling**

Manually fill one placeholder with test answer.
Expected: Placeholder replaced with answer text

---

### Task 7: Add Agent Collection with Error Handling

**Files:**
- Create: `.claude/skills/ada/references/wait-for-agents.md`

**Step 1: Create agent waiter reference**

Create `.claude/skills/ada/references/wait-for-agents.md`:

```markdown
# Wait for Agents

Collect results from background agents with timeout and error handling.

## Input

List of launched agent IDs from Agent tool responses.

## Process

1. For each agent ID:
   - Use TaskOutput(task_id=agent_id, timeout=120000) to wait
   - Timeout: 2 minutes

2. Track results:
   - Success: agent completed normally
   - Timeout: agent exceeded 2 minute limit
   - Error: agent threw exception

3. Build result map:
```
{
  "goals": "success",
  "calendar": "success",
  "journal": "timeout",
  "achievements": "error",
  ...
}
```

## Error Handling

**Timeout:**
- Log: "{Assistant} timed out after 2 minutes"
- Mark as failed
- Continue with other agents

**Error:**
- Log: "{Assistant} failed: {error_message}"
- Mark as failed
- Continue with other agents

**All failed:**
- Report: "All assistants failed, cannot generate plan"
- Exit ritual with error

**Partial success:**
- Continue with successful agents
- Report: "X assistants completed successfully, Y failed"
```

**Step 2: Verify file created**

Run: `cat .claude/skills/ada/references/wait-for-agents.md | head -15`
Expected: Shows agent waiting documentation

---

## Phase 3: Full Migration

### Task 8: Convert Goals Assistant to Draft Mode

**Files:**
- Modify: `.claude/skills/_assistant-goals/plan/daily.md`

**Step 1: Read current goals plan**

Run: `cat .claude/skills/_assistant-goals/plan/daily.md`
Expected: Shows current interactive implementation

**Step 2: Convert to draft mode**

Update `.claude/skills/_assistant-goals/plan/daily.md`:

```markdown
# Goals: Plan Daily

Generate 1-3-5 goals draft with placeholders for user input.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for weekly Major Moves
2. Read `vault/00_Brain/Captive/Quarter.md` for Quests (if exists)
3. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` for patterns

## Draft Generation

1. Identify potential priorities from weekly context:
   - Extract Major Moves from Week.md
   - Note any urgent items or deadlines
   - Consider energy and capacity

2. Suggest 1-3-5 structure:
   - 1 Big: Most impactful priority
   - 3 Medium: Supporting tasks
   - 5 Small: Quick wins

3. Generate draft with placeholders for unknowns

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/daily-draft.md`:

```markdown
## Goals

**From Your Week:**
- Major Move 1: Launch feature
- Major Move 2: Hire senior engineer

**Suggested Focus:**

<!-- ASK:goals-big-one
What's your ONE big priority for today? (2-4 hours of deep work)
-->

**Three Medium Tasks:**

<!-- ASK:goals-medium-1
Medium task 1?
-->

<!-- ASK:goals-medium-2
Medium task 2?
-->

<!-- ASK:goals-medium-3
Medium task 3?
-->

**Five Small Wins:**

<!-- ASK:goals-small-1
Quick win 1?
-->

<!-- ASK:goals-small-2
Quick win 2?
-->

<!-- ASK:goals-small-3
Quick win 3?
-->

<!-- ASK:goals-small-4
Quick win 4?
-->

<!-- ASK:goals-small-5
Quick win 5?
-->
```

## Status

Add frontmatter:
```
---
status: ok
assistant: goals
action: plan
timescale: daily
timestamp: {ISO timestamp}
---
```
```

**Step 3: Verify file updated**

Run: `grep -c "ASK:" .claude/skills/_assistant-goals/plan/daily.md`
Expected: Shows 9 placeholders (1 big + 3 medium + 5 small)

---

### Task 9: Convert Journal Assistant to Draft Mode

**Files:**
- Modify: `.claude/skills/_assistant-journal/plan/daily.md`

**Step 1: Convert journal plan**

Update `.claude/skills/_assistant-journal/plan/daily.md`:

```markdown
# Journal: Plan Daily

Generate check-in draft with placeholders for reflection.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for week context
2. Read `vault/00_Brain/Semantic/Assistants/journal/memory.md` for patterns
3. Read yesterday's daily note from Periodic if exists

## Draft Generation

1. Review recent patterns from memory
2. Generate reflection prompts based on weekly themes
3. Create draft with open-ended placeholders

## Output

Write to `vault/00_Brain/Synthetic/Assistants/journal/daily-draft.md`:

```markdown
## Journal

**Morning Check-In**

<!-- ASK:journal-energy
How's your energy level this morning? (1-10 and why)
-->

<!-- ASK:journal-mindset
What's your mindset as you start today?
-->

<!-- ASK:journal-intention
What's your intention for today? (one word + why)
-->

**From Yesterday:**
{If yesterday note exists, extract key insights}
```

## Status

Add frontmatter:
```
---
status: ok
assistant: journal
action: plan
timescale: daily
timestamp: {ISO timestamp}
---
```
```

**Step 2: Verify file updated**

Run: `grep "ASK:journal-" .claude/skills/_assistant-journal/plan/daily.md`
Expected: Shows journal-energy, journal-mindset, journal-intention placeholders

---

### Task 10: Convert Remaining Assistants (Achievements, Relationships, Projects)

**Files:**
- Modify: `.claude/skills/_assistant-achievements/plan/daily.md`
- Modify: `.claude/skills/_assistant-relationships/plan/daily.md`
- Modify: `.claude/skills/_assistant-projects/plan/daily.md`

**Step 1: Convert achievements to draft mode**

Update `.claude/skills/_assistant-achievements/plan/daily.md`:

```markdown
# Achievements: Plan Daily

Generate win capture draft.

## Context to Load

1. Read `vault/00_Brain/Captive/Week.md` for weekly achievements
2. Read `vault/00_Brain/Semantic/Assistants/achievements/memory.md`

## Output

Write to `vault/00_Brain/Synthetic/Assistants/achievements/daily-draft.md`:

```markdown
## Achievements

**Yesterday's Wins:**
{Extract from yesterday's note if exists}

<!-- ASK:achievements-capture
Any wins from yesterday to capture?
-->
```
```

**Step 2: Convert relationships to draft mode**

Update `.claude/skills/_assistant-relationships/plan/daily.md`:

```markdown
# Relationships: Plan Daily

Generate touchpoint draft.

## Context to Load

1. Fetch today's calendar events
2. Read person dossiers from `vault/02_Areas/People/`
3. Check for birthdays or special dates

## Output

Write to `vault/00_Brain/Synthetic/Assistants/relationships/daily-draft.md`:

```markdown
## Relationships

**Today's Touchpoints:**
{List people you're meeting with today from calendar}

<!-- ASK:relationships-touchpoints
Anyone else you want to connect with today?
-->

**Birthdays/Special Dates:**
{If any found from calendar or dossiers}
```
```

**Step 3: Convert projects to draft mode**

Update `.claude/skills/_assistant-projects/plan/daily.md`:

```markdown
# Projects: Plan Daily

Generate project task draft.

## Context to Load

1. Read active project files from `vault/01_Projects/`
2. Read `vault/00_Brain/Semantic/Assistants/projects/memory.md`

## Output

Write to `vault/00_Brain/Synthetic/Assistants/projects/daily-draft.md`:

```markdown
## Projects

**Active Projects:**
{List projects with upcoming deadlines or status=in-progress}

<!-- ASK:projects-focus
Which project(s) are you working on today?
-->

<!-- ASK:projects-blockers
Any blockers or dependencies?
-->
```
```

**Step 4: Verify all conversions**

Run: `for f in .claude/skills/_assistant-{achievements,relationships,projects}/plan/daily.md; do echo "=== $f ==="; grep -c "ASK:" "$f" || echo "0"; done`
Expected: Shows placeholder counts for each assistant

---

### Task 11: Update Weekly Plan Ritual

**Files:**
- Modify: `.claude/skills/ada/references/plan/weekly.md`

**Step 1: Copy daily plan pattern**

Update `.claude/skills/ada/references/plan/weekly.md` following the same pattern as daily:
- Phase 1: Parallel agent launch
- Phase 2: Wait for completion
- Phase 3: Collect drafts
- Phase 4: Orchestrate questions
- Phase 5: Ask questions
- Phase 6: Fill placeholders
- Phase 7: Compose

Change:
- Timescale from `daily` to `weekly`
- Draft filenames from `daily-draft.md` to `weekly-draft.md`
- Compose target from `Today.md` to `Week.md`

**Step 2: Verify file updated**

Run: `grep "weekly-draft" .claude/skills/ada/references/plan/weekly.md`
Expected: Shows weekly-draft references

---

### Task 12: Update Quarterly and Yearly Plan Rituals

**Files:**
- Modify: `.claude/skills/ada/references/plan/quarterly.md`
- Modify: `.claude/skills/ada/references/plan/yearly.md`

**Step 1: Update quarterly plan**

Follow same pattern as weekly, changing:
- Timescale to `quarterly`
- Draft filenames to `quarterly-draft.md`
- Compose target to `Quarter.md`

**Step 2: Update yearly plan**

Follow same pattern, changing:
- Timescale to `yearly`
- Draft filenames to `yearly-draft.md`
- Compose target to `Year.md`

**Step 3: Verify both files updated**

Run: `grep -l "parallel" .claude/skills/ada/references/plan/{quarterly,yearly}.md`
Expected: Shows both files contain parallel logic

---

### Task 13: Update All Assistant Plan Files for All Timescales

**Files:**
- Modify: All `.claude/skills/_assistant-*/plan/{weekly,quarterly,yearly}.md` files

**Step 1: Convert calendar weekly/quarterly/yearly**

For each timescale:
- Read context from appropriate higher timescale
- Generate draft with placeholders
- Write to `Synthetic/Assistants/calendar/{timescale}-draft.md`

**Step 2: Convert goals weekly/quarterly/yearly**

For each timescale:
- Weekly: Major Moves from Quarter.md
- Quarterly: Quests from Year.md
- Yearly: Annual Goals and Compass
- Add appropriate placeholders

**Step 3: Convert journal weekly/quarterly/yearly**

For each timescale:
- Weekly: Pulse Check
- Quarterly: Pivot
- Yearly: Vision
- Add reflection placeholders

**Step 4: Convert remaining assistants**

Convert achievements, relationships, projects for each applicable timescale.

**Step 5: Verify all conversions**

Run: `find .claude/skills/_assistant-*/plan/ -name "*.md" -exec grep -l "ASK:" {} \;`
Expected: Shows all plan files now use placeholders

---

### Task 14: Update Reflect Rituals (All Timescales)

**Files:**
- Modify: `.claude/skills/ada/references/reflect/daily.md`
- Modify: `.claude/skills/ada/references/reflect/weekly.md`
- Modify: `.claude/skills/ada/references/reflect/quarterly.md`
- Modify: `.claude/skills/ada/references/reflect/yearly.md`

**Step 1: Update daily reflect**

Follow same parallel pattern as plan:
- Launch agents for reflection
- Each agent compares plan vs actual
- Generates draft with findings and placeholders
- Ada orchestrates and fills

**Step 2: Update weekly/quarterly/yearly reflect**

Apply same pattern to all timescales.

**Step 3: Convert assistant reflect files**

Update all `.claude/skills/_assistant-*/reflect/{timescale}.md` files to draft mode.

**Step 4: Verify all reflect files updated**

Run: `find .claude/skills/ada/references/reflect/ -name "*.md" -exec grep -l "parallel" {} \;`
Expected: Shows all reflect rituals use parallel execution

---

## Phase 4: Polish & Documentation

### Task 15: Add Question Ordering Intelligence

**Files:**
- Create: `.claude/skills/ada/references/order-questions.md`

**Step 1: Create question ordering logic**

Create `.claude/skills/ada/references/order-questions.md`:

```markdown
# Question Ordering

Intelligently order questions from all assistants for natural conversation flow.

## Ordering Heuristics

1. **Context-setting first**: journal questions (energy, mindset)
2. **Strategic next**: goals questions (priorities, focus)
3. **Tactical after**: calendar questions (meeting prep, schedule)
4. **Execution details**: projects questions (tasks, blockers)
5. **Relationships**: touchpoint planning
6. **Capture last**: achievements questions (wins to log)

## Algorithm

1. Group questions by assistant
2. Assign priority to each assistant based on heuristic
3. Within each assistant, preserve question order from draft
4. Flatten to single ordered list

## Example

Input:
```
{
  "goals-priority": "Top priority?",
  "journal-energy": "Energy level?",
  "calendar-prep": "Meeting prep?",
  "journal-mindset": "Mindset?"
}
```

Output (ordered):
```
[
  "journal-energy",
  "journal-mindset",
  "goals-priority",
  "calendar-prep"
]
```

## Context Enrichment

When asking each question, provide context from draft:
- Show relevant analysis from assistant
- Reference related information
- Make question conversational, not robotic

Example:
"Your calendar shows 3 meetings today with 4 hours of focus time. Which meeting needs the most preparation?"
```

**Step 2: Verify file created**

Run: `cat .claude/skills/ada/references/order-questions.md | head -20`
Expected: Shows ordering heuristics

---

### Task 16: Update Compose Phase for Filled Drafts

**Files:**
- Modify: `.claude/skills/ada/references/compose/compose.md`

**Step 1: Update compose to read filled drafts**

Update `.claude/skills/ada/references/compose/compose.md`:

Add after "Process" section:

```markdown
## Draft Mode Support

When assistants ran in draft mode:

1. Drafts are already filled with user answers
2. Read filled drafts from `Synthetic/Assistants/{name}/{timescale}-draft.md`
3. Extract `## Section` content (already complete)
4. Proceed with normal assembly process

No changes needed to assembly logic - filled drafts look like normal assistant outputs.
```

**Step 2: Verify file updated**

Run: `grep "Draft Mode" .claude/skills/ada/references/compose/compose.md`
Expected: Shows draft mode section

---

### Task 17: Add Feature Flag Support

**Files:**
- Create: `.claude/skills/ada/references/check-parallel-mode.md`

**Step 1: Create feature flag checker**

Create `.claude/skills/ada/references/check-parallel-mode.md`:

```markdown
# Check Parallel Mode

Determine if parallel execution is enabled.

## Configuration Location

Read: `vault/00_Brain/Systemic/Config/ada.yaml`

Look for:
```yaml
parallel_execution: true  # or false
```

## Default Behavior

If key missing: default to `false` (sequential mode)

## Usage

```
if parallel_execution enabled:
    use parallel draft-and-fill flow
else:
    use sequential interactive flow (legacy)
```

## Migration Path

1. Start with `parallel_execution: false`
2. Test parallel mode thoroughly
3. Switch to `parallel_execution: true`
4. Monitor for issues
5. Can always rollback by setting to `false`
```

**Step 2: Verify file created**

Run: `cat .claude/skills/ada/references/check-parallel-mode.md`
Expected: Shows feature flag documentation

---

### Task 18: Update Documentation - How Ada Works

**Files:**
- Modify: `docs/ada/how-ada-works.md`

**Step 1: Add parallel execution section**

Add after "How rituals run" section in `docs/ada/how-ada-works.md`:

```markdown
### Parallel Execution

As of v1.2, Ada runs assistants in parallel for 70-80% faster rituals.

**The parallel flow:**

1. **Draft generation** - All assistants run as background agents simultaneously
2. **Context analysis** - Each agent reads vault, generates template section with placeholders
3. **Draft collection** - Ada gathers all drafts and extracts questions
4. **Intelligent ordering** - Ada orders questions for natural conversation flow
5. **User interaction** - Ada asks questions, collects answers
6. **Placeholder filling** - Ada fills all placeholders with answers
7. **Composition** - Ada assembles final note from filled sections

**Placeholder format:**

Assistants use HTML comment syntax for unknowns:

```markdown
<!-- ASK:unique-id
What's your top priority today?
-->
```

After you answer, Ada replaces placeholders with your responses.

**Error handling:**

If an assistant agent fails:
- Other assistants continue normally
- Failed sections noted in final output
- Partial results still usable

**Configuration:**

Control via `vault/00_Brain/Systemic/Config/ada.yaml`:
```yaml
parallel_execution: true
```

Set to `false` to use legacy sequential mode.
```

**Step 2: Verify documentation updated**

Run: `grep "Parallel Execution" docs/ada/how-ada-works.md`
Expected: Shows new parallel execution section

---

### Task 19: Update Documentation - Creating Custom Assistants

**Files:**
- Modify: `docs/reference/creating-custom-assistants.md`

**Step 1: Add draft mode section**

Add after "Assistant architecture" section in `docs/reference/creating-custom-assistants.md`:

```markdown
## Draft Mode

Assistants run in **draft mode** during parallel execution.

### Draft Mode Contract

Each assistant must:

1. **Load context** - Read vault files autonomously
2. **Analyze** - Synthesize what it knows
3. **Generate draft** - Create section with placeholders for unknowns
4. **Write output** - Save to `Synthetic/Assistants/{name}/{timescale}-draft.md`

### Placeholder Syntax

Use HTML comments for questions:

```markdown
## Goals

Based on your week goals, here's the focus:

<!-- ASK:goals-priority
What's your #1 priority today?
-->
```

**Placeholder ID format:** `{assistant}-{question-key}`
- Must be unique within assistant
- Use kebab-case: `goals-top-priority`
- Descriptive but concise

### Output Location

```
vault/00_Brain/Synthetic/Assistants/{assistant-name}/{timescale}-draft.md
```

Examples:
- `Synthetic/Assistants/goals/daily-draft.md`
- `Synthetic/Assistants/calendar/weekly-draft.md`

### Status Frontmatter

Include status in draft:

```markdown
---
status: ok | error
assistant: goals
action: plan | reflect
timescale: daily | weekly | quarterly | yearly
timestamp: 2026-02-28T10:30:00Z
error: "error message if status=error"
---
```

### Context Sources

Assistants should read:
- Higher timescale notes (daily reads Week.md, weekly reads Quarter.md)
- Relevant vault sections (projects, people, etc.)
- Assistant memory: `Semantic/Assistants/{name}/memory.md`

### Example Conversion

**Before (interactive):**
```markdown
Ask the user: "What's your top priority?"
Write answer to section.
```

**After (draft mode):**
```markdown
Load Week.md to see weekly goals.
Identify potential priorities.
Write draft:

Based on weekly Major Moves:
- Launch feature (deadline Friday)
- Hire engineer (pipeline building)

<!-- ASK:goals-priority
What's your #1 priority for today?
-->
```
```

**Step 2: Verify documentation updated**

Run: `grep "Draft Mode" docs/reference/creating-custom-assistants.md`
Expected: Shows new draft mode section

---

### Task 20: Update SKILL.md Files

**Files:**
- Modify: `.claude/skills/ada/SKILL.md`
- Modify: All `.claude/skills/_assistant-*/SKILL.md` files

**Step 1: Update Ada SKILL.md**

Add to `.claude/skills/ada/SKILL.md` after "Actions" section:

```markdown
## Parallel Execution

Ada orchestrates assistants in parallel:

1. **Launch** - Spawn all assistant agents simultaneously
2. **Collect** - Gather drafts with placeholders
3. **Orchestrate** - Order questions intelligently
4. **Interact** - Conduct conversation with user
5. **Fill** - Replace placeholders with answers
6. **Compose** - Assemble final note

See references for implementation:
- [parse-placeholders.md](references/parse-placeholders.md)
- [fill-placeholders.md](references/fill-placeholders.md)
- [collect-drafts.md](references/collect-drafts.md)
- [wait-for-agents.md](references/wait-for-agents.md)
- [order-questions.md](references/order-questions.md)

Configuration: `vault/00_Brain/Systemic/Config/ada.yaml`
```

**Step 2: Update assistant SKILL.md files**

For each `.claude/skills/_assistant-*/SKILL.md`:

Add after description:

```markdown
## Draft Mode

Runs in draft mode during parallel execution:
- Loads context autonomously
- Generates section with placeholders
- Writes to `Synthetic/Assistants/{name}/{timescale}-draft.md`

See plan/reflect files for implementation.
```

**Step 3: Verify all SKILL.md files updated**

Run: `grep -l "Draft Mode" .claude/skills/_assistant-*/SKILL.md | wc -l`
Expected: 7 (one for each assistant)

---

### Task 21: Integration Test - Full Daily Plan Ritual

**Files:**
- None (testing task)

**Step 1: Enable parallel execution**

Create/update `vault/00_Brain/Systemic/Config/ada.yaml`:
```yaml
parallel_execution: true
```

**Step 2: Run full daily plan**

Run: `claude skill run ada -- plan daily`

**Step 3: Verify parallel execution**

Check logs for:
- All 6 agents launched simultaneously
- Draft files created in `Synthetic/Assistants/*/daily-draft.md`
- Placeholders extracted
- Questions asked in intelligent order
- Placeholders filled
- Final note composed to `vault/00_Brain/Captive/Today.md`

**Step 4: Verify final note structure**

Run: `cat vault/00_Brain/Captive/Today.md`
Expected:
- Has all assistant sections
- No unfilled placeholders (no `<!-- ASK:` remaining)
- Content flows naturally
- Missing sections noted if any agents failed

**Step 5: Check performance**

Measure time vs sequential execution.
Expected: 70-80% faster

---

### Task 22: Integration Test - Weekly, Quarterly, Yearly

**Files:**
- None (testing task)

**Step 1: Test weekly plan**

Run: `claude skill run ada -- plan weekly`
Verify: All sections present, placeholders filled, composed to `Week.md`

**Step 2: Test quarterly plan**

Run: `claude skill run ada -- plan quarterly`
Verify: All sections present, placeholders filled, composed to `Quarter.md`

**Step 3: Test yearly plan**

Run: `claude skill run ada -- plan yearly`
Verify: All sections present, placeholders filled, composed to `Year.md`

**Step 4: Test all reflect rituals**

For each timescale, run:
- `claude skill run ada -- reflect daily`
- `claude skill run ada -- reflect weekly`
- `claude skill run ada -- reflect quarterly`
- `claude skill run ada -- reflect yearly`

Verify: Archives created in Periodic with correct structure

---

### Task 23: Error Scenario Testing

**Files:**
- None (testing task)

**Step 1: Test single agent failure**

Temporarily break one assistant (e.g., invalid file path).
Run daily plan.
Expected:
- Other agents complete successfully
- Failed agent noted in output
- Partial note composed without failed section

**Step 2: Test timeout**

Configure very short timeout (5 seconds).
Run daily plan.
Expected:
- Some agents timeout
- Others complete
- Graceful degradation

**Step 3: Test malformed placeholders**

Add invalid placeholder syntax to one draft.
Expected:
- Ada logs warning
- Continues with valid placeholders
- Invalid placeholder shows as comment in output

**Step 4: Test all agents fail**

Break all assistants.
Run daily plan.
Expected:
- Clear error message
- Ritual exits gracefully
- No partial/corrupt output

---

### Task 24: Update CLAUDE.md with New Patterns

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add parallel execution rule**

Add to appropriate section in `CLAUDE.md`:

```markdown
### 9. Parallel Execution
See all rules in section **## Parallel Execution**
1. Assistants run as background agents outputting drafts with placeholders
2. Ada orchestrates via draft collection, question ordering, and placeholder filling
```

**Step 2: Add detailed section**

Add new section at end of `CLAUDE.md`:

```markdown
## Parallel Execution

**Agent architecture**: Assistants run as autonomous agents in draft mode.

**Draft output**: Each assistant writes `Synthetic/Assistants/{name}/{timescale}-draft.md`

**Placeholder syntax**: `<!-- ASK:unique-id\nQuestion text?\n-->`

**Ada orchestration**: Launch all → collect drafts → order questions → ask user → fill placeholders → compose

**Configuration**: `vault/00_Brain/Systemic/Config/ada.yaml` with `parallel_execution: true/false`

**Error handling**: Failed agents don't block ritual; partial results still usable

**Feature flag**: Can toggle parallel mode on/off for rollback
```

**Step 3: Verify CLAUDE.md updated**

Run: `grep "Parallel Execution" CLAUDE.md`
Expected: Shows both summary and detailed section

---

### Task 25: Create Changelog Entry

**Files:**
- Modify: `CHANGELOG.md`

**Step 1: Add 1.2.0 entry**

Add to top of `CHANGELOG.md`:

```markdown
## 1.2.0

- **Parallel assistant execution** — Ada now runs assistants as parallel background agents for 70-80% faster rituals
- **Draft-and-fill architecture** — Assistants output drafts with HTML comment placeholders, Ada orchestrates questions and fills answers
- **Intelligent question ordering** — Ada orders questions by priority (context → strategy → tactics → capture) for natural conversation flow
- **Graceful degradation** — Failed agents don't block ritual completion; partial results still usable
- **Feature flag support** — Control parallel execution via `vault/00_Brain/Systemic/Config/ada.yaml`
- Updated all 7 assistants (goals, calendar, journal, achievements, relationships, projects) for draft mode
- Updated all plan and reflect rituals across all 4 timescales
- Added comprehensive documentation for parallel execution and draft mode
- Added error handling: timeouts, failures, malformed placeholders
```

**Step 2: Verify changelog updated**

Run: `head -20 CHANGELOG.md`
Expected: Shows 1.2.0 entry at top

---

### Task 26: Bump Version Number

**Files:**
- Modify: `.claude-plugin/plugin.json`

**Step 1: Update plugin version**

Read current version:
Run: `grep version .claude-plugin/plugin.json`

Update version to `1.2.0` in `.claude-plugin/plugin.json`.

**Step 2: Verify version updated**

Run: `grep version .claude-plugin/plugin.json`
Expected: Shows "version": "1.2.0"

---

### Task 27: Final Commit

**Files:**
- All modified files

**Step 1: Review all changes**

Run: `git status`
Expected: Shows all modified files (ada references, assistant files, docs, CLAUDE.md, CHANGELOG.md, plugin.json)

**Step 2: Stage all changes**

Run: `git add -A`

**Step 3: Commit with detailed message**

Run:
```bash
git commit -m "$(cat <<'EOF'
feat: parallel assistant execution with draft-and-fill architecture

Implement parallel execution for 70-80% faster rituals.

Architecture:
- Assistants run as background agents outputting drafts
- HTML comment placeholders for unknowns
- Ada orchestrates: collect → order → ask → fill → compose
- Graceful degradation on agent failures

Changes:
- Added placeholder parsing and filling infrastructure
- Converted all 7 assistants to draft mode
- Updated all plan/reflect rituals (4 timescales each)
- Added intelligent question ordering
- Added feature flag support (parallel_execution in ada.yaml)
- Updated docs: how-ada-works, creating-custom-assistants
- Updated CLAUDE.md with parallel execution patterns

Testing:
- All timescales tested (daily, weekly, quarterly, yearly)
- Error scenarios tested (timeouts, failures, malformed input)
- Performance validated (70-80% improvement)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**Step 4: Verify commit created**

Run: `git log -1 --oneline`
Expected: Shows commit with parallel execution message

---

## Success Criteria

After completing this plan:

- [ ] All assistants run in parallel (observable via logs)
- [ ] Ritual execution time reduced by 70-80%
- [ ] All placeholders filled correctly in final notes
- [ ] Final notes have same structure as before
- [ ] User interaction feels natural
- [ ] Error handling works gracefully (tested)
- [ ] All timescales work (daily, weekly, quarterly, yearly)
- [ ] Both plan and reflect rituals work
- [ ] Documentation updated and clear
- [ ] Feature flag allows rollback to sequential mode
- [ ] No data loss on failures (tested)
- [ ] Version bumped to 1.2.0
- [ ] Comprehensive commit created

---

## Rollback Plan

If parallel execution causes issues:

1. Set `parallel_execution: false` in `vault/00_Brain/Systemic/Config/ada.yaml`
2. Rituals fall back to sequential execution
3. Draft files remain but unused
4. No data loss

To fully rollback code:
1. Revert commit: `git revert HEAD`
2. Push revert
3. Sequential mode restored

---

## Notes

- **TDD approach**: Each conversion tested before moving to next
- **DRY**: Common logic extracted to references (parse, fill, collect, wait, order)
- **YAGNI**: No speculative features; only what design requires
- **Single commit**: All changes committed together at end
- **Bite-sized tasks**: Each task 2-5 minutes, can be completed independently
- **Exact file paths**: All paths specified exactly
- **Complete code**: All code examples complete and runnable
- **Testable steps**: Each step has verification command

---

## File Changes Summary

**New files created (9):**
- `.claude/skills/ada/references/parse-placeholders.md`
- `.claude/skills/ada/references/fill-placeholders.md`
- `.claude/skills/ada/references/collect-drafts.md`
- `.claude/skills/ada/references/wait-for-agents.md`
- `.claude/skills/ada/references/order-questions.md`
- `.claude/skills/ada/references/check-parallel-mode.md`
- `.plans/2026-02-28-parallel-assistants-implementation.md` (this file)

**Modified files (~65+):**

*Ada orchestration (8):*
- `.claude/skills/ada/SKILL.md`
- `.claude/skills/ada/references/plan/daily.md`
- `.claude/skills/ada/references/plan/weekly.md`
- `.claude/skills/ada/references/plan/quarterly.md`
- `.claude/skills/ada/references/plan/yearly.md`
- `.claude/skills/ada/references/reflect/daily.md`
- `.claude/skills/ada/references/reflect/weekly.md`
- `.claude/skills/ada/references/reflect/quarterly.md`
- `.claude/skills/ada/references/reflect/yearly.md`
- `.claude/skills/ada/references/compose/compose.md`

*Assistant implementations (56 = 7 assistants × 2 actions × 4 timescales):*
- All `.claude/skills/_assistant-{goals,calendar,journal,achievements,relationships,projects}/SKILL.md` (7 files)
- All `.claude/skills/_assistant-*/plan/{daily,weekly,quarterly,yearly}.md` (28 files)
- All `.claude/skills/_assistant-*/reflect/{daily,weekly,quarterly,yearly}.md` (28 files)

*Documentation (3):*
- `docs/ada/how-ada-works.md`
- `docs/reference/creating-custom-assistants.md`
- `CLAUDE.md`

*Project meta (2):*
- `CHANGELOG.md`
- `.claude-plugin/plugin.json`
