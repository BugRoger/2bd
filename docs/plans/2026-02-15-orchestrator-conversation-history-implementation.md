# Orchestrator: Conversation History Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate session directories from orchestration. Use conversation history as global state between agents.

**Architecture:** Sub-agents return data via Task tool results. Orchestrator loads all context into conversation using Read tool. Summary message communicates availability to skill.

**Tech Stack:** Claude Task tool, Read tool, bash sub-skills, YAML frontmatter

---

## Task 1: Update fetch-calendar Sub-Agent

**Files:**
- Modify: `.claude/skills/_sub/fetch-calendar/SKILL.md`

**Step 1: Read current implementation**

Read the file to understand current session-based implementation.

Run: Read `.claude/skills/_sub/fetch-calendar/SKILL.md`

**Step 2: Update frontmatter and description**

```yaml
---
name: fetch-calendar
description: Fetch calendar events from macOS Calendar using ekctl. Returns natural markdown via Task tool result.
disable-model-invocation: true
allowed-tools: Bash(*)
argument-hint: "[target_date: YYYY-MM-DD]"
---
```

**Step 3: Rewrite skill prose**

Replace entire content after frontmatter:

```markdown
# Fetch Calendar

Fetch calendar events from macOS Calendar using ekctl. Returns events as natural markdown.

## Prerequisites

- **ekctl** installed (`/opt/homebrew/bin/ekctl`)
- Calendar access granted
- Calendars configured in `.claude/skills/_sub/fetch-calendar/calendars.json`

## Input

**Argument:** `target_date` (YYYY-MM-DD format)

If no argument provided, default to today.

## Execution

### 1. Read Configuration

```bash
config_file=".claude/skills/_sub/fetch-calendar/calendars.json"

if [[ ! -f "$config_file" ]]; then
    echo "# Calendar Events: Unavailable"
    echo ""
    echo "Configuration not found. Create $config_file with calendar aliases."
    exit 0
fi

calendars=$(jq -r '.calendars[]' "$config_file")
```

### 2. Parse Target Date

```bash
if [[ -n "$ARGUMENTS" ]]; then
    target_date="$ARGUMENTS"
else
    target_date=$(date +"%Y-%m-%d")
fi
```

### 3. Calculate Date Range

```bash
FROM=$(date -j -f "%Y-%m-%d" "$target_date" +"%Y-%m-%dT00:00:00%z")
TO=$(date -j -f "%Y-%m-%d" "$target_date" +"%Y-%m-%dT23:59:59%z")
```

### 4. Fetch Events

For each calendar alias:

```bash
for calendar in $calendars; do
    ekctl list events --calendar "$calendar" --from "$FROM" --to "$TO"
done
```

Collect JSON responses.

### 5. Format Output

Output natural markdown to stdout:

```markdown
# Calendar Events: 2026-02-16

You have 3 meetings scheduled:

**09:00-09:30** Team standup
- Conference Room A

**14:00-15:00** 1:1 with Sarah Chen
- This is a one-on-one meeting
- Zoom link: https://...

**16:00-17:00** Design review
- Conference Room B

**Focus time available:**
- 09:30-14:00 (4.5 hours)
- 15:00-16:00 (1 hour)

Total: 3 meetings, 1 one-on-one, 5.5 hours focus time
```

If no events:

```markdown
# Calendar Events: 2026-02-16

You have no meetings scheduled.

Focus time available: Full day (9 hours)
```

## Error Handling

If ekctl not installed:

```markdown
# Calendar Events: Unavailable

ekctl not found. Install: brew install ekctl
```

If calendar access denied:

```markdown
# Calendar Events: Unavailable

Calendar access denied. Grant permission in System Settings > Privacy & Security > Calendars
```

If calendars.json missing:

```markdown
# Calendar Events: Unavailable

Configuration not found. Create .claude/skills/_sub/fetch-calendar/calendars.json
```

## Output

Returns markdown via stdout. Orchestrator captures this via Task tool result and loads into conversation.
```

**Step 4: Test manually**

Run: `claude skill run _sub/fetch-calendar --args "2026-02-17"`

Expected: Markdown output to stdout (not written to file)

**Step 5: Commit**

```bash
git add .claude/skills/_sub/fetch-calendar/SKILL.md
git commit -m "refactor(fetch-calendar): return markdown via stdout instead of session files"
```

---

## Task 2: Update resolve-references Sub-Agent

**Files:**
- Modify: `.claude/skills/_sub/resolve-references/SKILL.md`

**Step 1: Read current implementation**

Read the file to understand bash script structure.

Run: Read `.claude/skills/_sub/resolve-references/SKILL.md`

**Step 2: Update frontmatter and description**

```yaml
---
name: resolve-references
description: Resolve vault file paths and entity references. Returns structured markdown via Task tool result.
disable-model-invocation: true
allowed-tools: Bash(*)
argument-hint: "[target_date: YYYY-MM-DD] [calendar_md: (optional)]"
---
```

**Step 3: Rewrite skill prose**

Replace entire content after frontmatter:

```markdown
# Resolve References

Resolve vault file paths and entity references based on target date and optional calendar data.

## Input

**Arguments:**
1. `target_date` (YYYY-MM-DD format) - Required
2. `calendar_md` (path to temp calendar markdown file) - Optional

Pass calendar markdown as temporary file if people resolution needed.

## Execution

### 1. Read Configuration

```bash
vault_path=$(grep "^vault_path:" .claude/config.md | cut -d' ' -f2-)

if [[ -z "$vault_path" ]] || [[ ! -d "$vault_path" ]]; then
    echo "Error: Vault not configured. Run /init" >&2
    exit 1
fi
```

### 2. Parse Arguments

```bash
target_date="${1:?Error: target_date required}"
calendar_file="${2:-}"  # Optional
```

### 3. Resolve Static Vault Files

```bash
echo "# Vault References"
echo ""
echo "## Static Files"
echo ""

# Week.md
week_file="$vault_path/00_Brain/Captive/Week.md"
[[ -f "$week_file" ]] && echo "- **Week.md**: $week_file ✓" || echo "- **Week.md**: $week_file ✗"

# Month.md
month_file="$vault_path/00_Brain/Captive/Month.md"
[[ -f "$month_file" ]] && echo "- **Month.md**: $month_file ✓" || echo "- **Month.md**: $month_file ✗"

# Quarter.md
quarter_file="$vault_path/00_Brain/Captive/Quarter.md"
[[ -f "$quarter_file" ]] && echo "- **Quarter.md**: $quarter_file ✓" || echo "- **Quarter.md**: $quarter_file ✗"

# Today.md
today_file="$vault_path/00_Brain/Captive/Today.md"
[[ -f "$today_file" ]] && echo "- **Today.md**: $today_file ✓" || echo "- **Today.md**: $today_file ✗"

# Directives
directives_file="$vault_path/00_Brain/Systemic/Directives/profile.md"
[[ -f "$directives_file" ]] && echo "- **Directives**: $directives_file ✓" || echo "- **Directives**: $directives_file ✗"

echo ""
```

### 4. Resolve People from Calendar

```bash
echo "## People (from calendar 1:1s)"
echo ""

if [[ -n "$calendar_file" ]] && [[ -f "$calendar_file" ]]; then
    people_lines=$(grep -iE "(1:1|1-1)" "$calendar_file" || true)

    if [[ -n "$people_lines" ]]; then
        while IFS= read -r line; do
            person=$(echo "$line" | sed -E 's/.*(1:1|1-1):? *(with )?//i' | xargs)
            [[ -z "$person" ]] && continue

            person_file=$(find "$vault_path/02_Areas/People" -type f -iname "*${person}*.md" 2>/dev/null | head -1 || true)

            if [[ -n "$person_file" ]]; then
                echo "- **${person}**: $person_file ✓"
            else
                echo "- **${person}**: (no file found) ✗"
            fi
        done <<< "$people_lines"
    else
        echo "(no 1:1 meetings in calendar)"
    fi
else
    echo "(no calendar data provided)"
fi

echo ""
```

### 5. Resolve Active Projects

```bash
echo "## Projects (active)"
echo ""

projects_dir="$vault_path/01_Projects"
found=false

if [[ -d "$projects_dir" ]]; then
    for project_file in "$projects_dir"/*.md; do
        [[ ! -f "$project_file" ]] && continue

        filename=$(basename "$project_file")
        [[ "$filename" == *"✱"* ]] && continue

        title=$(grep "^title:" "$project_file" | cut -d':' -f2- | xargs || echo "${filename%.md}")
        status=$(grep "^status:" "$project_file" | cut -d':' -f2- | xargs || echo "")

        if [[ -z "$status" ]] || [[ "$status" == "active" ]]; then
            echo "- **${title}**: $project_file ✓"
            found=true
        fi
    done
fi

[[ "$found" == false ]] && echo "(no active projects)"

echo ""
```

## Output

Returns markdown via stdout. Orchestrator captures via Task tool result.

**Format:**

```markdown
# Vault References

## Static Files

- **Week.md**: /vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /vault/00_Brain/Captive/Month.md ✓
- **Quarter.md**: /vault/00_Brain/Captive/Quarter.md ✗
- **Today.md**: /vault/00_Brain/Captive/Today.md ✗
- **Directives**: /vault/00_Brain/Systemic/Directives/profile.md ✓

## People (from calendar 1:1s)

- **Sarah Chen**: /vault/02_Areas/People/Sarah Chen.md ✓

## Projects (active)

- **quarterly-planning**: /vault/01_Projects/2026-03-31-quarterly-planning.md ✓
```
```

**Step 4: Test manually**

Create test calendar file:

```bash
echo "## 10:00-11:00: 1:1 with Sarah Chen" > /tmp/test-calendar.md
claude skill run _sub/resolve-references --args "2026-02-17 /tmp/test-calendar.md"
```

Expected: Markdown output with resolved paths

**Step 5: Commit**

```bash
git add .claude/skills/_sub/resolve-references/SKILL.md
git commit -m "refactor(resolve-references): accept arguments instead of session directory"
```

---

## Task 3: Remove Obsolete Sub-Skills

**Files:**
- Delete: `.claude/skills/_sub/resolve-dates/`
- Delete: `.claude/skills/_sub/create-session/`

**Step 1: Verify no dependencies**

Search for references:

Run: `grep -r "resolve-dates" .claude/skills/ || echo "None found"`
Run: `grep -r "create-session" .claude/skills/ || echo "None found"`

Expected: Only references in orchestrator SKILL.md (which we'll update next)

**Step 2: Remove directories**

```bash
rm -rf .claude/skills/_sub/resolve-dates
rm -rf .claude/skills/_sub/create-session
```

**Step 3: Commit**

```bash
git add .claude/skills/_sub/
git commit -m "refactor: remove resolve-dates and create-session sub-skills"
```

---

## Task 4: Rewrite Orchestrator SKILL.md

**Files:**
- Modify: `.claude/skills/_core/orchestrator/SKILL.md`

**Step 1: Read current version**

Run: Read `.claude/skills/_core/orchestrator/SKILL.md`

**Step 2: Update frontmatter**

No changes needed:

```yaml
---
name: orchestrator
description: Internal orchestrator for executing skills with prose-driven context assembly. Interprets "## Context" sections and loads all context into conversation.
disable-model-invocation: false
internal: true
---
```

**Step 3: Rewrite orchestration instructions**

Replace entire content after frontmatter:

```markdown
# Orchestrator

Orchestrate skill execution by loading all context into conversation history before the skill runs.

## When to Use

Execute orchestration when a skill has `orchestrated: true` in frontmatter.

## Flow

### 1. Check for Context Section

Look for `## Context` section in the skill. If not present, skip orchestration (execute skill directly).

### 2. Resolve Date Arguments

Parse skill arguments for date references:
- Empty → today's date
- "tomorrow" → tomorrow's date
- "next monday" → next Monday's date
- "YYYY-MM-DD" → that date

Use Claude's natural date understanding. Post resolved date to conversation:

```
Target date: 2026-02-16 (tomorrow)
Scope: day
```

### 3. Parse Context Needs

Read the `## Context` section. Interpret prose to identify needs:

| Prose Pattern | Sub-Agent |
|--------------|-----------|
| "Calendar events" | fetch-calendar |
| "Week.md", "Month.md", "directives", "People files", "Projects" | resolve-references |

### 4. Spawn Sub-Agents (Parallel)

Spawn all sub-agents in single message using multiple Task calls.

**For calendar:**

```
Task(
  subagent_type: "Explore",
  description: "Fetch calendar for [date]",
  prompt: "Use skill _sub/fetch-calendar with argument: [target_date]"
)
```

**For vault references:**

```
Task(
  subagent_type: "Explore",
  description: "Resolve vault paths",
  prompt: "Use skill _sub/resolve-references with arguments: [target_date] [calendar_temp_file]"
)
```

If calendar fetched, write to temp file and pass path to resolve-references for people resolution.

### 5. Capture Results

Receive Task tool results containing markdown output from sub-agents.

**Calendar result:**
```markdown
# Calendar Events: 2026-02-16

You have 3 meetings scheduled:

**09:00-09:30** Team standup
**14:00-15:00** 1:1 with Sarah Chen
**16:00-17:00** Design review

Total: 3 meetings, 1 one-on-one, 5.5 hours focus time
```

**References result:**
```markdown
# Vault References

## Static Files
- **Week.md**: /vault/00_Brain/Captive/Week.md ✓
- **Directives**: /vault/00_Brain/Systemic/Directives/profile.md ✓

## People (from calendar 1:1s)
- **Sarah Chen**: /vault/02_Areas/People/Sarah Chen.md ✓

## Projects (active)
- **quarterly-planning**: /vault/01_Projects/2026-03-31-quarterly-planning.md ✓
```

### 6. Load Context Into Conversation

**A. Post sub-agent results**

Post calendar markdown to conversation.
Post vault references markdown to conversation.

**B. Read vault files**

For each file marked ✓ in vault references:
- Use Read tool to load file contents into conversation
- Skip files marked ✗ (don't exist)

**C. Post summary message**

```markdown
## Context Available

**Calendar:** 3 events for 2026-02-16 (loaded)
**Vault files:** Week.md, Directives (loaded), Month.md ❌ (not found)
**People:** Sarah Chen (loaded)
**Projects:** quarterly-planning (loaded)
```

### 7. Execute Skill

Find first section after `## Context` in skill (typically `## Validate` or `## Pre-Flight Check`).

Execute skill prose starting from that section. All context is already in conversation.

## Error Handling

**Blocking errors (stop):**
- Skill has `orchestrated: true` but no `## Context` section
- Vault not configured

**Graceful errors (note in summary, continue):**
- Calendar unavailable (ekctl not configured)
- Vault files missing
- People files not found
- Projects not found

Include error status in summary message. Skill adapts based on what's available.

## Summary Format

Always post summary after loading context:

```markdown
## Context Available

**Calendar:** [status]
**Vault files:** [list with status]
**People:** [list with status]
**Projects:** [list with status]
```

Status examples:
- "3 events for 2026-02-16 (loaded)"
- "❌ Unavailable (ekctl not configured)"
- "Week.md, Month.md (loaded), Quarter.md ❌ (not found)"
- "(no 1:1 meetings)"
- "(no active projects)"

## Key Principles

- **No session directories** - conversation history is state
- **Pre-load all context** - skills don't load incrementally
- **Summary message** - communicates availability clearly
- **Graceful degradation** - continue with partial context
- **Skills stay pure** - no orchestration mechanics in skill prose
```

**Step 4: Test with planning-daily**

Run: `claude skill run rituals/planning-daily tomorrow`

Expected: Orchestrator loads context, planning-daily executes normally

**Step 5: Commit**

```bash
git add .claude/skills/_core/orchestrator/SKILL.md
git commit -m "refactor(orchestrator): use conversation history instead of session files"
```

---

## Task 5: Update planning-daily Skill

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 1: Read current version**

Run: Read `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 2: Add orchestrated frontmatter**

```yaml
---
name: planning-daily
description: Morning ritual for planning the day
orchestrated: true
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---
```

**Step 3: Rename context section**

Change `## What I Need` to `## Context`:

```markdown
## Context

- Calendar events for the day
- User's directives and preferences
- Today.md file for this day (may not exist yet)
- Week.md for weekly context
- Month.md for monthly context
- Quarter.md for coaching context
- People files for anyone with 1:1 meetings
- Active project files
```

**Step 4: Update Pre-Flight Check section**

Add context reference:

```markdown
## Pre-Flight Check

Read the context summary to see what's available.

Check if Today.md already exists for the target date. If it does:
...
```

**Step 5: Update Planning Session section**

Add context reference at start:

```markdown
## Planning Session

All context has been pre-loaded. Calendar, vault files, people files, and projects are in conversation history.

Greet the user using their preferred name from directives.
...
```

**Step 6: Test end-to-end**

Run: `claude skill run rituals/planning-daily tomorrow`

Expected:
1. Orchestrator resolves date
2. Spawns fetch-calendar and resolve-references
3. Loads all context
4. Posts summary
5. Executes planning-daily
6. Creates Today.md

**Step 7: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "refactor(planning-daily): use conversation-based orchestration"
```

---

## Task 6: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Read current prose-driven orchestration section**

Run: Read `CLAUDE.md` (lines 88-174)

**Step 2: Update Context Pre-Loading section**

Replace lines 92-168 with:

```markdown
#### Context Pre-Loading

The orchestrator loads all context into conversation before skill execution. Skills reference context naturally without orchestration mechanics.

**Context references in skills:**
- "Review the calendar" (not "Load calendar.md from session")
- "Check Week.md" (not "Load Week.md from path in memory.md")
- "For people in 1:1s, review their files"

**How orchestration works:**

1. **Date Resolution** - Orchestrator resolves time arguments (tomorrow → 2026-02-16)
2. **Need Interpretation** - Parses `## Context` section:
   - "Calendar events" → spawn fetch-calendar sub-skill
   - "Week.md / Month.md" → resolve vault paths
   - "People files for 1:1s" → resolve from calendar + vault
   - "Active projects" → scan vault
3. **Parallel Fetching** - Spawns sub-skills in parallel via Task tool
4. **Context Loading** - Loads all context into conversation:
   - Posts sub-agent results (calendar, resolved paths)
   - Reads vault files using Read tool
   - Posts summary message
5. **Skill Execution** - Executes skill prose with all context in conversation

**All context is pre-loaded:**
- Sub-agents return data via Task tool results
- Orchestrator loads vault files using Read tool
- Summary message communicates what's available
- Skills reference context naturally from conversation history

**Benefits:**
- **No intermediate files** - conversation history is state
- **No cleanup needed** - no session directories
- **Simpler debugging** - everything visible in conversation
- **Pure prose** - skills unaware of orchestration
```

**Step 3: Remove session directory references**

Delete lines 123-162 (session structure, memory.md format sections).

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update orchestration to conversation-based design"
```

---

## Task 7: Update DEVELOPING.md Documentation

**Files:**
- Modify: `DEVELOPING.md`

**Step 1: Find prose-driven orchestration section**

Run: Read `DEVELOPING.md` (lines 275-453)

**Step 2: Update "Writing Prose-Driven Skills" section**

Replace lines 280-335 with:

```markdown
### Writing Prose-Driven Skills

1. Add `orchestrated: true` to frontmatter
2. Add `## Context` section declaring needs in prose
3. Write inline phases as natural language instructions

**Example:**

```markdown
---
name: planning-daily
description: Morning ritual for planning the day
orchestrated: true
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day.

## Context

- Calendar events for the day
- User's directives and preferences
- Week.md for weekly context
- People files for anyone with 1:1 meetings
- Active project files

## Pre-Flight Check

Read the context summary to see what's available.

Check if Today.md already exists...

## Planning Session

All context has been pre-loaded into conversation.

Greet the user using their preferred name from directives.
Load their calendar from conversation - what meetings do they have?
Check Week.md for weekly goals...
```

No orchestration mechanics in skill prose.
```

**Step 3: Update "How Orchestration Works" section**

Replace lines 336-395 with:

```markdown
### How Orchestration Works

**1. Date Resolution**

Orchestrator uses Claude's date understanding:
- Empty → today
- "tomorrow" → next day
- "next monday" → next Monday
- "YYYY-MM-DD" → specific date

**2. Need Interpretation**

Parses `## Context` prose:

| Prose Pattern | Fulfillment |
|--------------|-------------|
| "Calendar events" | Spawn fetch-calendar sub-skill |
| "Week.md / Month.md" | Resolve vault paths |
| "People files for 1:1s" | Parse calendar, find vault files |
| "Active projects" | Scan vault projects directory |

**3. Parallel Sub-Agent Spawning**

Spawns fetch-calendar and resolve-references in parallel via Task tool.

**4. Context Loading**

- Captures Task results (calendar markdown, vault paths)
- Reads vault files using Read tool
- Posts summary message to conversation

**5. Skill Execution**

Executes skill prose with all context in conversation.

**No session directories:**
- Conversation history is state
- Sub-agents return data via Task results
- Orchestrator loads into conversation
- Summary message communicates availability
```

**Step 4: Update Sub-Skills section**

Replace lines 396-420 with:

```markdown
### Sub-Skills for Orchestration

**fetch-calendar:**
- Input: target_date (YYYY-MM-DD)
- Output: Markdown via stdout
- Returns: Natural prose describing events

**resolve-references:**
- Input: target_date, optional calendar_file
- Output: Structured markdown via stdout
- Returns: Categorized vault paths with status (✓/✗)

**Removed:**
- resolve-dates (orchestrator handles dates directly)
- create-session (no sessions needed)
```

**Step 5: Update Benefits section**

Replace lines 422-432 with:

```markdown
### Benefits

| Benefit | Description |
|---------|-------------|
| **Pure declarative intent** | Skills describe WHAT, not HOW |
| **Natural language** | Prose instructions Claude interprets naturally |
| **No intermediate files** | Conversation history is state |
| **Parallel execution** | Sub-agents spawn simultaneously |
| **Direct vault access** | Read files directly, no copying |
| **Simpler debugging** | Everything visible in conversation |
| **No cleanup logic** | No session directories to manage |
```

**Step 6: Commit**

```bash
git add DEVELOPING.md
git commit -m "docs: update orchestration architecture in DEVELOPING.md"
```

---

## Task 8: Test End-to-End

**Files:**
- None (testing only)

**Step 1: Test planning-daily with tomorrow**

```bash
claude skill run rituals/planning-daily tomorrow
```

Expected:
1. Orchestrator resolves "tomorrow" to 2026-02-16
2. Spawns fetch-calendar and resolve-references
3. Loads calendar, vault files, people files
4. Posts summary
5. Executes planning session
6. Creates Today.md for 2026-02-16

**Step 2: Test with specific date**

```bash
claude skill run rituals/planning-daily --args "2026-02-20"
```

Expected: Same flow for 2026-02-20

**Step 3: Test with missing calendar**

Temporarily rename ekctl:

```bash
sudo mv /opt/homebrew/bin/ekctl /opt/homebrew/bin/ekctl.bak
claude skill run rituals/planning-daily tomorrow
sudo mv /opt/homebrew/bin/ekctl.bak /opt/homebrew/bin/ekctl
```

Expected:
- Orchestrator notes calendar unavailable in summary
- planning-daily adapts (asks user about meetings)
- Skill completes successfully

**Step 4: Test with missing vault files**

Temporarily rename Week.md:

```bash
vault_path=$(grep "^vault_path:" .claude/config.md | cut -d' ' -f2-)
mv "$vault_path/00_Brain/Captive/Week.md" "$vault_path/00_Brain/Captive/Week.md.bak"
claude skill run rituals/planning-daily tomorrow
mv "$vault_path/00_Brain/Captive/Week.md.bak" "$vault_path/00_Brain/Captive/Week.md"
```

Expected:
- Orchestrator notes Week.md unavailable in summary
- planning-daily adapts (skips weekly context)
- Skill completes successfully

**Step 5: Verify no session directories created**

```bash
ls /tmp/2bd-session-* 2>/dev/null || echo "No session directories (expected)"
```

Expected: No directories found

**Step 6: Document test results**

Create test summary in this file (end-to-end testing section).

---

## Task 9: Clean Up Old Design Documents

**Files:**
- Review: `docs/plans/2026-02-15-orchestrator-*.md`
- Add note to old docs

**Step 1: List orchestrator design docs**

```bash
ls -1 docs/plans/2026-02-15-orchestrator-*.md
```

**Step 2: Add deprecation notice**

For each old design doc (except conversation-history-design.md), add at top:

```markdown
> **DEPRECATED:** This design was superseded by conversation-history-design.md. Session directories were eliminated in favor of conversation history as state.
```

Files to update:
- `docs/plans/2026-02-15-orchestrator-engine-design.md`
- `docs/plans/2026-02-15-orchestrator-engine-implementation.md`
- `docs/plans/2026-02-15-orchestrator-redesign-design.md`
- `docs/plans/2026-02-15-orchestrator-redesign-implementation.md`
- `docs/plans/2026-02-15-orchestrator-redesign-implementation-revised.md`

**Step 3: Commit**

```bash
git add docs/plans/
git commit -m "docs: deprecate old orchestrator design documents"
```

---

## Task 10: Final Verification

**Files:**
- None (verification only)

**Step 1: Verify sub-agent interfaces**

Test each sub-agent independently:

```bash
# fetch-calendar
claude skill run _sub/fetch-calendar --args "2026-02-17"

# resolve-references
echo "## 10:00: 1:1 with Test Person" > /tmp/test-cal.md
claude skill run _sub/resolve-references --args "2026-02-17 /tmp/test-cal.md"
rm /tmp/test-cal.md
```

Expected: Markdown output to stdout (no files created)

**Step 2: Verify planning-daily**

```bash
claude skill run rituals/planning-daily tomorrow
```

Expected: Complete planning session, Today.md created

**Step 3: Verify conversation history**

Check conversation transcript shows:
1. Date resolution message
2. Calendar events loaded
3. Vault references loaded
4. Context summary message
5. Planning session dialogue

**Step 4: Verify no lingering session references**

```bash
grep -r "SESSION_DIR" .claude/skills/ && echo "Found references (investigate)" || echo "Clean"
grep -r "memory.md" .claude/skills/ && echo "Found references (investigate)" || echo "Clean"
grep -r "/tmp/2bd-session" .claude/skills/ && echo "Found references (investigate)" || echo "Clean"
```

Expected: All clean (orchestrator SKILL.md may reference these in comments)

**Step 5: Create completion summary**

Document:
- What changed (session directories → conversation history)
- What was removed (resolve-dates, create-session)
- What was updated (fetch-calendar, resolve-references, orchestrator, planning-daily)
- Test results (all passing)

---

## Success Criteria

- [ ] fetch-calendar returns markdown via stdout
- [ ] resolve-references accepts arguments and returns markdown
- [ ] resolve-dates and create-session removed
- [ ] Orchestrator uses conversation history as state
- [ ] planning-daily uses `orchestrated: true` and `## Context`
- [ ] No session directories created during execution
- [ ] All context visible in conversation history
- [ ] Graceful degradation works (missing calendar, vault files)
- [ ] Documentation updated (CLAUDE.md, DEVELOPING.md)
- [ ] Old design docs marked deprecated

---

## Notes

- Each task is independent where possible
- Test after each major change
- Commit frequently with clear messages
- Rollback strategy: revert commits if issues arise
- Only planning-daily uses orchestration currently (limited blast radius)
