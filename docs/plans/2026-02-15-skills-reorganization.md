# Skills Reorganization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Flatten skills directory to 2 levels (Category → Skill) with consistent verb-noun naming.

**Architecture:** Move skill directories, update all phases.yaml references, then update documentation. Each category (sub-skills, rituals, commands) is handled as a batch with a commit checkpoint.

**Tech Stack:** Git, Bash (mv commands), text editing for references

---

## Task 1: Move Sub-skills (fetch)

**Files:**
- Move: `.claude/skills/_sub/fetch/get-*` → `.claude/skills/_sub/fetch-*`

**Step 1: Move fetch sub-skills**

```bash
cd /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/_sub
mv fetch/get-active-projects fetch-active-projects
mv fetch/get-calendar fetch-calendar
mv fetch/get-config fetch-config
mv fetch/get-dates fetch-dates
mv fetch/get-directives fetch-directives
mv fetch/get-month-content fetch-month-content
mv fetch/get-quarter-content fetch-quarter-content
mv fetch/get-today-content fetch-today-content
mv fetch/get-week-content fetch-week-content
mv fetch/get-year-content fetch-year-content
```

**Step 2: Remove empty fetch directory**

```bash
rm -rf fetch
```

**Step 3: Verify moves**

Run: `ls -la /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/_sub/`
Expected: `fetch-*` directories visible, no `fetch/` directory

---

## Task 2: Move Sub-skills (synthesis)

**Files:**
- Move: `.claude/skills/_sub/synthesis/*` → `.claude/skills/_sub/*`

**Step 1: Move synthesis sub-skills**

```bash
cd /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/_sub
mv synthesis/extract-to-areas extract-to-areas
mv synthesis/gather-month-context gather-month-context
mv synthesis/gather-quarter-context gather-quarter-context
mv synthesis/gather-week-context gather-week-context
mv synthesis/gather-year-context gather-year-context
```

**Step 2: Remove empty synthesis directory**

```bash
rm -rf synthesis
```

**Step 3: Verify moves**

Run: `ls -la /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/_sub/`
Expected: `gather-*`, `extract-to-areas` directories visible, no `synthesis/` directory

---

## Task 3: Move Sub-skills (write)

**Files:**
- Move: `.claude/skills/_sub/write/*` → `.claude/skills/_sub/*`
- Rename: `captive-note` → `write-captive-note`

**Step 1: Move write sub-skills**

```bash
cd /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/_sub
mv write/archive-daily archive-daily
mv write/archive-monthly archive-monthly
mv write/archive-quarterly archive-quarterly
mv write/archive-weekly archive-weekly
mv write/archive-yearly archive-yearly
mv write/captive-note write-captive-note
mv write/update-semantic update-semantic
```

**Step 2: Remove empty write directory**

```bash
rm -rf write
```

**Step 3: Verify all sub-skills**

Run: `ls -1 /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/_sub/ | sort`

Expected:
```
archive-daily
archive-monthly
archive-quarterly
archive-weekly
archive-yearly
extract-to-areas
fetch-active-projects
fetch-calendar
fetch-config
fetch-dates
fetch-directives
fetch-month-content
fetch-quarter-content
fetch-today-content
fetch-week-content
fetch-year-content
gather-month-context
gather-quarter-context
gather-week-context
gather-year-context
update-semantic
write-captive-note
```

**Step 4: Commit sub-skill moves**

```bash
git add -A .claude/skills/_sub/
git commit -m "refactor(skills): flatten _sub/ directory structure

Move sub-skills from _sub/{fetch,synthesis,write}/ to _sub/.
Rename get-* to fetch-*, captive-note to write-captive-note."
```

---

## Task 4: Move Rituals (planning)

**Files:**
- Move: `.claude/skills/rituals/planning/*-planning` → `.claude/skills/rituals/planning-*`

**Step 1: Move planning rituals**

```bash
cd /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/rituals
mv planning/daily-planning planning-daily
mv planning/monthly-planning planning-monthly
mv planning/quarterly-planning planning-quarterly
mv planning/weekly-planning planning-weekly
mv planning/yearly-planning planning-yearly
```

**Step 2: Remove empty planning directory**

```bash
rm -rf planning
```

---

## Task 5: Move Rituals (review)

**Files:**
- Move: `.claude/skills/rituals/review/*-review` → `.claude/skills/rituals/review-*`

**Step 1: Move review rituals**

```bash
cd /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/rituals
mv review/daily-review review-daily
mv review/monthly-review review-monthly
mv review/quarterly-review review-quarterly
mv review/weekly-review review-weekly
mv review/yearly-review review-yearly
```

**Step 2: Remove empty review directory**

```bash
rm -rf review
```

**Step 3: Verify all rituals**

Run: `ls -1 /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/rituals/ | sort`

Expected:
```
planning-daily
planning-monthly
planning-quarterly
planning-weekly
planning-yearly
review-daily
review-monthly
review-quarterly
review-weekly
review-yearly
```

**Step 4: Commit ritual moves**

```bash
git add -A .claude/skills/rituals/
git commit -m "refactor(skills): flatten rituals/ directory structure

Move rituals from rituals/{planning,review}/ to rituals/.
Rename daily-planning to planning-daily, etc."
```

---

## Task 6: Move Commands

**Files:**
- Move: `.claude/skills/actions/` → `.claude/skills/commands/`
- Rename: `person-onboard` → `onboard-person`

**Step 1: Rename actions to commands**

```bash
cd /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills
mv actions commands
```

**Step 2: Rename person-onboard**

```bash
mv commands/person-onboard commands/onboard-person
```

**Step 3: Verify commands**

Run: `ls -1 /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/commands/`

Expected:
```
init
migrate
onboard-person
```

**Step 4: Commit command moves**

```bash
git add -A .claude/skills/actions/ .claude/skills/commands/
git commit -m "refactor(skills): rename actions/ to commands/

Also rename person-onboard to onboard-person for verb-noun consistency."
```

---

## Task 7: Update phases.yaml References

**Files:**
- Modify: All `phases.yaml` files in `.claude/skills/rituals/*/`

**Step 1: Update all phases.yaml files**

For each `phases.yaml` file, apply these replacements:

| Old | New |
|-----|-----|
| `_sub/fetch/get-config` | `_sub/fetch-config` |
| `_sub/fetch/get-dates` | `_sub/fetch-dates` |
| `_sub/fetch/get-directives` | `_sub/fetch-directives` |
| `_sub/fetch/get-calendar` | `_sub/fetch-calendar` |
| `_sub/fetch/get-today-content` | `_sub/fetch-today-content` |
| `_sub/fetch/get-week-content` | `_sub/fetch-week-content` |
| `_sub/fetch/get-month-content` | `_sub/fetch-month-content` |
| `_sub/fetch/get-quarter-content` | `_sub/fetch-quarter-content` |
| `_sub/fetch/get-year-content` | `_sub/fetch-year-content` |
| `_sub/fetch/get-active-projects` | `_sub/fetch-active-projects` |
| `_sub/synthesis/gather-week-context` | `_sub/gather-week-context` |
| `_sub/synthesis/gather-month-context` | `_sub/gather-month-context` |
| `_sub/synthesis/gather-quarter-context` | `_sub/gather-quarter-context` |
| `_sub/synthesis/gather-year-context` | `_sub/gather-year-context` |
| `_sub/write/captive-note` | `_sub/write-captive-note` |
| `_sub/write/archive-daily` | `_sub/archive-daily` |
| `_sub/write/archive-weekly` | `_sub/archive-weekly` |
| `_sub/write/archive-monthly` | `_sub/archive-monthly` |
| `_sub/write/archive-quarterly` | `_sub/archive-quarterly` |
| `_sub/write/archive-yearly` | `_sub/archive-yearly` |

**Files to update:**
- `rituals/planning-daily/phases.yaml`
- `rituals/planning-weekly/phases.yaml`
- `rituals/planning-monthly/phases.yaml`
- `rituals/planning-quarterly/phases.yaml`
- `rituals/planning-yearly/phases.yaml`
- `rituals/review-daily/phases.yaml`
- `rituals/review-weekly/phases.yaml`
- `rituals/review-monthly/phases.yaml`
- `rituals/review-quarterly/phases.yaml`
- `rituals/review-yearly/phases.yaml`

**Step 2: Verify no old references remain**

Run: `grep -r "_sub/fetch/\|_sub/write/\|_sub/synthesis/" /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/rituals/`

Expected: No output (no matches)

**Step 3: Commit phases.yaml updates**

```bash
git add .claude/skills/rituals/*/phases.yaml
git commit -m "refactor(skills): update phases.yaml sub-skill references

Update all skill paths to match flattened _sub/ structure."
```

---

## Task 8: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update Quick Reference section**

Replace:
```bash
claude skill run rituals/planning/daily-planning   # morning
claude skill run rituals/review/daily-review       # evening
claude skill run actions/init --args "profile"     # update profile
```

With:
```bash
claude skill run rituals/planning-daily   # morning
claude skill run rituals/review-daily     # evening
claude skill run commands/init --args "profile"   # update profile
```

**Step 2: Update any other skill path references**

Search for and update:
- `rituals/planning/` → `rituals/planning-`
- `rituals/review/` → `rituals/review-`
- `actions/` → `commands/`
- `_sub/fetch/` → `_sub/fetch-`
- `_sub/write/` → `_sub/write-` (only for captive-note)
- `_sub/synthesis/` → `_sub/`

**Step 3: Verify no old references remain**

Run: `grep -E "rituals/planning/|rituals/review/|actions/|_sub/fetch/|_sub/write/|_sub/synthesis/" /Users/D038720/Code/github.com/bugroger/2bd/CLAUDE.md`

Expected: No output

---

## Task 9: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Update all skill path references**

Apply same replacements as Task 8.

**Step 2: Verify no old references remain**

Run: `grep -E "rituals/planning/|rituals/review/|actions/|_sub/fetch/|_sub/write/|_sub/synthesis/" /Users/D038720/Code/github.com/bugroger/2bd/README.md`

Expected: No output

---

## Task 10: Update DEVELOPING.md

**Files:**
- Modify: `DEVELOPING.md`

**Step 1: Update all skill path references**

Apply same replacements as Task 8.

**Step 2: Update directory structure diagrams**

Update the ASCII tree diagrams to show:
- `commands/` instead of `actions/`
- Flat `rituals/` structure
- Flat `_sub/` structure

**Step 3: Update sub-skill category descriptions**

Replace:
```
| `_sub/synthesis/` | Content combination and transformation | gather-context, extract-actions |
| `_sub/fetch/` | Data retrieval from system or external sources | get-dates, get-calendar, get-config, get-directives |
| `_sub/write/` | Write operations with validation | captive-note |
```

With:
```
| `_sub/gather-*` | Content combination and transformation | gather-week-context, gather-month-context |
| `_sub/fetch-*` | Data retrieval from system or external sources | fetch-dates, fetch-calendar, fetch-config |
| `_sub/archive-*` | Archive operations | archive-daily, archive-weekly |
| `_sub/write-*` | Write operations | write-captive-note |
```

**Step 4: Verify no old references remain**

Run: `grep -E "rituals/planning/|rituals/review/|actions/|_sub/fetch/|_sub/write/|_sub/synthesis/" /Users/D038720/Code/github.com/bugroger/2bd/DEVELOPING.md`

Expected: No output

---

## Task 11: Update scaffold/00_Brain/✱ Home.md

**Files:**
- Modify: `scaffold/00_Brain/✱ Home.md`

**Step 1: Update skill path references**

Replace:
```
- `claude skill run rituals/planning/daily-planning`
- `claude skill run rituals/review/daily-review`
- `claude skill run actions/create-project "Project Name"`
```

With:
```
- `claude skill run rituals/planning-daily`
- `claude skill run rituals/review-daily`
- `claude skill run commands/create-project "Project Name"`
```

---

## Task 12: Final Commit and Verification

**Step 1: Commit documentation updates**

```bash
git add CLAUDE.md README.md DEVELOPING.md scaffold/
git commit -m "docs: update skill paths for flattened structure

Update all documentation to reference new paths:
- rituals/planning-* instead of rituals/planning/*-planning
- rituals/review-* instead of rituals/review/*-review
- commands/ instead of actions/
- _sub/fetch-* instead of _sub/fetch/get-*"
```

**Step 2: Verify final structure**

Run: `find /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills -type d -maxdepth 2 | sort`

Expected structure:
```
.claude/skills
.claude/skills/_core
.claude/skills/_core/orchestrator
.claude/skills/_dev
.claude/skills/_dev/sync-templates
.claude/skills/_sub
.claude/skills/_sub/archive-daily
.claude/skills/_sub/archive-monthly
.claude/skills/_sub/archive-quarterly
.claude/skills/_sub/archive-weekly
.claude/skills/_sub/archive-yearly
.claude/skills/_sub/extract-to-areas
.claude/skills/_sub/fetch-active-projects
.claude/skills/_sub/fetch-calendar
.claude/skills/_sub/fetch-config
.claude/skills/_sub/fetch-dates
.claude/skills/_sub/fetch-directives
.claude/skills/_sub/fetch-month-content
.claude/skills/_sub/fetch-quarter-content
.claude/skills/_sub/fetch-today-content
.claude/skills/_sub/fetch-week-content
.claude/skills/_sub/fetch-year-content
.claude/skills/_sub/gather-month-context
.claude/skills/_sub/gather-quarter-context
.claude/skills/_sub/gather-week-context
.claude/skills/_sub/gather-year-context
.claude/skills/_sub/update-semantic
.claude/skills/_sub/write-captive-note
.claude/skills/commands
.claude/skills/commands/init
.claude/skills/commands/migrate
.claude/skills/commands/onboard-person
.claude/skills/rituals
.claude/skills/rituals/planning-daily
.claude/skills/rituals/planning-monthly
.claude/skills/rituals/planning-quarterly
.claude/skills/rituals/planning-weekly
.claude/skills/rituals/planning-yearly
.claude/skills/rituals/review-daily
.claude/skills/rituals/review-monthly
.claude/skills/rituals/review-quarterly
.claude/skills/rituals/review-weekly
.claude/skills/rituals/review-yearly
```

**Step 3: Verify no broken references**

Run: `grep -r "_sub/fetch/\|_sub/write/\|_sub/synthesis/\|rituals/planning/\|rituals/review/\|actions/" /Users/D038720/Code/github.com/bugroger/2bd/.claude/skills/ /Users/D038720/Code/github.com/bugroger/2bd/*.md /Users/D038720/Code/github.com/bugroger/2bd/scaffold/`

Expected: No output (only in docs/plans/ which documents the old structure)

**Step 4: Test a ritual**

Run: `claude skill run rituals/planning-daily --dry-run` (if available) or verify manually.
