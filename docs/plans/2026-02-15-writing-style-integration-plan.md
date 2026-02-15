# Writing Style Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate concise writing principles across 2bd through a copyeditor sub-skill.

**Architecture:** New `apply-writing-style` sub-skill receives draft prose, returns polished version. Prose-writing skills (`write-captive-note`, `update-semantic`) invoke it via HARD-GATE before file writes.

**Tech Stack:** Claude Code skills (markdown), vault templates (markdown)

---

## Task 1: Create apply-writing-style Sub-skill

**Files:**
- Create: `.claude/skills/_sub/apply-writing-style/SKILL.md`

**Step 1: Create the skill directory**

Run: `mkdir -p .claude/skills/_sub/apply-writing-style`

**Step 2: Write the skill file**

Create `.claude/skills/_sub/apply-writing-style/SKILL.md`:

```markdown
---
name: apply-writing-style
description: Polish prose before writing to files. Receives draft text, returns concise version applying Strunk's principles.
disable-model-invocation: false
---

# Apply Writing Style

Copyedit prose to read like skilled human writing, not typical AI output.

## Input

Draft prose passed in the prompt.

## Output

Polished prose. No explanations, just the edited text.

## Core Rules (Strunk)

### Use Active Voice

Put the actor before the action.

| Weak | Strong |
|------|--------|
| The project was completed by the team | The team completed the project |
| It was decided that | We decided |
| There were many issues found | We found many issues |

### Omit Needless Words

Every word earns its place.

| Cut | Keep |
|-----|------|
| the question as to whether | whether |
| owing to the fact that | because |
| in a hasty manner | hastily |
| he is a man who | he |
| this is a subject which | this subject |

### Cut Qualifiers and Hedges

| Remove |
|--------|
| very, really, quite, somewhat, rather, fairly |
| I think, it seems, perhaps, maybe, arguably |
| actually, basically, essentially, literally, honestly |

### Use Positive Form

Say what is, not what isn't.

| Weak | Strong |
|------|--------|
| He was not very often on time | He usually came late |
| did not remember | forgot |
| did not pay attention to | ignored |
| not important | trifling |

### Use Concrete Language

Prefer specific over general, definite over vague.

| Vague | Concrete |
|-------|----------|
| A period of unfavorable weather set in | It rained every day for a week |
| He showed satisfaction | He grinned |
| productive of great exhilaration | exhilarating |

### Place Emphasis at End

The emphatic position is the end of the sentence.

| Weak | Strong |
|------|--------|
| Humanity has hardly advanced in fortitude since that time, though it has advanced in many other ways | Humanity has advanced in many ways, but hardly in fortitude |

## AI Anti-Patterns to Eliminate

### Puffery Words

Remove: pivotal, crucial, vital, testament, enduring legacy, cornerstone, paramount, transformative

### Empty -ing Phrases

Remove: ensuring reliability, showcasing features, highlighting capabilities, fostering innovation, driving excellence

### Promotional Adjectives

Remove: groundbreaking, seamless, robust, cutting-edge, state-of-the-art, world-class, best-in-class

### Overused AI Vocabulary

Remove: delve, leverage, multifaceted, foster, realm, tapestry, landscape, paradigm, synergy, holistic, utilize (use "use")

### Formatting Overuse

Avoid: excessive bullets, emoji decorations, bold on every other word

## Process

1. Read the draft prose
2. Apply core rules systematically
3. Eliminate AI anti-patterns
4. Return polished text only — no commentary
```

**Step 3: Verify the file exists**

Run: `ls -la .claude/skills/_sub/apply-writing-style/`
Expected: `SKILL.md` listed

**Step 4: Commit**

```bash
git add .claude/skills/_sub/apply-writing-style/SKILL.md
git commit -m "feat: add apply-writing-style sub-skill

Copyeditor skill for polishing prose before file writes.
Implements Strunk's core rules and eliminates AI patterns."
```

---

## Task 2: Add HARD-GATE to write-captive-note

**Files:**
- Modify: `.claude/skills/_sub/write-captive-note/SKILL.md`

**Step 1: Read current file**

Read `.claude/skills/_sub/write-captive-note/SKILL.md` to understand current structure.

**Step 2: Add HARD-GATE after frontmatter**

Insert after line 7 (after the closing `---`):

```markdown

<HARD-GATE>
Before writing prose to any file, pass the content through the `apply-writing-style` sub-skill. Invoke it with the draft content, receive polished version, then proceed with the write.
</HARD-GATE>
```

**Step 3: Verify the change**

Read the file to confirm HARD-GATE is present.

**Step 4: Commit**

```bash
git add .claude/skills/_sub/write-captive-note/SKILL.md
git commit -m "feat: enforce writing style in write-captive-note

Add HARD-GATE requiring apply-writing-style before writes."
```

---

## Task 3: Add HARD-GATE to update-semantic

**Files:**
- Modify: `.claude/skills/_sub/update-semantic/SKILL.md`

**Step 1: Read current file**

Read `.claude/skills/_sub/update-semantic/SKILL.md` to understand current structure.

**Step 2: Add HARD-GATE after frontmatter**

Insert after line 6 (after the closing `---`):

```markdown

<HARD-GATE>
Before appending prose to any semantic note, pass the content through the `apply-writing-style` sub-skill. Invoke it with the draft content, receive polished version, then proceed with the append.
</HARD-GATE>
```

**Step 3: Verify the change**

Read the file to confirm HARD-GATE is present.

**Step 4: Commit**

```bash
git add .claude/skills/_sub/update-semantic/SKILL.md
git commit -m "feat: enforce writing style in update-semantic

Add HARD-GATE requiring apply-writing-style before appends."
```

---

## Task 4: Clean ai-personality.md

**Files:**
- Modify: `$VAULT/00_Brain/Systemic/Directives/ai-personality.md`

**Step 1: Read current file**

Read the file. Note the Writing Style section (lines 27-54) to remove.

**Step 2: Remove Writing Style section**

Delete lines 25-55 (the `## Writing Style` section including the preceding `---`). Keep:
- Frontmatter
- `# AI Personality` header
- `## Communication Style` section
- `## Coaching Approach` section
- `## Interaction Patterns` section

**Step 3: Verify the change**

Read the file to confirm Writing Style section is gone.

**Step 4: Note completion**

This file is in the vault (git-ignored). No commit needed.

---

## Task 5: Tighten today.md template

**Files:**
- Modify: `$VAULT/00_Brain/Systemic/Templates/Captive/today.md`

**Step 1: Read current file**

Read the template to identify verbose prompts.

**Step 2: Apply concise writing to prompts**

Replace verbose prompts with tight versions:

| Line | Before | After |
|------|--------|-------|
| 27 | `*What personal win will you protect for yourself?*` | `*What win will you protect?*` |
| 28 | `*What organisational/team interaction matters most?*` | `*What team interaction matters most?*` |
| 29 | `*What strategic work moves the week forward?*` | `*What strategic work moves the week?*` |
| 32 | `[One word or short phrase - your mode/stance for today: e.g., Focused, Collaborative, Strategic, Supportive, Decisive]` | `[Your stance today: Focused, Collaborative, Strategic, Supportive, Decisive]` |
| 109-111 | Personal wins prompts | Tighten |
| 114-116 | Organisational wins prompts | Tighten |
| 127-134 | Insights prompts | Tighten |
| 137 | Key Insight prompt | Tighten |

Apply these specific changes:

**Focus section (lines 27-32):**
```markdown
### Top Priorities
1. *What win will you protect?*
2. *What team interaction matters most?*
3. *What strategic work moves the week?*

### Leadership Intention
[Your stance today: Focused, Collaborative, Strategic, Supportive, Decisive]
```

**Personal wins (lines 109-111):**
```markdown
### Personal
- *What energy or time did you protect?*
- *What decision are you proud of?*
- *Where did you lead well?*
```

**Organisational wins (lines 114-116):**
```markdown
### Organisational
- *Who deserves recognition?*
- *What collaboration made impact?*
- *What progress would go unnoticed?*
```

**What Went Well (lines 127-128):**
```markdown
### What Went Well
- *What gave you energy?*
- *What habit paid off?*
```

**What Could Be Better (lines 131-134):**
```markdown
### What Could Be Better
- *What friction could become a system?*
- *Where did you react instead of respond?*
- *What would you tell yesterday-self?*
```

**Key Insight (line 137):**
```markdown
### Key Insight of the Day
*One thing worth remembering in 5 years?*
```

**Step 3: Verify the changes**

Read the file to confirm prompts are tighter.

**Step 4: Note completion**

This file is in the vault (git-ignored). No commit needed.

---

## Task 6: Tighten week.md template

**Files:**
- Modify: `$VAULT/00_Brain/Systemic/Templates/Captive/week.md`

**Step 1: Read current file**

Read the template to identify verbose prompts.

**Step 2: Apply concise writing to prompts**

**Key Outcomes (lines 42-44):**
```markdown
### Key Outcomes This Week
1. *What personal habit will you strengthen?*
2. *What team conversation or decision is needed?*
3. *What deliverable moves the month forward?*
```

**Focus Theme (line 47):**
```markdown
### Focus Theme
[One theme: Team building, Strategic planning, Execution mode, etc.]
```

**Leadership Intention (line 50):**
```markdown
### Leadership Intention
[Your stance: Decisive, Collaborative, Strategic, Supportive, Present]
```

**Growth Challenge (line 66):**
```markdown
### One Growth Challenge
- [Connected to your growth edge]
```

**Coaching Check-in (lines 85-89):**
```markdown
## Coaching Check-in
*Where might your patterns show up this week?*
-

*What does your best week look like?*
-
```

**Personal wins (lines 96-98):**
```markdown
### Personal
- *What habit or boundary will you protect?*
- *Where will you lead well?*
- *What decision will you be proud of?*
```

**Organisational wins (lines 101-103):**
```markdown
### Organisational
- *Who deserves recognition?*
- *What collaboration made impact?*
- *What progress would go unnoticed?*
```

**What Went Well (lines 113-114):**
```markdown
### What Went Well
- *What patterns worked?*
- *What decisions paid off?*
```

**What Could Be Better (lines 117-118):**
```markdown
### What Could Be Better
- *What could have gone differently?*
- *What will you adjust?*
```

**Step 3: Verify the changes**

Read the file to confirm prompts are tighter.

**Step 4: Note completion**

This file is in the vault (git-ignored). No commit needed.

---

## Task 7: Tighten month.md, quarter.md, year.md templates

**Files:**
- Modify: `$VAULT/00_Brain/Systemic/Templates/Captive/month.md`
- Modify: `$VAULT/00_Brain/Systemic/Templates/Captive/quarter.md`
- Modify: `$VAULT/00_Brain/Systemic/Templates/Captive/year.md`

**Step 1: Read each file**

Read all three templates.

**Step 2: Apply same principles**

For each file, identify verbose prompts and tighten:
- Remove "for yourself" patterns
- Remove "What... that you..." constructions
- Shorten explanatory brackets
- Cut hedge words

**Step 3: Verify the changes**

Read each file to confirm prompts are tighter.

**Step 4: Note completion**

These files are in the vault (git-ignored). No commit needed.

---

## Task 8: Update design doc acceptance criteria

**Files:**
- Modify: `docs/plans/2026-02-15-writing-style-integration-design.md`

**Step 1: Check off completed items**

Update acceptance criteria to show completion:

```markdown
## Acceptance Criteria

- [x] `apply-writing-style` sub-skill exists with complete rules
- [x] `write-captive-note` invokes apply-writing-style before writes
- [x] `update-semantic` invokes apply-writing-style before writes
- [x] `ai-personality.md` contains only interaction/personality guidance
- [x] Captive templates use tight, direct prompt language
- [ ] Generated content across rituals is more direct and human
```

**Step 2: Commit**

```bash
git add docs/plans/2026-02-15-writing-style-integration-design.md
git commit -m "docs: mark writing style integration tasks complete"
```

---

## Task 9: Final verification

**Step 1: List new skill**

Run: `ls -la .claude/skills/_sub/apply-writing-style/`
Expected: `SKILL.md` present

**Step 2: Verify HARD-GATEs**

Run: `grep -l "HARD-GATE" .claude/skills/_sub/write-captive-note/SKILL.md .claude/skills/_sub/update-semantic/SKILL.md`
Expected: Both files listed

**Step 3: Check git status**

Run: `git status`
Expected: Clean working tree (all changes committed)

**Step 4: Run git log**

Run: `git log --oneline -5`
Expected: See commits for apply-writing-style, write-captive-note, update-semantic, and design doc
