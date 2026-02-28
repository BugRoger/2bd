# External Integrations

**Analysis Date:** 2026-02-28

## APIs & External Services

**Claude AI Models:**
- Claude (Opus, Haiku) - Backbone AI engine for all assistants
  - SDK/Client: Claude Code native integration
  - Auth: Managed by Claude Code environment

**Calendar Services:**
- ekctl (Calendar provider) - Meeting prep and day-shape analysis
  - Client: Optional calendar integration module
  - Config: `Systemic/Config/config.yaml`

## Data Storage

**Databases:**
- Markdown filesystem - Primary data storage
  - Structure: Vault at user-configured path (typically OneDrive Second Brain)
  - Organization: PARA method (Projects, Areas, Resources, Archives)
  - Client: Native markdown read/write via Claude Code

**File Storage:**
- Local filesystem - Vault directory
- OneDrive/Cloud Storage - Primary vault syncing (user's Second Brain folder)
- Git repository - Engine code version control at `https://github.com/bugroger/2bd`

**Caching:**
- In-memory during ritual execution - No persistent cache layer
- Markdown files serve as source of truth

## Authentication & Identity

**Auth Provider:**
- Custom - Claude Code session-based
  - Implementation: Claude Code SDK permissions model
  - Config: `.claude/settings.json` with permissions array
  - Vault access: Controlled via `.claude/config.md` path configuration

## Configuration Files

**Vault Structure (Required):**
- `00_Brain/Systemic/Directives/human.md` - User profile and preferences
- `00_Brain/Systemic/Directives/ada.md` - Ada assistant personality config
- `00_Brain/Systemic/Config/config.yaml` - Calendar and work hours
- `00_Brain/Systemic/Config/ada.yaml` - Assistant ordering
- `00_Brain/Systemic/Templates/` - Ritual output templates
- `00_Brain/Systemic/Coaching/` - Coaching prompts per ritual type

**Engine Configuration (Git-tracked):**
- `.claude/config.md` - Vault path (git-ignored, per-user)
- `.claude/settings.json` - Claude Code permissions
- `.claude/settings.local.json` - Local setting overrides

## Monitoring & Observability

**Error Tracking:**
- None - Errors reported inline to user during ritual execution

**Logs:**
- User vault (`Synthetic/Assistants/` directories) - Ritual working output and results
- Console output via Claude Code CLI

## CI/CD & Deployment

**Hosting:**
- GitHub - Repository at `https://github.com/bugroger/2bd`
- Claude Code Marketplace - Plugin registry

**Distribution:**
- Git clone for installation
- Claude Code plugin system for skill registration
- Marketplace metadata: `.claude-plugin/marketplace.json` (v1.1.7)

**Deployment:**
- No traditional CI/CD pipeline
- Manual git updates to engine
- Vault data persists independently

## Environment Configuration

**Required environment variables:**
- None - Configuration via markdown files only

**Optional environment variables:**
- None explicitly defined - Calendar integration configurable via YAML

**Secrets location:**
- Not applicable - No API keys required
- Claude Code session token managed by Anthropic

## Calendar Integration

**Provider:**
- ekctl - Optional calendar backend

**Configuration:**
- Location: `Systemic/Config/config.yaml`
- Settings:
  - `work_hours` - Start/end times (default: 09:00-18:00)
  - `min_focus_block_minutes` - Minimum focus time threshold (default: 30)
  - `one_on_one_patterns` - Regex patterns for 1:1 detection

**What Calendar Integration Provides:**
- Day shape analysis (focus blocks vs meeting clusters)
- Meeting prep before significant meetings
- Post-meeting reflection prompts
- 1:1 detection and relationship context

## Vault Syncing

**OneDrive Integration:**
- Primary vault path: User's "Second Brain" folder
- Symlink: `vault/` → `/Users/{user}/OneDrive - SAP SE/Second Brain` (macOS)
- Alternative: `/Users/{user}/Library/CloudStorage/OneDrive-SAPSE/Second Brain`
- Sync: Automatic via OneDrive client

**Multi-location Support:**
- Primary: OneDrive cloud storage
- Secondary: Optional local git clone for additional directories
- Settings: `additionalDirectories` in `.claude/settings.json`

## Webhooks & Callbacks

**Incoming:**
- None - Vault is read-only during rituals

**Outgoing:**
- None - No external webhook callbacks

**Claude Code Hooks (Potential):**
- Session start hook - Loads user context
- Pre-meeting hook - Generates meeting prep
- Config: `.claude/hooks/` (user-configurable)

## Plugin System

**Claude Code Marketplace:**
- Plugin name: "2bd"
- Version: 1.1.7
- Repository: `https://github.com/bugroger/2bd`
- Category: Productivity
- Keywords: second brain, PARA, PKM, productivity, knowledge management, Obsidian, rituals

**Skill Registration:**
- Metadata: `.claude/skills/{skill-name}/SKILL.md`
- Skills: ada, plan, reflect, project, person, _assistant-* (domain specialists)
- Custom frontmatter: timescales attribute for multi-timescale skills

---

*Integration audit: 2026-02-28*
