---
name: daily-planning
description: Plan a day's priorities, meetings, and intentions. Accepts an optional target date (default: today). Use with date arguments like "tomorrow", "Monday", "2026-02-12", or "next Tuesday". Reads current Today.md as context for prior work.
argument-hint: "[target-date: today|tomorrow|monday|YYYY-MM-DD]"
---

# Daily Planning Ritual

This skill guides you through a planning ritual that helps set intentions, prioritize outcomes, and prepare for a target day. By default it plans for today, but accepts a target date argument to plan ahead (e.g., planning Friday for Monday).

## Target Date Resolution

Parse `$ARGUMENTS` to determine the target date. If no argument provided, default to today.

| Input | Interpretation |
|-------|----------------|
| (empty) | Today |
| `today` | Today |
| `tomorrow` | Tomorrow |
| `monday`, `tuesday`, etc. | Next occurrence of that weekday (including today if it matches) |
| `next monday`, `next tuesday`, etc. | Next occurrence after today (always future) |
| `YYYY-MM-DD` (e.g., `2026-02-14`) | Specific date |

Use macOS `date` command to resolve relative dates to `YYYY-MM-DD` format. Store the resolved target date for use throughout the workflow.

## Workflow

### 1. Pre-flight Check

Before planning, handle the current Today.md appropriately:

1. Get **today's actual date** using `date +"%Y-%m-%d"` (current calendar date)
2. Get the **target date** from the Target Date Resolution above
3. Read `00_Brain/Captive/Today.md` and extract the `date` from frontmatter (if it exists)

**If target date is TODAY:**
   a. If Today.md date matches today → note was already created, ask user if they want to regenerate
   b. If Today.md date is older:
      - Check if archive exists at `00_Brain/Periodic/Daily/{Today.md date}.md`
      - If archive exists and content matches → already digested, proceed
      - If archive exists but content differs → **STOP**: "The note from {date} has changes that aren't archived yet. Please run daily-review first, or confirm you want to discard those changes."
      - If no archive exists → **STOP**: "The note from {date} hasn't been digested yet. Please run daily-review first, or confirm you want to skip archiving."
      - Only proceed if user explicitly confirms to skip/discard

**If target date is FUTURE (tomorrow, Monday, specific future date):**
   a. Read Today.md content as **context source** (work completed before target date)
   b. Check if target date already has an archive at `00_Brain/Periodic/Daily/{target-date}.md`:
      - If archive exists → Ask: "A plan for {target-date} already exists in the archive. Do you want to regenerate it?"
   c. Warn user: "Planning for {target-date} will overwrite Today.md. The current Today.md ({Today.md date}) content will be used as context. Make sure yesterday's work is archived if needed."
   d. Proceed only if user confirms

### 2. Gather Context

Collect information to inform planning for the **target date**:

1. **Get target date information**:
   - Calculate all date fields for the **target date** (not today):
   - Target date (`YYYY-MM-DD`), day of week, week number (`YYYY-Www`), month (`YYYY-MM`), quarter (`YYYY-QN`)
   - Use bash commands with the resolved target date

2. **Fetch and filter calendar events for target date**:

   **Use sub-skill: `_sub/fetch/get-calendar`**
   - Scope: Use the resolved target date (e.g., `tomorrow`, `monday`, or `YYYY-MM-DD`)
   - Format: json

   **Filter out events that don't need meeting notes:**

   EXCLUDE if any of:
   - All-day events (these are typically vacation notices, blockers, deadlines)
   - Title is empty or whitespace only
   - Title contains vacation/OOO patterns: "vacation", "OoO", "OOO", "out of office", "holiday", "stand-in:", "standin:"
   - Title contains blocker patterns: "lunch", "focus", "blocker", "physio", "travel"
   - Title starts with "[INVITATION]" (FYI broadcasts, not actual meetings to attend)
   - Title contains "placeholder"

   INCLUDE all-day events only if they're actual workshops/offsites to attend (rare).

   **Discover meeting types from template:**

   Read `00_Brain/Systemic/Templates/Captive/today.md` and parse the `## Meetings` section.
   For each `### ...` heading found, extract:
   - The heading pattern (e.g., `[Meeting Name/Topic]`, `[[PersonName]]`)
   - The template content (everything until next `###` or `---`)

   **Match each calendar event to best template:**

   For each event, analyze the title and infer which template fits best:
   - `### [[PersonName]]` pattern: Events that appear to be 1:1 conversations (two people meeting)
   - `### [Meeting Name/Topic]` pattern: Group meetings, syncs, reviews, etc.
   - If template has other patterns, use semantic matching to find best fit

   **When uncertain, ask the user:**

   If confidence is low (e.g., ambiguous title like "Quick chat" or "Alignment"), present options:
   "I'm not sure which format to use for 'Quick chat'. Is this:
    1. A 1:1 with someone? (I'll use the [[PersonName]] format)
    2. A standard meeting? (I'll use the [Meeting Name] format)"

   For `[[PersonName]]` templates, extract the other person's name using `user_name` from calendars.json.

3. **Review prior work** (context from Today.md):
   - Read `00_Brain/Captive/Today.md` to see the most recent work content
   - This serves as context regardless of whether target date is today or future
   - Note completed items, wins, and any actions that need follow-up
   - Look for unfinished priorities that may carry forward to target date

4. **Review recent Periodic archives** (for context):
   - Check recent files in `00_Brain/Periodic/Daily/` relative to the target date
   - Review `00_Brain/Captive/Week.md` for weekly context

5. **Scan active projects**:
   - List files in `01_Projects/` to see current commitments
   - Optionally read project files if user mentions specific projects

6. **Check ongoing areas**:
   - List files in `02_Areas/Insights/` and `02_Areas/People/` to understand ongoing themes and relationships
   - Consider what areas need attention today

7. **Load coaching context**:
   - Read `00_Brain/Captive/Year.md` for:
     - Key Annual Goals
     - Leadership Development (current focus, leadership identity, growth edge)
   - Read `00_Brain/Captive/Quarter.md` for:
     - Key Outcomes This Quarter
     - Coaching Themes (patterns to watch, questions that serve me)
   - If sections are empty or contain only placeholders, note this for later and use generic prompts

### 3. Interactive Planning Session

Engage the user to plan for the **target date**:

1. **Present calendar overview**:
   - Show: "I found X meetings on your calendar for **{target_date} ({day_name})**:"
   - List by time with detected template:
     - "09:30-10:00: 1:1 Simone/Michi → [[Simone]] template"
     - "13:00-13:55: CE Leadership Weekly → [Meeting] template"
   - For uncertain matches, note: "(needs confirmation)"
   - Note filtered events: "Filtered out X events (OOO notices, blockers, lunch)"
   - Ask: "Does this look right? Any template assignments to change?"

2. **Contextual questions**:
   - "What's your expected energy level **on {day_name}**?" (High/Medium/Low)
   - "Where will you be working **on {target_date}**?" (Office/Home/Travel/Other)
   - "Are there any deadlines, events, or constraints **on {target_date}**?"
   - For [[PersonName]] meetings: "What do you want to focus on with [PersonName]?"
   - Optional: Consider any additional arguments passed with `$ARGUMENTS`

3. **Priority discussion**:
   - Review prior work and progress from Today.md context
   - Discuss active projects and areas that need attention
   - Help user identify the **top 3 outcomes** for the target date:
     - Priority 1: Most critical outcome that must happen
     - Priority 2: Team/strategic work
     - Priority 3: Personal/operational task
   - Frame priorities as **outcomes**, not just tasks (what will be different by end of the target day?)

4. **Leadership intention** (context-aware):

   Based on gathered context for the target date, suggest 2-3 relevant intentions with reasoning:

   - Heavy meeting day (4+ meetings) → "Present", "Listening", "Patient"
   - Many [[PersonName]] meetings scheduled → "Supportive", "Coaching", "Curious"
   - Big deadline or presentation → "Decisive", "Confident", "Clear"
   - Low energy reported → "Sustainable", "Boundaries", "Selective"
   - High energy + light calendar → "Creative", "Ambitious", "Momentum"
   - Yesterday had unfinished priorities → "Focused", "Finishing", "Discipline"
   - Conflict or difficult conversations pending → "Calm", "Direct", "Empathetic"

   Present suggestions with brief reasoning, then let user choose or provide their own.

5. **Generate coaching prompts** (context-aware):

   Based on gathered context (goals, day type, priorities), generate personalized prompts for the Wins and Insights sections. Act as an experienced executive coach developing the user according to their stated leadership and unit goals.

   **Determine day type for target date:**
   - Heavy meeting day (4+ meetings): Focus on presence, listening, energy protection
   - 1:1 heavy day (2+ 1:1s): Focus on coaching vs. solving, feedback, development
   - Deadline/delivery day: Focus on delivery, recognition, sustainable effort
   - Low energy day: Focus on boundaries, sustainability, delegation
   - Strategic/light calendar day: Focus on clarity, long-term thinking, creative work

   **Generate Wins prompts** (2-3 total across Personal, Team, Project Progress):

   Connect to:
   - Target date priorities → "If you complete [Priority 1], what will that prove about your capability?"
   - Leadership intention → "How will you know if you successfully embodied '[intention]' on {target_date}?"
   - 1:1 meetings → "What opportunity does your 1:1 with [Person] give you to practice [leadership focus]?"
   - Growth edge → "Where might '[growth edge]' show up today? What's your plan?"
   - Unit goals → "What progress today connects to [Key Outcome]?"

   **Generate Insights prompts** (2-3 total across What Went Well, What Could Be Better, Key Insight):

   Connect to:
   - Patterns to watch → "Did you notice '[pattern]' on {target_date}? What triggered it?"
   - Leadership development → "Where did you practice '[leadership focus]' on {target_date}? What worked?"
   - Questions that serve me → Select 1 relevant question for Key Insight of the Day
   - Day type context:
     - Heavy meeting day: "Which meeting energized vs. drained you? Why?"
     - 1:1 day: "What question unlocked something for someone today?"
     - Deadline day: "What was the hidden cost of today's push? Worth it?"

   **Prompt generation rules:**
   - Maximum 2-3 prompts per section
   - Each prompt should be specific to the target date's context, not generic
   - Connect prompts to stated goals when available
   - Frame Wins as celebration/recognition; Insights as learning/pattern-recognition
   - If goals are empty, use thoughtful generic prompts and suggest filling in Year.md/Quarter.md

### 4. Generate Daily Plan

Read `00_Brain/Systemic/Templates/Captive/today.md` as the single source of truth for structure.

1. **Fill frontmatter** using the template's frontmatter keys:
   - Copy the exact keys from the template (date, day, week, month, quarter, energy, location, focus_hours, meetings)
   - Fill values using the **target date** (not today's date)

2. **Fill Focus section**:
   - Replace priority prompts with user's actual priorities
   - Replace Leadership Intention placeholder with user's chosen intention

3. **Fill Meetings section** from calendar events:
   - Parse all meeting templates from the template's `## Meetings` section
   - Each `### ...` heading defines a template type
   - Sort events by start time
   - For each meeting, use the template assigned during calendar overview
   - Replace placeholder values with actual event data

4. **Keep remaining sections as-is** from template (Capture, Wins, Insights)

5. **Fill Wins section** with generated coaching prompts:
   - Keep the section structure from template (Personal, Team, Project Progress)
   - Replace generic prompts with the context-aware prompts generated in step 3.5
   - Personal: 1-2 prompts connecting to leadership intention and growth edge
   - Team: 1 prompt connecting to 1:1s or team development
   - Project Progress: Keep the [[project-name]] placeholder format for user to fill

6. **Fill Insights section** with generated coaching prompts:
   - Keep the section structure from template (What Went Well, What Could Be Better, Key Insight)
   - What Went Well: 1-2 prompts about patterns, energy, or leadership practice
   - What Could Be Better: 1-2 prompts connecting to patterns to watch or growth edge
   - Key Insight of the Day: Use one question from "Questions That Serve Me" or a powerful coaching question relevant to the day

7. **Keep Capture section as-is** from template

### 5. Write and Confirm

1. Write the complete daily plan to `00_Brain/Captive/Today.md`
   - Note: Today.md represents "the active working day" which is now the target date
2. Confirm with the user:
   - Show the target date: "Plan created for **{target_date} ({day_name})**"
   - Summarize the 3 priorities
   - Highlight the leadership intention
   - Note any meetings prepared
3. Optionally suggest:
   - Time blocking specific focus hours
   - When to tackle highest-priority items
   - Breaks or energy management strategies

## Tips for Effective Planning

- **Outcomes over tasks**: Frame priorities as what will be accomplished, not just activities
- **Realistic priorities**: Three well-chosen priorities are better than an overwhelming list
- **Plan ahead**: Use target dates to plan Friday for Monday, skip holidays, or prepare for important days
- **Review prior work**: Learn from what worked and what didn't from recent work
- **Intentionality**: The leadership intention helps maintain focus on how you work, not just what you work on

## Integration with Other Skills

- **daily-review**: Evening counterpart that reflects on the day, fills Completed/Wins/Insights, and archives to Periodic/Daily/
- **weekly-planning**: Higher-level planning that daily-planning aligns with
- **weekly-review**: Review that synthesizes the week and archives to Periodic/Weekly/
- **create-project**: Action to create new project files that show up in context gathering
