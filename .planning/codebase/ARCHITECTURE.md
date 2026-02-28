# Architecture

**Analysis Date:** 2026-02-28

## Pattern Overview

**Overall:** Orchestrated multi-agent system with layered subprocess communication and skill discovery.

**Key Characteristics:**
- **Coordinator pattern**: Ada skill coordinates execution of domain assistants via subprocess invocation
- **Bridge pattern**: Teams bot bridges Microsoft Teams webhook protocol to Claude CLI processes
- **Pipeline pattern**: Planning and reflection sequences execute domain assistants in series with error recovery
- **Stateful session management**: Single active session per bot instance with timeout-based cleanup
- **Intent detection**: Natural language input routed to appropriate skills via Claude API classification

## Layers

**Presentation Layer (Teams Integration):**
- Purpose: Handle Microsoft Teams webhook protocol and convert Teams interactions to internal messages
- Location: `teams-bot/src/index.ts`, `teams-bot/src/bot.ts`, `teams-bot/src/teams-api.ts`
- Contains: HTTP server (Hono), activity handlers, Teams protocol adapters, authentication
- Depends on: Session manager, intent detector, subprocess bridge, output formatter
- Used by: External Teams service

**Intent & Routing Layer:**
- Purpose: Parse user input and determine which skill/ritual to invoke
- Location: `teams-bot/src/intent-detector.ts`, `teams-bot/src/bot.ts` (handleMessage)
- Contains: Claude API integration for intent classification, router logic
- Depends on: Anthropic SDK, config
- Used by: Bot message handler

**Session Management Layer:**
- Purpose: Track active skill execution and enforce single-session constraint
- Location: `teams-bot/src/session-manager.ts`
- Contains: Session lifecycle (create/destroy/timeout), process tracking, orphaned session cleanup
- Depends on: Child process API, filesystem
- Used by: Bot handler, subprocess bridge

**Subprocess & Bridge Layer:**
- Purpose: Spawn Claude CLI processes with proper arguments and manage bidirectional I/O
- Location: `teams-bot/src/subprocess-bridge.ts`, `teams-bot/src/config.ts`, `teams-bot/src/components.ts`
- Contains: Child process spawning, skill path resolution, stdio piping, configuration loading
- Depends on: Node.js child_process module, filesystem
- Used by: Bot message handler, active session handler

**Output Formatting Layer:**
- Purpose: Parse subprocess stdout into typed messages for Teams display
- Location: `teams-bot/src/output-formatter.ts`
- Contains: ANSI code stripping, line classification (PROMPT/STATUS/ERROR/CONTENT), buffering
- Depends on: None (pure text processing)
- Used by: Subprocess output handler

**Interactive Response Layer:**
- Purpose: Detect prompts and render Teams Adaptive Cards for interactive input
- Location: `teams-bot/src/interactive-mapper.ts`
- Contains: Prompt detection, adaptive card generation, card submission parsing
- Depends on: Adaptive card schema knowledge
- Used by: Output handler, adaptive card submission handler

**Skill Orchestration Layer (Ada):**
- Purpose: Coordinate domain assistants for planning/reflection rituals
- Location: `.claude/skills/ada/references/plan/`, `.claude/skills/ada/references/reflect/`
- Contains: Sequence definitions (daily/weekly/quarterly/yearly), assistant dispatcher
- Depends on: Domain assistant skills, compose assistant
- Used by: Claude CLI when ada skill is invoked

**Domain Assistant Skills:**
- Purpose: Provide specialized expertise for specific life domains
- Location: `.claude/skills/_assistant-*/` (goals, calendar, journal, achievements, relationships, projects)
- Contains: Domain templates, references, learn modules
- Depends on: Vault structure, timescale templates
- Used by: Ada orchestration sequences

## Data Flow

**Incoming Message Flow:**

1. Teams sends webhook POST to `/api/messages`
2. `index.ts` validates JWT token via `validateToken()`
3. `bot.ts::handleMessage()` extracts text and user context
4. `intent-detector.ts::detectIntent()` calls Claude API to classify user input
5. If intent matched: `startSession()` spawns subprocess for skill
6. If no match: Return help message

**Active Session Message Flow:**

1. User sends follow-up message during active session
2. `bot.ts::handleActiveSessionMessage()` checks session validity
3. `subprocess-bridge.ts::sendInput()` writes message to subprocess stdin
4. Session timeout is reset
5. Subprocess output captured by stdout listener

**Subprocess Output Flow:**

1. Claude CLI subprocess writes to stdout
2. `SubprocessCallbacks.onStdout` triggered with data chunk
3. `output-formatter.ts::parse()` strips ANSI codes and buffers incomplete lines
4. Each complete line is classified into OutputType (PROMPT/STATUS/ERROR/CONTENT)
5. `bot.ts::handleOutputLine()` routes each output:
   - PROMPT: Render adaptive card via `interactiveMapper.renderAdaptiveCard()`
   - STATUS/WARNING/ERROR: Send as Teams message with formatting
   - CONTENT: Send as Teams message
6. If adaptive card submitted: `parseSubmission()` extracts form data → sent to subprocess stdin

**Session Lifecycle:**

1. Session created when skill starts: stores conversationId, skill name, process handle, timestamps
2. Session state persisted to `.active-session.json` for crash recovery
3. Session timeout reset on each message from user or subprocess output
4. If timeout expires: `sessionManager.destroy()` kills subprocess, clears session
5. On subprocess exit: flush remaining buffer, send completion message, call `destroy()`
6. On bot startup: `cleanupOrphaned()` kills any processes from previous crashes

**State Management:**

- **Session state**: In-memory during execution, persisted to `.active-session.json` (recovered on startup)
- **Configuration**: Loaded from environment variables at startup, validated
- **Skills**: Discovered at startup from filesystem, cached
- **Components**: Singleton pattern via `components.ts` - initialized once, accessed throughout

## Key Abstractions

**Activity (Teams Protocol):**
- Purpose: Represents incoming Teams webhook payload
- Examples: `teams-bot/src/types.ts` - Activity, ChannelAccount, ConversationAccount
- Pattern: Sealed union of activity types (message, conversationUpdate, invoke, etc.)
- Mapped to internal handlers: message → intent detection, invoke → card submission

**Session (Execution Context):**
- Purpose: Tracks single active skill execution with process and metadata
- Examples: `teams-bot/src/types.ts` - Session, SessionState
- Pattern: Temporal - created, mutated (timeout reset), destroyed
- Persisted state subset (SessionState) for crash recovery

**IntentResult (Classification Output):**
- Purpose: Represents skill routing decision from intent detector
- Examples: `teams-bot/src/intent-detector.ts` - IntentResult
- Pattern: Optional skill match with optional arguments
- Validation: Strict schema enforcement before returning from detector

**ParsedOutput (Formatted Line):**
- Purpose: Classified output line from subprocess for Teams display
- Examples: `teams-bot/src/output-formatter.ts` - ParsedOutput, OutputType enum
- Pattern: Tagged union of output types (PROMPT/STATUS/WARNING/ERROR/CONTENT)
- Mapping: PROMPT → interactive card, others → text message

**Config (Environment-based Configuration):**
- Purpose: Centralized, validated configuration from environment variables
- Examples: `teams-bot/src/config.ts` - Config interface with validation
- Pattern: Single load at startup, immutable, strict validation (path existence, API key format, timeout bounds)
- Scope: Shared via components singleton

## Entry Points

**Teams Bot Server:**
- Location: `teams-bot/src/index.ts`
- Triggers: Bun server starts on PORT (default 3000)
- Responsibilities:
  - Load configuration and discover skills
  - Initialize all components (session manager, intent detector, subprocess bridge, formatters)
  - Register Hono routes (/health, /api/messages)
  - Handle incoming Teams webhooks

**Message Webhook Handler:**
- Location: `teams-bot/src/index.ts::POST /api/messages`
- Triggers: Teams sends activity POST with JWT Authorization header
- Responsibilities:
  - Validate JWT token from Azure Bot Service
  - Parse Teams Activity JSON
  - Dispatch to `handleActivity()` based on activity type
  - Return 200 OK response

**Ada Skill Orchestrator:**
- Location: `.claude/skills/ada/SKILL.md`
- Triggers: User invokes via natural language ("plan my day", "reflect on week")
- Responsibilities:
  - Detect if first-run (setup required)
  - Parse timescale from user input (daily/weekly/quarterly/yearly)
  - Load and execute sequence of domain assistants
  - Report completion and handle errors

**Domain Assistants:**
- Location: `.claude/skills/_assistant-{domain}/` (goals, calendar, journal, etc.)
- Triggers: Invoked by Ada orchestration sequence
- Responsibilities:
  - Load domain-specific templates for timescale
  - Present templates and prompts to user
  - Collect user input
  - Persist changes to vault structure

## Error Handling

**Strategy:** Fail-safe continuity - errors don't cascade; sessions terminate gracefully.

**Patterns:**

- **Intent Detection Failure**: Log error, return skill=null, send user "help" message. User can retry.

- **Subprocess Spawn Failure**: Catch error, log with skill name, send "Failed to start {skill}" message, session remains null.

- **Subprocess Runtime Failure**: Captured on stderr listener, logged, sent as error message to Teams. Subprocess continues accepting input.

- **Subprocess Exit Nonzero**: Logged with exit code, send "{skill} exited with code {code}" message. Session destroyed.

- **Session Timeout**: Background timeout fires, subprocess killed, session destroyed. User sees no message (can check status).

- **Adaptive Card Parsing Failure**: Log error, send "Error processing your response" message. Session remains active for retry.

- **Configuration Failure**: Throw at startup - fatal. Server won't start without ENGINE_PATH, ANTHROPIC_API_KEY.

- **Authorization Failure**: Log unauthorized user, send "this bot is private" message, return early (no session created).

- **Ada Sequence Assistant Failure**: Log error with assistant name, continue with next assistant in sequence. Compose step notes gaps.

## Cross-Cutting Concerns

**Logging:** Console.log throughout with context prefixes: "[{skill}]", "Intent detection error:", "Session timed out...". No centralized logger.

**Validation:**
- JWT validation on every incoming request via `validateToken()`
- AAD object ID authorization check for allowed users
- Configuration validation on startup (path existence, API key format, timeout bounds)
- Intent result schema validation before returning from detector
- Session state file validation on recovery

**Authentication:**
- Incoming: JWT validation via `jose` library against Azure Bot Service public key (via URL)
- Outgoing: API key passed to Anthropic SDK and subprocess via environment
- Teams calls: ServiceUrl used for reply URL, no explicit auth (Teams service validates)

**Resource Management:**
- Subprocess cleanup: explicit kill() on timeout/error, implicit on natural exit
- Session file cleanup: explicit unlinkSync() on destroy, implicit recovery with kill on startup
- Timeout handles: cleared and reset on every message, explicit cleanup on destroy
- Component lifecycle: single initialization check prevents double-init
