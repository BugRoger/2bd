# Testing Patterns

**Analysis Date:** 2026-02-28

## Test Framework

**Runner:**
- Bun test framework
- Config: No explicit config file (uses Bun defaults)

**Assertion Library:**
- Bun built-in assertions (imports from `bun:test`)

**Run Commands:**
```bash
bun test                   # Run all tests
bun run --watch src/       # Watch mode (dev, not test-specific)
```

**Note:** No dedicated test watch mode configured. Development uses `bun run --watch src/index.ts` for the application. Tests run standalone with `bun test`.

## Test File Organization

**Location:**
- Co-located with source code in `__tests__/` directory
- Example: `src/__tests__/output-formatter.test.ts` for `src/output-formatter.ts`

**Naming:**
- `.test.ts` suffix for test files
- Example: `output-formatter.test.ts`

**Structure:**
```
src/
├── output-formatter.ts
├── bot.ts
├── types.ts
└── __tests__/
    └── output-formatter.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe("OutputFormatter", () => {
  let formatter: OutputFormatter;

  beforeEach(() => {
    formatter = new OutputFormatter();
  });

  describe("ANSI code stripping", () => {
    it("should strip ANSI color codes", () => {
      // test body
    });
  });
});
```

**Patterns:**
- Top-level `describe()` wraps entire test suite (class/module being tested)
- Nested `describe()` blocks organize related test cases by feature
- `beforeEach()` for test setup (fixture initialization)
- No `afterEach()` observed (cleanup not needed for stateless tests)
- `it()` for individual test cases with descriptive names

**Test Naming Convention:**
- Start with `"should ..."` for clarity
- Example: `"should strip ANSI color codes"`, `"should buffer incomplete lines"`

**Assertion Pattern:**
```typescript
it("should strip ANSI color codes", () => {
  const input = "\x1B[32mGreen text\x1B[0m";
  const results = formatter.parse(input + "\n");
  expect(results[0].text).toBe("Green text");
});
```

- Arrange-Act-Assert structure (implicit)
- Single assertion per test in most cases
- Use `expect()` API with matchers: `toBe()`, `toHaveLength()`, `toEqual()`, `not.toBeNull()`

## Mocking

**Framework:** None detected

**What to Mock:**
- External APIs (would use jest.mock or similar if needed)
- Timers (not observed in tests yet)

**What NOT to Mock:**
- Pure utility functions (tested directly)
- Buffer/state management (tested through public API)
- Helper methods (tested indirectly through public methods)

**Stateful Testing:**
- Avoid mocking internal state; instead test public methods that manage state
- Use `beforeEach()` to reset state between tests
- Example: Each test gets fresh `OutputFormatter` instance

## Fixtures and Factories

**Test Data:**
```typescript
describe("Buffering", () => {
  it("should buffer incomplete lines", () => {
    const results1 = formatter.parse("Incomplete");
    expect(results1).toHaveLength(0);

    const results2 = formatter.parse(" line\n");
    expect(results2).toHaveLength(1);
    expect(results2[0].text).toBe("Incomplete line");
  });
});
```

**Patterns:**
- Inline test data construction (no factory functions)
- Use actual types from source code (not mocks)
- Realistic examples that match production behavior

**Location:**
- Test data defined inline within test cases
- No separate fixtures directory (not needed for utility tests)

## Coverage

**Requirements:** Not enforced

**View Coverage:**
```bash
bun test --coverage           # If configured in bunfig.toml (not observed)
```

**Observation:** No coverage configuration detected in package.json or Bun config. Coverage reporting not automated.

## Test Types

**Unit Tests:**
- Scope: Individual class methods and exported functions
- Approach: Test-driven state verification
- Example: `OutputFormatter.parse()` tested in isolation with various inputs
- Each method has dedicated describe block with multiple test cases

**Integration Tests:**
- Not observed in current codebase
- Would test component interactions (e.g., SessionManager + SubprocessBridge)

**E2E Tests:**
- Not present
- Would require actual Teams API or Hono server mocking

## Common Patterns

**Async Testing:**
```typescript
export async function validateToken(authHeader: string | undefined): Promise<boolean> {
  // implementation
}
```

**Pattern:** Use `async` keyword in test function; Bun automatically waits for Promise resolution. No explicit `.then()` or `await` handling needed if test completes naturally.

**Note:** Current test suite (OutputFormatter) is synchronous. Async tests would follow standard async test patterns if present.

**Error Testing:**
```typescript
it("should validate timeout bounds", () => {
  // If implementation throws on invalid input:
  const config = {
    sessionTimeoutMs: -100 // invalid
  };
  // Would expect throw or error state
});
```

**Pattern:** For error cases, test either:
- Expected function return (error state)
- Function throws exception (wrap in try-catch in test if needed)
- Logged error messages (via console.error spy if mocked)

**Current codebase:** Most error cases return safe defaults rather than throwing (see `intent-detector.ts`, `output-formatter.ts`).

## Comprehensive Example

**Full test suite from codebase** (`src/__tests__/output-formatter.test.ts`):

The OutputFormatter test suite demonstrates best practices:

**Structure:**
- 10+ describe blocks organized by feature (ANSI stripping, Buffering, Classification, Whitespace)
- 40+ individual test cases
- Comprehensive coverage of public API and edge cases

**Key Features Tested:**
- ANSI code removal: `stripAnsiCodes()` internal method tested indirectly
- State buffering: Incomplete lines retained, complete lines processed
- Flush behavior: Edge cases for empty/whitespace buffers
- Classification: All OutputType enums covered (PROMPT, STATUS, WARNING, ERROR, CONTENT)
- Whitespace handling: Leading/trailing/internal spaces preserved where appropriate
- Integration scenarios: Mixed output types in single parse call

**Edge Cases:**
- Empty buffers
- Whitespace-only content
- Multi-line input
- ANSI codes with buffering (split across parse calls)
- Classification with/without leading/trailing whitespace

**Test Data Quality:**
- Realistic strings representing actual CLI output
- Emoji characters in status tests (Unicode handling)
- Multiple error prefix patterns tested
- Regression test for "prefix-only limitation" (documents by design behavior)

---

*Testing analysis: 2026-02-28*
