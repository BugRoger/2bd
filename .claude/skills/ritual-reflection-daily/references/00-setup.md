# Setup

Initialize the daily reflection ritual by loading context.

## Step 1: Resolve Target Date

1. Invoke skill `_resolve-date` with argument (default: today)
2. Store resolved date for all phases

## Step 2: Load Global Context

Read in order:
1. `00_Brain/Systemic/Directives/user-profile.md`
2. `00_Brain/Systemic/Directives/ai-personality.md`

## Step 3: Load Today's Plan

Read:
1. `00_Brain/Captive/Today.md` — Today's plan (required)
2. `00_Brain/Captive/Week.md` — Week context (Major Moves)

## Step 4: Validate Prerequisites

Check if `00_Brain/Captive/Today.md` exists:
1. If not exists → warn, cannot reflect without plan
2. If exists → continue

Proceed to Brief.
