# External Integrations

**Analysis Date:** 2026-02-28

## APIs & External Services

**Anthropic Claude API:**
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`) - Intent detection via `IntentDetector` class
  - SDK/Client: `@anthropic-ai/sdk` 0.74.0
  - Auth: `ANTHROPIC_API_KEY` environment variable
  - Usage: Classifies user messages to detect which ritual or command to execute
  - Endpoint: `messages.create()` with max_tokens: 200
  - Request: System prompt describing available skills + user message
  - Response: JSON with `{"skill": "skill-name"}` or `{"skill": null}`

**Microsoft Teams Bot Framework:**
- Teams Bot Framework API v3 - Sends and manages messages in Teams conversations
  - SDK/Client: Native `fetch` API with Bearer token auth
  - Auth: OAuth 2.0 client credentials (app ID + password)
  - Base URL: Received in incoming activity `serviceUrl` property
  - Endpoints:
    - `v3/conversations/{conversationId}/activities` - Send new message or typing indicator
    - `v3/conversations/{conversationId}/activities/{activityId}` - Update or delete message
    - `v3/conversations/{conversationId}/activities/{activityId}` - Reply to specific message

**Microsoft Azure Bot Service:**
- Azure AD OAuth 2.0 token endpoint
  - Connection: `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token`
  - Auth: Client credentials (app ID + password from environment)
  - Purpose: Obtains access tokens for calling Teams APIs
  - Token scope: `https://api.botframework.com/.default`
  - Token caching: 24-hour JWKS cache + 5-minute buffer on token expiry

**Microsoft OpenID Configuration:**
- Bot Framework OpenID metadata endpoint
  - URL: `https://login.botframework.com/v1/.well-known/openid-configuration`
  - Purpose: Discovers JWKS URI for JWT verification
  - Response: Returns `jwks_uri` for fetching signing keys
  - Caching: 24-hour cache in `getJWKS()` function

**Microsoft JWKS (JSON Web Key Set):**
- Remote JWKS endpoint (URL from OpenID config)
  - Purpose: Validates JWT tokens from incoming Teams activities
  - Library: `jose.createRemoteJWKSet()` manages remote key fetching
  - Validation: Checks token issuer, audience (bot app ID), and signature

## Data Storage

**Databases:**
- None - No external database integration

**File Storage:**
- Local filesystem only
  - Session state: `.active-session.json` in `teams-bot/` directory
  - Contains: PID, skill name, conversation ID, start timestamp
  - Purpose: Orphan process cleanup on restart

**Caching:**
- In-memory caching only
  - JWKS cache: Updated every 24 hours or on demand
  - Access token cache: Valid until expiry minus 5-minute buffer
  - Active session: Single in-memory `Session` object

## Authentication & Identity

**Auth Provider:**
- Microsoft Azure AD + Bot Framework
  - Incoming auth: JWT token validation from Azure Bot Service
  - Outgoing auth: OAuth 2.0 client credentials for Teams API calls

**Implementation:**
- Incoming requests: `validateToken()` verifies JWT signature via JWKS, checks issuer and audience
- Outgoing requests: `getAccessToken()` obtains bearer token via OAuth 2.0, caches token
- Authorization: Single-user whitelist via `ALLOWED_AAD_OBJECT_ID` environment variable
- Token validation can be skipped in development via `SKIP_AUTH=true`

## Monitoring & Observability

**Error Tracking:**
- None detected - No error tracking service integration

**Logs:**
- Console logging only
  - Framework: `console.log()`, `console.error()`, `console.warn()`
  - Hono Logger middleware: Request/response logging via `logger()` middleware
  - Output: Sent to standard output/error streams

## CI/CD & Deployment

**Hosting:**
- None detected - Application expects to be deployed separately
- Webhook model: Expects incoming POST requests to `POST /api/messages`

**CI Pipeline:**
- Not detected - No CI/CD configuration files found

## Environment Configuration

**Required env vars:**
- `ENGINE_PATH` - Path to 2bd skills directory
- `ANTHROPIC_API_KEY` - Claude API key
- `MICROSOFT_APP_ID` - Azure Bot Service app ID
- `MICROSOFT_APP_PASSWORD` - Azure Bot Service app password

**Optional env vars:**
- `PORT` - Server port (default: 3000)
- `SESSION_TIMEOUT_MS` - Session timeout in milliseconds (default: 1800000)
- `CLAUDE_CLI_PATH` - Path to Claude CLI (default: "claude")
- `MICROSOFT_APP_TENANT_ID` - Azure tenant ID (default: "botframework.com")
- `ALLOWED_AAD_OBJECT_ID` - Azure AD object ID for user authorization (empty = allow all)
- `SKIP_AUTH` - Skip token validation in dev (set to "true")

**Secrets location:**
- Environment variables (provided at deployment/runtime)
- Managed outside codebase (`.env` files not committed)

## Webhooks & Callbacks

**Incoming:**
- `POST /api/messages` - Main webhook for incoming Teams activities
  - Triggered by: Teams messages, conversation updates, adaptive card submissions
  - Auth: Bearer token validation via `validateToken()`
  - Payload: `Activity` object from Teams Bot Framework
  - Response: 200 OK with `{status: "ok"}`

**Outgoing:**
- Teams API callbacks via HTTP POST (no webhook registration)
  - Messages sent via `sendActivity()` to conversation endpoint
  - Interactive cards submitted via adaptive card actions

## Integration Flow

**Incoming Message Flow:**
1. Teams sends POST to `/api/messages` with JWT token
2. `validateToken()` verifies JWT via JWKS (cached 24 hours)
3. `handleMessage()` removes bot mention, checks authorization
4. `IntentDetector` calls Claude API to classify user intent
5. `SubprocessBridge` spawns Claude CLI process for matched skill
6. Skill output streamed to `OutputFormatter` which parses into types
7. Messages sent back via `sendActivity()` with bearer token from `getAccessToken()`
8. Session maintained in `SessionManager` until timeout or completion

---

*Integration audit: 2026-02-28*
