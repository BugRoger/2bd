# Codebase Structure

**Analysis Date:** 2026-02-28

## Directory Layout

```
2bd/
├── .claude/                    # Claude skills and configuration
│   ├── config.md               # Vault path configuration
│   ├── skills/
│   │   ├── ada/                # Executive Assistant orchestrator
│   │   ├── _assistant-*/       # Domain-specific assistants (6 total)
│   │   ├── _specs/             # Specification templates
│   │   └── _util-*/            # Utility skills
│   └── hooks/                  # Git hooks
├── teams-bot/                  # Microsoft Teams integration bot
│   ├── src/                    # TypeScript source code
│   ├── manifest/               # Teams app manifest
│   ├── package.json
│   └── tsconfig.json
├── docs/                       # Mintlify documentation site
│   ├── ada/                    # Ada architecture docs
│   ├── assistants/             # Skill documentation
│   ├── overview/               # Getting started
│   ├── reference/              # API reference
│   └── configuration/          # Setup guides
├── .plans/                     # Implementation plans (design documents)
├── .planning/codebase/         # Generated codebase analysis (this folder)
├── .obsidian/                  # Obsidian vault configuration
├── vault/                      # Symlink to user's OneDrive Second Brain
├── CLAUDE.md                   # Project-specific Claude guidelines
├── README.md                   # Project overview
├── CHANGELOG.md                # Release history
└── 2bd.code-workspace          # VSCode workspace config
```

## Directory Purposes

**`.claude/`:**
- Purpose: Central skill library and configuration
- Contains: 16+ skills organized by type (ada coordinator, 6 domain assistants, utilities, specs)
- Key files:
  - `config.md`: Vault path mapping (required for skill execution)
  - `skills/ada/`: Orchestrator that sequences domain assistants
  - `skills/_assistant-*/`: Domain skills (goals, calendar, journal, achievements, relationships, projects)
- Structure: Each skill has `SKILL.md` (metadata), `templates/` (timescale-specific), `references/` (behavior)

**`teams-bot/`:**
- Purpose: Microsoft Teams webhook integration and bot orchestration
- Contains: Teams activity handlers, session management, subprocess bridging
- Key files:
  - `src/index.ts`: Server entry point, component initialization
  - `src/bot.ts`: Activity routing and session lifecycle
  - `src/session-manager.ts`: Session state tracking and timeout management
  - `src/intent-detector.ts`: Claude API intent classification
  - `src/subprocess-bridge.ts`: Claude CLI subprocess spawning
  - `src/output-formatter.ts`: Terminal output parsing and classification
  - `src/interactive-mapper.ts`: Adaptive card generation from prompts
  - `src/config.ts`: Environment configuration loading and validation
  - `src/auth.ts`: JWT token validation
  - `src/types.ts`: TypeScript types for Teams protocol

**`docs/`:**
- Purpose: User and developer documentation (Mintlify-based)
- Contains: Architecture guides, setup instructions, skill reference, API docs
- Structure: Organized by audience/topic (overview, configuration, development)

**`.plans/`:**
- Purpose: Implementation design documents and decision records
- Contains: 15+ dated design documents for refactoring, features, architecture changes
- Naming: `YYYY-MM-DD-{topic}.md` or `{topic}.md`

## Key File Locations

**Entry Points:**
- `teams-bot/src/index.ts`: Bot server initialization and HTTP routes
- `.claude/skills/ada/SKILL.md`: Ada skill metadata and action handlers
- `.claude/skills/_assistant-{domain}/SKILL.md`: Each domain assistant metadata

**Configuration:**
- `.claude/config.md`: Vault path configuration
- `teams-bot/src/config.ts`: Environment variable validation and loading
- `teams-bot/package.json`: Dependencies, scripts (dev, start)
- `teams-bot/tsconfig.json`: TypeScript configuration

**Core Logic:**
- `teams-bot/src/bot.ts`: Activity routing (message, conversationUpdate, invoke)
- `teams-bot/src/intent-detector.ts`: Intent classification logic
- `teams-bot/src/session-manager.ts`: Single-session constraint enforcement
- `teams-bot/src/subprocess-bridge.ts`: Skill process spawning
- `.claude/skills/ada/references/plan/`: Plan sequences (daily, weekly, quarterly, yearly)
- `.claude/skills/ada/references/reflect/`: Reflect sequences (daily, weekly, quarterly, yearly)

**Testing:**
- `teams-bot/src/__tests__/`: Test files co-located with source
- `teams-bot/src/__tests__/output-formatter.test.ts`: Output parser unit tests

**Types & Interfaces:**
- `teams-bot/src/types.ts`: Teams Activity protocol types, Session interface, SessionState persistence
- `teams-bot/src/config.ts`: Config interface with validation
- `teams-bot/src/intent-detector.ts`: IntentResult interface
- `teams-bot/src/output-formatter.ts`: ParsedOutput and OutputType enum

## Naming Conventions

**Files:**
- TypeScript source: camelCase.ts (e.g., `intent-detector.ts`, `session-manager.ts`)
- Test files: `.test.ts` suffix (e.g., `output-formatter.test.ts`)
- Skills: kebab-case directories with SKILL.md (e.g., `_assistant-goals/`, `ada/`)
- Markdown docs: kebab-case.md or descriptive (e.g., `daily.md`, `ritual-flow.md`)
- Configuration: lowercase with extension (`.md`, `.json`)

**Directories:**
- Source code: `src/`
- Tests: `__tests__/`
- Skills: `skills/`, with underscore prefix for internal tools (`_assistant-*`, `_util-*`, `_specs`)
- Subdirectories within skills: `templates/`, `references/`, `plan/`, `reflect/`, `learn/`
- Documentation: `docs/` with subdirectories by topic (ada, assistants, overview, reference, configuration)

**Code Exports:**
- Classes: PascalCase (e.g., `SessionManager`, `IntentDetector`, `OutputFormatter`)
- Interfaces: PascalCase (e.g., `Activity`, `Session`, `Config`)
- Enums: PascalCase with SCREAMING_CASE members (e.g., `OutputType.PROMPT`)
- Functions: camelCase (e.g., `handleActivity()`, `detectIntent()`)
- Type aliases: PascalCase (e.g., `ActivityType`)

**Environment Variables:**
- SCREAMING_SNAKE_CASE (e.g., `ENGINE_PATH`, `ANTHROPIC_API_KEY`, `SESSION_TIMEOUT_MS`, `ALLOWED_AAD_OBJECT_ID`)

## Where to Add New Code

**New Teams Bot Feature:**
- Implementation: `teams-bot/src/{feature-name}.ts` (e.g., `teams-bot/src/webhook-validator.ts`)
- Tests: `teams-bot/src/__tests__/{feature-name}.test.ts`
- Register in: `teams-bot/src/index.ts` (import and initialize)
- If new handler type: Add to `bot.ts::handleActivity()` switch statement

**New Skill/Ritual:**
- Skill definition: `.claude/skills/{skill-type}/{skill-name}/` with `SKILL.md`
- Timescale templates: `.claude/skills/{skill-name}/templates/{daily|weekly|quarterly|yearly}.md`
- Behavior references: `.claude/skills/{skill-name}/references/{action}/*.md`
- Discovery: Automatic via `discoverSkills()` scanning `.claude/skills/rituals/` or `.claude/skills/commands/`

**New Domain Assistant:**
- Pattern: `.claude/skills/_assistant-{domain-name}/`
- Structure:
  - `SKILL.md`: Skill metadata
  - `templates/{timescale}.md`: User-facing templates for each timescale
  - `references/`: Behavior definitions (how to load, process, persist)
  - `plan/`: Plan-phase specific references
  - `reflect/`: Reflect-phase specific references
  - `learn/`: Learning/training materials

**Utilities and Shared Code:**
- Helper functions: `teams-bot/src/{concern}-utils.ts`
- Shared types: `teams-bot/src/types.ts` (append to existing file)
- Formatters/parsers: `teams-bot/src/{domain}-formatter.ts`

**Documentation:**
- User guides: `docs/overview/` or `docs/configuration/`
- API reference: `docs/reference/`
- Development guides: `docs/development/` (check if exists)

## Special Directories

**`.active-session.json`:**
- Purpose: Session state persistence for crash recovery
- Generated: Yes (created during session, deleted on session destroy)
- Committed: No (in .gitignore)
- Contents: PID, skill name, conversation ID, start timestamp
- Lifecycle: Created by `session-manager.ts::saveState()`, recovered by `cleanupOrphaned()`, deleted on destroy

**`vault/`:**
- Purpose: Symlink to user's OneDrive Second Brain
- Generated: No (symlink created during setup)
- Committed: No (symlink tracked, actual vault not in repo)
- Usage: Vault path configured in `.claude/config.md`, passed to skills via environment/arguments

**`.plans/`:**
- Purpose: Implementation design documents
- Generated: No (authored by developers)
- Committed: Yes
- Naming: Dated (YYYY-MM-DD-{topic}.md) for chronological organization
- Role: Authoritative during execution (takes precedence over outdated docs per CLAUDE.md)

**`.planning/codebase/`:**
- Purpose: Generated codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: Yes (by GSD map-codebase command)
- Committed: Yes (reference documents for future sessions)
- Naming: UPPERCASE.md (ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md)

**`.obsidian/`:**
- Purpose: Obsidian vault configuration
- Generated: No
- Committed: Yes (for shared settings)
- Contains: Plugin configs, theme settings, snippet styles
- Modified by: Obsidian app automatically

**`manifest/`:**
- Purpose: Microsoft Teams app manifest
- Generated: No (authored manually)
- Committed: Yes
- Role: Defines bot capabilities for Teams app registration
- Key file: `manifest.json` or similar (Teams app configuration)

## Import Path Patterns

**Internal imports (teams-bot):**
- Relative paths: `../config`, `./types`
- Modules in same directory: `./intent-detector`
- No path aliases configured (raw relative paths used)

**Skill invocation (Ada sequences):**
- Dispatch syntax: `@_assistant-{domain} action={plan|reflect} timescale={daily|weekly|quarterly|yearly}`
- Examples: `@_assistant-goals action=plan timescale=daily`, `@ada/references/compose action=plan timescale=daily`
- Pattern: @ prefix for skill references in sequence files

**Environment-based paths:**
- Engine path: `process.env.ENGINE_PATH` (required, validated on startup)
- Claude CLI: `process.env.CLAUDE_CLI_PATH || "claude"` (default "claude" in PATH)
- Vault: Resolved via `.claude/config.md`, passed to subprocesses

## Common Patterns

**Singleton Component Pattern:**
```
// Initialization (index.ts):
initializeComponents({ config, sessionManager, ... })

// Usage anywhere:
const { sessionManager } = getComponents()
```

**Error-Safe Return Pattern:**
```
// Intent detection returns null skill on any error
// No exception thrown, graceful degradation
try { ... } catch (err) { return { skill: null } }
```

**Stateful Session Pattern:**
```
// Create, use, destroy lifecycle
sessionManager.create(conversationId, skill, process)
// ... active session operations ...
sessionManager.destroy()
```

**Output Buffering Pattern:**
```
// Lines incomplete until newline received
buffer += data
const lines = buffer.split("\n")
process(lines[0..n-1])  // complete lines
buffer = lines[-1]      // incomplete last line
```

**Subprocess Callback Pattern:**
```
spawn(skill, args, {
  onStdout: (data) => { /* handle output */ },
  onStderr: (data) => { /* handle error */ },
  onExit: (code) => { /* handle completion */ }
})
```

## Generated vs. Committed Files

**Not in `.gitignore` (committed):**
- All `.md` files (docs, references, templates, plans)
- `.claude/config.md` (vault configuration)
- TypeScript source and tests
- `teams-bot/package.json`, `tsconfig.json`, manifest
- `.planning/codebase/` analysis documents

**In `.gitignore` (generated/local):**
- `node_modules/`
- `dist/` or build output
- `.active-session.json` (session state)
- `.env` files and secrets
- `.DS_Store` and OS files
