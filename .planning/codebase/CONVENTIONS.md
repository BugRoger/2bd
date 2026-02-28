# Coding Conventions

**Analysis Date:** 2026-02-28

## Naming Patterns

**Files:**
- PascalCase for classes: `OutputFormatter.ts`, `SessionManager.ts`, `IntentDetector.ts`
- camelCase for utilities/functions: `config.ts`, `auth.ts`, `teams-api.ts`
- kebab-case for compound module names: `output-formatter.ts`, `subprocess-bridge.ts`, `session-manager.ts`
- Test files: `__tests__/` directory with `.test.ts` suffix (e.g., `output-formatter.test.ts`)

**Functions:**
- camelCase for all function names
- Async functions explicitly marked with `async` keyword
- Helper functions prefixed with leading underscore: `_stripAnsiCodes()`, `_classify()`
- Public methods without underscore prefix: `parse()`, `flush()`, `detectIntent()`

**Variables:**
- camelCase for local variables and constants: `activeSession`, `isValid`, `cleanedText`
- UPPER_SNAKE_CASE for module-level constants: `MAX_MESSAGE_LENGTH`, `DEFAULT_MODEL`, `ALLOWED_USERS`
- UPPER_SNAKE_CASE for enum-like constants: `MAX_TIMEOUT_MS`, `OPENID_METADATA_URL`, `JWKS_CACHE_DURATION_MS`

**Types:**
- PascalCase for interfaces: `Activity`, `Config`, `Session`, `OutputFormatter`
- Enum names PascalCase with PascalCase members: `OutputType.PROMPT`, `OutputType.STATUS`
- Interface naming: no `I` prefix (e.g., `Activity` not `IActivity`)

## Code Style

**Formatting:**
- No automated formatter configured (no `.prettierrc` or `.eslintrc`)
- 2-space indentation used throughout
- Line length: generally follows ~100-120 character conventions
- Semicolons: consistently used at end of statements

**Linting:**
- TypeScript only (no ESLint or Prettier config present)
- Type annotations required for function parameters and return types
- Strict null checking implied by TypeScript usage patterns

**Import Organization:**
```typescript
// Order observed:
1. External library imports (e.g., "hono", "@anthropic-ai/sdk", "child_process")
2. Node.js built-in imports (e.g., "fs", "path")
3. Type imports marked with 'type' keyword: import type { Activity }
4. Local module imports: import { handler } from "./bot"
5. No barrel files (*.index.ts) used; direct imports preferred
```

**Path Aliases:**
- Not detected; all imports use relative paths or node_modules

## Error Handling

**Patterns:**
- Errors thrown as `Error` with descriptive messages
- Try-catch blocks used for API calls and async operations
- Validation errors caught and logged before returning fallback values

Examples from `config.ts`:
```typescript
if (!enginePath) {
  throw new Error("ENGINE_PATH environment variable is required");
}
```

Examples from `intent-detector.ts`:
```typescript
try {
  return this.validateIntentResult(parsed);
} catch (validationErr) {
  console.error("Intent detection error: Invalid response structure:", validationErr);
  return { skill: null };
}
```

- Guard clauses used to return early on error conditions
- Graceful degradation: functions return `null` or default values on non-critical errors

## Logging

**Framework:** `console` (no custom logging framework)

**Patterns:**
- `console.log()` for informational messages with emoji prefixes: `console.log("🔧 Loading configuration...")`
- `console.error()` for errors: `console.error("Error detecting intent:", error)`
- `console.warn()` for warnings: `console.warn("⚠️ Auth validation skipped")`
- Structured log messages include context (e.g., skill name, conversation ID)

Usage examples from `index.ts`:
```typescript
console.log("🔧 Loading configuration...");
console.log(`Found ${skills.rituals.length} rituals: ${skills.rituals.join(", ")}`);
console.error("Invalid or missing authorization token");
```

From `bot.ts`:
```typescript
console.log(`Message from ${userName} (${aadObjectId || "no-aad-id"}): ${text}`);
console.error("Error sending message to subprocess:", error);
```

## Comments

**When to Comment:**
- JSDoc blocks for public methods and classes
- Inline comments for complex logic or non-obvious algorithms
- No comments for self-documenting code

**JSDoc/TSDoc:**
- Used consistently for exported functions and class methods
- Documents parameters, return values, and exceptions

Example from `config.ts`:
```typescript
/**
 * Loads and validates configuration from environment variables.
 *
 * @returns {Config} Validated configuration object
 * @throws {Error} If required environment variables are missing or invalid
 */
export function loadConfig(): Config {
```

Example from `subprocess-bridge.ts`:
```typescript
/**
 * Spawn Claude CLI process for a skill
 *
 * @param skillName - Name of the skill (e.g., "planning-daily", "init")
 * @param args - Optional arguments to pass to the skill (string or array of strings)
 * @param callbacks - Callbacks for stdout, stderr, and exit events
 * @throws {Error} If spawn fails or process cannot be started
 */
spawn(
  skillName: string,
  args: string | string[] = "",
  callbacks: SubprocessCallbacks = {}
): ChildProcess {
```

## Function Design

**Size:** Functions are concise and focused, typically 10-50 lines

**Parameters:**
- Prefer explicit parameters over options objects for 1-3 parameters
- Use options/callback objects for 4+ parameters: `SubprocessCallbacks` interface

Example from `output-formatter.ts`:
```typescript
parse(data: string): ParsedOutput[]
```

Example from `subprocess-bridge.ts`:
```typescript
spawn(
  skillName: string,
  args: string | string[] = "",
  callbacks: SubprocessCallbacks = {}
): ChildProcess
```

**Return Values:**
- Explicit return types on all functions
- Nullable returns indicated with `T | null`
- Result objects for complex returns: `IntentResult`, `ParsedOutput`

## Module Design

**Exports:**
- Named exports for most functions and classes
- Default export only used for Hono app configuration in `index.ts`: `export default { port, fetch }`
- Classes export both the class and any related interfaces

From `output-formatter.ts`:
```typescript
export enum OutputType { ... }
export interface ParsedOutput { ... }
export class OutputFormatter { ... }
```

**Barrel Files:**
- Not used; `components.ts` provides centralized access to singletons via `getComponents()` and `initializeComponents()`

**Class Organization:**
- Private fields declared at top with visibility modifiers
- Public methods before private methods
- Constructor first in method order

From `SessionManager.ts`:
```typescript
export class SessionManager {
  private activeSession: Session | null = null;
  private timeoutHandle: NodeJS.Timeout | null = null;

  constructor(private timeoutMs: number = 1800000) {}

  hasActiveSession(): boolean { ... }
  getActiveSession(): Session | null { ... }

  private saveState(): void { ... }
}
```

## Async Patterns

**Async/Await:**
- Used consistently for all async operations
- No Promise chains; always use `async/await`

From `bot.ts`:
```typescript
async function handleMessage(activity: Activity): Promise<void> {
  try {
    const intent = await intentDetector.detectIntent(cleanedText);
  } catch (error) {
    console.error("Error detecting intent:", error);
  }
}
```

**Callback Functions:**
- Inline callbacks for event handlers: `onStdout`, `onStderr`, `onExit`
- Callbacks typed explicitly in interfaces: `SubprocessCallbacks`

## Type Patterns

**Strict Typing:**
- All function parameters typed explicitly
- All return types annotated
- Type assertions minimized; `as any` used rarely and documented

From `intent-detector.ts`:
```typescript
private validateIntentResult(obj: unknown): IntentResult {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Invalid intent result: not an object");
  }
  const result = obj as Record<string, unknown>;
```

**Union Types:**
- Used for optional or fallback values: `string | null`, `number | null`
- Discriminated unions not heavily used

**Environment Variables:**
- Validated at application startup in `config.ts`
- Checked again at runtime where used (e.g., `SKIP_AUTH` in `auth.ts`)

---

*Convention analysis: 2026-02-28*
