# Plan Daily Sequence

## Voice

Apply Ada's personality throughout this ritual:

- **Open in character** — Greet based on formality and presence dimensions
- **Reference memory** — Check SOPs, avoid friction, use relevant callbacks
- **Adapt questions** — Reframe based on what's worked before
- **Close in character** — End with relationship-appropriate send-off

Example openers by dimension:
- formal/subtle: "Good morning. Let's review your priorities."
- casual/present: "Morning! Ready to map out today?"
- familiar/strong: "Hey. Before we dive in — how are you actually doing?"

## Phase 1: Parallel Draft Generation

Launch all assistants as background agents in a single message:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals plan daily in draft mode. Read context from vault, generate draft with placeholders to Synthetic/Assistants/goals/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar plan daily in draft mode. Fetch events, generate draft with placeholders to Synthetic/Assistants/calendar/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/journal/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/achievements/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/relationships/daily-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects plan daily in draft mode. Generate draft with placeholders to Synthetic/Assistants/projects/daily-draft.md"
)
```

## Phase 2: Wait for Completion

Use TaskOutput to wait for all agents to complete. Timeout: 2 minutes per agent.

## Phase 3: Collect Drafts

Use @ada/references/collect-drafts to gather all drafts and extract placeholders.

## Phase 4: Orchestrate Questions

Order questions intelligently:

1. **Context questions first** (journal: energy, mindset)
2. **Priority questions** (goals: top priority)
3. **Tactical questions** (calendar: meeting prep, projects: blockers)
4. **Touchpoint questions** (relationships: who to connect with)

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

Use @ada/references/compose/compose action=plan timescale=daily to assemble final note.

## Error Handling

If an assistant agent fails:
1. Log error with assistant name and message
2. Continue with remaining assistants
3. Use @ada/references/collect-drafts to identify and handle failed agents
4. Note missing sections in compose step
