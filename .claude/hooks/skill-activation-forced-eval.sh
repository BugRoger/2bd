#!/bin/bash
# UserPromptSubmit hook that enforces skill activation
#
# This hook requires Claude to activate relevant skills before implementation.

cat <<'EOF'
INSTRUCTION: MANDATORY SKILL ACTIVATION

Check <available_skills> for relevance before proceeding.

IF any skills are relevant:
  1. State which skills and why (only mention relevant ones)
  2. Activate ALL relevant skills with Skill() tool - multiple skills can be activated together
  3. Then proceed with implementation

IF no skills are relevant:
  - Proceed directly (no statement needed)

Example when multiple skills are relevant:
  relevant skills: mongo (querying database), local-docs (using go-pkgz)
  [activates Skill(mongo)]
  [activates Skill(local-docs)]
  [then proceeds with implementation]

CRITICAL: Activate ALL relevant skills via Skill() tool before implementation.
Multiple skills can and should be activated when applicable.
Mentioning a skill without activating it is worthless.
EOF