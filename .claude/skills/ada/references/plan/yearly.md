# Plan Yearly Sequence

Execute these assistants in order:

1. @_assistant-brief action=plan timescale=yearly
2. @_assistant-goals action=plan timescale=yearly
3. @_assistant-calendar action=plan timescale=yearly
4. @_assistant-journal action=plan timescale=yearly
5. @_assistant-achievements action=plan timescale=yearly
6. @_assistant-relationships action=plan timescale=yearly
7. @_assistant-projects action=plan timescale=yearly
8. @ada/references/compose action=plan timescale=yearly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
