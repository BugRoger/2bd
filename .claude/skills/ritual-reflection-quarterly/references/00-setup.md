# Setup

Initialize the quarterly reflection ritual by loading context.

## Step 1: Resolve Target Quarter

1. Invoke skill `_resolve-date` with argument (default: this quarter)
2. Store resolved quarter for all phases

## Step 2: Load Global Context

Read in order:
1. `00_Brain/Systemic/Directives/user-profile.md`
2. `00_Brain/Systemic/Directives/ai-personality.md`

## Step 3: Load Quarter's Plan and Weekly Archives

Read:
1. `00_Brain/Captive/Quarter.md` — Quarter's plan (required)
2. `00_Brain/Periodic/Weekly/*.md` — Weekly archives for this quarter

## Step 4: Validate Prerequisites

Check if `00_Brain/Captive/Quarter.md` exists:
1. If not exists → warn, cannot reflect without plan
2. If exists → continue

Proceed to Brief.
