# Setup

Initialize the yearly planning ritual by loading context and validating prerequisites.

## Step 1: Resolve Target Year

1. Invoke skill `_resolve-date` with argument (default: this year)
2. Store resolved year for all phases

## Step 2: Load Global Context

Read in order:
1. `00_Brain/Systemic/Directives/user-profile.md`
2. `00_Brain/Systemic/Directives/ai-personality.md`

## Step 3: Load Hierarchical Context

Read:
1. Prior year archive (if exists)

## Step 4: Validate Prerequisites

Check if `00_Brain/Captive/Year.md` exists for target year:
1. If exists → warn, offer Abort or Start fresh
2. If abort → end session
3. If start fresh → continue

## Step 5: Initialize Year.md

1. Read template from `00_Brain/Systemic/Templates/Captive/Year.md`
2. Replace placeholders with resolved date values
3. Write to `00_Brain/Captive/Year.md`

Proceed to Brief.
