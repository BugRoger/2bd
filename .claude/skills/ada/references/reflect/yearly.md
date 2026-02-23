# Reflect Yearly Sequence

Execute these assistants in order:

1. @_assistant-goals action=reflect timescale=yearly
2. @_assistant-calendar action=reflect timescale=yearly
3. @_assistant-journal action=reflect timescale=yearly
4. @_assistant-achievements action=reflect timescale=yearly
5. @_assistant-relationships action=reflect timescale=yearly
6. @_assistant-projects action=reflect timescale=yearly
7. @ada/references/compose action=reflect timescale=yearly

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=yearly
10. @_assistant-calendar action=learn timescale=yearly
11. @_assistant-journal action=learn timescale=yearly
12. @_assistant-achievements action=learn timescale=yearly
13. @_assistant-relationships action=learn timescale=yearly
14. @_assistant-projects action=learn timescale=yearly

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
   - {date}: {insight} (from yearly reflect)

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
