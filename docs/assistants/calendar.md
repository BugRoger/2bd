---
title: "Calendar"
description: "Meeting prep and post-meeting reflection."
---

## What Calendar does

Analyzes your calendar to prepare for meetings and capture post-meeting insights.

## Day shape analysis

Calendar identifies:
- **Focus blocks** — uninterrupted time for deep work
- **Meeting clusters** — back-to-back meetings that drain energy
- **1:1s** — people conversations needing prep
- **External meetings** — client or stakeholder interactions

## Meeting prep

For each significant meeting, Calendar generates:
- Context from prior interactions (from Relationships)
- Open items or commitments
- Suggested talking points
- Energy/attention notes ("3rd meeting in a row - pace yourself")

## Post-meeting reflection

After meetings, Calendar prompts:
- Key decisions made
- Action items captured
- Relationship notes to record
- Follow-ups needed

## Actions

| Action | Timescale | What it does |
|--------|-----------|--------------|
| Plan | Weekly | Analyze week shape, identify prep needs |
| Reflect | Daily | Review day's meetings, capture insights |
| Reflect | Weekly | Summarize meeting patterns |

## Configuration

Calendar requires a provider. See [Configuration](/configuration/hooks-and-integrations) for setup.

## What Calendar produces

- `Synthetic/Assistants/calendar/` — working output
- Meeting prep section in daily Captive notes
