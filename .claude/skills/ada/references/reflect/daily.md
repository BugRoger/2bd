# Reflect Daily Sequence

## Voice

Apply Ada's personality throughout this ritual:

- **Open in character** — Evening greeting based on dimensions
- **Reference memory** — Check SOPs, avoid friction, use callbacks
- **Adapt questions** — Reframe based on what's worked
- **Close in character** — Relationship-appropriate send-off

## Learn Phase

After completing the reflection ritual, run Ada's learn phase:

1. Load `.claude/skills/ada/learn/daily.md`
2. Observe: SOPs, friction, non-answers, what worked
3. Record observations to `$VAULT/00_Brain/Synthetic/Assistants/ada/daily-observations.md`
4. Graduate confirmed patterns to `$VAULT/00_Brain/Semantic/Ada/memory.md`

## Phase 1: Parallel Draft Generation

Launch all assistants as background agents in a single message:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals reflect daily in draft mode. Compare plan vs actual, generate draft with findings and placeholders to Synthetic/Assistants/goals/daily-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar reflect daily in draft mode. Compare plan vs actual, generate draft with findings and placeholders to Synthetic/Assistants/calendar/daily-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal reflect daily in draft mode. Generate draft with reflection and placeholders to Synthetic/Assistants/journal/daily-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements reflect daily in draft mode. Generate draft with findings and placeholders to Synthetic/Assistants/achievements/daily-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships reflect daily in draft mode. Generate draft with findings and placeholders to Synthetic/Assistants/relationships/daily-reflect-draft.md"
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects reflect daily in draft mode. Generate draft with findings and placeholders to Synthetic/Assistants/projects/daily-reflect-draft.md"
)
```

## Phase 2: Wait for Completion

Use TaskOutput to wait for all agents to complete. Timeout: 2 minutes per agent.

## Phase 3: Collect Drafts

Use @ada/references/collect-drafts to gather all drafts and extract placeholders.

## Phase 4: Orchestrate Questions

Order questions intelligently:

1. **Reflection questions first** (journal: how was your day, what went well)
2. **Achievement questions** (goals: did you hit priorities, achievements: wins to capture)
3. **Analysis questions** (calendar: meeting insights, projects: progress)
4. **Learning questions** (relationships: interactions, what did you learn)

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

Use @ada/references/compose/compose action=reflect timescale=daily to assemble final note.

## Phase 8: Learn Phase

After compose, run learn phase:

Launch all assistants as background agents:

```
Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-goals learn daily. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-calendar learn daily. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-journal learn daily. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-achievements learn daily. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-relationships learn daily. Analyze patterns and update memory."
)

Agent(
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "Run @_assistant-projects learn daily. Analyze patterns and update memory."
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
   - {date}: {insight} (from daily reflect)

## Error Handling

If an assistant agent fails:
1. Log error with assistant name and message
2. Continue with other assistants
3. Report failed sections to user
4. Note gaps in compose step
