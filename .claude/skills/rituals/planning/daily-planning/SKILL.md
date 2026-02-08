---
name: daily-planning
description: Morning ritual to plan the day. Sets top 3 priorities, leadership intention, and prepares for scheduled meetings. Use when the user wants to plan their day, set daily priorities, or prepare their daily focus.
---

# Daily Planning Ritual

This skill guides you through a morning planning ritual that helps set intentions, prioritize outcomes, and prepare for the day ahead.

## Workflow

### 1. Pre-flight Check

Before planning, verify the previous day was digested:

1. Get today's date using `date +"%Y-%m-%d"`
2. Read `00_Brain/Captive/Today.md` and extract the `date` from frontmatter
3. If the Today.md date is NOT today:
   a. Check if archive exists at `00_Brain/Periodic/Daily/{date}.md`
   b. If archive exists, compare content:
      - If Today.md content matches archive content → already digested, proceed
      - If Today.md content differs from archive → **STOP**: "Yesterday's note ({date}) has changes that aren't archived yet. Please run daily-review first, or confirm you want to discard those changes."
   c. If archive doesn't exist → **STOP**: "Yesterday's note ({date}) hasn't been digested yet. Please run daily-review first, or confirm you want to skip archiving."
   d. Only proceed if user explicitly confirms to skip/discard
4. If date IS today, the note was already created - ask user if they want to regenerate

### 2. Gather Context

Collect information to inform today's planning:

1. **Get today's date information**:
   - Today's date, day of week, week number, quarter
   - Use bash commands: `date +"%Y-%m-%d"`, `date +"%A"`, `date +"%V"`, etc.

2. **Fetch and filter calendar events**:

   **Use sub-skill: `_sub/fetch/get-calendar`**
   - Scope: today
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

3. **Review yesterday's work** (if it exists):
   - Read `00_Brain/Captive/Today.md` to see yesterday's content
   - Note completed items, wins, and any actions that need follow-up
   - Look for unfinished priorities that may carry forward

4. **Review recent Periodic archives** (for context):
   - Check recent files in `00_Brain/Periodic/Daily/` for patterns
   - Review `00_Brain/Captive/Week.md` for weekly context

5. **Scan active projects**:
   - List files in `01_Projects/` to see current commitments
   - Optionally read project files if user mentions specific projects

6. **Check ongoing areas**:
   - List files in `02_Areas/Insights/` and `02_Areas/People/` to understand ongoing themes and relationships
   - Consider what areas need attention today

### 3. Interactive Planning Session

Engage the user to plan their day:

1. **Present calendar overview**:
   - Show: "I found X meetings on your calendar today:"
   - List by time with detected template:
     - "09:30-10:00: 1:1 Simone/Michi → [[Simone]] template"
     - "13:00-13:55: CE Leadership Weekly → [Meeting] template"
   - For uncertain matches, note: "(needs confirmation)"
   - Note filtered events: "Filtered out X events (OOO notices, blockers, lunch)"
   - Ask: "Does this look right? Any template assignments to change?"

2. **Contextual questions**:
   - "What's your energy level today?" (High/Medium/Low)
   - "Where will you be working?" (Office/Home/Travel/Other)
   - "Are there any deadlines, events, or constraints today?"
   - For [[PersonName]] meetings: "What do you want to focus on with [PersonName] today?"
   - Optional: Consider any arguments passed with `$ARGUMENTS`

3. **Priority discussion**:
   - Review yesterday's priorities and progress
   - Discuss active projects and areas that need attention
   - Help user identify the **top 3 outcomes** for today:
     - Priority 1: Most critical outcome that must happen
     - Priority 2: Team/strategic work
     - Priority 3: Personal/operational task
   - Frame priorities as **outcomes**, not just tasks (what will be different by end of day?)

4. **Leadership intention** (context-aware):

   Based on gathered context, suggest 2-3 relevant intentions with reasoning:

   - Heavy meeting day (4+ meetings) → "Present", "Listening", "Patient"
   - Many [[PersonName]] meetings scheduled → "Supportive", "Coaching", "Curious"
   - Big deadline or presentation → "Decisive", "Confident", "Clear"
   - Low energy reported → "Sustainable", "Boundaries", "Selective"
   - High energy + light calendar → "Creative", "Ambitious", "Momentum"
   - Yesterday had unfinished priorities → "Focused", "Finishing", "Discipline"
   - Conflict or difficult conversations pending → "Calm", "Direct", "Empathetic"

   Present suggestions with brief reasoning, then let user choose or provide their own.

### 4. Generate Daily Plan

Read `00_Brain/Systemic/Templates/Captive/today.md` as the single source of truth for structure.

1. **Fill frontmatter** using the template's frontmatter keys:
   - Copy the exact keys from the template (date, day, week, month, quarter, energy, location, focus_hours, meetings)
   - Fill values from gathered context

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

### 5. Write and Confirm

1. Write the complete daily plan to `00_Brain/Captive/Today.md`
2. Confirm with the user:
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
- **Morning ritual**: Do this planning at the start of the day, before checking email or messages
- **Review yesterday**: Learn from what worked and what didn't from the previous day
- **Intentionality**: The leadership intention helps maintain focus on how you work, not just what you work on

## Integration with Other Skills

- **daily-review**: Evening counterpart that reflects on the day, fills Completed/Wins/Insights, and archives to Periodic/Daily/
- **weekly-planning**: Higher-level planning that daily-planning aligns with
- **weekly-review**: Review that synthesizes the week and archives to Periodic/Weekly/
- **create-project**: Action to create new project files that show up in context gathering
