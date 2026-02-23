# Plan Daily Sequence

Execute these assistants in order:

1. @_assistant-brief action=plan timescale=daily
2. @_assistant-goals action=plan timescale=daily
3. @_assistant-calendar action=plan timescale=daily
4. @_assistant-journal action=plan timescale=daily
5. @_assistant-achievements action=plan timescale=daily
6. @_assistant-relationships action=plan timescale=daily
7. @_assistant-projects action=plan timescale=daily
8. @ada/references/compose action=plan timescale=daily

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
