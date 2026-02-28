# Technology Stack

**Analysis Date:** 2026-02-28

## Languages

**Primary:**
- TypeScript 5.7.0 - All application code in `teams-bot/src/**/*.ts`

## Runtime

**Environment:**
- Bun (latest) - JavaScript runtime and package manager
- Node.js compatible - Uses native Node.js APIs like `child_process` and `fs`

**Package Manager:**
- Bun
- Lockfile: Present (implicit via Bun)

## Frameworks

**Core:**
- Hono 4.6.0 - Lightweight web framework for HTTP server and webhook handling (`teams-bot/src/index.ts`)
- Hono Logger middleware - Request/response logging

**Authentication & Security:**
- jose 5.9.0 - JWT verification and JWKS handling for Microsoft Bot Framework token validation (`teams-bot/src/auth.ts`)

**API Integration:**
- @anthropic-ai/sdk 0.74.0 - Anthropic Claude API for intent detection (`teams-bot/src/intent-detector.ts`)

## Key Dependencies

**Critical:**
- `@anthropic-ai/sdk` - Provides `Anthropic` client for Claude API calls; required for intent detection that classifies user messages into rituals or commands
- `hono` - HTTP server framework; handles Teams webhook endpoint (`/api/messages`) and health check
- `jose` - Validates JWT tokens from Microsoft Bot Framework; prevents unauthorized access

**Infrastructure:**
- `@types/bun` - TypeScript types for Bun runtime
- `typescript` - Type checking and compilation

## Configuration

**Environment:**
- Configuration loaded via environment variables in `loadConfig()` at `teams-bot/src/config.ts`
- Required variables:
  - `ENGINE_PATH` - Path to 2bd engine directory containing skills
  - `ANTHROPIC_API_KEY` - Claude API key (validated to start with `sk-ant-`)
  - `SESSION_TIMEOUT_MS` - Session idle timeout in milliseconds (default: 1800000/30min)
  - `MICROSOFT_APP_ID` - Azure Bot Service app ID for authentication
  - `MICROSOFT_APP_PASSWORD` - Azure Bot Service app password for token generation
  - `MICROSOFT_APP_TENANT_ID` - Azure tenant ID (default: `botframework.com`)
  - `ALLOWED_AAD_OBJECT_ID` - Azure AD object ID for authorization (whitelist single user)
  - `CLAUDE_CLI_PATH` - Path to Claude CLI binary (default: `claude`)
  - `SKIP_AUTH` - Development flag to skip token validation (set to `"true"`)

**Build:**
- No build configuration - TypeScript runs directly via Bun (`bun run src/index.ts`)
- `tsconfig.json` exists (from node_modules dependencies)

## Platform Requirements

**Development:**
- Bun runtime installed
- TypeScript 5.7.0
- Node.js compatible system (for `child_process`, `fs` modules)

**Production:**
- Bun runtime
- Microsoft Teams application configured in Azure Bot Service
- 2bd engine directory with skills available at `ENGINE_PATH`
- Claude CLI binary accessible at `CLAUDE_CLI_PATH`

## Runtime Details

**Server:**
- Hono web server starts on port specified by `PORT` env var (default: 3000)
- Health check endpoint: `GET /`
- Teams webhook endpoint: `POST /api/messages`
- Server exports as `{ port, fetch }` compatible with Bun's HTTP handler

**Process Model:**
- Main server process handles HTTP requests
- Child processes spawned via `SubprocessBridge` for each skill execution
- Child process runs Claude CLI: `claude skill run rituals/{skill}` or `commands/{skill}`
- Session state persisted to `.active-session.json` for orphan cleanup

---

*Stack analysis: 2026-02-28*
