---
name: init
description: Bootstrap 2bd. Sets up your vault and introduces you to Ada.
argument-hint: "[--vault=/path/to/vault]"
---

# Init

First-time setup for 2bd. This skill is a thin wrapper that invokes Ada for the actual setup experience.

## Process

1. Check if already configured (`.claude/config.md` exists with valid vault path)
2. If configured: "You're already set up. Run /ada to get started."
3. If not configured: Invoke Ada with `setup` action

## Invocation

When not configured, tell the user:

"Let me introduce you to Ada."

Then invoke the `ada` skill with action `setup` and pass any `--vault` argument.
