---
name: daily-planning
description: Morning ritual to plan the day. Sets top 3 priorities, leadership intention, and prepares for scheduled meetings. Use when the user wants to plan their day, set daily priorities, or prepare their daily focus.
disable-model-invocation: true
allowed-tools: Read, Write, Bash(*), Grep, Glob
argument-hint: "[optional: specific focus area or constraint]"
---

# Daily Planning Ritual

This skill guides you through a morning planning ritual that helps set intentions, prioritize outcomes, and prepare for the day ahead.

## Workflow

### 1. Archive Previous Day

**Note**: Daily planning does NOT archive - archival is handled by the daily-review ritual. Planning is forward-looking only.

Skip this step. The previous day's content will be archived by the review ritual.

### 2. Gather Context

Collect information to inform today's planning:

1. **Get today's date information**:
   - Today's date, day of week, week number, quarter
   - Use bash commands: `date +"%Y-%m-%d"`, `date +"%A"`, `date +"%V"`, etc.

2. **Review yesterday's work** (if it exists):
   - Read `00_Brain/Current/Day.md` to see yesterday's content
   - Note completed items, wins, and any actions that need follow-up
   - Look for unfinished priorities that may carry forward

3. **Scan active projects**:
   - List files in `01_Projects/` to see current commitments
   - Optionally read project files if user mentions specific projects

4. **Check ongoing areas**:
   - List subdirectories in `02_Areas/Insights/` and `02_Areas/People/` to understand ongoing themes and relationships
   - Consider what areas need attention today

### 3. Interactive Planning Session

Engage the user to plan their day:

1. **Contextual questions**:
   - "What's your energy level today?" (High/Medium/Low)
   - "Where will you be working?" (Office/Home/Travel/Other)
   - "What meetings do you have scheduled today?"
   - "Are there any deadlines, events, or constraints today?"
   - Optional: Consider any arguments passed with `$ARGUMENTS`

2. **Priority discussion**:
   - Review yesterday's priorities and progress
   - Discuss active projects and areas that need attention
   - Help user identify the **top 3 outcomes** for today:
     - Priority 1: Most critical outcome that must happen
     - Priority 2: Team/strategic work
     - Priority 3: Personal/operational task
   - Frame priorities as **outcomes**, not just tasks (what will be different by end of day?)

3. **Leadership intention**:
   - Help user choose **one word or short phrase** for how they want to show up today
   - Examples: "Decisive", "Collaborative", "Focused", "Energizing", "Patient"
   - This sets the tone and mindset for the day

4. **Meeting preparation** (if applicable):
   - For each meeting mentioned, ask:
     - Meeting name/purpose
     - What decisions need to be made?
     - What actions might come from it?
   - Pre-populate the Meetings section structure

### 4. Generate Daily Plan

Create the structured daily plan using the gathered information:

1. **Build the frontmatter**:
```yaml
---
date: [YYYY-MM-DD from Step 2]
day: [Day name from Step 2]
week: Week [W] of [YYYY]
quarter: Q[1-4] [YYYY]
energy: [User's response]
location: [User's response]
focus_hours: 0
meetings: [Number of meetings]
---
```

2. **Fill in the Focus section**:
   - Add the 3 priorities under "Top Priorities (Outcomes)"
   - Add the leadership intention under "Leadership Intention"

3. **Pre-populate Meetings section** (if meetings mentioned):
   - Create a subsection for each meeting with the template structure
   - Include meeting name, Decisions, Actions, and Notes placeholders

4. **Keep template sections intact**:
   - Leave Completed, Actions, Wins, and Insights sections as templates
   - These will be filled during or at the end of the day

5. **Use the template structure** from `template.md` in this skill folder as a reference

### 5. Write and Confirm

1. Write the complete daily plan to `00_Brain/Current/Day.md`
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

- **daily-review** (future): Evening counterpart that reflects on the day, fills Completed/Wins/Insights, and archives to Resources/Brain
- **weekly-planning** (future): Higher-level planning that daily-planning aligns with
- **weekly-review** (future): Review that synthesizes the week and archives to Resources/Brain
- **create-project** (future): Action to create new project files that show up in context gathering
