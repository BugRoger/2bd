# Plan Weekly Sequence

## Phase 1: Parallel Draft Generation

Launch all assistants as background agents in a single message:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals plan weekly in draft mode. Read context from vault, generate draft with placeholders to Synthetic/Assistants/goals/weekly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar plan weekly in draft mode. Fetch events, generate draft with placeholders to Synthetic/Assistants/calendar/weekly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal plan weekly in draft mode. Generate draft with placeholders to Synthetic/Assistants/journal/weekly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements plan weekly in draft mode. Generate draft with placeholders to Synthetic/Assistants/achievements/weekly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships plan weekly in draft mode. Generate draft with placeholders to Synthetic/Assistants/relationships/weekly-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects plan weekly in draft mode. Generate draft with placeholders to Synthetic/Assistants/projects/weekly-draft.md"
)
```

## Phase 2: Wait for Completion

Use TaskOutput to wait for all agents to complete. Timeout: 2 minutes per agent.

## Phase 3: Collect Drafts

Use @ada/references/collect-drafts to gather all drafts and extract placeholders.

## Phase 4: Orchestrate Questions

Order questions intelligently:

1. **Context questions first** (journal: weekly themes, energy patterns)
2. **Priority questions** (goals: major moves)
3. **Tactical questions** (calendar: key meetings, projects: milestones)
4. **Touchpoint questions** (relationships: weekly connections)

Heuristic: journal → goals → calendar → projects → relationships → achievements

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

Use @ada/references/compose/compose action=plan timescale=weekly to assemble final note.

## Error Handling

If an assistant agent fails:
1. Log error with assistant name and message
2. Continue with other assistants
3. Report failed sections to user
4. Note gaps in compose step
