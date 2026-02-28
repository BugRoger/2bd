# Coding Conventions

**Analysis Date:** 2026-02-28

## Naming Patterns

**Files:**
- camelCase for implementation files: `output-formatter.ts`, `intent-detector.ts`, `session-manager.ts`
- PascalCase for test files: `output-formatter.test.ts`
- All lowercase with hyphens for skill/feature directories

**Functions:**
- camelCase for all function names (both exported and internal)
- Prefix private functions with `_` where not using private keyword
- Example: `handleMessage()`, `stripAnsiCodes()`, `detectIntent()`

**Variables:**
- camelCase for all variables and constants
- ALL_CAPS for true constants that are module-level: `ALLOWED_USERS`, `MAX_MESSAGE_LENGTH`, `SESSION_FILE`
- Example: `formatter.buffer`, `cleanedText`, `sessionTimeoutMs`

**Types:**
- PascalCase for all interfaces and types
- Prefix with `I` only when convention demands (not used in this codebase)
- Example: `OutputType`, `Activity`, `IntentResult`, `Session`

## Code Style

**Formatting:**
- No explicit formatter configured (eslint/prettier config not detected)
- Use TypeScript defaults: 2-space indentation (implied by structure)
- Semicolons always required (TypeScript standard)
- Double quotes for strings, single quotes allowed in template literals

**Linting:**
- ESLint rule present: `no-control-regex` disabled with comment for regex patterns
- Example from `output-formatter.ts`: `// eslint-disable-next-line no-control-regex`
- This indicates ANSI code regex patterns are expected and intentional

**Line Length:**
- Implied soft limit around 80-100 characters based on code wrapping patterns
- Longer logical expressions wrap to multiple lines

## Import Organization

**Order:**
1. Built-in Node modules (`fs`, `path`, `child_process`)
2. Third-party imports (`@anthropic-ai/sdk`, `hono`, `jose`)
3. Type imports using `import type` for TypeScript types only
4. Local imports from same package (relative paths)

**Example from `bot.ts`:**
```typescript
import { sendActivity } from "./teams-api";
import type { Activity, OutgoingActivity } from "./types";
import { getComponents } from "./components";
import { OutputType } from "./output-formatter";
```

**Path Aliases:**
- No path aliases configured (direct relative imports used throughout)

**Type Imports:**
- Always use `import type` for importing only types/interfaces
- Example: `import type { Activity, OutgoingActivity } from "./types";`

## Error Handling

**Patterns:**
- Use try-catch blocks for async operations
- Always log errors with context before returning fallback: `console.error("Error message:", error);`
- Return sensible defaults on error rather than throwing (defensive programming)
- Example from `intent-detector.ts`:
```typescript
try {
  // operation
} catch (err) {
  console.error("Intent detection error: API request failed:", err instanceof Error ? err.message : err);
  return { skill: null };
}
```

**Error Messages:**
- Prefix console errors with context label: `"Intent detection error:"`, `"Token validation failed:"`
- Include the specific operation that failed
- For unknown error types, use ternary to extract message: `err instanceof Error ? err.message : err`

**Warnings:**
- Use `console.warn()` for non-fatal issues: `console.warn("⚠️ Auth validation skipped (SKIP_AUTH=true)")`
- Use emoji warning prefixes (⚠️) for visual distinction in logs

## Logging

**Framework:** Native `console` object

**Patterns:**
- `console.log()` for informational messages with context
- `console.warn()` for non-fatal warnings with ⚠️ emoji prefix
- `console.error()` for error conditions with full context
- Always include user/operation context in logs: `console.log("Message from ${userName} (${aadObjectId}): ${text}")`
- Status messages use emoji prefixes for visual classification

**Example logging patterns:**
```typescript
console.log(`Message from ${userName} (${aadObjectId}): ${text}`);
console.warn("⚠️ No ALLOWED_AAD_OBJECT_ID configured - allowing all users");
console.error("Token validation failed:", error);
```

## Comments

**When to Comment:**
- JSDoc comments for all exported functions and classes
- Explain the "why" not the "what" for non-obvious logic
- Keep implementation comments minimal when code is self-documenting

**JSDoc/TSDoc:**
- Use JSDoc format with `/** */` for all public exports
- Include `@param`, `@returns`, `@throws` tags
- Example from `config.ts`:
```typescript
/**
 * Loads and validates configuration from environment variables.
 *
 * @returns {Config} Validated configuration object
 * @throws {Error} If required environment variables are missing or invalid
 */
export function loadConfig(): Config {
```

## Function Design

**Size:**
- Functions typically 30-80 lines
- Longer functions (100+ lines) broken into logical subsections with comments
- Example: `handleMessage()` in `bot.ts` handles multiple conditional branches

**Parameters:**
- Maximum 3-4 parameters before considering refactoring to options object
- Use typed parameters, avoid `any` type
- Example: `async function handleActivity(activity: Activity): Promise<void>`

**Return Values:**
- Explicit return types on all functions (TypeScript)
- Return types: `Promise<T>` for async, void for event handlers, `T | null` for optional results
- Example return patterns:
  - `Promise<void>` for event handlers
  - `Promise<IntentResult>` for detection methods
  - `Session | null` for optional lookups
  - `ParsedOutput[]` for batch operations

## Module Design

**Exports:**
- Named exports preferred for utilities and classes
- Example: `export async function validateToken()`, `export class OutputFormatter`
- Default exports not used in this codebase

**Barrel Files:**
- Not used; each module imports directly from specific files
- Example: `import { OutputFormatter } from "./output-formatter"` not from barrel

**Class Instantiation:**
- Classes instantiated once and managed by a component manager
- Singleton pattern via `getComponents()` in bot for centralized access
- Private fields using TypeScript `private` keyword (not `_` prefix)

**Private Methods:**
- Use TypeScript `private` keyword for class methods: `private stripAnsiCodes()`
- Not prefixed with underscore

## Validation Patterns

**Type Validation:**
- Explicit validation functions for parsed data (e.g., `validateIntentResult()`)
- Runtime checks for JSON parsing results
- Type narrowing with `instanceof` checks

**Configuration Validation:**
- Validate all environment variables at startup
- Throw errors early with descriptive messages
- Validate value ranges and formats: `isNaN()` checks, string format validation

**Example from `config.ts`:**
```typescript
const sessionTimeoutMs = parseInt(timeoutStr, 10);
if (isNaN(sessionTimeoutMs)) {
  throw new Error(`SESSION_TIMEOUT_MS must be a valid number, got: ${timeoutStr}`);
}
```

---

*Convention analysis: 2026-02-28*
