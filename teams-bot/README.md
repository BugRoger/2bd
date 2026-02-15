# 2bd Teams Bot

A Microsoft Teams bot that bridges natural language interactions with the 2bd skill system. Run your daily rituals and project management commands directly from Teams chats.

## Features

- **Natural Language Interface** - Describe what you want in plain English ("plan my day", "review my day")
- **Interactive Prompts** - Adaptive Cards render multiple-choice and yes/no prompts inline
- **Session Management** - One active skill session at a time with automatic timeout
- **User Authorization** - Restrict bot access to specific Azure AD users
- **Subprocess Bridge** - Spawns Claude CLI in the background and streams output
- **Output Formatting** - Parses colored output, status messages, and interactive prompts
- **Meta Commands** - Control sessions with `cancel`, `status`, and `help`

## Architecture

```
Teams Chat → Bot Framework → Hono Server
                                   ↓
                        [Intent Detector (LLM)]
                                   ↓
                         [Session Manager]
                                   ↓
                        [Subprocess Bridge]
                                   ↓
                        claude skill run <skill>
                                   ↓
                        [Output Formatter]
                                   ↓
                        [Interactive Mapper]
                                   ↓
                        Adaptive Cards / Text
```

### Components

| Component | Purpose |
|-----------|---------|
| **bot.ts** | Main activity handler, routes messages and invokes |
| **intent-detector.ts** | Uses Claude API to map natural language to skills |
| **session-manager.ts** | Tracks active sessions, prevents concurrent sessions |
| **subprocess-bridge.ts** | Spawns and manages Claude CLI child processes |
| **output-formatter.ts** | Parses ANSI output into typed messages |
| **interactive-mapper.ts** | Detects prompts and renders Adaptive Cards |
| **auth.ts** | JWT validation for Bot Framework messages |
| **teams-api.ts** | Sends activities back to Teams conversations |

## Prerequisites

- **Bun runtime** (tested on 1.0+)
- **Claude CLI** installed and configured
- **2bd engine** repository
- **Microsoft Teams** with bot app installed
- **Azure Bot Service** registration
- **Anthropic API key** for intent detection

## Installation

1. **Clone the repository**

```bash
git clone <repo-url>
cd teams-bot
```

2. **Install dependencies**

```bash
bun install
```

3. **Configure environment variables**

Create a `.env` file:

```bash
# Required
ENGINE_PATH=/path/to/2bd-engine
ANTHROPIC_API_KEY=sk-ant-...
MICROSOFT_APP_ID=<azure-bot-app-id>
MICROSOFT_APP_PASSWORD=<azure-bot-app-secret>
ALLOWED_AAD_OBJECT_ID=<your-azure-ad-object-id>

# Optional
CLAUDE_CLI_PATH=claude           # Default: "claude"
SESSION_TIMEOUT_MS=1800000       # Default: 30 minutes
PORT=3978                        # Default: 3978
```

4. **Set up Teams app manifest**

- Edit `manifest/manifest.json` with your bot ID and endpoints
- Package as `.zip` and upload to Teams

## Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `ENGINE_PATH` | Yes | Absolute path to 2bd engine directory | - |
| `ANTHROPIC_API_KEY` | Yes | API key for intent detection (must start with `sk-ant-`) | - |
| `MICROSOFT_APP_ID` | Yes | Azure Bot Service application ID | - |
| `MICROSOFT_APP_PASSWORD` | Yes | Azure Bot Service application password | - |
| `ALLOWED_AAD_OBJECT_ID` | Yes | Azure AD Object ID of authorized user | - |
| `CLAUDE_CLI_PATH` | No | Path to Claude CLI binary | `claude` |
| `SESSION_TIMEOUT_MS` | No | Session timeout in milliseconds (max 24 hours) | `1800000` (30 min) |
| `PORT` | No | Server port | `3978` |

### Finding Your Azure AD Object ID

1. Go to Azure Portal → Azure Active Directory → Users
2. Find your user and copy the **Object ID** field
3. Add it to `ALLOWED_AAD_OBJECT_ID` in `.env`

## Usage

### Starting the Bot

```bash
# Development mode (auto-restart on changes)
bun run dev

# Production mode
bun run start
```

The server listens on `http://localhost:3978` (or configured PORT).

### Interacting with the Bot

**Start a skill:**
```
plan my day
review my day
create project called Launch
archive project Launch
```

**Meta commands:**
```
status  - Show active session info
cancel  - Cancel the active session
help    - Show available commands
```

### Example Session

```
You: plan my day
Bot: Starting planning-daily...
Bot: [Adaptive Card with options]
You: [Select option via card]
Bot: Received: Option 1
Bot: [Interactive dialogue continues...]
Bot: ✅ planning-daily completed successfully.
```

## Development

### Project Structure

```
teams-bot/
├── src/
│   ├── bot.ts                  # Main activity handler
│   ├── intent-detector.ts      # LLM-based intent detection
│   ├── session-manager.ts      # Session lifecycle management
│   ├── subprocess-bridge.ts    # Child process management
│   ├── output-formatter.ts     # ANSI output parser
│   ├── interactive-mapper.ts   # Adaptive Card renderer
│   ├── auth.ts                 # JWT validation
│   ├── teams-api.ts            # Teams API client
│   ├── components.ts           # Singleton component registry
│   ├── config.ts               # Configuration loader
│   ├── types.ts                # TypeScript types
│   └── index.ts                # Server entry point
├── manifest/
│   └── manifest.json           # Teams app manifest
├── package.json
├── tsconfig.json
└── README.md
```

### Running Tests

```bash
bun test
```

### Adding New Skills

Skills are discovered automatically from the engine:

1. Create skill in `ENGINE_PATH/.claude/skills/rituals/` or `.../commands/`
2. Add `SKILL.md` with skill definition
3. Restart bot to pick up new skills

The intent detector will automatically recognize natural language that maps to the new skill.

### Debugging

Enable verbose logging:

```bash
DEBUG=* bun run dev
```

Session files are preserved in memory only. Check console logs for subprocess stdout/stderr.

## Limitations

- **Single user** - Only one authorized user per bot instance
- **One session at a time** - Cannot run multiple skills concurrently
- **No persistence** - Session state lost on restart
- **Basic error handling** - Subprocess errors may not be gracefully recovered
- **Limited interactive support** - Only simple prompts map to Adaptive Cards
- **No file uploads** - Cannot attach files from Teams
- **Text-only skills** - Skills that produce images or complex outputs are not supported

## Security

- **JWT validation** - All incoming activities are validated against Bot Framework tokens
- **User authorization** - Only users with configured AAD Object ID can use the bot
- **Environment isolation** - Subprocess runs with bot's environment (ensure ENGINE_PATH security)
- **No credential storage** - API keys only in environment variables

## Troubleshooting

**Bot doesn't respond:**
- Check `MICROSOFT_APP_ID` and `MICROSOFT_APP_PASSWORD` match Azure Bot Service
- Verify bot endpoint is publicly accessible (use ngrok for local dev)
- Check console logs for authentication errors

**Skills not detected:**
- Verify `ENGINE_PATH` points to correct directory
- Check skill directories have `SKILL.md` files
- Restart bot after adding new skills

**Intent detection fails:**
- Verify `ANTHROPIC_API_KEY` is valid
- Check API key has sufficient credits
- Try more explicit language ("run planning-daily" vs "plan day")

**Session timeout issues:**
- Increase `SESSION_TIMEOUT_MS` for long-running skills
- Check subprocess is actually running (look for zombie processes)
- Verify Claude CLI is responsive (`claude --version`)

**Adaptive Cards not rendering:**
- Check Teams client version (desktop app recommended)
- Verify prompt format matches expected patterns in `interactive-mapper.ts`
- Fall back to text prompts if cards don't work

## License

See repository root for license information.
