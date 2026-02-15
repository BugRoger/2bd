# Orchestrator Skill Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor all skills to remove memory/session logic and adopt prose-driven orchestration pattern.

**Architecture:** Convert 21 skill files from session-based to conversation-based orchestration. Inline archive operations into review rituals. Remove all memory.md, session directory, and QMD references. Use natural prose throughout.

**Tech Stack:** Markdown skills, Claude orchestrator, git

---

## Task 1: Review Daily Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-daily/SKILL.md`

**Step 1: Add orchestration flag**

Add to frontmatter after line 4:
```yaml
orchestrated: true
```

**Step 2: Update Context section (lines 11-20)**

Replace lines 11-20:
```markdown
## Context

- Today.md file for the target date
- User's directives and preferences
- Week.md for weekly context
- Calendar events for the day (for meeting context)
- People files for anyone mentioned in meetings
- Active project files
- Existing daily archive if re-reviewing
```

**Step 3: Remove memory.md references in Validate (lines 22-36)**

Replace lines 22-36:
```markdown
## Validate

Load Today.md for the target date. Verify the note state before reviewing:

- Check date alignment between Today.md frontmatter and the target review date. If mismatched, ask which date to review.
- Check if an archive already exists for this date in Periodic/Daily/. If exists, offer to view or re-review.
- Check for an archived marker in Today.md frontmatter. If present, the day has already been archived.

If directives are unavailable, note that and proceed with limited coaching context.

Proceed only when state is validated.
```

**Step 4: Remove memory.md references in Session (lines 38-88)**

Replace line 41:
```markdown
Guide the user through reflection on the day. Load Week.md for coaching context.
```

**Step 5: Update Compose section (lines 90-103)**

Replace with prose-driven approach:
```markdown
## Compose

Review the completed session content. Identify semantic note updates based on the reflection:

- Extract People file updates from 1:1 meetings and interactions
- Prepare project updates from wins and priority completion
- Prepare insight notes from key learnings
- Prepare resource notes from captures (links, articles, ideas)

Present proposed updates for user approval.
```

**Step 6: Inline archive logic in Persist (lines 105-120)**

Replace lines 105-120:
```markdown
## Persist

Execute confirmed semantic note updates.

Archive Today.md to Periodic/Daily/{date}.md. Transform the content into the archive format, ensuring the target directory exists. Write the file and verify the write succeeded. Call append-changelog to record the archival with skill "review-daily", action "Archived", summary "from Captive/Today.md".

Replace Today.md in Captive with an archived placeholder:
```markdown
---
archived: {date}
---

# Archived

This day has been archived to [[00_Brain/Periodic/Daily/{date}]].

Run `/daily-planning` to start a new day.
```

Report completion and suggest next steps:
- Daily planning for tomorrow
- Quarter.md updates if patterns emerged
- New insight notes if warranted

If directives were not available, suggest running `/init`.
```

**Step 7: Update Confirm section (lines 122-136)**

Replace:
```markdown
## Confirm

Present a summary of what was done:
- Archive location (Periodic/Daily/{date}.md)
- Day summary (energy, priorities completed, key wins)
- Each semantic note update with target file and content preview

The user has already approved during the session, this is verification after completion.
```

**Step 8: Commit**

```bash
git add .claude/skills/rituals/review-daily/SKILL.md
git commit -m "refactor(review-daily): adopt prose orchestration, inline archive logic"
```

---

## Task 2: Planning Weekly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-weekly/SKILL.md`

**Step 1: Add orchestration flag**

Add to frontmatter after line 4:
```yaml
orchestrated: true
```

**Step 2: Update Context section (lines 12-21)**

Replace lines 12-21:
```markdown
## Context

- Calendar events for the upcoming week
- User's directives and preferences
- Current Week.md (may need archiving)
- Month.md for monthly context
- Quarter.md for quarterly context
- Year.md for annual context
- Active project files
- Prior week's daily archives for synthesis
```

**Step 3: Remove memory.md references in Validate (lines 23-34)**

Replace lines 23-34:
```markdown
## Validate

Load current Week.md. Before overwriting, verify its state:

- If Week.md contains a different week and hasn't been archived, block and suggest running review-weekly first
- If planning for a past week, warn that this is unusual
- Only proceed with explicit confirmation when there's unarchived work
```

**Step 4: Remove memory.md references in Session (lines 36-216)**

Replace line 42 "Load calendar.md from session" with:
```markdown
Present the target week's shape based on calendar:
```

Replace line 62 "Load Month.md and Quarter.md (paths in memory.md)" with:
```markdown
Reference Month.md and Quarter.md to extract key dates.
```

Replace line 74 "If prior week's daily archives are available in memory.md" with:
```markdown
If prior week's daily archives are available, analyze them:
```

Replace line 94 "Present context from higher-level planning (load from paths in memory.md)" with:
```markdown
Present context from higher-level planning:
```

Replace line 111 "(from memory.md project references)" with:
```markdown
(from active projects):
```

**Step 5: Update Persist section (lines 200-206)**

Replace lines 200-206:
```markdown
## Persist

Write the generated plan to Week.md in Captive.
```

**Step 6: Commit**

```bash
git add .claude/skills/rituals/planning-weekly/SKILL.md
git commit -m "refactor(planning-weekly): adopt prose orchestration pattern"
```

---

## Task 3: Review Weekly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-weekly/SKILL.md`

**Step 1: Read current file**

Read `.claude/skills/rituals/review-weekly/SKILL.md` to understand structure.

**Step 2: Add orchestration flag and update Context**

Add `orchestrated: true` to frontmatter.

Update Context section to prose declarations (remove any memory.md references).

**Step 3: Remove memory.md references throughout**

Search for "memory.md" and replace with natural references.
Search for "session" and remove session directory references.
Search for "path in memory.md" and remove.

**Step 4: Inline archive logic in Persist**

Replace any `archive-weekly` sub-skill calls with inline prose:
```markdown
Archive Week.md to Periodic/Weekly/{week}.md. Transform the content into the archive format, ensuring the target directory exists. Write the file and verify the write succeeded. Call append-changelog to record the archival with skill "review-weekly", action "Archived", summary "from Captive/Week.md".

Replace Week.md in Captive with an archived placeholder linking to the archive.
```

**Step 5: Commit**

```bash
git add .claude/skills/rituals/review-weekly/SKILL.md
git commit -m "refactor(review-weekly): adopt prose orchestration, inline archive logic"
```

---

## Task 4: Planning Monthly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-monthly/SKILL.md`

**Step 1: Read current file**

Read `.claude/skills/rituals/planning-monthly/SKILL.md` to understand structure.

**Step 2: Add orchestration flag and update Context**

Add `orchestrated: true` to frontmatter.

Update Context section to prose declarations.

**Step 3: Remove memory.md references**

Replace all memory.md/session references with natural prose.

**Step 4: Update Persist section**

Ensure it uses "Write Month.md to Captive" not file paths.

**Step 5: Commit**

```bash
git add .claude/skills/rituals/planning-monthly/SKILL.md
git commit -m "refactor(planning-monthly): adopt prose orchestration pattern"
```

---

## Task 5: Review Monthly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-monthly/SKILL.md`

**Step 1: Read current file**

Read `.claude/skills/rituals/review-monthly/SKILL.md` to understand structure.

**Step 2: Add orchestration flag and update Context**

Add `orchestrated: true` to frontmatter.

Update Context section.

**Step 3: Remove memory.md references**

Replace all memory.md/session references.

**Step 4: Inline archive logic in Persist**

Replace `archive-monthly` call with inline prose:
```markdown
Archive Month.md to Periodic/Monthly/{month}.md. Transform the content into the archive format, ensuring the target directory exists. Write the file and verify the write succeeded. Call append-changelog to record the archival.

Replace Month.md in Captive with an archived placeholder.
```

**Step 5: Commit**

```bash
git add .claude/skills/rituals/review-monthly/SKILL.md
git commit -m "refactor(review-monthly): adopt prose orchestration, inline archive logic"
```

---

## Task 6: Planning Quarterly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-quarterly/SKILL.md`

**Step 1: Read and update**

Read file, add `orchestrated: true`, update Context section, remove memory.md references.

**Step 2: Update Persist**

Ensure declarative file operations.

**Step 3: Commit**

```bash
git add .claude/skills/rituals/planning-quarterly/SKILL.md
git commit -m "refactor(planning-quarterly): adopt prose orchestration pattern"
```

---

## Task 7: Review Quarterly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-quarterly/SKILL.md`

**Step 1: Read and update**

Read file, add `orchestrated: true`, update Context section, remove memory.md references.

**Step 2: Inline archive logic**

Replace `archive-quarterly` call with inline prose.

**Step 3: Commit**

```bash
git add .claude/skills/rituals/review-quarterly/SKILL.md
git commit -m "refactor(review-quarterly): adopt prose orchestration, inline archive logic"
```

---

## Task 8: Planning Yearly Ritual

**Files:**
- Modify: `.claude/skills/rituals/planning-yearly/SKILL.md`

**Step 1: Read and update**

Read file, add `orchestrated: true`, update Context section, remove memory.md references.

**Step 2: Update Persist**

Ensure declarative file operations.

**Step 3: Commit**

```bash
git add .claude/skills/rituals/planning-yearly/SKILL.md
git commit -m "refactor(planning-yearly): adopt prose orchestration pattern"
```

---

## Task 9: Review Yearly Ritual

**Files:**
- Modify: `.claude/skills/rituals/review-yearly/SKILL.md`

**Step 1: Read and update**

Read file, add `orchestrated: true`, update Context section, remove memory.md references.

**Step 2: Inline archive logic**

Replace `archive-yearly` call with inline prose.

**Step 3: Commit**

```bash
git add .claude/skills/rituals/review-yearly/SKILL.md
git commit -m "refactor(review-yearly): adopt prose orchestration, inline archive logic"
```

---

## Task 10: Write-Captive-Note Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/write-captive-note/SKILL.md`

**Step 1: Read current file**

Read `.claude/skills/_sub/write-captive-note/SKILL.md` to understand structure.

**Step 2: Convert to prose style**

Replace numbered steps with flowing prose. Remove bash code blocks.

Example transformation:
```markdown
Receive the vault path, target filename, and content to write.

Validate that the Captive directory exists in the vault. If missing, create it.

Check if the target file already exists. If it does, compare content. Return an error if content differs and ask whether to overwrite.

Write the content to Captive/{filename}. Verify the write succeeded by reading back the file.

Return structured output in a markdown code block:

```json
{
  "success": true,
  "path": "/vault/00_Brain/Captive/Today.md",
  "bytes_written": 4096
}
```
```

**Step 3: Remove session references**

Ensure no session/memory.md mentions.

**Step 4: Commit**

```bash
git add .claude/skills/_sub/write-captive-note/SKILL.md
git commit -m "refactor(write-captive-note): convert to prose style"
```

---

## Task 11: Append-Changelog Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/append-changelog/SKILL.md`

**Step 1: Convert to prose**

Replace numbered steps with flowing prose describing the operation.

**Step 2: Remove session references**

**Step 3: Preserve JSON output format**

Keep structured output in markdown code blocks.

**Step 4: Commit**

```bash
git add .claude/skills/_sub/append-changelog/SKILL.md
git commit -m "refactor(append-changelog): convert to prose style"
```

---

## Task 12: Extract-To-Areas Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/extract-to-areas/SKILL.md`

**Step 1: Convert to prose**

**Step 2: Remove session references**

**Step 3: Commit**

```bash
git add .claude/skills/_sub/extract-to-areas/SKILL.md
git commit -m "refactor(extract-to-areas): convert to prose style"
```

---

## Task 13: Update-Semantic Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/update-semantic/SKILL.md`

**Step 1: Convert to prose**

**Step 2: Remove session references**

**Step 3: Preserve JSON output**

**Step 4: Commit**

```bash
git add .claude/skills/_sub/update-semantic/SKILL.md
git commit -m "refactor(update-semantic): convert to prose style"
```

---

## Task 14: Fetch-Calendar Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/fetch-calendar/SKILL.md`

**Step 1: Convert to prose**

**Step 2: Remove session references**

**Step 3: Commit**

```bash
git add .claude/skills/_sub/fetch-calendar/SKILL.md
git commit -m "refactor(fetch-calendar): convert to prose style"
```

---

## Task 15: Project-Sync Sub-Skills

**Files:**
- Modify: `.claude/skills/_sub/project-sync-outlook/SKILL.md`
- Modify: `.claude/skills/_sub/project-sync-finder/SKILL.md`
- Modify: `.claude/skills/_sub/project-sync-vault/SKILL.md`

**Step 1: Convert each to prose**

Read each file and convert numbered steps to prose.

**Step 2: Remove session references**

**Step 3: Commit**

```bash
git add .claude/skills/_sub/project-sync-*
git commit -m "refactor(project-sync): convert to prose style"
```

---

## Task 16: Resolve-References Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/resolve-references/SKILL.md`

**Step 1: Convert to prose**

**Step 2: Remove session references**

**Step 3: Commit**

```bash
git add .claude/skills/_sub/resolve-references/SKILL.md
git commit -m "refactor(resolve-references): convert to prose style"
```

---

## Task 17: Apply-Writing-Style Sub-Skill

**Files:**
- Modify: `.claude/skills/_sub/apply-writing-style/SKILL.md`

**Step 1: Convert to prose**

**Step 2: Remove session references**

**Step 3: Commit**

```bash
git add .claude/skills/_sub/apply-writing-style/SKILL.md
git commit -m "refactor(apply-writing-style): convert to prose style"
```

---

## Task 18: Init Command

**Files:**
- Modify: `.claude/skills/commands/init/SKILL.md`

**Step 1: Read and update**

Add `orchestrated: true` if it needs vault context.

**Step 2: Convert to prose**

Remove numbered steps, use flowing prose.

**Step 3: Remove session references**

**Step 4: Commit**

```bash
git add .claude/skills/commands/init/SKILL.md
git commit -m "refactor(init): adopt prose orchestration pattern"
```

---

## Task 19: Other Commands

**Files:**
- Modify: `.claude/skills/commands/migrate/SKILL.md`
- Modify: `.claude/skills/commands/create-project/SKILL.md`
- Modify: `.claude/skills/commands/archive-project/SKILL.md`
- Modify: `.claude/skills/commands/onboard-person/SKILL.md`

**Step 1: Convert each to prose**

Read each file, convert to prose style, remove session references.

**Step 2: Add orchestration flag if needed**

**Step 3: Commit**

```bash
git add .claude/skills/commands/
git commit -m "refactor(commands): adopt prose orchestration pattern"
```

---

## Task 20: Delete Archive Sub-Skills

**Files:**
- Delete: `.claude/skills/_sub/archive-daily/`
- Delete: `.claude/skills/_sub/archive-weekly/`
- Delete: `.claude/skills/_sub/archive-monthly/`
- Delete: `.claude/skills/_sub/archive-quarterly/`
- Delete: `.claude/skills/_sub/archive-yearly/`

**Step 1: Remove directories**

```bash
rm -rf .claude/skills/_sub/archive-daily
rm -rf .claude/skills/_sub/archive-weekly
rm -rf .claude/skills/_sub/archive-monthly
rm -rf .claude/skills/_sub/archive-quarterly
rm -rf .claude/skills/_sub/archive-yearly
```

**Step 2: Verify deletion**

```bash
ls .claude/skills/_sub/
```

Expected: archive-* directories should not be listed.

**Step 3: Commit**

```bash
git add -A .claude/skills/_sub/
git commit -m "refactor: remove obsolete archive sub-skills

Archive logic has been inlined into review rituals for simplicity."
```

---

## Task 21: Update DEVELOPING.md

**Files:**
- Modify: `DEVELOPING.md`

**Step 1: Remove memory.md references**

Search for "memory.md" in file and remove all references.

**Step 2: Remove session directory references**

Search for "session" and remove references to session directories, /tmp/ paths.

**Step 3: Update sub-skill list (lines 223-236)**

Remove archive-* entries:
```markdown
**Current Sub-Skills:**

| Category | Purpose | Examples |
|----------|---------|----------|
| `_sub/write-*` | File creation operations | write-captive-note |
| `_sub/append-*` | Append operations | append-changelog |
| `_sub/extract-*` | Content extraction and transformation | extract-to-areas |
| `_sub/update-*` | Semantic note updates | update-semantic |
| `_sub/fetch-calendar` | External calendar API access | fetch-calendar (via ekctl) |
| `_sub/project-sync-*` | External system integration | project-sync-finder, project-sync-outlook |
| `_sub/resolve-references` | Wikilink and embed resolution | resolve-references |
| `_sub/apply-writing-style` | Prose quality enhancement | apply-writing-style |

**Note:** The orchestrator handles most data loading (config, directives, vault files, date resolution). Only create _sub/ skills for complex operations the orchestrator cannot perform.
```

**Step 4: Remove QMD references**

Search for "QMD" and remove all mentions.

**Step 5: Update orchestration examples**

Remove any references to fetch-qmd, session creation, memory.md patterns.

**Step 6: Verify prose-driven section (lines 318-482)**

Ensure examples match implemented pattern.

**Step 7: Commit**

```bash
git add DEVELOPING.md
git commit -m "docs: update DEVELOPING.md for prose orchestration

Remove memory.md, session, QMD, and archive sub-skill references."
```

---

## Task 22: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Search for session references**

Search for "session" and remove any outdated references.

**Step 2: Search for QMD references**

Search for "QMD" and remove all mentions.

**Step 3: Verify orchestration guidance**

Check "Prose-Driven Orchestration" section matches implementation.

**Step 4: Commit if changes made**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for prose orchestration"
```

---

## Task 23: Check README.md

**Files:**
- Modify: `README.md` (if needed)

**Step 1: Search for problematic references**

Search for "memory", "session", "QMD" in user-facing docs.

**Step 2: Update if needed**

Remove any outdated references.

**Step 3: Commit if changes made**

```bash
git add README.md
git commit -m "docs: remove outdated references from README"
```

---

## Task 24: Verify Planning-Daily

**Files:**
- Verify: `.claude/skills/rituals/planning-daily/SKILL.md`

**Step 1: Read file**

Read `.claude/skills/rituals/planning-daily/SKILL.md`.

**Step 2: Check for issues**

Verify:
- Has `orchestrated: true` in frontmatter
- No memory.md references
- No session directory references
- Uses natural context references
- Declarative file operations

**Step 3: Fix if needed**

If any issues found, fix them.

**Step 4: Commit if changes made**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git commit -m "fix(planning-daily): ensure full prose orchestration compliance"
```

---

## Task 25: Update Orchestrator Documentation

**Files:**
- Modify: `.claude/skills/_core/orchestrator/SKILL.md`

**Step 1: Remove QMD references**

Search for "QMD" and remove all mentions (lines referencing fetch-qmd).

**Step 2: Update sub-skill table (lines 290-296)**

Remove QMD entry:
```markdown
| Sub-Skill | Purpose | Output |
|-----------|---------|--------|
| `_sub/resolve-dates` | Parse time expressions | Returns date info as markdown |
| `_sub/fetch-calendar` | Get calendar events | Returns calendar events as markdown |
| `_sub/resolve-references` | Vault paths + entity discovery | Returns paths and file locations |
```

**Step 3: Commit**

```bash
git add .claude/skills/_core/orchestrator/SKILL.md
git commit -m "docs(orchestrator): remove QMD references"
```

---

## Task 26: Final Verification

**Step 1: Search for memory.md globally**

```bash
grep -r "memory\.md" .claude/skills/ docs/ *.md
```

Expected: No results (except in plan files).

**Step 2: Search for session references**

```bash
grep -r "session" .claude/skills/ | grep -v "Session" | grep -v "skill execution"
```

Expected: No session directory references.

**Step 3: Search for QMD references**

```bash
grep -r "QMD" .claude/skills/ docs/ *.md
```

Expected: No results (except in plan files).

**Step 4: Verify archive sub-skills deleted**

```bash
ls .claude/skills/_sub/archive-* 2>&1
```

Expected: "No such file or directory"

**Step 5: Count updated files**

```bash
git log --oneline --since="1 hour ago" | wc -l
```

Expected: Approximately 25 commits.

---

## Success Criteria

- ✅ All 21 skill files refactored to prose style
- ✅ All memory.md references removed
- ✅ All session directory references removed
- ✅ All QMD references removed
- ✅ 5 archive sub-skill directories deleted
- ✅ Documentation updated (DEVELOPING.md, CLAUDE.md, README.md)
- ✅ All rituals have `orchestrated: true` flag
- ✅ Review rituals contain inline archive logic
- ✅ Planning-daily verified for compliance

---

## Testing

After implementation, test key rituals:

```bash
# Test planning-daily
claude skill run rituals/planning-daily

# Test review-daily
claude skill run rituals/review-daily

# Test weekly planning
claude skill run rituals/planning-weekly
```

Verify:
- No errors about missing memory.md
- No session directory references in output
- Archive operations work correctly in review rituals
- Context loads naturally from orchestrator
