---
name: create-session
description: Create temp session directory for orchestrated skill execution
disable-model-invocation: true
allowed-tools: Bash
---

# Create Session

Create a temporary session directory for orchestrated skill execution.

## Inputs

- `$1` (skill_name) — Required. Name of the skill for which to create a session. Should not contain special characters or spaces.

## Task

Create a unique temp directory with error handling:

```bash
skill_name="${1:?Error: skill name required}"
timestamp=$(date +"%Y%m%d-%H%M%S")
session_dir="/tmp/2bd-session-${skill_name}-${timestamp}"

if ! mkdir -p "$session_dir"; then
    echo "Error: Failed to create session directory at $session_dir" >&2
    exit 1
fi

echo "$session_dir"
```

## Output

On success, returns the session directory path:
```
/tmp/2bd-session-{skill_name}-{timestamp}
```

On error, outputs message to stderr and exits with non-zero code:
```
Error: skill name required
# or
Error: Failed to create session directory at /tmp/...
```

## Cleanup

Session directories in `/tmp` are cleaned by the OS on reboot. For long-running systems, consider periodic cleanup:
```bash
find /tmp/2bd-session-* -mtime +7 -type d -exec rm -rf {} \;
```
