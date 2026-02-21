# Setup

Initialize the weekly reflection ritual by loading context.

## Step 1: Resolve Target Week

1. Invoke skill `_resolve-date` with argument (default: this week)
2. Store resolved week for all phases

## Step 2: Load Global Context

Read in order:
1. `00_Brain/Systemic/Directives/user-profile.md`
2. `00_Brain/Systemic/Directives/ai-personality.md`

## Step 3: Load Week's Plan and Daily Archives

Read:
1. `00_Brain/Captive/Week.md` — Week's plan (required)
2. `00_Brain/Periodic/Daily/*.md` — Daily archives for this week

## Step 4: Validate Prerequisites

Check if `00_Brain/Captive/Week.md` exists:
1. If not exists → warn, cannot reflect without plan
2. If exists → continue

Proceed to Brief.
