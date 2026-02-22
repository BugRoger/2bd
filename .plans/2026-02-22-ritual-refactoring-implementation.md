# Ritual Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify ritual system from 26 to 19 skills by making Ada the orchestrator and assistants self-contained.

**Architecture:** Two thin wrapper skills (/planning, /reflection) invoke Ada. Ada owns sequencing logic. Each assistant has plan/reflect/learn actions. Compose assembles Synthetic outputs into Captive.

**Tech Stack:** Claude skills (markdown), vault structure (Obsidian)

**Design doc:** [.plans/2026-02-22-ritual-refactoring-design.md](.plans/2026-02-22-ritual-refactoring-design.md)

---

## Phase 1: Create Thin Wrapper Skills

### Task 1.1: Create /planning skill

**Files:**
- Create: `.claude/skills/planning/SKILL.md`

**Step 1: Create planning skill directory**

Run: `mkdir -p .claude/skills/planning`

**Step 2: Write SKILL.md**

Create `.claude/skills/planning/SKILL.md`:

```markdown
---
name: planning
description: Run a planning ritual. Invokes Ada.
argument-hint: "[timescale: daily|weekly|quarterly|yearly]"
---

# Planning

Invoke Ada with action=plan and the specified timescale.

## Usage

- `/planning` or `/planning daily` - plan today
- `/planning weekly` - plan the week
- `/planning quarterly` - plan the quarter
- `/planning yearly` - plan the year

## Process

1. Parse timescale from argument (default: daily)
2. Invoke @ada with: action=plan, timescale={parsed}
```

**Step 3: Verify skill loads**

Run: `cat .claude/skills/planning/SKILL.md`
Expected: File contents displayed without error

---

### Task 1.2: Create /reflection skill

**Files:**
- Create: `.claude/skills/reflection/SKILL.md`

**Step 1: Create reflection skill directory**

Run: `mkdir -p .claude/skills/reflection`

**Step 2: Write SKILL.md**

Create `.claude/skills/reflection/SKILL.md`:

```markdown
---
name: reflection
description: Run a reflection ritual. Invokes Ada.
argument-hint: "[timescale: daily|weekly|quarterly|yearly]"
---

# Reflection

Invoke Ada with action=reflect and the specified timescale.

## Usage

- `/reflection` or `/reflection daily` - reflect on today
- `/reflection weekly` - reflect on the week
- `/reflection quarterly` - reflect on the quarter
- `/reflection yearly` - reflect on the year

## Process

1. Parse timescale from argument (default: daily)
2. Invoke @ada with: action=reflect, timescale={parsed}
```

**Step 3: Verify skill loads**

Run: `cat .claude/skills/reflection/SKILL.md`
Expected: File contents displayed without error

---

## Phase 2: Refactor Ada Orchestration

### Task 2.1: Create Ada orchestration sequences

**Files:**
- Create: `.claude/skills/ada/references/plan/daily.md`
- Create: `.claude/skills/ada/references/plan/weekly.md`
- Create: `.claude/skills/ada/references/plan/quarterly.md`
- Create: `.claude/skills/ada/references/plan/yearly.md`
- Create: `.claude/skills/ada/references/reflect/daily.md`
- Create: `.claude/skills/ada/references/reflect/weekly.md`
- Create: `.claude/skills/ada/references/reflect/quarterly.md`
- Create: `.claude/skills/ada/references/reflect/yearly.md`

**Step 1: Create directories**

Run: `mkdir -p .claude/skills/ada/references/plan .claude/skills/ada/references/reflect`

**Step 2: Write plan/daily.md**

Create `.claude/skills/ada/references/plan/daily.md`:

```markdown
# Plan Daily Sequence

Execute these assistants in order:

1. @_assistant-brief action=plan timescale=daily
2. @_assistant-goals action=plan timescale=daily
3. @_assistant-calendar action=plan timescale=daily
4. @_assistant-journal action=plan timescale=daily
5. @_assistant-achievements action=plan timescale=daily
6. @_assistant-relationships action=plan timescale=daily
7. @_assistant-projects action=plan timescale=daily
8. @_assistant-compose action=plan timescale=daily

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

**Step 3: Write plan/weekly.md**

Create `.claude/skills/ada/references/plan/weekly.md`:

```markdown
# Plan Weekly Sequence

Execute these assistants in order:

1. @_assistant-brief action=plan timescale=weekly
2. @_assistant-goals action=plan timescale=weekly
3. @_assistant-calendar action=plan timescale=weekly
4. @_assistant-journal action=plan timescale=weekly
5. @_assistant-achievements action=plan timescale=weekly
6. @_assistant-relationships action=plan timescale=weekly
7. @_assistant-projects action=plan timescale=weekly
8. @_assistant-compose action=plan timescale=weekly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

**Step 4: Write plan/quarterly.md**

Create `.claude/skills/ada/references/plan/quarterly.md`:

```markdown
# Plan Quarterly Sequence

Execute these assistants in order:

1. @_assistant-brief action=plan timescale=quarterly
2. @_assistant-goals action=plan timescale=quarterly
3. @_assistant-calendar action=plan timescale=quarterly
4. @_assistant-journal action=plan timescale=quarterly
5. @_assistant-achievements action=plan timescale=quarterly
6. @_assistant-relationships action=plan timescale=quarterly
7. @_assistant-projects action=plan timescale=quarterly
8. @_assistant-compose action=plan timescale=quarterly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

**Step 5: Write plan/yearly.md**

Create `.claude/skills/ada/references/plan/yearly.md`:

```markdown
# Plan Yearly Sequence

Execute these assistants in order:

1. @_assistant-brief action=plan timescale=yearly
2. @_assistant-goals action=plan timescale=yearly
3. @_assistant-calendar action=plan timescale=yearly
4. @_assistant-journal action=plan timescale=yearly
5. @_assistant-achievements action=plan timescale=yearly
6. @_assistant-relationships action=plan timescale=yearly
7. @_assistant-projects action=plan timescale=yearly
8. @_assistant-compose action=plan timescale=yearly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

**Step 6: Write reflect/daily.md**

Create `.claude/skills/ada/references/reflect/daily.md`:

```markdown
# Reflect Daily Sequence

Execute these assistants in order:

1. @_assistant-brief action=reflect timescale=daily
2. @_assistant-goals action=reflect timescale=daily
3. @_assistant-calendar action=reflect timescale=daily
4. @_assistant-journal action=reflect timescale=daily
5. @_assistant-achievements action=reflect timescale=daily
6. @_assistant-relationships action=reflect timescale=daily
7. @_assistant-projects action=reflect timescale=daily
8. @_assistant-compose action=reflect timescale=daily

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=daily
10. @_assistant-calendar action=learn timescale=daily
11. @_assistant-journal action=learn timescale=daily
12. @_assistant-achievements action=learn timescale=daily
13. @_assistant-relationships action=learn timescale=daily
14. @_assistant-projects action=learn timescale=daily

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

**Step 7: Write reflect/weekly.md**

Create `.claude/skills/ada/references/reflect/weekly.md`:

```markdown
# Reflect Weekly Sequence

Execute these assistants in order:

1. @_assistant-brief action=reflect timescale=weekly
2. @_assistant-goals action=reflect timescale=weekly
3. @_assistant-calendar action=reflect timescale=weekly
4. @_assistant-journal action=reflect timescale=weekly
5. @_assistant-achievements action=reflect timescale=weekly
6. @_assistant-relationships action=reflect timescale=weekly
7. @_assistant-projects action=reflect timescale=weekly
8. @_assistant-compose action=reflect timescale=weekly

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=weekly
10. @_assistant-calendar action=learn timescale=weekly
11. @_assistant-journal action=learn timescale=weekly
12. @_assistant-achievements action=learn timescale=weekly
13. @_assistant-relationships action=learn timescale=weekly
14. @_assistant-projects action=learn timescale=weekly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

**Step 8: Write reflect/quarterly.md**

Create `.claude/skills/ada/references/reflect/quarterly.md`:

```markdown
# Reflect Quarterly Sequence

Execute these assistants in order:

1. @_assistant-brief action=reflect timescale=quarterly
2. @_assistant-goals action=reflect timescale=quarterly
3. @_assistant-calendar action=reflect timescale=quarterly
4. @_assistant-journal action=reflect timescale=quarterly
5. @_assistant-achievements action=reflect timescale=quarterly
6. @_assistant-relationships action=reflect timescale=quarterly
7. @_assistant-projects action=reflect timescale=quarterly
8. @_assistant-compose action=reflect timescale=quarterly

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=quarterly
10. @_assistant-calendar action=learn timescale=quarterly
11. @_assistant-journal action=learn timescale=quarterly
12. @_assistant-achievements action=learn timescale=quarterly
13. @_assistant-relationships action=learn timescale=quarterly
14. @_assistant-projects action=learn timescale=quarterly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

**Step 9: Write reflect/yearly.md**

Create `.claude/skills/ada/references/reflect/yearly.md`:

```markdown
# Reflect Yearly Sequence

Execute these assistants in order:

1. @_assistant-brief action=reflect timescale=yearly
2. @_assistant-goals action=reflect timescale=yearly
3. @_assistant-calendar action=reflect timescale=yearly
4. @_assistant-journal action=reflect timescale=yearly
5. @_assistant-achievements action=reflect timescale=yearly
6. @_assistant-relationships action=reflect timescale=yearly
7. @_assistant-projects action=reflect timescale=yearly
8. @_assistant-compose action=reflect timescale=yearly

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=yearly
10. @_assistant-calendar action=learn timescale=yearly
11. @_assistant-journal action=learn timescale=yearly
12. @_assistant-achievements action=learn timescale=yearly
13. @_assistant-relationships action=learn timescale=yearly
14. @_assistant-projects action=learn timescale=yearly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
```

---

### Task 2.2: Update Ada SKILL.md

**Files:**
- Modify: `.claude/skills/ada/SKILL.md`

**Step 1: Read current Ada SKILL.md**

Run: `cat .claude/skills/ada/SKILL.md`

**Step 2: Rewrite Ada SKILL.md**

Replace `.claude/skills/ada/SKILL.md` with:

```markdown
---
name: ada
description: Ada, your Executive Assistant. Coordinates planning and reflection rituals.
argument-hint: "[action: plan|reflect] [timescale: daily|weekly|quarterly|yearly]"
---

# Ada

I'm Ada, your Executive Assistant. I coordinate your planning and reflection rituals.

## Usage

- "Ada, plan my day" or "Ada, run my morning ritual"
- "Ada, reflect on today" or "Ada, let's review today"
- "Ada, plan my week"
- "Ada, weekly reflection"

## Process

1. Parse action (plan/reflect) from input
2. Parse timescale (daily/weekly/quarterly/yearly) from input (default: daily)
3. Load sequence from [references/{action}/{timescale}.md](references/)
4. Execute each assistant in order
5. Report completion

## Sequences

- **Plan:** [daily](references/plan/daily.md) | [weekly](references/plan/weekly.md) | [quarterly](references/plan/quarterly.md) | [yearly](references/plan/yearly.md)
- **Reflect:** [daily](references/reflect/daily.md) | [weekly](references/reflect/weekly.md) | [quarterly](references/reflect/quarterly.md) | [yearly](references/reflect/yearly.md)

## Error Handling

If an assistant fails:
1. Report error to user
2. Continue with remaining assistants
3. Note incomplete sections in compose
```

---

## Phase 3: Add Learn Phase to Assistants

### Task 3.1: Add learn/ to _assistant-goals

**Files:**
- Create: `.claude/skills/_assistant-goals/learn/daily.md`
- Create: `.claude/skills/_assistant-goals/learn/weekly.md`
- Create: `.claude/skills/_assistant-goals/learn/quarterly.md`
- Create: `.claude/skills/_assistant-goals/learn/yearly.md`
- Modify: `.claude/skills/_assistant-goals/SKILL.md`

**Step 1: Create learn directory**

Run: `mkdir -p .claude/skills/_assistant-goals/learn`

**Step 2: Write learn/daily.md**

Create `.claude/skills/_assistant-goals/learn/daily.md`:

```markdown
# Goals: Learn Daily

Analyze goal patterns and graduate insights to Semantic memory.

## Context to Load

1. Read recent outputs from `vault/00_Brain/Synthetic/Assistants/goals/` (last 7 days)
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Scan ## Observations from recent outputs
2. Identify recurring patterns:
   - Which tasks consistently complete/fail?
   - What blocks progress?
   - What time of day works best?
3. Cluster similar observations (3+ = consider, 5+ = flag for graduation)

## Graduation

If cluster confidence high:
1. Present to user: "I noticed {pattern} across {N} days. Evidence: {dates}"
2. Ask: "What does this pattern mean to you?"
3. Write synthesized insight to `vault/00_Brain/Semantic/Assistants/goals/memory.md`

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-learn-daily.md`:

```markdown
# Goals: learn(daily) {date}

## Status
ok

## Clusters Found

### {Pattern title}
**Confidence:** {N} observations
**Evidence:**
- {date}: {observation}
- {date}: {observation}

**Ready for graduation:** {Yes/No}

## Graduated This Session
- {Insight title} -> memory.md (or "None")

## Timestamp
{ISO timestamp}
```
```

**Step 3: Write learn/weekly.md**

Create `.claude/skills/_assistant-goals/learn/weekly.md`:

```markdown
# Goals: Learn Weekly

Analyze weekly goal patterns and graduate insights.

## Context to Load

1. Read outputs from `vault/00_Brain/Synthetic/Assistants/goals/` (last 4 weeks)
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Scan ## Observations from weekly outputs
2. Identify patterns:
   - Which Major Moves consistently advance/stall?
   - What weekly rhythms emerge?
   - Connection between daily completion and weekly progress?
3. Cluster similar observations

## Graduation

Same as daily - present pattern, ask for synthesis, write to memory.md.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-learn-weekly.md` with same format.
```

**Step 4: Write learn/quarterly.md**

Create `.claude/skills/_assistant-goals/learn/quarterly.md`:

```markdown
# Goals: Learn Quarterly

Analyze quarterly goal patterns and graduate insights.

## Context to Load

1. Read outputs from `vault/00_Brain/Synthetic/Assistants/goals/` (last 3 months)
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Scan ## Observations from quarterly outputs
2. Identify patterns:
   - Which Quests consistently progress/stall?
   - What quarterly rhythms emerge?
   - Connection between weekly moves and quarterly quests?
3. Cluster similar observations

## Graduation

Same as daily - present pattern, ask for synthesis, write to memory.md.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-learn-quarterly.md` with same format.
```

**Step 5: Write learn/yearly.md**

Create `.claude/skills/_assistant-goals/learn/yearly.md`:

```markdown
# Goals: Learn Yearly

Analyze yearly goal patterns and graduate insights.

## Context to Load

1. Read outputs from `vault/00_Brain/Synthetic/Assistants/goals/` (last 12 months)
2. Read `vault/00_Brain/Semantic/Assistants/goals/memory.md` if exists

## Process

1. Scan ## Observations from yearly outputs
2. Identify patterns:
   - Which Annual Goals consistently progress/stall?
   - What yearly rhythms emerge?
   - Connection between quarterly quests and annual goals?
3. Cluster similar observations

## Graduation

Same as daily - present pattern, ask for synthesis, write to memory.md.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/goals/{date}-learn-yearly.md` with same format.
```

**Step 6: Update SKILL.md**

Replace `.claude/skills/_assistant-goals/SKILL.md` with:

```markdown
---
name: _assistant-goals
description: Goals assistant. 1-3-5 (daily), Major Moves (weekly), Quests (quarterly), Annual Goals (yearly).
---

# Goals Assistant

You are Ada's goals specialist following GPS methodology.

## Actions

- **Plan:** [daily](plan/daily.md) | [weekly](plan/weekly.md) | [quarterly](plan/quarterly.md) | [yearly](plan/yearly.md)
- **Reflect:** [daily](reflect/daily.md) | [weekly](reflect/weekly.md) | [quarterly](reflect/quarterly.md) | [yearly](reflect/yearly.md)
- **Learn:** [daily](learn/daily.md) | [weekly](learn/weekly.md) | [quarterly](learn/quarterly.md) | [yearly](learn/yearly.md)

## References

1. [1-3-5 Method](references/1-3-5-method.md)

## Protocol

Follow @_assistant-protocol for output format and knowledge model.
```

---

### Task 3.2: Add learn/ to _assistant-calendar

**Files:**
- Create: `.claude/skills/_assistant-calendar/learn/daily.md`
- Create: `.claude/skills/_assistant-calendar/learn/weekly.md`
- Create: `.claude/skills/_assistant-calendar/learn/quarterly.md`
- Create: `.claude/skills/_assistant-calendar/learn/yearly.md`
- Modify: `.claude/skills/_assistant-calendar/SKILL.md`

**Step 1: Create learn directory**

Run: `mkdir -p .claude/skills/_assistant-calendar/learn`

**Step 2: Write learn files**

Create `.claude/skills/_assistant-calendar/learn/daily.md`:

```markdown
# Calendar: Learn Daily

Analyze meeting patterns and graduate insights.

## Context to Load

1. Read recent outputs from `vault/00_Brain/Synthetic/Assistants/calendar/` (last 7 days)
2. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. Scan ## Observations from recent outputs
2. Identify patterns:
   - Which meetings run over/under?
   - What prep consistently helps?
   - Energy patterns after meeting types?
3. Cluster similar observations

## Graduation

Present pattern, ask for synthesis, write to memory.md.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-learn-daily.md`.
```

Create `.claude/skills/_assistant-calendar/learn/weekly.md`:

```markdown
# Calendar: Learn Weekly

Analyze weekly calendar patterns.

## Context to Load

1. Read outputs from `vault/00_Brain/Synthetic/Assistants/calendar/` (last 4 weeks)
2. Read `vault/00_Brain/Semantic/Assistants/calendar/memory.md` if exists

## Process

1. Identify weekly patterns:
   - Best days for focus work?
   - Meeting clustering effects?
   - Travel/commute patterns?
3. Cluster similar observations

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-learn-weekly.md`.
```

Create `.claude/skills/_assistant-calendar/learn/quarterly.md`:

```markdown
# Calendar: Learn Quarterly

Analyze quarterly calendar patterns.

## Context to Load

1. Read outputs from last 3 months
2. Read memory.md if exists

## Process

Identify quarterly patterns and graduate insights.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-learn-quarterly.md`.
```

Create `.claude/skills/_assistant-calendar/learn/yearly.md`:

```markdown
# Calendar: Learn Yearly

Analyze yearly calendar patterns.

## Context to Load

1. Read outputs from last 12 months
2. Read memory.md if exists

## Process

Identify yearly patterns and graduate insights.

## Output

Write to `vault/00_Brain/Synthetic/Assistants/calendar/{date}-learn-yearly.md`.
```

**Step 3: Update SKILL.md**

Read current SKILL.md and add Learn action section following same pattern as goals.

---

### Task 3.3: Add learn/ to _assistant-journal

Same pattern as 3.1 and 3.2. Create learn/{daily,weekly,quarterly,yearly}.md and update SKILL.md.

Focus areas for journal patterns:
- Recurring themes/emotions
- Energy patterns
- Insight frequency

---

### Task 3.4: Add learn/ to _assistant-achievements

Same pattern. Focus areas:
- Win categories (personal/team/strategic)
- Achievement frequency patterns
- Recognition patterns

---

### Task 3.5: Add learn/ to _assistant-relationships

Same pattern. Focus areas:
- Connection frequency patterns
- Relationship health trends
- Touchpoint effectiveness

---

### Task 3.6: Add learn/ to _assistant-projects

Same pattern. Focus areas:
- Blocker patterns
- Velocity trends
- Project completion patterns

---

### Task 3.7: Add learn/ to _assistant-brief

Same pattern. Focus areas:
- Brief accuracy (predicted vs actual)
- Priority effectiveness
- Intention alignment

---

## Phase 4: Delete Old Skills

### Task 4.1: Delete ritual-planning-* skills

**Files:**
- Delete: `.claude/skills/ritual-planning-daily/`
- Delete: `.claude/skills/ritual-planning-weekly/`
- Delete: `.claude/skills/ritual-planning-quarterly/`
- Delete: `.claude/skills/ritual-planning-yearly/`

**Step 1: Remove directories**

Run: `rm -rf .claude/skills/ritual-planning-daily .claude/skills/ritual-planning-weekly .claude/skills/ritual-planning-quarterly .claude/skills/ritual-planning-yearly`

**Step 2: Verify deletion**

Run: `ls .claude/skills/ | grep ritual-planning`
Expected: No output (no matches)

---

### Task 4.2: Delete ritual-reflection-* skills

**Files:**
- Delete: `.claude/skills/ritual-reflection-daily/`
- Delete: `.claude/skills/ritual-reflection-weekly/`
- Delete: `.claude/skills/ritual-reflection-quarterly/`
- Delete: `.claude/skills/ritual-reflection-yearly/`

**Step 1: Remove directories**

Run: `rm -rf .claude/skills/ritual-reflection-daily .claude/skills/ritual-reflection-weekly .claude/skills/ritual-reflection-quarterly .claude/skills/ritual-reflection-yearly`

**Step 2: Verify deletion**

Run: `ls .claude/skills/ | grep ritual-reflection`
Expected: No output (no matches)

---

### Task 4.3: Delete _assistant-learn skill

**Files:**
- Delete: `.claude/skills/_assistant-learn/`

**Step 1: Remove directory**

Run: `rm -rf .claude/skills/_assistant-learn`

**Step 2: Verify deletion**

Run: `ls .claude/skills/ | grep _assistant-learn`
Expected: No output

---

## Phase 5: Vault Structure Updates

### Task 5.1: Create Systemic/Assistants structure

**Files:**
- Create: `vault/00_Brain/Systemic/Assistants/goals/templates/section.md`
- Create: `vault/00_Brain/Systemic/Assistants/calendar/templates/section.md`
- Create: `vault/00_Brain/Systemic/Assistants/journal/templates/section.md`
- Create: `vault/00_Brain/Systemic/Assistants/brief/templates/section.md`
- Create: `vault/00_Brain/Systemic/Assistants/achievements/templates/section.md`
- Create: `vault/00_Brain/Systemic/Assistants/relationships/templates/section.md`
- Create: `vault/00_Brain/Systemic/Assistants/projects/templates/section.md`

**Step 1: Create directories**

Run: `mkdir -p vault/00_Brain/Systemic/Assistants/{goals,calendar,journal,brief,achievements,relationships,projects}/templates`

**Step 2: Create section templates**

Create `vault/00_Brain/Systemic/Assistants/goals/templates/section.md`:

```markdown
## Goals

### 1-3-5

**Must do:**
- {Big task} -> {Major Move}

**Should do:**
- {Medium 1}
- {Medium 2}
- {Medium 3}

**Could do:**
- {Small 1}
- {Small 2}
- {Small 3}
- {Small 4}
- {Small 5}
```

Create similar section templates for each assistant domain.

---

### Task 5.2: Delete Systemic/Coaching

**Files:**
- Delete: `vault/00_Brain/Systemic/Coaching/`

**Step 1: Remove directory**

Run: `rm -rf vault/00_Brain/Systemic/Coaching`

**Step 2: Verify deletion**

Run: `ls vault/00_Brain/Systemic/ | grep Coaching`
Expected: No output

---

## Phase 6: Update Documentation

### Task 6.1: Update CLAUDE.md timescale references

**Files:**
- Modify: `CLAUDE.md`

Remove references to deleted ritual skills from the timescale architecture section.

---

### Task 6.2: Update docs if needed

**Files:**
- Modify: `docs/reference/rituals.md` (if exists)

Update to reflect new /planning and /reflection entry points.

---

## Phase 7: Final Verification

### Task 7.1: Verify skill count

**Step 1: Count skills**

Run: `ls -d .claude/skills/*/ | wc -l`
Expected: ~19 skills (down from 26)

**Step 2: List all skills**

Run: `ls .claude/skills/`
Expected: ada, planning, reflection, _assistant-* (without _assistant-learn), utilities

---

### Task 7.2: Commit all changes

**Step 1: Stage changes**

Run: `git add -A`

**Step 2: Review staged changes**

Run: `git status`

**Step 3: Commit**

Run:
```bash
git commit -m "$(cat <<'EOF'
refactor: simplify ritual system with Ada as orchestrator

- Add /planning and /reflection thin wrapper skills
- Move orchestration sequences into Ada
- Add learn/ phase to all assistants
- Delete 8 ritual-* skills and _assistant-learn
- Create Systemic/Assistants/ structure in vault
- Delete Systemic/Coaching/

Reduces skill count from 26 to 19.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```
