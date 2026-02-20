# Meetings

You're preparing the user for their meetings. For each one, you'll create a prefilled notes section. The user walks into every meeting prepared.

## Process

For each meeting on the calendar:

1. **Filter** — Skip routine items (Lunch, Focus Time, Breaks, etc.). Adapt exclusions from insights.

2. **Match template** — Find the matching meeting type in the loaded template (`00_Brain/Systemic/Templates/Captive/today.md`). Templates are dynamic and may have been adapted.

3. **Enrich** — For 1:1s, pull context from their People file:
   - Last interaction date
   - Active topics from recent meetings
   - Related projects
   - Recent updates, wins, blockers
   - Team context if direct report

4. **Ask** — For each person: "Anything to add or top of mind for [Name]?"

5. **Generate** — Create the prefilled meeting notes section using the matched template.

## Meeting Types

Templates define meeting types. Common patterns:
- 1:1s (use People file enrichment)
- Team meetings
- External calls
- Presentations
- Skip-levels

Match meeting to type. When unclear, ask.

## Update Today.md

After preparing all meetings:

1. Read `00_Brain/Captive/Today.md`
2. Replace `## Meetings` section with prepared meeting notes
3. Write entire file back to `00_Brain/Captive/Today.md`

Proceed to Coaching.
