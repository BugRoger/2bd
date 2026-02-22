---
name: planning
description: Run a planning ritual. Invokes Ada.
argument-hint: "[timescale: daily|weekly|quarterly|yearly]"
---

# Planning

Invoke Ada with action=plan and the specified timescale.

## Usage

- `/planning` or `/planning daily` - plan today
- `/planning weekly` - plan the week
- `/planning quarterly` - plan the quarter
- `/planning yearly` - plan the year

## Process

1. Parse timescale from argument (default: daily)
2. Invoke @ada with: action=plan, timescale={parsed}
