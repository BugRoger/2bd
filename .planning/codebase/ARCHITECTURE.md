# Architecture

**Analysis Date:** 2026-02-28

## Pattern Overview

**Overall:** Assistant Orchestration with Metabolic State Organization

2bd implements a **coordinator-specialist** pattern where Ada (Executive Assistant) orchestrates domain-specific assistants (goals, calendar, journal, achievements, relationships, projects) across timescales. The system organizes all information by **metabolic state** (how volatile/active the information is) rather than topic.

**Key Characteristics:**
- Assistant specialization: Each domain gets a dedicated skill that knows all timescales
- Sequence-driven rituals: Plans and reflections follow predefined sequences stored as reference documents
- State-driven organization: Information flows through Captive (working) → Synthetic (drafts) → Periodic (archived) → Semantic (learned)
- Time-scale nesting: Daily rituals feed weekly reviews, which inform quarterly direction, which align with yearly vision
- Vault-centric: All persistent data lives in a markdown-based vault (symlinked to OneDrive Second Brain)

## Layers

**Ada (Orchestrator Layer):**
- Purpose: Entry point and ritual coordinator; parses user intent and directs assistant execution
- Location: `.claude/skills/ada/`
- Contains: SKILL.md manifest, templates for timescales, references for sequences, setup/profile flows
- Depends on: Domain assistants, vault structure, reference documents
- Used by: Users via natural language commands; called directly as `/ada [action] [timescale]`

**Domain Assistants (Specialist Layer):**
- Purpose: Handle specific domains (goals, calendar, journal, etc.); each knows its own timescales
- Location: `.claude/skills/_assistant-{name}/` (e.g., `_assistant-journal`, `_assistant-goals`)
- Contains: SKILL.md frontmatter declaring supported timescales, plan/reflect/learn action references
- Depends on: Vault data, user profile, timescale directives
- Used by: Ada during ritual sequences

**Compose (Assembly Layer):**
- Purpose: Synthesize assistant outputs into final Captive/Periodic files
- Location: `.claude/skills/ada/references/compose/`
- Contains: compose.md (orchestration logic), assembly.md (assembly protocol)
- Depends on: All assistant outputs, brief synthesis sources, section-order configuration
- Used by: Ada as final step in plan/reflect sequences

**Vault (Persistent Storage):**
- Purpose: Markdown-based knowledge base organized by metabolic state
- Location: Symlinked at `vault/` to user's OneDrive Second Brain
- Contains: 00_Brain (core system), 01_Projects (active work), 02_Areas (ongoing domains), 04_Archives (completed work)
- Depends on: File system, Obsidian configuration
- Used by: All assistants for context, state persistence, template loading

**Specifications Layer (Contracts):**
- Purpose: Define contracts between skills and the system
- Location: `.claude/skills/_specs/`
- Contains: output-format.md, timescales.md, knowledge-model.md
- Depends on: Nothing; defines standards
- Used by: Assistants during plan/reflect/learn actions

## Data Flow

**Planning Ritual Flow (e.g., "Ada, run my morning ritual"):**

1. User invokes Ada with `action=plan, timescale=daily`
2. Ada checks `.claude/config.md` for vault path (first-run detection)
3. Ada reads `.claude/skills/ada/references/plan/daily.md` sequence
4. For each assistant in sequence:
   - Invoke `_assistant-{name} action=plan timescale=daily`
   - Assistant reads context from vault (previous week.md, user profile, goals)
   - Assistant runs interactive dialogue with user
   - Assistant writes output to `vault/00_Brain/Synthetic/Assistants/{name}/observations.md`
5. Invoke compose assistant
   - Read all assistant outputs from Synthetic/Assistants/
   - Synthesize brief section (priorities, intention, growth edge)
   - Assemble into `vault/00_Brain/Captive/Today.md`
6. Invoke learn assistant
   - Analyze patterns across observations
   - Cluster related insights
   - Write to Semantic if high-confidence
7. Report completion to user

**Reflection Ritual Flow (e.g., "Ada, let's reflect on today"):**

1. User invokes Ada with `action=reflect, timescale=daily`
2. Ada reads `.claude/skills/ada/references/reflect/daily.md` sequence
3. For each assistant:
   - Load today's plan from Captive/Today.md
   - Load today's capture from vault's working notes
   - Compare planned vs actual
   - Write findings to Synthetic/Assistants/{name}/
4. Compose assembles findings into coaching conversation format
5. User confirms learnings; confirmed observations persist to 02_Areas/People/ and 01_Projects/
6. Archive to `vault/00_Brain/Periodic/Daily/YYYY-MM-DD.md`

**State Management:**

- **Captive:** Today.md, Week.md, Quarter.md, Year.md (volatile, in-flight work)
- **Synthetic:** Assistants/{name}/observations.md (draft outputs, working space)
- **Periodic:** Daily/YYYY-MM-DD.md, Weekly/YYYY-Www.md, etc. (immutable timeline)
- **Semantic:** Per-ritual/insights.md (graduated learnings, high-confidence patterns)
- **Systemic:** Templates, Directives, Coaching (infrastructure, not data)

## Key Abstractions

**Ritual (Plan/Reflect/Setup):**
- Purpose: Time-bounded action coordinating multiple assistants
- Examples: `.claude/skills/ada/references/plan/daily.md`, `reflect/quarterly.md`
- Pattern: Sequence of assistant invocations + compose step; error-resilient (continues if assistant fails)

**Timescale:**
- Purpose: Temporal context (daily, weekly, quarterly, yearly)
- Examples: Templates at `.claude/skills/ada/templates/{timescale}.md`
- Pattern: Each timescale nests into the next; same assistants handle all scales they support

**Assistant:**
- Purpose: Domain-specific skill handling one area across multiple timescales
- Examples: `.claude/skills/_assistant-goals/`, `_assistant-journal/`
- Pattern: Declares supported timescales in SKILL.md frontmatter; implements plan/reflect/learn actions

**Metabolic State:**
- Purpose: Organize information by lifecycle stage, not topic
- Examples: Captive (working), Synthetic (drafts), Periodic (archived), Semantic (learned), Systemic (infrastructure)
- Pattern: Information naturally flows through states without explicit categorization

## Entry Points

**Ada Skill:**
- Location: `.claude/skills/ada/SKILL.md`
- Triggers: User natural language (`"Ada, plan my day"`) or `/ada [action] [timescale]`
- Responsibilities: Parse intent, validate config, execute ritual sequences, report status

**Setup Action:**
- Location: `.claude/skills/ada/references/setup/init.md`
- Triggers: First run or missing vault configuration
- Responsibilities: Detect vault location, initialize 00_Brain structure, create config

**Profile Action:**
- Location: `.claude/skills/ada/references/setup/profile.md`
- Triggers: On demand or when user profile needs update
- Responsibilities: Update user-profile.md and ai-personality.md in vault

## Error Handling

**Strategy:** Resilient continuation - if an assistant fails, Ada logs the error and continues with remaining assistants. Missing sections are noted in compose step.

**Patterns:**
- Try-catch around each assistant invocation
- Continue sequence if assistant errors
- Compose step notes gaps in output
- User is informed of partial completion

## Cross-Cutting Concerns

**Logging:** Compose assistant writes logs to `vault/00_Brain/Synthetic/Assistants/compose/{date}-compose-{action}-{timescale}.md` for audit trail.

**Validation:** Ada validates vault path on every ritual; first-run detection checks `.claude/config.md` existence.

**Timescale Support:** Each assistant declares supported timescales in SKILL.md frontmatter (e.g., `timescales: plan: [daily, weekly]`). Ada skips assistants that don't support current action+timescale.

**Brief Synthesis:** Only during plan actions; reads leadership coaching from `vault/00_Brain/Systemic/Coaching/leadership/{timescale}.md` to inject growth edge.

---

*Architecture analysis: 2026-02-28*
