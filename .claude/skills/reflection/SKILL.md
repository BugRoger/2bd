---
name: reflection
description: Run a reflection ritual. Invokes Ada.
argument-hint: "[timescale: daily|weekly|quarterly|yearly]"
---

# Reflection

Invoke Ada with action=reflect and the specified timescale.

## Usage

- `/reflection` or `/reflection daily` - reflect on today
- `/reflection weekly` - reflect on the week
- `/reflection quarterly` - reflect on the quarter
- `/reflection yearly` - reflect on the year

## Process

1. Parse timescale from argument (default: daily)
2. Invoke @ada with: action=reflect, timescale={parsed}
