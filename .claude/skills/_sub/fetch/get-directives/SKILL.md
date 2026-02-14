---
name: get-directives
description: Load user profile and AI personality directives. Returns structured context for personalizing skill behavior and communication style.
disable-model-invocation: true
allowed-tools: Read, Bash(ls)
---

# Get Directives Sub-Skill

Loads the user profile and AI personality files from the Directives folder. Returns structured data for other skills to use for personalization.

## Prerequisites

This sub-skill expects `$VAULT` to be set by the calling skill (via `get-config`).

## File Locations

- **User Profile:** `$VAULT/00_Brain/Systemic/Directives/user-profile.md`
- **AI Personality:** `$VAULT/00_Brain/Systemic/Directives/ai-personality.md`

## Execution Steps

### 1. Check File Existence

Check if the Directives folder and files exist:

```bash
ls -la "$VAULT/00_Brain/Systemic/Directives/"
```

Track which files are present or missing.

### 2. Load User Profile (if exists)

If `user-profile.md` exists, read the file and extract:

**From frontmatter:**
- `name` - Full name
- `preferred_name` - How to address the user
- `role` - Job title/position

**From sections:**
- `## Overview` → `what_i_do`
- `## Work Context` → `focus_areas`, `team_org`, `communication_style`
- `## Goals & Growth` → `key_goals`, `leadership_identity`, `growth_edge`
- `## Coaching Context` → `patterns_to_watch`, `grounding_questions`, `success_definition`

### 3. Load AI Personality (if exists)

If `ai-personality.md` exists, read the file and extract:

**From frontmatter:**
- `formality` - casual/formal
- `directness` - direct/balanced/soft
- `humor` - high/medium/low/none

**From sections:**
- `## Communication Style` → detailed style preferences
- `## Coaching Approach` → `support_challenge`, `proactive_input`, `feedback_style`
- `## Interaction Patterns` → `questions_suggestions`, `autonomy_level`, `disagreement_handling`

### 4. Return Structured Result

Return the loaded context to the parent skill:

**If both files loaded:**
```
Directives loaded successfully.

User: {preferred_name} ({role})
- Leadership Identity: {leadership_identity}
- Growth Edge: {growth_edge}
- Patterns to Watch: {patterns_to_watch}
- Grounding Questions: {grounding_questions}

AI Style: {formality}, {directness}, humor={humor}
- Feedback Style: {feedback_style}
- Autonomy: {autonomy_level}
```

**If files missing:**
```
Directives partially loaded. Missing: {missing_files}
Tip: Run `/init` to set up your profile.
```

**If no files exist:**
```
No directives found. Using default communication style.
Run `/init` to personalize your 2bd experience.
```

## Usage Guide for Parent Skills

### How to Apply User Profile

| Field | Use For |
|-------|---------|
| `preferred_name` | Address the user by name ("Good morning, Michi!") |
| `leadership_identity` | Frame leadership intentions and suggestions |
| `growth_edge` | Generate growth-focused coaching prompts |
| `patterns_to_watch` | Proactive reminders when patterns might emerge |
| `grounding_questions` | Include in reflection/insight sections |
| `key_goals` | Connect daily work to larger objectives |
| `success_definition` | Frame wins and progress |

### How to Apply AI Personality

| Field | Effect |
|-------|--------|
| `formality: casual` | Conversational tone, no corporate speak |
| `formality: formal` | Professional, structured communication |
| `directness: direct` | Say what needs to be said, no softening |
| `directness: balanced` | Direct but considerate |
| `humor: high` | Include humor, make it enjoyable |
| `humor: low/none` | Keep it professional, minimal humor |
| `feedback_style: direct` | Give feedback straight, no sandwich method |
| `proactive_input: yes` | Suggest and advise without being asked |
| `autonomy_level` | How much to check in vs. execute independently |

### Graceful Degradation

If directives aren't loaded:
- Use neutral, professional tone as default
- Skip personalized coaching references
- At the end of the skill, suggest running `/init`

## Difference from Coaching Context

| Source | Purpose | Stability |
|--------|---------|-----------|
| **Directives** | WHO the user is, HOW to communicate | Stable (rarely changes) |
| **Year.md/Quarter.md** | WHAT they're focused on now | Temporal (changes by period) |

Skills should load BOTH:
1. Directives first (identity and style)
2. Then temporal coaching context (current goals and focus)
