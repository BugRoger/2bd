# Reflect Quarterly Sequence

Execute these assistants in order:

1. @_assistant-brief action=reflect timescale=quarterly
2. @_assistant-goals action=reflect timescale=quarterly
3. @_assistant-calendar action=reflect timescale=quarterly
4. @_assistant-journal action=reflect timescale=quarterly
5. @_assistant-achievements action=reflect timescale=quarterly
6. @_assistant-relationships action=reflect timescale=quarterly
7. @_assistant-projects action=reflect timescale=quarterly
8. @_assistant-compose action=reflect timescale=quarterly

After compose, run learn phase:

9. @_assistant-goals action=learn timescale=quarterly
10. @_assistant-calendar action=learn timescale=quarterly
11. @_assistant-journal action=learn timescale=quarterly
12. @_assistant-achievements action=learn timescale=quarterly
13. @_assistant-relationships action=learn timescale=quarterly
14. @_assistant-projects action=learn timescale=quarterly

## Error Handling

If an assistant fails:
1. Log error with assistant name and message
2. Continue with next assistant
3. Note gap in compose step
