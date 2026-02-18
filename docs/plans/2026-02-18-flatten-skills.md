# Flatten Skills Structure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure `.claude/skills/` from nested categories to flat structure so Claude Code discovers skills as slash commands.

**Architecture:** Move all skill folders to top level with naming conventions (commands keep names, rituals get `ritual-` prefix, internal get `_` prefix). Move auxiliary files to `scaffold/00_Brain/Systemic/`. Update all path references in skills and documentation.

**Tech Stack:** Bash (git mv), markdown editing

---

## Task 1: Create Auxiliary File Directories

**Files:**
- Create: `scaffold/00_Brain/Systemic/Coaching/`
- Create: `scaffold/00_Brain/Systemic/Config/`
- Verify: `scaffold/00_Brain/Systemic/Templates/Directives/` exists

**Step 1: Create directories**

Run:
```bash
mkdir -p scaffold/00_Brain/Systemic/Coaching
mkdir -p scaffold/00_Brain/Systemic/Config
mkdir -p scaffold/00_Brain/Systemic/Templates/Directives
```

**Step 2: Verify directories exist**

Run: `ls -la scaffold/00_Brain/Systemic/`
Expected: Coaching/, Config/, Templates/ directories present

**Step 3: Commit**

```bash
git add scaffold/00_Brain/Systemic/
git commit -m "chore: create directories for skill auxiliary files"
```

---

## Task 2: Move Coaching Files

**Files:**
- Move: `.claude/skills/rituals/review-daily/coaching.md` → `scaffold/00_Brain/Systemic/Coaching/review-daily.md`
- Move: `.claude/skills/rituals/review-monthly/coaching.md` → `scaffold/00_Brain/Systemic/Coaching/review-monthly.md`
- Move: `.claude/skills/rituals/review-quarterly/coaching.md` → `scaffold/00_Brain/Systemic/Coaching/review-quarterly.md`
- Move: `.claude/skills/rituals/review-yearly/coaching.md` → `scaffold/00_Brain/Systemic/Coaching/review-yearly.md`

**Step 1: Move coaching files**

Run:
```bash
git mv .claude/skills/rituals/review-daily/coaching.md scaffold/00_Brain/Systemic/Coaching/review-daily.md
git mv .claude/skills/rituals/review-monthly/coaching.md scaffold/00_Brain/Systemic/Coaching/review-monthly.md
git mv .claude/skills/rituals/review-quarterly/coaching.md scaffold/00_Brain/Systemic/Coaching/review-quarterly.md
git mv .claude/skills/rituals/review-yearly/coaching.md scaffold/00_Brain/Systemic/Coaching/review-yearly.md
```

**Step 2: Verify files moved**

Run: `ls scaffold/00_Brain/Systemic/Coaching/`
Expected: review-daily.md, review-monthly.md, review-quarterly.md, review-yearly.md

**Step 3: Commit**

```bash
git commit -m "refactor: move coaching files to scaffold/Systemic/Coaching"
```

---

## Task 3: Move Init Templates

**Files:**
- Move: `.claude/skills/commands/init/templates/user-profile.md` → `scaffold/00_Brain/Systemic/Templates/Directives/user-profile.md`
- Move: `.claude/skills/commands/init/templates/ai-personality.md` → `scaffold/00_Brain/Systemic/Templates/Directives/ai-personality.md`

**Step 1: Move template files**

Run:
```bash
git mv .claude/skills/commands/init/templates/user-profile.md scaffold/00_Brain/Systemic/Templates/Directives/user-profile.md
git mv .claude/skills/commands/init/templates/ai-personality.md scaffold/00_Brain/Systemic/Templates/Directives/ai-personality.md
```

**Step 2: Remove empty templates directory**

Run: `rmdir .claude/skills/commands/init/templates`

**Step 3: Verify files moved**

Run: `ls scaffold/00_Brain/Systemic/Templates/Directives/`
Expected: user-profile.md, ai-personality.md

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: move init templates to scaffold/Systemic/Templates/Directives"
```

---

## Task 4: Move Calendar Config

**Files:**
- Move: `.claude/skills/_sub/fetch-calendar/calendars.json` → `scaffold/00_Brain/Systemic/Config/calendars.json`

**Step 1: Move config file**

Run:
```bash
git mv .claude/skills/_sub/fetch-calendar/calendars.json scaffold/00_Brain/Systemic/Config/calendars.json
```

**Step 2: Verify file moved**

Run: `ls scaffold/00_Brain/Systemic/Config/`
Expected: calendars.json

**Step 3: Commit**

```bash
git commit -m "refactor: move calendars.json to scaffold/Systemic/Config"
```

---

## Task 5: Flatten Command Skills

**Files:**
- Move: `.claude/skills/commands/init/` → `.claude/skills/init/`
- Move: `.claude/skills/commands/create-project/` → `.claude/skills/create-project/`
- Move: `.claude/skills/commands/archive-project/` → `.claude/skills/archive-project/`
- Move: `.claude/skills/commands/migrate/` → `.claude/skills/migrate/`
- Move: `.claude/skills/commands/onboard-person/` → `.claude/skills/onboard-person/`

**Step 1: Move command folders**

Run:
```bash
git mv .claude/skills/commands/init .claude/skills/init
git mv .claude/skills/commands/create-project .claude/skills/create-project
git mv .claude/skills/commands/archive-project .claude/skills/archive-project
git mv .claude/skills/commands/migrate .claude/skills/migrate
git mv .claude/skills/commands/onboard-person .claude/skills/onboard-person
```

**Step 2: Remove empty commands directory**

Run:
```bash
rm .claude/skills/commands/.gitkeep
rmdir .claude/skills/commands
```

**Step 3: Verify structure**

Run: `ls .claude/skills/ | grep -E "^(init|create-project|archive-project|migrate|onboard-person)$"`
Expected: All 5 command folders listed

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: flatten command skills to top level"
```

---

## Task 6: Flatten Ritual Skills (with prefix)

**Files:**
- Move: `.claude/skills/rituals/planning-daily/` → `.claude/skills/ritual-planning-daily/`
- Move: `.claude/skills/rituals/planning-weekly/` → `.claude/skills/ritual-planning-weekly/`
- Move: `.claude/skills/rituals/planning-monthly/` → `.claude/skills/ritual-planning-monthly/`
- Move: `.claude/skills/rituals/planning-quarterly/` → `.claude/skills/ritual-planning-quarterly/`
- Move: `.claude/skills/rituals/planning-yearly/` → `.claude/skills/ritual-planning-yearly/`
- Move: `.claude/skills/rituals/review-daily/` → `.claude/skills/ritual-review-daily/`
- Move: `.claude/skills/rituals/review-weekly/` → `.claude/skills/ritual-review-weekly/`
- Move: `.claude/skills/rituals/review-monthly/` → `.claude/skills/ritual-review-monthly/`
- Move: `.claude/skills/rituals/review-quarterly/` → `.claude/skills/ritual-review-quarterly/`
- Move: `.claude/skills/rituals/review-yearly/` → `.claude/skills/ritual-review-yearly/`

**Step 1: Move ritual folders with prefix**

Run:
```bash
git mv .claude/skills/rituals/planning-daily .claude/skills/ritual-planning-daily
git mv .claude/skills/rituals/planning-weekly .claude/skills/ritual-planning-weekly
git mv .claude/skills/rituals/planning-monthly .claude/skills/ritual-planning-monthly
git mv .claude/skills/rituals/planning-quarterly .claude/skills/ritual-planning-quarterly
git mv .claude/skills/rituals/planning-yearly .claude/skills/ritual-planning-yearly
git mv .claude/skills/rituals/review-daily .claude/skills/ritual-review-daily
git mv .claude/skills/rituals/review-weekly .claude/skills/ritual-review-weekly
git mv .claude/skills/rituals/review-monthly .claude/skills/ritual-review-monthly
git mv .claude/skills/rituals/review-quarterly .claude/skills/ritual-review-quarterly
git mv .claude/skills/rituals/review-yearly .claude/skills/ritual-review-yearly
```

**Step 2: Remove empty rituals directory**

Run: `rmdir .claude/skills/rituals`

**Step 3: Verify structure**

Run: `ls .claude/skills/ | grep "^ritual-"`
Expected: All 10 ritual folders listed with `ritual-` prefix

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: flatten ritual skills with ritual- prefix"
```

---

## Task 7: Flatten Internal Skills

**Files:**
- Move: `.claude/skills/_core/orchestrator/` → `.claude/skills/_orchestrator/`
- Move: `.claude/skills/_dev/test-orchestrator/` → `.claude/skills/_test-orchestrator/`
- Move: `.claude/skills/_sub/fetch-calendar/` → `.claude/skills/_fetch-calendar/`
- Move: `.claude/skills/_sub/resolve-references/` → `.claude/skills/_resolve-references/`
- Move: `.claude/skills/_sub/write-captive-note/` → `.claude/skills/_write-captive-note/`
- Move: `.claude/skills/_sub/append-changelog/` → `.claude/skills/_append-changelog/`
- Move: `.claude/skills/_sub/extract-to-areas/` → `.claude/skills/_extract-to-areas/`
- Move: `.claude/skills/_sub/update-semantic/` → `.claude/skills/_update-semantic/`
- Move: `.claude/skills/_sub/project-sync-vault/` → `.claude/skills/_project-sync-vault/`
- Move: `.claude/skills/_sub/project-sync-outlook/` → `.claude/skills/_project-sync-outlook/`
- Move: `.claude/skills/_sub/project-sync-finder/` → `.claude/skills/_project-sync-finder/`
- Move: `.claude/skills/_sub/apply-writing-style/` → `.claude/skills/_apply-writing-style/`

**Step 1: Move internal skill folders**

Run:
```bash
git mv .claude/skills/_core/orchestrator .claude/skills/_orchestrator
git mv .claude/skills/_dev/test-orchestrator .claude/skills/_test-orchestrator
git mv .claude/skills/_sub/fetch-calendar .claude/skills/_fetch-calendar
git mv .claude/skills/_sub/resolve-references .claude/skills/_resolve-references
git mv .claude/skills/_sub/write-captive-note .claude/skills/_write-captive-note
git mv .claude/skills/_sub/append-changelog .claude/skills/_append-changelog
git mv .claude/skills/_sub/extract-to-areas .claude/skills/_extract-to-areas
git mv .claude/skills/_sub/update-semantic .claude/skills/_update-semantic
git mv .claude/skills/_sub/project-sync-vault .claude/skills/_project-sync-vault
git mv .claude/skills/_sub/project-sync-outlook .claude/skills/_project-sync-outlook
git mv .claude/skills/_sub/project-sync-finder .claude/skills/_project-sync-finder
git mv .claude/skills/_sub/apply-writing-style .claude/skills/_apply-writing-style
```

**Step 2: Remove empty category directories**

Run:
```bash
rmdir .claude/skills/_core
rmdir .claude/skills/_dev
rmdir .claude/skills/_sub
```

**Step 3: Verify structure**

Run: `ls .claude/skills/ | grep "^_"`
Expected: All 12 internal skill folders listed with `_` prefix

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: flatten internal skills with _ prefix"
```

---

## Task 8: Update Orchestrator References

**Files:**
- Modify: `.claude/skills/_orchestrator/SKILL.md`

**Step 1: Read current orchestrator**

Read `.claude/skills/_orchestrator/SKILL.md` and identify all references to old paths.

**Step 2: Update sub-skill references**

Replace these patterns in the file:
- `_sub/fetch-calendar` → `_fetch-calendar`
- `_sub/resolve-references` → `_resolve-references`
- `_sub/resolve-dates` → `_resolve-dates` (if exists, otherwise remove reference)

**Step 3: Verify no old paths remain**

Run: `grep -n "_sub/\|_core/\|_dev/" .claude/skills/_orchestrator/SKILL.md`
Expected: No matches

**Step 4: Commit**

```bash
git add .claude/skills/_orchestrator/SKILL.md
git commit -m "refactor(orchestrator): update sub-skill path references"
```

---

## Task 9: Update Review Skill Coaching References

**Files:**
- Modify: `.claude/skills/ritual-review-daily/SKILL.md`
- Modify: `.claude/skills/ritual-review-monthly/SKILL.md`
- Modify: `.claude/skills/ritual-review-quarterly/SKILL.md`
- Modify: `.claude/skills/ritual-review-yearly/SKILL.md`

**Step 1: Check current references**

Run: `grep -l "coaching.md" .claude/skills/ritual-review-*/SKILL.md`
Identify which files reference coaching.md

**Step 2: Update each file**

For each file that references `coaching.md`, replace with:
- `$VAULT/00_Brain/Systemic/Coaching/review-daily.md` (for daily)
- `$VAULT/00_Brain/Systemic/Coaching/review-monthly.md` (for monthly)
- `$VAULT/00_Brain/Systemic/Coaching/review-quarterly.md` (for quarterly)
- `$VAULT/00_Brain/Systemic/Coaching/review-yearly.md` (for yearly)

**Step 3: Verify no relative coaching.md references remain**

Run: `grep -rn "coaching.md" .claude/skills/ritual-review-*/`
Expected: No matches (or only $VAULT paths)

**Step 4: Commit**

```bash
git add .claude/skills/ritual-review-*/SKILL.md
git commit -m "refactor(review-skills): update coaching file paths to vault"
```

---

## Task 10: Update Init Skill Template References

**Files:**
- Modify: `.claude/skills/init/SKILL.md`

**Step 1: Read current init skill**

Read `.claude/skills/init/SKILL.md` and identify template references.

**Step 2: Update template paths**

Replace:
- `templates/user-profile.md` → `scaffold/00_Brain/Systemic/Templates/Directives/user-profile.md`
- `templates/ai-personality.md` → `scaffold/00_Brain/Systemic/Templates/Directives/ai-personality.md`

**Step 3: Verify no relative template paths remain**

Run: `grep -n "templates/" .claude/skills/init/SKILL.md`
Expected: No matches

**Step 4: Commit**

```bash
git add .claude/skills/init/SKILL.md
git commit -m "refactor(init): update template paths to scaffold"
```

---

## Task 11: Update Fetch-Calendar Config Reference

**Files:**
- Modify: `.claude/skills/_fetch-calendar/SKILL.md`

**Step 1: Read current fetch-calendar skill**

Read `.claude/skills/_fetch-calendar/SKILL.md` and identify calendars.json reference.

**Step 2: Update config path**

Replace:
- `calendars.json` → `$VAULT/00_Brain/Systemic/Config/calendars.json`

**Step 3: Verify update**

Run: `grep -n "calendars.json" .claude/skills/_fetch-calendar/SKILL.md`
Expected: Only $VAULT path reference

**Step 4: Commit**

```bash
git add .claude/skills/_fetch-calendar/SKILL.md
git commit -m "refactor(fetch-calendar): update config path to vault"
```

---

## Task 12: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update quick reference section**

Replace:
```bash
claude skill run rituals/planning-daily   # morning
claude skill run rituals/review-daily     # evening
claude skill run commands/init --args "profile"
claude skill run commands/create-project
claude skill run commands/archive-project
```

With:
```bash
claude skill run ritual-planning-daily   # morning
claude skill run ritual-review-daily     # evening
claude skill run init --args "profile"
claude skill run create-project
claude skill run archive-project
```

**Step 2: Update key paths section**

Update any references to old skill paths:
- `_core/orchestrator` → `_orchestrator`
- `_sub/*` → `_*`
- `rituals/*` → `ritual-*`
- `commands/*` → direct name

**Step 3: Verify no old paths remain**

Run: `grep -n "rituals/\|commands/\|_sub/\|_core/" CLAUDE.md`
Expected: No matches in skill-related sections

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE.md): update skill paths for flat structure"
```

---

## Task 13: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Search for skill path references**

Run: `grep -n "rituals/\|commands/\|_sub/\|skills/" README.md`

**Step 2: Update all skill invocation examples**

Replace old nested paths with flat paths:
- `rituals/planning-daily` → `ritual-planning-daily`
- `commands/init` → `init`
- etc.

**Step 3: Verify updates**

Run: `grep -n "rituals/\|commands/" README.md`
Expected: No matches in skill path contexts

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs(README.md): update skill paths for flat structure"
```

---

## Task 14: Update DEVELOPING.md

**Files:**
- Modify: `DEVELOPING.md`

**Step 1: Search for skill architecture references**

Run: `grep -n "rituals/\|commands/\|_sub/\|_core/\|_dev/" DEVELOPING.md`

**Step 2: Update skill architecture documentation**

Update any sections describing skill structure to reflect:
- Flat structure under `.claude/skills/`
- Naming conventions: commands (no prefix), rituals (`ritual-`), internal (`_`)
- Auxiliary files in `scaffold/00_Brain/Systemic/`

**Step 3: Verify updates**

Run: `grep -n "_sub/\|_core/" DEVELOPING.md`
Expected: No matches except in migration/historical context

**Step 4: Commit**

```bash
git add DEVELOPING.md
git commit -m "docs(DEVELOPING.md): update skill architecture for flat structure"
```

---

## Task 15: Verify Claude Code Discovery

**Step 1: List available skills**

Run: `claude skills` or check `/skills` in Claude Code

**Step 2: Verify user-facing skills appear**

Expected skills visible:
- `init`
- `create-project`
- `archive-project`
- `migrate`
- `onboard-person`
- `ritual-planning-daily`
- `ritual-planning-weekly`
- `ritual-review-daily`
- etc.

**Step 3: Verify internal skills hidden**

Expected NOT visible as slash commands:
- `_orchestrator`
- `_fetch-calendar`
- `_resolve-references`
- etc.

**Step 4: Test skill invocation**

Run: `/ritual-planning-daily` or `claude skill run ritual-planning-daily`
Expected: Skill executes successfully

---

## Task 16: Final Commit and Summary

**Step 1: Check for uncommitted changes**

Run: `git status`

**Step 2: Commit any remaining changes**

If any unstaged changes:
```bash
git add -A
git commit -m "chore: cleanup remaining flatten-skills changes"
```

**Step 3: Create summary commit (optional)**

If squashing desired:
```bash
git log --oneline | head -15
```

Review commits from this implementation.

**Step 4: Verify final structure**

Run: `ls -la .claude/skills/`
Expected: Flat structure with all skills at top level

---

## Rollback Plan

If issues arise, revert all commits from this implementation:

```bash
git log --oneline | grep -E "(flatten|refactor.*skill)" | head -20
# Identify first commit SHA before changes
git revert --no-commit HEAD~N..HEAD  # where N is number of commits
git commit -m "revert: rollback flatten-skills changes"
```
