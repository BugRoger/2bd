---
name: test-orchestrator
description: Minimal skill for testing orchestrator functionality
---

# Test Orchestrator

Validate that prose-driven orchestration works correctly.

## What I Need

- Calendar events for the day
- Week.md for weekly context

## Test Execution

Read memory.md from the session directory to see what's available.

If calendar.md exists in the session, read it and show the first event found.
If Week.md path is available in memory.md, confirm its path is listed.

Report findings:
1. ✓ Session directory was created
2. ✓ memory.md exists with expected structure
3. ✓ External data files (calendar.md) are present if calendar available
4. ✓ Vault references show full paths with status indicators

Output final result: "✓ Orchestration test passed" or explain what failed.
