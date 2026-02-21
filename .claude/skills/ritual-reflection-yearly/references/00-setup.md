# Setup

Initialize the yearly reflection ritual by loading context.

## Step 1: Resolve Target Year

1. Invoke skill `_resolve-date` with argument (default: this year)
2. Store resolved year for all phases

## Step 2: Load Global Context

Read in order:
1. `00_Brain/Systemic/Directives/user-profile.md`
2. `00_Brain/Systemic/Directives/ai-personality.md`

## Step 3: Load Year's Plan and Quarterly Archives

Read:
1. `00_Brain/Captive/Year.md` — Year's plan (required)
2. `00_Brain/Periodic/Quarterly/*.md` — Quarterly archives for this year

## Step 4: Validate Prerequisites

Check if `00_Brain/Captive/Year.md` exists:
1. If not exists → warn, cannot reflect without plan
2. If exists → continue

Proceed to Brief.
