# Codebase Concerns

**Analysis Date:** 2026-02-28

## Tech Debt

**Centralized error handling in bot.ts:**
- Issue: `bot.ts` (496 lines) contains most error-prone subprocess lifecycle logic but lacks granular error recovery. Session destruction logic is scattered across multiple error paths.
- Files: `teams-bot/src/bot.ts`, `teams-bot/src/subprocess-bridge.ts`, `teams-bot/src/session-manager.ts`
- Impact: Subprocess crashes may leak resources; orphaned processes difficult to clean up consistently; error messages inconsistent across handlers
- Fix approach: Extract subprocess error handling into dedicated error handler class with consistent retry/cleanup logic. Use AbortController pattern for subprocess lifecycle management.

**Hardcoded skill path resolution heuristics:**
- Issue: `SubprocessBridge.resolveSkillPath()` uses heuristics for backward compatibility when skill discovery fails (checks for "planning-" and "review-" prefixes). Falls back to `commands/` for unknown skills.
- Files: `teams-bot/src/subprocess-bridge.ts` lines 49-70
- Impact: New skills with different naming conventions won't resolve correctly; difficult to debug when skill discovery cache is stale; silent failures when skill doesn't exist
- Fix approach: Add validation that resolved skill path actually exists before spawning subprocess. Return explicit error instead of silent fallback.

**Token caching without expiration backoff:**
- Issue: Microsoft Bot Framework tokens cached for full `expires_in` duration; no exponential backoff on token refresh failures. If token endpoint is temporarily unavailable, all subsequent API calls fail.
- Files: `teams-bot/src/auth.ts` lines 80-129
- Impact: Service becomes degraded during temporary Azure auth service issues; no graceful recovery; expired token errors bubble up to users
- Fix approach: Implement exponential backoff on token refresh failures with circuit breaker pattern. Return previous token on refresh failure rather than throwing.

**Type safety gaps:**
- Issue: `any` types used in event handler callbacks (`team-bot.ts` line 362: `const membersAdded = (activity as any).membersAdded`); `sendAdaptiveCard` parameter accepts `card: any` (line 480); Adaptive Card action data not validated before submission parsing.
- Files: `teams-bot/src/bot.ts`, `teams-bot/src/interactive-mapper.ts`
- Impact: Vulnerable to malformed Teams activity schema; card data injection possible; type checking doesn't catch logic errors at compile time
- Fix approach: Create discriminated union types for all Teams activity subtypes. Use strict validation library for card submission parsing.

**Missing input validation on OutputFormatter:**
- Issue: `OutputFormatter.parse()` classifies output but doesn't validate line length or handle extremely large outputs (e.g., 1MB+ binary data). Classification regex patterns may match unintended patterns in complex output.
- Files: `teams-bot/src/output-formatter.ts`
- Impact: Large subprocess outputs could consume excessive memory; emoji regex may false-positive on Unicode sequences; no rate limiting for rapid subprocess output
- Fix approach: Add configurable output limits per line and total. Pre-compile regex patterns for performance. Add tests for Unicode edge cases.

## Known Bugs

**Session state persistence race condition:**
- Symptoms: On rapid bot restarts, `.active-session.json` may contain stale PIDs; `cleanupOrphaned()` attempts to kill already-dead processes but continues normally
- Files: `teams-bot/src/session-manager.ts` lines 84-141
- Trigger: Start session → Bot crashes → Bot restarts before session timeout
- Workaround: Session cleanup catches errors gracefully (line 133) but doesn't validate PID was actually killed before allowing new sessions

**Intent detection silent fallback on JSON parsing errors:**
- Symptoms: Malformed Claude API response → parser logs error → returns `{skill: null}` → user sees "I didn't understand that" instead of error context
- Files: `teams-bot/src/intent-detector.ts` lines 71-126
- Trigger: Claude returns incomplete/truncated JSON (rare but possible with streaming issues)
- Workaround: Check console logs for "Intent detection error" lines; current behavior prevents cascading failures but loses signal

**Interactive card submission without active session validation:**
- Symptoms: User submits adaptive card response after session times out or in wrong conversation → error message sent but response lost
- Files: `teams-bot/src/bot.ts` lines 403-439
- Trigger: Session timeout (30 min default) while user is filling out adaptive card
- Workaround: UI should display session status before complex cards; no automatic retry mechanism

## Security Considerations

**Authorization enforcement relies on single env var:**
- Risk: `ALLOWED_AAD_OBJECT_ID` is comma-separated list stored in environment; if bot has no configured ID, accepts all users with warning (line 20-21 in `bot.ts`)
- Files: `teams-bot/src/bot.ts` lines 10-24, `teams-bot/src/config.ts`
- Current mitigation: Console warning logged; Teams Activity should verify sender identity in production deployment
- Recommendations:
  - Require at least one allowed user at startup; fail if empty
  - Move allowed users to vault/config file instead of env var (less likely to leak in logs)
  - Add audit logging for all authorization decisions

**Auth token refresh may expose credentials in logs:**
- Risk: `getAccessToken()` error path returns full Azure response which may contain partial credentials in development mode
- Files: `teams-bot/src/auth.ts` line 116-117
- Current mitigation: Errors logged to console only; stderr not captured in production typically
- Recommendations:
  - Sanitize error messages before logging (remove `error` object details)
  - Use structured logging with redaction rules for sensitive fields
  - Never include response body in error messages

**Adaptive card data parsing has no injection protection:**
- Risk: `interactiveMapper.parseSubmission()` extracts values from card submission data and sends directly to subprocess stdin without escaping
- Files: `teams-bot/src/interactive-mapper.ts` lines 292-320; `teams-bot/src/bot.ts` line 428
- Current mitigation: Subprocess runs Claude CLI which is assumed trusted; but if CLI is compromised, untrusted card data flows through
- Recommendations:
  - Quote/escape all card submission values before sending to subprocess
  - Add length limits on card response fields (match form validation limits from card definition)
  - Validate card submission schema against expected Adaptive Card action structure

## Performance Bottlenecks

**Intent detection calls Claude API on every user message:**
- Problem: Every incoming message requires API call to Claude 3.5 Haiku; no caching of intent results; rate limited by Anthropic API
- Files: `teams-bot/src/intent-detector.ts` lines 71-126
- Cause: No intent result caching; same user phrase will re-query API
- Improvement path:
  - Add in-memory LRU cache of recent intent results (with TTL)
  - Implement keyword-based fast path for common commands (e.g., "cancel", "status", "help" already hard-coded but not in cache)
  - Batch similar intents during high load

**OutputFormatter regex compilation happens on every parse call:**
- Problem: `OPTIONS_PATTERN` regex (line 84) and `statusPatterns` array (lines 114-122) defined as instance methods; regex compiled fresh for each output chunk
- Files: `teams-bot/src/output-formatter.ts`
- Cause: Regexes not static/compiled at class definition time
- Improvement path:
  - Move pattern compilation to static initializers
  - Consider using optimized regex engine for high-volume output (e.g., re2js)
  - Cache compiled patterns at module level

**subprocess-bridge skill discovery happens in constructor but blocks on first call:**
- Problem: `getDiscoveredSkills()` called synchronously in `spawn()` but uses synchronous `require()` of config module; if file I/O slow, blocks event loop
- Files: `teams-bot/src/subprocess-bridge.ts` lines 37-43
- Cause: No async initialization phase; discovery happens during request handling
- Improvement path:
  - Cache skill discovery at module load time
  - Pre-warm cache during bot startup (already attempted in `index.ts` but then not used by subprocess bridge)
  - Use async I/O for directory scanning

## Fragile Areas

**Bot.ts message handler logic:**
- Files: `teams-bot/src/bot.ts` lines 51-126
- Why fragile: Large function with many conditional branches; 75+ lines handling auth, command detection, session routing, intent detection all in sequence. Adding new command types requires modifying multiple switch statements.
- Safe modification:
  - Extract command handler into strategy pattern map (CommandHandler registry)
  - Use guard clauses to fail early and exit branches
  - Add tests for each conditional path before modifying
- Test coverage: Only `output-formatter.test.ts` exists; no tests for bot message handling, session management, or subprocess bridge

**Session lifecycle management across components:**
- Files: `teams-bot/src/session-manager.ts`, `teams-bot/src/subprocess-bridge.ts`, `teams-bot/src/bot.ts`
- Why fragile: Session state divided between three components; `SessionManager` holds reference to ChildProcess but doesn't own it; `SubprocessBridge` owns spawn but not lifecycle; `bot.ts` coordinates both. No clear ownership model.
- Safe modification:
  - Make SessionManager sole owner of subprocess lifecycle (owns spawn, callbacks, cleanup)
  - SubprocessBridge becomes stateless factory only
  - Add invariant tests: session must have running process, process must belong to exactly one session
- Test coverage: No tests for session timeout, orphaned process cleanup, or multi-session conflict scenarios

**Interactive card detection regexes:**
- Files: `teams-bot/src/interactive-mapper.ts` lines 84-143
- Why fragile: Option detection uses `/^\s*(\d+)[.)]\s+(.+)/` which matches any indented numbered list; could false-positive on structured output that isn't a prompt (e.g., JSON array output). Prompt detection uses `line.includes("?")` which is too broad.
- Safe modification:
  - Require prompts to end with `?` AND have numbered options (current logic doesn't require both)
  - Add context window: check for typical question prefixes ("Enter", "Choose", "Select", "Confirm")
  - Add tests for Claude output samples to verify no false positives
- Test coverage: Output formatter tested but interactive mapper not tested

## Scaling Limits

**Session storage on disk (`.active-session.json`):**
- Current capacity: Single bot instance per system (one `.active-session.json` file)
- Limit: Can only track one concurrent skill session per bot instance; no distributed session storage
- Scaling path:
  - Move session state to Redis (allows multiple bot instances)
  - Use session ID instead of single active session file
  - Support queue of pending sessions

**OutputFormatter buffer unbounded growth:**
- Current capacity: No limit on internal buffer accumulation
- Limit: Large continuous output streams (e.g., file downloads, logs) will fill memory
- Scaling path:
  - Add configurable max buffer size (default 1MB)
  - Emit partial output when buffer exceeded
  - Consider streaming output protocol instead of buffering

**Intent detection rate limited by Claude API:**
- Current capacity: ~100 messages/min per Anthropic API tier
- Limit: Under high volume (team collaboration) system will queue or drop messages
- Scaling path:
  - Implement request queuing with priority (cancel/status high priority)
  - Add local ML model for fast intent pre-filtering (reduce API calls)
  - Cache intent results across team members

## Dependencies at Risk

**jose v5.9.0 (JWT verification):**
- Risk: RFC 7518 compliance; used for Microsoft Bot Framework token verification. Pinned to 5.9.0.
- Impact: Security patches in jose library won't be automatically applied; known vulns must be manually patched
- Migration plan:
  - Evaluate if Microsoft provides native token verification library
  - Consider using node-jose or dedicated Teams SDK
  - Set up dependabot to alert on jose updates

**@anthropic-ai/sdk v0.74.0:**
- Risk: Rapidly evolving API; SDK version significantly lags latest Claude models; v0.74.0 may not support latest model releases
- Impact: New Claude models cannot be used without SDK upgrade; schema changes require code updates
- Migration plan:
  - Subscribe to Anthropic SDK releases
  - Test latest SDK monthly; schedule upgrades quarterly
  - Use streaming API when available to reduce token usage

**hono v4.6.0:**
- Risk: Lightweight web framework; smaller community than Express; edge runtime may have compatibility gaps
- Impact: Bun runtime dependency; if Bun adoption stalls, framework support may suffer
- Migration plan:
  - Keep framework usage minimal (mostly HTTP routing)
  - Avoid middleware lock-in; use middleware-agnostic patterns
  - Monitor Hono deprecations closely

## Missing Critical Features

**No input rate limiting:**
- Problem: Users can spam messages; no per-user rate limit enforced. Bot attempts to process all messages sequentially.
- Blocks: Cannot protect against DOS; cannot prioritize admin commands; cannot manage load
- Workaround: Teams channel admin can mute users; but no app-level protection

**No graceful shutdown:**
- Problem: When bot service stops, active subprocess sessions are forcibly killed without cleanup. Child processes may leave temporary files.
- Blocks: Cannot cleanly migrate sessions; cannot drain queued requests
- Workaround: Manual cleanup of orphaned sessions on restart

**No observability beyond console logs:**
- Problem: No metrics, traces, or structured logging. Cannot observe latency, error rates, or throughput without grep'ing logs.
- Blocks: Cannot debug production issues; cannot measure improvement; cannot set SLOs
- Workaround: Send all logs to centralized logging service externally

**No adaptive card schema validation:**
- Problem: Adaptive cards generated by `interactiveMapper.renderAdaptiveCard()` not validated against Teams schema before sending. Invalid cards may be silently rejected by Teams client.
- Blocks: Cannot detect UI rendering errors early; users see blank cards with no error message
- Workaround: Manual testing of all card templates

## Test Coverage Gaps

**Subprocess bridge and spawning:**
- What's not tested:
  - Subprocess spawn failures (permission denied, binary not found, OOM)
  - Subprocess crash/signal handling (SIGTERM, SIGSEGV, timeout)
  - Callback invocation order and timing
  - Large output handling (>10MB)
- Files: `teams-bot/src/subprocess-bridge.ts`
- Risk: Regressions in subprocess handling can crash bot without warning
- Priority: High - core bot functionality depends on reliable subprocess management

**Session manager timeout and cleanup:**
- What's not tested:
  - Session timeout triggers correctly after `timeoutMs`
  - Orphaned process detection and cleanup
  - Multiple concurrent sessions attempted (should fail on second create)
  - Session state persistence to disk
- Files: `teams-bot/src/session-manager.ts`
- Risk: Session leaks accumulate over time; orphaned processes consume resources
- Priority: High - memory leak vector

**Auth token validation and refresh:**
- What's not tested:
  - Invalid JWT tokens rejected correctly
  - Token refresh retry logic on transient failures
  - Expired token cache doesn't get reused
  - SKIP_AUTH development bypass flag works
- Files: `teams-bot/src/auth.ts`
- Risk: Security boundary; incorrect validation allows unauthorized access
- Priority: Critical - must not allow unauthorized requests

**Interactive mapper prompt detection:**
- What's not tested:
  - Prompts with various formatting (different numbering styles)
  - False positives on non-prompt numbered lists
  - Multi-line questions
  - Unicode edge cases in options
- Files: `teams-bot/src/interactive-mapper.ts`
- Risk: Incorrect card rendering; user confusion on prompt intent
- Priority: Medium - affects UX but not data integrity

**Intent detector response parsing:**
- What's not tested:
  - Malformed JSON responses from Claude
  - Missing skill/args fields
  - Invalid skill names returned
  - Rate limiting and retry behavior
- Files: `teams-bot/src/intent-detector.ts`
- Risk: Silent failures mask API issues; users think bot doesn't understand their input
- Priority: Medium - affects usability

---

*Concerns audit: 2026-02-28*
