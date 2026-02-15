---
name: create-session
description: Create temp session directory for orchestrated skill execution
disable-model-invocation: false
allowed-tools: Bash
---

# Create Session

Create a temporary session directory for orchestrated skill execution.

## Inputs

- Skill name (from arguments)

## Task

Create a unique temp directory:

```bash
skill_name="$1"
timestamp=$(date +"%Y%m%d-%H%M%S")
session_dir="/tmp/2bd-session-${skill_name}-${timestamp}"
mkdir -p "$session_dir"
echo "$session_dir"
```

Return the full path to the session directory.
