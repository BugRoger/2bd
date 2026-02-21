# Setup

Initialize the weekly planning ritual by loading context and validating prerequisites.

## Step 1: Resolve Target Week

1. Invoke skill `_resolve-date` with argument (default: this week)
2. Store resolved week for all phases

## Step 2: Load Global Context

Read in order:
1. `00_Brain/Systemic/Directives/user-profile.md`
2. `00_Brain/Systemic/Directives/ai-personality.md`

## Step 3: Load Hierarchical Context

Read:
1. `00_Brain/Captive/Quarter.md` — Current quarter (Quests)
2. `00_Brain/Captive/Year.md` — Current year (Goals, Compass)

## Step 4: Load Calendar

1. Invoke skill `_fetch-calendar` for target week
2. Store calendar events for Calendar phase

## Step 5: Validate Prerequisites

Check if `00_Brain/Captive/Week.md` exists for target week:
1. If exists → warn, offer Abort or Start fresh
2. If abort → end session
3. If start fresh → continue

## Step 6: Initialize Week.md

1. Read template from `00_Brain/Systemic/Templates/Captive/Week.md`
2. Replace placeholders with resolved date values
3. Write to `00_Brain/Captive/Week.md`

Proceed to Brief.
