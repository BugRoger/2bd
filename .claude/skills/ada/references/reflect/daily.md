# Reflect Daily Sequence

Execute these assistants in order:

1. @_assistant-brief action=reflect timescale=daily
2. @_assistant-goals action=reflect timescale=daily
3. @_assistant-calendar action=reflect timescale=daily
4. @_assistant-journal action=reflect timescale=daily
5. @_assistant-achievements action=reflect timescale=daily
6. @_assistant-relationships action=reflect timescale=daily
7. @_assistant-projects action=reflect timescale=daily
8. @_assistant-compose action=reflect timescale=daily

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=daily
10. @_assistant-calendar action=learn timescale=daily
11. @_assistant-journal action=learn timescale=daily
12. @_assistant-achievements action=learn timescale=daily
13. @_assistant-relationships action=learn timescale=daily
14. @_assistant-projects action=learn timescale=daily

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
