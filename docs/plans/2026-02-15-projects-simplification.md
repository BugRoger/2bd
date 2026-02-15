# Projects Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify project fetching to focus on active projects by default, rename skill to vault-specific name, and remove projects from quarterly/yearly rituals.

**Architecture:** Rename `_sub/fetch-projects` to `_sub/fetch-projects-vault`, keep scope argument with `active` as default, update all ritual phase files to use new name, and remove project fetching from quarterly/yearly planning.

**Tech Stack:** YAML (phase files), Markdown (skill documentation), Git (file operations)

---

## Task 1: Rename Skill Directory and Update Frontmatter

**Files:**
- Rename: `.claude/skills/_sub/fetch-projects/` → `.claude/skills/_sub/fetch-projects-vault/`
- Modify: `.claude/skills/_sub/fetch-projects-vault/SKILL.md:1-7`

**Step 1: Rename the skill directory**

```bash
cd /Users/D038720/Code/github.com/bugroger/2bd
mv .claude/skills/_sub/fetch-projects .claude/skills/_sub/fetch-projects-vault
```

Expected: Directory renamed successfully

**Step 2: Update skill name in frontmatter**

In `.claude/skills/_sub/fetch-projects-vault/SKILL.md`, change line 2:

```markdown
name: fetch-projects-vault
```

**Step 3: Update description**

In `.claude/skills/_sub/fetch-projects-vault/SKILL.md`, change line 3:

```markdown
description: List projects from vault 01_Projects/ (active by default) and 04_Archives/Projects/ (archived). Returns structured data with title, deadline, status, and timeline urgency.
```

**Step 4: Update argument hint**

In `.claude/skills/_sub/fetch-projects-vault/SKILL.md`, change line 6:

```markdown
argument-hint: "[scope: active|archived|all (default: active)]"
```

**Step 5: Verify file reads correctly**

```bash
head -10 .claude/skills/_sub/fetch-projects-vault/SKILL.md
```

Expected: Should show updated frontmatter with new name and description

**Step 6: Commit the rename**

```bash
git add -A
git commit -m "refactor(skills): rename fetch-projects to fetch-projects-vault"
```

---

## Task 2: Update Skill Documentation Body

**Files:**
- Modify: `.claude/skills/_sub/fetch-projects-vault/SKILL.md:9-30`

**Step 1: Update main heading**

In `.claude/skills/_sub/fetch-projects-vault/SKILL.md`, change line 9:

```markdown
# Fetch Projects Vault Sub-Skill
```

**Step 2: Update description paragraph**

Change line 11:

```markdown
Scans vault project folders and returns structured data for project lifecycle management. Defaults to active projects only.
```

**Step 3: Update Arguments section**

Change lines 17-22 to:

```markdown
## Arguments

- `scope` - Optional. Filter by project location (default: `active`):
  - `active` - Only projects in `01_Projects/` (default)
  - `archived` - Only projects in `04_Archives/Projects/`
  - `all` - Both active and archived projects
```

**Step 4: Verify changes**

```bash
head -30 .claude/skills/_sub/fetch-projects-vault/SKILL.md
```

Expected: Updated documentation reflecting new defaults

**Step 5: Commit documentation updates**

```bash
git add .claude/skills/_sub/fetch-projects-vault/SKILL.md
git commit -m "docs(skills): update fetch-projects-vault documentation"
```

---

## Task 3: Update Daily Planning Phase File

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/phases.yaml:50`

**Step 1: Read current phase file**

```bash
grep -n "fetch-active-projects" .claude/skills/rituals/planning-daily/phases.yaml
```

Expected: Shows line 50 with `fetch-active-projects`

**Step 2: Update skill name**

In `.claude/skills/rituals/planning-daily/phases.yaml`, change line 50:

```yaml
      - skill: _sub/fetch-projects-vault
```

**Step 3: Verify the change**

```bash
grep -A2 -B2 "fetch-projects-vault" .claude/skills/rituals/planning-daily/phases.yaml
```

Expected: Shows updated skill name in context

**Step 4: Commit the change**

```bash
git add .claude/skills/rituals/planning-daily/phases.yaml
git commit -m "refactor(rituals): update daily planning to use fetch-projects-vault"
```

---

## Task 4: Update Weekly Planning Phase File

**Files:**
- Modify: `.claude/skills/rituals/planning-weekly/phases.yaml`

**Step 1: Find the reference**

```bash
grep -n "fetch-active-projects\|fetch-projects" .claude/skills/rituals/planning-weekly/phases.yaml
```

Expected: Shows line number with old skill name

**Step 2: Update skill name to fetch-projects-vault**

Update the matching line to:

```yaml
      - skill: _sub/fetch-projects-vault
```

**Step 3: Verify the change**

```bash
grep -A2 -B2 "fetch-projects-vault" .claude/skills/rituals/planning-weekly/phases.yaml
```

Expected: Shows updated skill name in context

**Step 4: Commit the change**

```bash
git add .claude/skills/rituals/planning-weekly/phases.yaml
git commit -m "refactor(rituals): update weekly planning to use fetch-projects-vault"
```

---

## Task 5: Update Monthly Planning Phase File

**Files:**
- Modify: `.claude/skills/rituals/planning-monthly/phases.yaml`

**Step 1: Find the reference**

```bash
grep -n "fetch-active-projects\|fetch-projects" .claude/skills/rituals/planning-monthly/phases.yaml
```

Expected: Shows line number with old skill name

**Step 2: Update skill name to fetch-projects-vault**

Update the matching line to:

```yaml
      - skill: _sub/fetch-projects-vault
```

**Step 3: Verify the change**

```bash
grep -A2 -B2 "fetch-projects-vault" .claude/skills/rituals/planning-monthly/phases.yaml
```

Expected: Shows updated skill name in context

**Step 4: Commit the change**

```bash
git add .claude/skills/rituals/planning-monthly/phases.yaml
git commit -m "refactor(rituals): update monthly planning to use fetch-projects-vault"
```

---

## Task 6: Remove Projects from Quarterly Planning

**Files:**
- Modify: `.claude/skills/rituals/planning-quarterly/phases.yaml:38-43`

**Step 1: Read the current file to find project fetching section**

```bash
grep -n "fetch-active-projects" .claude/skills/rituals/planning-quarterly/phases.yaml
```

Expected: Shows lines 38-43 with the fetch-active-projects subagent

**Step 2: Remove the entire subagent block**

Remove lines 38-43 (the complete subagent entry including all its fields):

```yaml
      - skill: _sub/fetch-active-projects
        type: explore
        args: "filter=all"
        output: PROJECTS
        optional: true
        on_error: "No active projects found."
```

**Step 3: Verify the removal**

```bash
grep "fetch-active-projects\|fetch-projects\|PROJECTS" .claude/skills/rituals/planning-quarterly/phases.yaml
```

Expected: No output (no project references remain)

**Step 4: Verify YAML is still valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('.claude/skills/rituals/planning-quarterly/phases.yaml'))"
```

Expected: No errors (valid YAML)

**Step 5: Commit the change**

```bash
git add .claude/skills/rituals/planning-quarterly/phases.yaml
git commit -m "refactor(rituals): remove project fetching from quarterly planning"
```

---

## Task 7: Remove Projects from Yearly Planning

**Files:**
- Modify: `.claude/skills/rituals/planning-yearly/phases.yaml:33-38`

**Step 1: Read the current file to find project fetching section**

```bash
grep -n "fetch-active-projects" .claude/skills/rituals/planning-yearly/phases.yaml
```

Expected: Shows lines 33-38 with the fetch-active-projects subagent

**Step 2: Remove the entire subagent block**

Remove lines 33-38 (the complete subagent entry including all its fields):

```yaml
      - skill: _sub/fetch-active-projects
        type: explore
        args: "filter=all"
        output: PROJECTS
        optional: true
        on_error: "No active projects found."
```

**Step 3: Verify the removal**

```bash
grep "fetch-active-projects\|fetch-projects\|PROJECTS" .claude/skills/rituals/planning-yearly/phases.yaml
```

Expected: No output (no project references remain)

**Step 4: Verify YAML is still valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('.claude/skills/rituals/planning-yearly/phases.yaml'))"
```

Expected: No errors (valid YAML)

**Step 5: Commit the change**

```bash
git add .claude/skills/rituals/planning-yearly/phases.yaml
git commit -m "refactor(rituals): remove project fetching from yearly planning"
```

---

## Task 8: Update Create-Project Command

**Files:**
- Modify: `.claude/skills/commands/create-project/phases.yaml`

**Step 1: Find the reference**

```bash
grep -n "fetch-projects" .claude/skills/commands/create-project/phases.yaml
```

Expected: Shows line number with skill reference

**Step 2: Update skill name to fetch-projects-vault**

Update the matching line to:

```yaml
      - skill: _sub/fetch-projects-vault
```

**Step 3: Verify the change**

```bash
grep -A2 -B2 "fetch-projects-vault" .claude/skills/commands/create-project/phases.yaml
```

Expected: Shows updated skill name in context

**Step 4: Commit the change**

```bash
git add .claude/skills/commands/create-project/phases.yaml
git commit -m "refactor(commands): update create-project to use fetch-projects-vault"
```

---

## Task 9: Update Archive-Project Command

**Files:**
- Modify: `.claude/skills/commands/archive-project/phases.yaml`

**Step 1: Find the reference**

```bash
grep -n "fetch-projects" .claude/skills/commands/archive-project/phases.yaml
```

Expected: Shows line number with skill reference

**Step 2: Update skill name to fetch-projects-vault**

Update the matching line to:

```yaml
      - skill: _sub/fetch-projects-vault
```

**Step 3: Verify the change**

```bash
grep -A2 -B2 "fetch-projects-vault" .claude/skills/commands/archive-project/phases.yaml
```

Expected: Shows updated skill name in context

**Step 4: Commit the change**

```bash
git add .claude/skills/commands/archive-project/phases.yaml
git commit -m "refactor(commands): update archive-project to use fetch-projects-vault"
```

---

## Task 10: Check and Update gather-key-dates if Needed

**Files:**
- Check: `.claude/skills/_sub/gather-key-dates/SKILL.md`

**Step 1: Search for any project references**

```bash
grep -i "fetch-projects\|fetch-active-projects" .claude/skills/_sub/gather-key-dates/SKILL.md
```

Expected: Either shows matches that need updating, or no output

**Step 2a: If matches found - update them**

Replace any occurrences of `fetch-projects` or `fetch-active-projects` with `fetch-projects-vault`

**Step 2b: If no matches - skip this task**

No changes needed

**Step 3: If changes made - commit**

```bash
git add .claude/skills/_sub/gather-key-dates/SKILL.md
git commit -m "refactor(skills): update gather-key-dates references to fetch-projects-vault"
```

---

## Task 11: Search for Any Other References

**Files:**
- Check: All documentation files

**Step 1: Search entire codebase for old skill name**

```bash
grep -r "fetch-projects" --include="*.md" --include="*.yaml" .claude/ docs/
```

Expected: Shows any remaining references (excluding the renamed skill itself)

**Step 2: Review and update any found references**

For each match found, update to `fetch-projects-vault`

**Step 3: Verify no references remain**

```bash
grep -r "\bfetch-projects\b" --include="*.md" --include="*.yaml" .claude/ docs/ | grep -v "fetch-projects-vault"
```

Expected: No output (or only references within the fetch-projects-vault skill itself)

**Step 4: Commit any changes**

```bash
git add -A
git commit -m "docs: update remaining references to fetch-projects-vault"
```

---

## Task 12: Verification Testing - Daily Ritual

**Files:**
- Test: `.claude/skills/rituals/planning-daily/`

**Step 1: Run daily planning ritual**

```bash
cd ~/Code/2bd-engine
claude skill run rituals/planning-daily
```

Expected: Ritual runs successfully, projects are fetched and displayed

**Step 2: Check for any errors related to project fetching**

Look in output for:
- "fetch-projects-vault" being invoked
- Project data appearing in planning context
- No errors about missing skills

Expected: All subagents succeed, projects appear

**Step 3: Document result**

Note: ✅ Daily planning verified - projects load successfully

---

## Task 13: Verification Testing - Weekly Ritual

**Files:**
- Test: `.claude/skills/rituals/planning-weekly/`

**Step 1: Run weekly planning ritual**

```bash
cd ~/Code/2bd-engine
claude skill run rituals/planning-weekly
```

Expected: Ritual runs successfully, projects are fetched

**Step 2: Verify project context appears**

Expected: Projects appear in weekly planning context

**Step 3: Document result**

Note: ✅ Weekly planning verified - projects load successfully

---

## Task 14: Verification Testing - Monthly Ritual

**Files:**
- Test: `.claude/skills/rituals/planning-monthly/`

**Step 1: Run monthly planning ritual**

```bash
cd ~/Code/2bd-engine
claude skill run rituals/planning-monthly
```

Expected: Ritual runs successfully, projects are fetched

**Step 2: Verify project context appears**

Expected: Projects appear in monthly planning context

**Step 3: Document result**

Note: ✅ Monthly planning verified - projects load successfully

---

## Task 15: Verification Testing - Quarterly Ritual

**Files:**
- Test: `.claude/skills/rituals/planning-quarterly/`

**Step 1: Run quarterly planning ritual**

```bash
cd ~/Code/2bd-engine
claude skill run rituals/planning-quarterly
```

Expected: Ritual runs successfully WITHOUT fetching projects

**Step 2: Verify no project fetching occurs**

Look for:
- No "fetch-projects-vault" invocation
- No project data in planning context
- No errors about missing project subagent

Expected: Clean execution, no project references

**Step 3: Document result**

Note: ✅ Quarterly planning verified - no project fetching

---

## Task 16: Verification Testing - Yearly Ritual

**Files:**
- Test: `.claude/skills/rituals/planning-yearly/`

**Step 1: Run yearly planning ritual**

```bash
cd ~/Code/2bd-engine
claude skill run rituals/planning-yearly
```

Expected: Ritual runs successfully WITHOUT fetching projects

**Step 2: Verify no project fetching occurs**

Look for:
- No "fetch-projects-vault" invocation
- No project data in planning context
- No errors about missing project subagent

Expected: Clean execution, no project references

**Step 3: Document result**

Note: ✅ Yearly planning verified - no project fetching

---

## Task 17: Verification Testing - Create Project Command

**Files:**
- Test: `.claude/skills/commands/create-project/`

**Step 1: Run create-project command (can cancel after project list appears)**

```bash
cd ~/Code/2bd-engine
claude skill run commands/create-project
```

Expected: Command runs, fetches projects for duplicate detection

**Step 2: Verify project fetching works**

Look for:
- "fetch-projects-vault" being invoked
- List of existing projects displayed
- No errors

Expected: Projects listed successfully for duplicate checking

**Step 3: Cancel or complete the command**

Press Ctrl+C or complete the wizard

**Step 4: Document result**

Note: ✅ Create-project verified - duplicate detection works

---

## Task 18: Verification Testing - Archive Project Command

**Files:**
- Test: `.claude/skills/commands/archive-project/`

**Step 1: Run archive-project command (can cancel after project list appears)**

```bash
cd ~/Code/2bd-engine
claude skill run commands/archive-project
```

Expected: Command runs, fetches projects for selection

**Step 2: Verify project fetching works**

Look for:
- "fetch-projects-vault" being invoked
- List of active projects displayed for selection
- No errors

Expected: Projects listed successfully for archiving

**Step 3: Cancel or complete the command**

Press Ctrl+C or complete if you have a project to archive

**Step 4: Document result**

Note: ✅ Archive-project verified - project listing works

---

## Task 19: Update CLAUDE.md if Needed

**Files:**
- Check: `CLAUDE.md`

**Step 1: Check if CLAUDE.md mentions the old skill name**

```bash
grep -n "fetch-projects\|fetch-active-projects" CLAUDE.md
```

Expected: Either shows matches or no output

**Step 2: If matches found - update to fetch-projects-vault**

Update any documentation references to use the new name

**Step 3: If changes made - commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE): update skill references to fetch-projects-vault"
```

**Step 4: If no matches - document**

Note: ✅ CLAUDE.md does not need updates

---

## Task 20: Final Verification and Summary

**Files:**
- Review: All changed files

**Step 1: Review all commits**

```bash
git log --oneline -20
```

Expected: See all commits from this implementation

**Step 2: Verify no uncommitted changes**

```bash
git status
```

Expected: Clean working tree

**Step 3: Run full test suite one more time**

Quickly verify each ritual/command works as expected per previous tests

**Step 4: Document completion**

Create summary:
```
✅ Projects Simplification Complete

Changes:
- Renamed _sub/fetch-projects → _sub/fetch-projects-vault
- Updated 7 phase files (daily, weekly, monthly, create, archive)
- Removed projects from quarterly and yearly planning
- All rituals and commands tested and working

Philosophy enforced:
- Projects = tactical, short-lived (≤4 weeks)
- Daily/weekly/monthly = tactical timescale ✓
- Quarterly/yearly = strategic timescale ✓
- Default to active projects only
```

**Step 5: Update implementation plan status**

Mark this plan as completed in the design document if desired

---

## Notes

- All changes are backwards incompatible but acceptable for personal system
- Archive functionality preserved - files still move to 04_Archives/Projects/
- Scope argument still supports `archived` and `all` for flexibility
- Quarterly and yearly rituals now focus purely on strategic themes
- Testing should be done in the engine directory: `~/Code/2bd-engine`
