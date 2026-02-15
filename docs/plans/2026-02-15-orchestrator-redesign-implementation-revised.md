# Orchestrator Redesign Implementation Plan (Revised)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the prose-driven orchestration by implementing the orchestrator engine that reads "What I Need" sections and coordinates existing sub-skills.

**Architecture:** Skills declare needs in prose ("What I Need" sections), orchestrator interprets needs using Claude's natural understanding, spawns existing sub-skills in parallel to fulfill needs, builds memory.md as session index.

**Tech Stack:** Markdown, Claude Code Task tool for spawning sub-skills, existing sub-skill infrastructure

**Key Insight:** Sub-skills already exist (create-session, resolve-dates, resolve-references, fetch-calendar, fetch-resources). The missing piece is the orchestrator engine that reads "What I Need" and coordinates these sub-skills.

---

## Task 1: Verify Existing Sub-Skills

**Goal:** Confirm that all required sub-skills exist and understand their interfaces.

**Step 1: Review create-session**

Read: `.claude/skills/_sub/create-session/SKILL.md`

Expected: Creates temp directory, returns session path

**Step 2: Review resolve-dates**

Read: `.claude/skills/_sub/resolve-dates/SKILL.md`

Expected: Parses time expressions, writes dates.md

**Step 3: Review resolve-references**

Read: `.claude/skills/_sub/resolve-references/SKILL.md`

Expected: Resolves vault paths, discovers entities

**Step 4: Review fetch-calendar**

Read: `.claude/skills/_sub/fetch-calendar/SKILL.md`

Expected: Fetches calendar events, writes calendar.md

**Step 5: Review fetch-resources**

Read: `.claude/skills/_sub/fetch-resources/SKILL.md`

Expected: QMD search, writes resources.md

**Step 6: Document findings**

Create a quick reference note listing each sub-skill's interface.

---

## Task 2: Create Test Skill for Validation

**Goal:** Create a minimal test skill to validate orchestration works.

**File:** `.claude/skills/_dev/test-orchestrator/SKILL.md`

**Content:**

```markdown
---
name: test-orchestrator
description: Minimal skill for testing orchestrator functionality
---

# Test Orchestrator

Validate that prose-driven orchestration works.

## What I Need

- Calendar events for the day
- Week.md for weekly context

## Test Execution

Read memory.md from the session directory to see what's available.

If calendar.md exists in session, read it and list the first event.
If Week.md path is in memory.md, note its availability.

Confirm orchestration is working by showing:
1. Session directory was created
2. memory.md exists and contains expected references
3. External data files (calendar.md) are in session
4. Vault references show full paths

Output: "✓ Orchestration test passed" or details of what failed.
```

**Commit:**

```bash
git add .claude/skills/_dev/test-orchestrator/SKILL.md
git commit -m "test(orchestrator): add test skill for validation"
```

---

## Task 3: Update Orchestrator SKILL.md for Inline Execution

**Goal:** Update the orchestrator SKILL.md to function as the actual orchestration engine.

**File:** `.claude/skills/_core/orchestrator/SKILL.md`

**Key Changes:**

1. Add explicit orchestration logic at the top
2. Include the execution flow as instructions Claude follows
3. Make it clear this is the engine that interprets "What I Need"

**Update Strategy:**

The orchestrator should:
- Detect when a skill has "What I Need" section
- Create session using create-session sub-skill
- Resolve dates using resolve-dates sub-skill
- Parse needs naturally (Claude interprets prose)
- Spawn appropriate sub-skills in parallel
- Collect results and build memory.md
- Execute the skill's inline phase

**Commit:**

```bash
git add .claude/skills/_core/orchestrator/SKILL.md
git commit -m "feat(orchestrator): implement prose-driven orchestration engine"
```

---

## Task 4: Test with Test Skill

**Goal:** Manually test the orchestrator with test-orchestrator skill.

**Step 1: Run test skill**

```bash
claude skill run test-orchestrator
```

**Expected:**
- Session created in /tmp/2bd-session-*
- memory.md written with references
- Test skill executes and confirms orchestration works

**Step 2: Inspect session directory**

```bash
ls -la /tmp/2bd-session-test-orchestrator-*
```

Verify:
- memory.md exists
- calendar.md exists (if calendar available)
- dates.md exists

**Step 3: Read memory.md**

Confirm it contains:
- External data references
- Vault file paths with status indicators

**Step 4: Document results**

Note any issues or unexpected behavior.

---

## Task 5: Migrate planning-daily to Prose-Driven

**Goal:** Update planning-daily to use "What I Need" pattern.

**File:** `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 1: Read current skill**

Review existing structure.

**Step 2: Rewrite with "What I Need"**

```markdown
---
name: planning-daily
description: Morning ritual for planning the day
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day with leadership intention.

## What I Need

- Calendar events for the day
- User's directives and preferences
- QMD search results for meeting topics
- Today.md file for this day (may not exist yet)
- Week.md for weekly context
- Month.md for monthly context
- People files for anyone with 1:1 meetings
- Active project files

## Pre-Flight Check

Read memory.md to see what context is available.

Check if Today.md already exists. If it does, ask whether to:
- Review existing plan
- Update existing plan
- Start fresh (clear and rewrite)

If calendar is unavailable, note that and proceed without it.
If QMD is unavailable, note that and proceed without it.

## Planning Session

Greet the user using their preferred name from directives.

We're planning their day for {target date from dates.md}.

### Review Context

Load calendar.md from session. What meetings do they have?

Load Week.md from vault (path in memory.md). What are their weekly goals?

Load Month.md if available. What are the monthly objectives?

For each 1:1 meeting on the calendar:
- Load that person's file from vault (path in memory.md)
- Mention context (last interaction, ongoing topics)

### Guide Planning

Ask: What's the leadership intention for today?
(Reference their leadership identity from directives)

Ask: What are the top 2-3 priorities for today?

For each meeting on the calendar:
- Does it need preparation?
- What outcome are they aiming for?

Where's the focus time? Identify blocks for deep work.

### Check Projects

Review active projects from memory.md references.
Which ones need attention today?
For projects with upcoming deadlines, highlight timeline urgency.

### Generate Plan

Based on the conversation, generate their day plan with:
- Leadership intention
- Top priorities
- Meeting preparation notes
- Focus time blocks
- Project work items

## Save to Vault

Write the plan to Today.md in the vault (path from memory.md).

Confirm with the user that their day is planned.
```

**Step 3: Remove phases.yaml**

```bash
rm .claude/skills/rituals/planning-daily/phases.yaml
```

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git rm .claude/skills/rituals/planning-daily/phases.yaml
git commit -m "refactor(planning-daily): migrate to prose-driven orchestration"
```

---

## Task 6: Test planning-daily with Different Arguments

**Goal:** Validate planning-daily works with flexible time expressions.

**Test 1: Today (empty argument)**

```bash
claude skill run planning-daily
```

Expected: Resolves to today, fetches today's calendar

**Test 2: Tomorrow**

```bash
claude skill run planning-daily tomorrow
```

Expected: Resolves to tomorrow, fetches tomorrow's calendar

**Test 3: Next Monday**

```bash
claude skill run planning-daily "next monday"
```

Expected: Resolves to next Monday's date, fetches that calendar

**Validation:**

For each test:
- Check session directory was created
- Verify dates.md has correct target_date
- Confirm calendar.md has events for correct date
- Verify interactive planning session works

**Document any issues**

---

## Task 7: Migrate review-daily

**Goal:** Migrate review-daily to prose-driven pattern.

**File:** `.claude/skills/rituals/review-daily/SKILL.md`

**Step 1: Add "What I Need"**

```markdown
## What I Need

- Today.md file for this day
- Calendar events for the day
- User's directives and preferences
- Week.md for weekly context
- People files for anyone with 1:1 meetings
```

**Step 2: Rewrite as prose**

Follow planning-daily pattern but focused on review instead of planning.

**Step 3: Remove phases.yaml**

**Step 4: Test**

```bash
claude skill run review-daily
```

**Step 5: Commit**

```bash
git add .claude/skills/rituals/review-daily/
git commit -m "refactor(review-daily): migrate to prose-driven orchestration"
```

---

## Task 8: Migrate planning-weekly

**Goal:** Migrate planning-weekly to prose-driven pattern.

**File:** `.claude/skills/rituals/planning-weekly/SKILL.md`

**Step 1: Add "What I Need"**

```markdown
## What I Need

- Calendar events for the upcoming week
- User's directives and preferences
- Current Week.md
- Month.md for monthly context
- Active project files
```

**Step 2: Rewrite as prose**

**Step 3: Remove phases.yaml**

**Step 4: Test**

```bash
claude skill run planning-weekly
```

**Step 5: Commit**

```bash
git add .claude/skills/rituals/planning-weekly/
git commit -m "refactor(planning-weekly): migrate to prose-driven orchestration"
```

---

## Task 9: Migrate review-weekly

**Goal:** Migrate review-weekly to prose-driven pattern.

**File:** `.claude/skills/rituals/review-weekly/SKILL.md`

**Step 1: Add "What I Need"**

```markdown
## What I Need

- All daily archive files for the week
- Week.md
- Calendar events for the week (already past)
- People files mentioned in the week
- Project files mentioned in the week
```

**Step 2: Rewrite as prose**

Include logic to scan daily archives for mentioned people/projects.

**Step 3: Remove phases.yaml**

**Step 4: Test**

```bash
claude skill run review-weekly "last week"
```

**Step 5: Commit**

```bash
git add .claude/skills/rituals/review-weekly/
git commit -m "refactor(review-weekly): migrate to prose-driven orchestration"
```

---

## Task 10: Update Documentation

**Goal:** Update CLAUDE.md and DEVELOPING.md to reflect completed orchestration redesign.

**Files:**
- `CLAUDE.md`
- `DEVELOPING.md`

**Step 1: Update CLAUDE.md orchestration section**

Replace with final implementation details:

```markdown
### Prose-Driven Orchestration

Skills declare context needs in natural language. The orchestrator interprets these needs and coordinates fulfillment transparently.

**Detecting prose-driven skills:**

Skills with a "What I Need" section use prose-driven orchestration:

```markdown
## What I Need

- Calendar events for the day
- User's directives and preferences
- Week.md for weekly context
- People files for anyone with 1:1 meetings
- Active project files
```

**How orchestration works:**

1. **Session Creation** - Orchestrator creates temp directory: `/tmp/2bd-session-{skill}-{timestamp}/`
2. **Date Resolution** - Resolves time arguments (today, tomorrow, "next monday", YYYY-MM-DD) to concrete dates
3. **Need Interpretation** - Parses prose needs and determines fulfillment strategy using Claude's natural understanding
4. **Context Assembly** - Spawns sub-skills in parallel, builds `memory.md` with available context
5. **Inline Execution** - Executes skill prose with session directory available

**Session structure:**

```
/tmp/2bd-session-{skill}-{timestamp}/
├── memory.md              # Index of available context
├── dates.md               # Resolved time context (internal)
├── calendar.md            # External: fetched calendar events
└── resources.md           # External: QMD search results
```

**Benefits:**
- **No orchestration mechanics in skills** - pure declarative intent
- **Natural language** - describe what you need, not how to get it
- **Flexible fulfillment** - orchestrator chooses appropriate sub-skills
- **Incremental context loading** - only read what's needed
```

**Step 2: Update DEVELOPING.md skill creation guide**

Add section on writing prose-driven skills with examples.

**Step 3: Commit**

```bash
git add CLAUDE.md DEVELOPING.md
git commit -m "docs: update for completed prose-driven orchestration"
```

---

## Task 11: Clean Up Old Files

**Goal:** Remove deprecated files and Python test files.

**Step 1: Remove Python files**

```bash
rm .claude/skills/_core/orchestrator/test_session.py
```

**Step 2: Check for other deprecated files**

Review .claude/skills/_core/orchestrator/ for any old implementation files.

**Step 3: Archive example phases.yaml**

```bash
mkdir -p docs/archive/old-orchestration
find .claude/skills/rituals -name "phases.yaml" -exec mv {} docs/archive/old-orchestration/ \;
```

**Step 4: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove Python implementation and archive old phases.yaml"
```

---

## Success Criteria

- [ ] test-orchestrator skill runs and validates orchestration
- [ ] planning-daily works with: (empty), "tomorrow", "next monday"
- [ ] review-daily works correctly
- [ ] planning-weekly and review-weekly work correctly
- [ ] memory.md contains full vault paths
- [ ] Session contains only external data (calendar.md, resources.md)
- [ ] Skills have zero orchestration knowledge
- [ ] Documentation updated
- [ ] Python files removed

---

## Key Differences from Original Plan

**Original Plan:**
- Implement Python modules (session.py, resolver.py, parser.py, orchestrator.py)
- Write pytest tests
- Create new sub-skills

**Revised Plan:**
- Use existing sub-skills (create-session, resolve-dates, resolve-references, etc.)
- Orchestration engine is the orchestrator SKILL.md itself
- Claude interprets "What I Need" using natural language understanding
- Testing through actual skill execution (manual testing)
- No Python implementation needed - it's all prose-driven

**Why This Works:**
- Claude Code's Task tool spawns sub-skills
- Orchestrator SKILL.md contains the logic as prose instructions
- Claude reads "What I Need" and knows which sub-skills to spawn
- Existing sub-skills handle all the heavy lifting
- Pure markdown-based session assembly
