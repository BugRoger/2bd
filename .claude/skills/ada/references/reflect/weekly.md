# Reflect Weekly Sequence

## Phase 1: Parallel Draft Generation

Launch all assistants as background agents in a single message:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals reflect weekly in draft mode. Compare plan vs actual, generate draft with findings and placeholders to Synthetic/Assistants/goals/weekly-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar reflect weekly in draft mode. Compare plan vs actual, generate draft with findings and placeholders to Synthetic/Assistants/calendar/weekly-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal reflect weekly in draft mode. Generate draft with reflection and placeholders to Synthetic/Assistants/journal/weekly-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements reflect weekly in draft mode. Generate draft with findings and placeholders to Synthetic/Assistants/achievements/weekly-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships reflect weekly in draft mode. Generate draft with findings and placeholders to Synthetic/Assistants/relationships/weekly-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects reflect weekly in draft mode. Generate draft with findings and placeholders to Synthetic/Assistants/projects/weekly-reflect-draft.md"
)
```

## Phase 2: Wait for Completion

Use TaskOutput to wait for all agents to complete. Timeout: 2 minutes per agent.

## Phase 3: Collect Drafts

Use @ada/references/collect-drafts to gather all drafts and extract placeholders.

## Phase 4: Orchestrate Questions

Order questions intelligently:

1. **Reflection questions first** (journal: how was your week, themes)
2. **Achievement questions** (goals: Major Moves progress, achievements: wins)
3. **Analysis questions** (calendar: week shape effectiveness, projects: progress)
4. **Learning questions** (relationships: key interactions, what did you learn)

Heuristic: journal → achievements → goals → calendar → projects → relationships

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

Use @ada/references/compose/compose action=reflect timescale=weekly to assemble final note.

## Phase 8: Learn Phase

After compose, run learn phase:

Launch all assistants as background agents:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals learn weekly. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar learn weekly. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal learn weekly. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements learn weekly. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships learn weekly. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects learn weekly. Analyze patterns and update memory."
)
```

Wait for completion and collect findings.

## Phase 9: Aggregate Findings

After assistants return findings:

1. Collect all `### Entity Learnings` from assistant findings
2. Collect all `### Coaching Questions` from assistant findings
3. Weave into coaching conversation:
   - Surface variance patterns across domains
   - Ask coaching questions that connect insights
   - Discuss entity learnings with user

## Phase 10: Persist Entity Learnings

After user confirms insights:

For each confirmed entity learning:
1. Find entity file in vault:
   - People: `vault/02_Areas/People/{name}.md`
   - Projects: `vault/01_Projects/{name}.md`
2. Append to `## Insights` section:
   - {date}: {insight} (from weekly reflect)

## Error Handling

If an assistant agent fails:
1. Log error with assistant name and message
2. Continue with other assistants
3. Report failed sections to user
4. Note gaps in compose step
