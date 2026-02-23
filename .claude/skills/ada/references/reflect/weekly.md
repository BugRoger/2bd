# Reflect Weekly Sequence

Execute these assistants in order:

1. @_assistant-brief action=reflect timescale=weekly
2. @_assistant-goals action=reflect timescale=weekly
3. @_assistant-calendar action=reflect timescale=weekly
4. @_assistant-journal action=reflect timescale=weekly
5. @_assistant-achievements action=reflect timescale=weekly
6. @_assistant-relationships action=reflect timescale=weekly
7. @_assistant-projects action=reflect timescale=weekly
8. @ada/references/compose action=reflect timescale=weekly

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=weekly
10. @_assistant-calendar action=learn timescale=weekly
11. @_assistant-journal action=learn timescale=weekly
12. @_assistant-achievements action=learn timescale=weekly
13. @_assistant-relationships action=learn timescale=weekly
14. @_assistant-projects action=learn timescale=weekly

## Aggregate Findings

After assistants return findings:

1. Collect all `### Entity Learnings` from assistant findings
2. Collect all `### Coaching Questions` from assistant findings
3. Weave into coaching conversation:
   - Surface variance patterns across domains
   - Ask coaching questions that connect insights
   - Discuss entity learnings with user

## Persist Entity Learnings

After user confirms insights:

For each confirmed entity learning:
1. Find entity file in vault:
   - People: `vault/02_Areas/People/{name}.md`
   - Projects: `vault/01_Projects/{name}.md`
2. Append to `## Insights` section:
   - {date}: {insight} (from weekly reflect)

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
