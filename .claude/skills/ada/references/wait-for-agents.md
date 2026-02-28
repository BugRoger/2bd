# Wait for Agents

Collect results from background agents with timeout and error handling.

## Input

List of launched agent IDs from Agent tool responses.

## Process

1. For each agent ID:
   - Use TaskOutput(task_id=agent_id, timeout=120000) to wait
   - Timeout: 2 minutes

2. Track results:
   - Success: agent completed normally
   - Timeout: agent exceeded 2 minute limit
   - Error: agent threw exception

3. Build result map:
```
{
  "goals": "success",
  "calendar": "success",
  "journal": "timeout",
  "achievements": "error",
  ...
}
```

## Error Handling

**Timeout:**
- Log: "{Assistant} timed out after 2 minutes"
- Mark as failed
- Continue with other agents

**Error:**
- Log: "{Assistant} failed: {error_message}"
- Mark as failed
- Continue with other agents

**All failed:**
- Report: "All assistants failed, cannot generate plan"
- Exit ritual with error

**Partial success:**
- Continue with successful agents
- Report: "X assistants completed successfully, Y failed"
