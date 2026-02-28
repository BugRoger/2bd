# Testing Patterns

**Analysis Date:** 2026-02-28

## Test Framework

**Runner:**
- Bun built-in test runner (via `bun:test`)
- No separate Jest or Vitest configuration
- Config: `bun:test` imported directly in test files

**Assertion Library:**
- Bun's built-in `expect()` function from `bun:test`

**Run Commands:**
```bash
bun test                           # Run all tests
bun test --watch                   # Watch mode (assumed supported)
bun test --coverage               # Coverage (assumed supported)
```

Note: Package.json has no test scripts defined; tests run directly with Bun.

## Test File Organization

**Location:**
- Co-located in `src/__tests__/` subdirectory
- Test files in same module structure as source

**Naming:**
- Pattern: `{module}.test.ts`
- Example: `src/__tests__/output-formatter.test.ts` tests `src/output-formatter.ts`

**Structure:**
```
src/
├── __tests__/
│   └── output-formatter.test.ts
├── output-formatter.ts
├── bot.ts
└── [other modules]
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, beforeEach } from "bun:test";
import { OutputFormatter, OutputType } from "../output-formatter";

describe("OutputFormatter", () => {
  let formatter: OutputFormatter;

  beforeEach(() => {
    formatter = new OutputFormatter();
  });

  describe("ANSI code stripping", () => {
    it("should strip ANSI color codes", () => {
      const input = "\x1B[32mGreen text\x1B[0m";
      const results = formatter.parse(input + "\n");
      expect(results[0].text).toBe("Green text");
    });
  });
});
```

**Patterns:**
- Nested `describe()` blocks for feature grouping
- `beforeEach()` for setup (instantiation of test subjects)
- `it()` for individual test cases
- Descriptive test names starting with "should"
- One assertion per test or grouped related assertions

## Mocking

**Framework:** Not detected; tests use real objects

**What IS Tested:**
- Pure functions and methods (OutputFormatter.parse, OutputFormatter.classify)
- Data transformations
- String manipulation and ANSI code stripping
- Classification logic (PROMPT, STATUS, ERROR, etc.)

**What NOT Tested:**
- Async operations (no API mocking)
- Child process operations (no process mocking)
- External dependencies (no mock for Anthropic SDK, Hono)
- File I/O operations

**Note:** Current test coverage is limited to `output-formatter.test.ts`. Other modules (bot.ts, session-manager.ts, subprocess-bridge.ts) lack tests due to their dependency on external systems (Teams API, child processes).

## Fixtures and Factories

**Test Data:**
```typescript
// From output-formatter.test.ts
const input = "\x1B[32mGreen text\x1B[0m";
const results = formatter.parse(input + "\n");
expect(results[0].text).toBe("Green text");
```

- Inline test data in test functions (no factory pattern)
- Sample strings for testing parsing: `"🚀 Starting process"`, `"Warning: Deprecated feature"`
- Multiple test cases for edge cases (empty strings, whitespace-only, ANSI codes)

**Location:**
- Test data defined inline within `it()` blocks
- No separate fixtures directory or factory modules

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
bun test --coverage
```

**Coverage Gaps:**
- No tests for: `bot.ts`, `session-manager.ts`, `subprocess-bridge.ts`, `intent-detector.ts`, `auth.ts`, `teams-api.ts`, `config.ts`, `interactive-mapper.ts`
- Only `output-formatter.ts` has comprehensive test coverage
- Estimated coverage: ~15% of codebase

## Test Types

**Unit Tests:**
- Scope: Individual methods and functions
- Approach: Direct function invocation with known inputs, verify outputs
- Example: `OutputFormatter.parse()` with various ANSI codes, classification logic

**Integration Tests:**
- Not present; would require mocking Teams API and child processes

**E2E Tests:**
- Framework: Not used
- No end-to-end workflows tested

## Common Patterns

**Async Testing:**
- Not present; output-formatter is synchronous

**Error Testing:**
```typescript
// Pattern: No explicit error testing observed
// Current tests focus on happy paths and edge cases (empty strings, whitespace)
```

**Classification Testing:**
```typescript
describe("Classification - PROMPT", () => {
  it("should classify lines ending with ? as PROMPT", () => {
    const results = formatter.parse("What is your name?\n");
    expect(results[0].type).toBe(OutputType.PROMPT);
  });

  it("should classify questions with leading whitespace as PROMPT", () => {
    const results = formatter.parse("  Would you like to continue?  \n");
    expect(results[0].type).toBe(OutputType.PROMPT);
  });
});
```

**Buffering Tests:**
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

**Integration Tests:**
```typescript
describe("Integration tests", () => {
  it("should handle mixed output types", () => {
    const input = "🚀 Starting process\nProcessing file 1\nWarning: Large file detected\nProcessed successfully\nWould you like to continue?\n";
    const results = formatter.parse(input);

    expect(results).toHaveLength(5);
    expect(results[0].type).toBe(OutputType.STATUS);
    expect(results[1].type).toBe(OutputType.CONTENT);
    expect(results[2].type).toBe(OutputType.WARNING);
    expect(results[3].type).toBe(OutputType.CONTENT);
    expect(results[4].type).toBe(OutputType.PROMPT);
  });

  it("should handle ANSI codes with buffering", () => {
    const results1 = formatter.parse("\x1B[32mGreen ");
    expect(results1).toHaveLength(0);

    const results2 = formatter.parse("text\x1B[0m\n");
    expect(results2).toHaveLength(1);
    expect(results2[0].text).toBe("Green text");
  });
});
```

## Test Count and Coverage Details

**Total Tests:** 43 tests in `output-formatter.test.ts`

**Test Categories:**
- ANSI code stripping: 2 tests
- Buffering: 4 tests
- Flush behavior: 5 tests
- Classification (PROMPT): 2 tests
- Classification (STATUS): 7 tests
- Classification (WARNING): 2 tests
- Classification (ERROR): 5 tests
- Classification (CONTENT): 2 tests
- Whitespace preservation: 5 tests
- Integration tests: 3 tests

**Tested Functionality:**
- Output parsing with newline handling
- ANSI code stripping (color, bold, reset codes)
- Line classification (PROMPT, STATUS, WARNING, ERROR, CONTENT)
- Buffering incomplete lines and flushing
- Whitespace preservation (leading, trailing, internal)
- Mixed output type handling
- Edge cases (empty lines, whitespace-only lines, trailing newlines)

## Known Testing Limitations

**Cannot Test Without Mocking:**
- `bot.ts`: Requires Teams API mocking, session management
- `session-manager.ts`: Requires file system mocking, process management
- `subprocess-bridge.ts`: Requires child_process mocking
- `intent-detector.ts`: Requires Anthropic API mocking
- `auth.ts`: Requires fetch/JWT mocking, token caching
- `teams-api.ts`: Requires fetch mocking

**Why Not Mocked:**
- Tests focus on deterministic, synchronous code (OutputFormatter)
- Async operations and external dependencies would require significant test infrastructure
- Bun's test runner supports mocking but no mocks configured in codebase

---

*Testing analysis: 2026-02-28*
