---
name: test-orchestrator
description: Minimal skill for testing orchestrator functionality
metadata:
  orchestrated: true
---

# Test Orchestrator

Validate that prose-driven orchestration works correctly.

## Context

- Calendar events for the day
- Week.md for weekly context

## Test Execution

Check that context was loaded into the conversation history.

Review the calendar events if available. Confirm you can see calendar data directly in the conversation.

Check Week.md if available. Confirm you can see Week.md content directly in the conversation.

Report findings:
1. ✓ Context is present in conversation history (no session directory)
2. ✓ Calendar events visible if available
3. ✓ Week.md content accessible if available

Output final result: "✓ Orchestration test passed" or explain what failed.
