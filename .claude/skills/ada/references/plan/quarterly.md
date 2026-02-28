# Plan Quarterly Sequence

## Voice

Apply Ada's personality throughout this ritual:

- **Open in character** — Greet based on formality and presence dimensions
- **Reference memory** — Check SOPs, avoid friction, use relevant callbacks
- **Adapt questions** — Reframe based on what's worked before
- **Close in character** — End with relationship-appropriate send-off

Example openers by dimension:
- formal/subtle: "Good to see you. Let's set the tone for this quarter."
- casual/present: "New quarter! Ready to set some intentions?"
- familiar/strong: "Hey. A fresh quarter — what are you hoping for this time?"

## Phase 1: Parallel Draft Generation

Launch all assistants as background agents in a single message:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-brief plan quarterly in draft mode. Read context from vault, generate draft with placeholders to Synthetic/Assistants/brief/quarterly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals plan quarterly in draft mode. Read context from vault, generate draft with placeholders to Synthetic/Assistants/goals/quarterly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar plan quarterly in draft mode. Fetch events, generate draft with placeholders to Synthetic/Assistants/calendar/quarterly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal plan quarterly in draft mode. Generate draft with placeholders to Synthetic/Assistants/journal/quarterly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements plan quarterly in draft mode. Generate draft with placeholders to Synthetic/Assistants/achievements/quarterly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships plan quarterly in draft mode. Generate draft with placeholders to Synthetic/Assistants/relationships/quarterly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects plan quarterly in draft mode. Generate draft with placeholders to Synthetic/Assistants/projects/quarterly-draft.md"
)
```

## Phase 2: Wait for Completion

Use TaskOutput to wait for all agents to complete. Timeout: 2 minutes per agent.

## Phase 3: Collect Drafts

Use @ada/references/collect-drafts to gather all drafts and extract placeholders.

## Phase 4: Orchestrate Questions

Order questions intelligently:

1. **Context questions first** (journal: quarterly themes, pivots)
2. **Strategic questions** (brief: quarterly objectives, goals: quests)
3. **Tactical questions** (calendar: key events, projects: quarterly milestones)
4. **Touchpoint questions** (relationships: quarterly connections)

Heuristic: journal → brief → goals → calendar → projects → relationships → achievements

Within each assistant, maintain question order from draft.

## Phase 5: Ask Questions

For each question in order:
- Show context from draft if helpful
- Ask the question
- Collect and validate answer
- Map to placeholder ID

## Phase 6: Fill Placeholders

Use @ada/references/fill-placeholders to replace all placeholders with answers.

## Phase 7: Compose

Use @ada/references/compose/compose action=plan timescale=quarterly to assemble final note.

## Error Handling

If an assistant agent fails:
1. Log error with assistant name and message
2. Continue with other assistants
3. Report failed sections to user
4. Note gaps in compose step
