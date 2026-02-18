# Self-Learning Daily Planning Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add self-learning capabilities to the daily planning ritual so it adapts to user preferences over time.

**Architecture:** Single insights file in vault captures learned preferences. Planning skill reads insights at startup and adapts. Review skill observes patterns and proposes updates. Templates evolve in vault; skill code stays stable.

**Tech Stack:** Claude skills (Markdown), vault files, no external dependencies.

---

## Task 1: Create Insights File Template in Scaffold

**Files:**
- Create: `scaffold/00_Brain/Systemic/Insights/planning-daily.md`

**Step 1: Create the Insights directory**

Run: `mkdir -p scaffold/00_Brain/Systemic/Insights`

**Step 2: Create the empty insights template**

```markdown
---
created: {{date}}
last_updated: {{date}}
---

# Daily Planning Insights

Learned preferences for the daily planning ritual. Updated by review-daily.

## Session Style

<!-- How the user prefers to run planning sessions -->

## Priorities

<!-- Priority count, categories used, framing preferences -->

## Coaching Style

<!-- Question types that resonate, phrasing, engagement patterns -->

## Meeting Templates

<!-- 1:1 style, group style, sections used/skipped -->

## Behavioral Patterns

<!-- Correlations: energy, day types, what predicts good days -->

## Observations Log

<!-- Raw observations from recent sessions, timestamped -->

## Pending Proposals

<!-- Suggested changes awaiting user confirmation -->
```

**Step 3: Verify file exists**

Run: `cat scaffold/00_Brain/Systemic/Insights/planning-daily.md`
Expected: File contents displayed

**Step 4: Commit**

Run: `git add scaffold/00_Brain/Systemic/Insights/ && git commit -m "scaffold: add empty insights template for daily planning"`

---

## Task 2: Inline Meeting Templates into Vault Template

**Files:**
- Modify: `scaffold/00_Brain/Systemic/Templates/Captive/today.md`

**Step 1: Read current template**

Read the file to understand current structure.

**Step 2: Update Meetings section with inline templates**

Replace the Meetings section with clearly marked inline templates that can evolve:

```markdown
## Meetings

<!--
MEETING TEMPLATES (evolve based on usage):

=== 1:1 TEMPLATE ===
### [[PersonName]]
*→ Update [[02_Areas/People/PersonName|their People file]] after this conversation*

**Check-in**
- How are you?

**Their Agenda**
- *What's on your mind?*

**Work**
- Wins:
- Blockers:

**Growth**
- *What are you learning?*

**Commitments**
- [ ] Me:
- [ ] Them:

=== GROUP TEMPLATE ===
### [Meeting Name]
**Decisions:**
-

**Next Steps:**
- [ ] [Owner]: [Action]

**Notes:**
-

=== INTERVIEW TEMPLATE ===
### Interview: [Candidate Name]
**Role:** [Position]

**Scorecard** *(1-5)*
- Technical: _ /5
- Communication: _ /5
- Problem-solving: _ /5

**Strengths:**
-

**Concerns:**
-

**Recommendation:** [ ] Yes [ ] No
-->
```

**Step 3: Remove Interview and extra meeting examples from main body**

Keep only one meeting placeholder in the visible template. Templates above are reference for generation.

**Step 4: Verify changes**

Run: `head -100 scaffold/00_Brain/Systemic/Templates/Captive/today.md`
Expected: Updated structure with inline templates in comment block

**Step 5: Commit**

Run: `git add scaffold/00_Brain/Systemic/Templates/Captive/today.md && git commit -m "scaffold: inline meeting templates into today.md for evolution"`

---

## Task 3: Update Planning Skill Setup to Load Insights

**Files:**
- Modify: `.claude/skills/ritual-planning-daily/SKILL.md`

**Step 1: Read current skill**

Read the file to understand current Setup section.

**Step 2: Add insights loading to Setup**

Update the Setup section to include insights loading:

```markdown
## Setup

Load context before starting the session:

1. **Resolve date** — Invoke `_resolve-dates` with argument (default: today)
2. **Load insights** — Read `00_Brain/Systemic/Insights/planning-daily.md` (create if missing)
3. **Fetch calendar** — Invoke `_fetch-calendar` for target date
4. **Load template** — Read `00_Brain/Systemic/Templates/Captive/today.md`
5. **Load hierarchical context:**
   - `00_Brain/Captive/Week.md`
   - `00_Brain/Captive/Month.md` (if insights indicate user values hierarchy)
   - `00_Brain/Captive/Quarter.md` (if insights indicate user values hierarchy)
6. **Load directives:**
   - `00_Brain/Systemic/Directives/user-profile.md`
   - `00_Brain/Systemic/Directives/ai-personality.md`
7. **Find People for 1:1s** — Parse calendar for 1:1 meetings, Glob `02_Areas/People/*.md` for matching names
8. **Check existing Today.md** — `00_Brain/Captive/Today.md`

Graceful degradation: If insights file doesn't exist, create empty one and proceed with defaults.
```

**Step 3: Update Session section to reference insights**

Add instruction to adapt based on insights:

```markdown
## Session

Greet the user using their preferred name from directives.

**Adapt to insights:** Read the insights file and adjust the session accordingly:
- Skip steps the user doesn't engage with
- Use coaching style that resonates
- Apply learned phrasing preferences
- For anything not in insights, use reference file defaults

Follow the session flow in [session-flow.md](references/session-flow.md), adapting based on insights.
```

**Step 4: Verify changes**

Run: `head -60 .claude/skills/ritual-planning-daily/SKILL.md`
Expected: Updated Setup and Session sections

**Step 5: Commit**

Run: `git add .claude/skills/ritual-planning-daily/SKILL.md && git commit -m "skill(planning-daily): load insights file during setup"`

---

## Task 4: Add Observe Step to Planning Skill

**Files:**
- Modify: `.claude/skills/ritual-planning-daily/SKILL.md`

**Step 1: Read current skill end**

Read the Confirm section to understand where to add Observe.

**Step 2: Add Observe section after Confirm**

Add new section at the end:

```markdown
## Observe

After the session, record observations to the insights file.

**What to observe:**
- Which questions the user engaged with vs skipped
- How they rephrased suggested priorities
- Whether they accepted or modified leadership intentions
- Any explicit feedback about the session

**Recording observations:**
Append timestamped entries to the Observations Log section:

```markdown
## Observations Log

- YYYY-MM-DD: [observation about user behavior or preference]
```

**Pattern detection:**
When the same observation appears 3+ times:
1. Synthesize into prose description
2. Add to appropriate section (Session Style, Priorities, Coaching Style, etc.)
3. If high confidence, add to Pending Proposals with rationale

**Template evolution:**
When a template change is warranted:
1. Add proposal to Pending Proposals section
2. Ask user for confirmation
3. If confirmed, edit `00_Brain/Systemic/Templates/Captive/today.md` directly

The skill code never changes. Evolution happens in the vault.
```

**Step 3: Verify changes**

Run: `tail -50 .claude/skills/ritual-planning-daily/SKILL.md`
Expected: New Observe section present

**Step 4: Commit**

Run: `git add .claude/skills/ritual-planning-daily/SKILL.md && git commit -m "skill(planning-daily): add Observe step for learning"`

---

## Task 5: Remove Hardcoded Meeting Templates Reference

**Files:**
- Delete: `.claude/skills/ritual-planning-daily/references/meeting-templates.md`
- Modify: `.claude/skills/ritual-planning-daily/references/session-flow.md`

**Step 1: Update session-flow.md to reference vault template**

Read session-flow.md and update the Meetings section to reference vault template instead of meeting-templates.md:

```markdown
### 1:1 Context Enrichment

For each 1:1 meeting, review their People file thoroughly. Present enriched context:

- **Last interaction date** — When did you last meet or have significant interaction?
- **Active topics** — Ongoing conversations or themes from recent 1:1s
- **Related projects** — Projects they're involved in or leading
- **Recent updates** — Wins, blockers, or context worth mentioning
- **Team context** — If direct report, current team/project status

Ask what the user wants to focus on with that person.

Use meeting templates from the vault template (`00_Brain/Systemic/Templates/Captive/today.md`).
Templates are embedded in HTML comments and evolve based on user preferences.
```

**Step 2: Delete meeting-templates.md**

Run: `rm .claude/skills/ritual-planning-daily/references/meeting-templates.md`

**Step 3: Verify deletion**

Run: `ls .claude/skills/ritual-planning-daily/references/`
Expected: meeting-templates.md not listed

**Step 4: Commit**

Run: `git add -A .claude/skills/ritual-planning-daily/references/ && git commit -m "skill(planning-daily): remove hardcoded meeting templates, use vault"`

---

## Task 6: Update Review Skill to Synthesize Observations

**Files:**
- Modify: `.claude/skills/ritual-review-daily/SKILL.md`

**Step 1: Read current review skill**

Read the file to understand current structure.

**Step 2: Add insights synthesis to Compose section**

Update Compose to include observation synthesis:

```markdown
## Compose

Review the completed session content.

**Semantic note updates:**
- Extract People file updates from 1:1 meetings and interactions
- Prepare project updates from wins and priority completion
- Prepare insight notes from key learnings
- Prepare resource notes from captures (links, articles, ideas)

**Planning insights synthesis:**
Compare Today.md with the generated version (if available in changelog):
- What sections were filled vs left empty?
- What was modified from generated content?
- What was added that wasn't in the template?
- What phrasing did the user prefer?

Load `00_Brain/Systemic/Insights/planning-daily.md` and:
1. Append new observations to Observations Log
2. Look for patterns across recent observations
3. Propose insight updates if patterns emerge
4. Propose template changes if high confidence

Present proposed updates for user approval.
```

**Step 3: Add insights file to Context section**

Update Context to include insights file:

```markdown
## Context

- Today.md file for the target date
- User's directives and preferences
- Week.md for weekly context
- Calendar events for the day (for meeting context)
- People files for anyone mentioned in meetings
- Active project files
- Existing daily archive if re-reviewing
- Planning insights file for observation synthesis
```

**Step 4: Verify changes**

Run: `grep -A 20 "## Compose" .claude/skills/ritual-review-daily/SKILL.md`
Expected: Updated Compose section with insights synthesis

**Step 5: Commit**

Run: `git add .claude/skills/ritual-review-daily/SKILL.md && git commit -m "skill(review-daily): add planning insights synthesis"`

---

## Task 7: Update Documentation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md` (if self-learning concept needs documentation)

**Step 1: Add insights path to CLAUDE.md Key Paths**

Update the Key Paths section:

```markdown
**Vault paths:**
- Central Hub: `$VAULT/00_Brain/✱ Home.md`
- Working notes: `$VAULT/00_Brain/Captive/`
- Archives: `$VAULT/00_Brain/Periodic/`
- Directives: `$VAULT/00_Brain/Systemic/Directives/`
- Insights: `$VAULT/00_Brain/Systemic/Insights/`
```

**Step 2: Verify changes**

Run: `grep -A 10 "Vault paths" CLAUDE.md`
Expected: Insights path listed

**Step 3: Commit**

Run: `git add CLAUDE.md && git commit -m "docs: add insights path to CLAUDE.md"`

---

## Task 8: Verify End-to-End Flow

**Step 1: Check scaffold structure**

Run: `find scaffold/00_Brain/Systemic -type f -name "*.md" | sort`
Expected: Includes `Insights/planning-daily.md`

**Step 2: Check skill references**

Run: `ls .claude/skills/ritual-planning-daily/references/`
Expected: Does NOT include meeting-templates.md

**Step 3: Check skill loads insights**

Run: `grep -n "insights" .claude/skills/ritual-planning-daily/SKILL.md`
Expected: Multiple references to loading and using insights

**Step 4: Check review synthesizes**

Run: `grep -n "insights" .claude/skills/ritual-review-daily/SKILL.md`
Expected: References to insights synthesis

**Step 5: Final commit if any changes**

Run: `git status`
If changes: `git add -A && git commit -m "chore: final cleanup for self-learning daily planning"`

---

## Summary

After completing all tasks:

1. **Scaffold** has empty insights template for new users
2. **Vault template** has inline meeting templates that can evolve
3. **Planning skill** loads insights and adapts session accordingly
4. **Planning skill** observes user behavior and records to insights
5. **Review skill** synthesizes observations and proposes updates
6. **Meeting templates** removed from skill references (now in vault)
7. **Documentation** updated with new paths

The system will now learn and adapt over time while keeping skill code stable.
