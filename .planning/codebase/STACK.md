# Technology Stack

**Analysis Date:** 2026-02-28

## Languages

**Primary:**
- Markdown - Core content format for vault, skills, and documentation
- YAML - Configuration format for assistants and settings
- Bash - Utility scripts for date resolution and system operations

## Runtime

**Environment:**
- Claude AI models via Claude Code SDK
- Node.js ecosystem (Claude Code native)
- Browser/Web (Obsidian vault viewing)

**Package Manager:**
- Claude Code built-in skill system - no external package manager

## Frameworks

**Core:**
- Claude Code (Anthropic) - AI agent platform and skill system
- Obsidian - Knowledge vault client (markdown viewer/editor)

**Templating:**
- Markdown-based templating - No external templating engine
- Custom frontmatter YAML for skill metadata

**Documentation:**
- Mintlify - Documentation hosting at `2bd.l48a.de`
- Static markdown docs in `/docs`

## Key Dependencies

**Critical:**
- Claude AI (Opus, Haiku models) - Backbone of Ada and all assistants
- Claude Code SDK - Enables skill execution and ritual automation

**Vault Storage:**
- Markdown files on local filesystem
- OneDrive/Cloud Storage - Vault syncing (user's Second Brain folder)
- Git - Version control for engine code

**Optional Integrations:**
- Calendar provider (ekctl) - For calendar integration (optional)

## Configuration

**Environment:**
- `.claude/config.md` - Vault path configuration (git-ignored)
- `.claude/settings.json` - Claude Code permissions and plugin settings
- `.claude/settings.local.json` - Local overrides for settings

**Runtime Config Files:**
- `Systemic/Config/config.yaml` - Calendar and work hours settings
- `Systemic/Config/ada.yaml` - Assistant ordering and configuration
- `Systemic/Directives/human.md` - User profile (name, role, goals, growth edge)
- `Systemic/Directives/ada.md` - Ada personality configuration
- `Systemic/Templates/` - Ritual output templates (customizable)
- `Systemic/Coaching/` - Coaching prompts per timescale and domain

## Build & Deployment

**Build:**
- No build step required - runs directly as Claude Code skills/plugins
- Git-based distribution via GitHub: https://github.com/bugroger/2bd

**Distribution:**
- Claude Code Marketplace plugin registration at `.claude-plugin/marketplace.json`
- Plugin version: 1.1.7
- MIT License

**Hooks:**
- Claude Code hooks in `.claude/hooks/` (session start, pre-meeting triggers)

## Platform Requirements

**Development:**
- Claude Code IDE or CLI
- Git for version control
- Text editor for markdown editing
- Obsidian (optional, for vault UI)

**Runtime:**
- Claude Code CLI: `claude` command
- Access to Claude API (requires Anthropic subscription)
- Local filesystem with write permissions
- Network access to Anthropic's Claude API

**Production:**
- Cloud deployment: via Claude Code orchestration
- Vault storage: Local filesystem or synced via OneDrive/cloud storage
- Persistent state: Markdown files in vault directory

## Timescales Architecture

**Core Timescales:**
- Daily - 24-hour ritual cycle
- Weekly - 7-day planning/reflection
- Quarterly - ~90-day goal cycle
- Yearly - Annual planning

**Implementation:**
- `.claude/skills/ada/templates/{scale}.md` - Ada base templates per timescale
- `.claude/skills/_assistant-{name}/templates/{scale}.md` - Assistant-specific templates
- `Systemic/Templates/Periodic/{scale}ly.md` - Vault periodic templates
- `Systemic/Coaching/{domain}/{scale}.md` - Coaching prompts by timescale

---

*Stack analysis: 2026-02-28*
