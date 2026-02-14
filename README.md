# 2bd (Second Brain Daemon)

**A personal knowledge system that runs itself—powered by Claude Skills, driven by rituals, stored in markdown.**

## Why 2bd?

Traditional productivity systems depend on you being the engine. They're passive containers waiting for you to fill them. You set up elaborate workflows, miss a day, then a week, and suddenly your second brain is out of date.

2bd flips the script. Instead of you serving your system, your system serves you. **Rituals** run on schedule, the **metabolic architecture** keeps knowledge flowing, and everything stays organized in plain markdown files you truly own.

And because everything is plain markdown on your filesystem, AI integration is trivial. No plugins. No APIs. No MCPs. You just point Claude at a folder.

## Core Philosophy

The note-taking architecture mirrors human cognitive biology. Information is categorized by its **metabolic state**—energy velocity and temporal density rather than just topic.

| State | Purpose |
|-------|---------|
| **Captive** | Sensory/Intake - high-velocity, volatile working notes |
| **Synthetic** | Short-term/Executive - active project work, drafts |
| **Periodic** | Episodic/Rhythm - timeline archives (the heartbeat) |
| **Semantic** | Long-term/Reference - crystallized knowledge |
| **Systemic** | Procedural/Structure - templates, SOPs, workflows |

## How It Works

2bd operates on nested time scales, each feeding into the next:

```
Daily ──▶ Weekly ──▶ Monthly ──▶ Quarterly ──▶ Yearly
  ↓          ↓          ↓            ↓            ↓
Small     Tactics   Strategy    Direction    Vision
wins      review    synthesis   reflection   planning
```

**Core rituals** drive the engine:
- **Planning Rituals** – Prepare Captive notes from templates, synthesize prior knowledge
- **Review Rituals** – Archive Captive to Periodic, synthesize forward

Run rituals from the CLI:
```bash
cd ~/Code/2bd-engine
claude skill run rituals/planning/daily-planning
claude skill run rituals/review/daily-review
```

## Architecture

2bd separates **engine** (this repo) from **vault** (your notes):

```
~/Code/2bd-engine/                  ~/OneDrive/2bd-vault/
├── .claude/                        ├── 00_Brain/
│   ├── skills/                     │   ├── Captive/ (your notes)
│   └── config.md  ← vault path     │   ├── Periodic/ (archives)
├── scaffold/   ← vault template    │   └── Systemic/
├── CLAUDE.md                       │       ├── Templates/
└── README.md                       │       └── Directives/
                                    ├── 01_Projects/
                                    ├── 02_Areas/
                                    └── .obsidian/
```

**Key principles:**
- **Engine** = Skills, scaffold, documentation — public, git-tracked
- **Vault** = Your notes, archives, projects — private, cloud-synced
- **Always run Claude from the engine directory**
- **Templates are yours** — copied once during setup, customize freely

## Getting Started

### Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
- Markdown editor (Obsidian recommended)
- A sync folder (OneDrive, iCloud, Dropbox)

### Quick Start

```bash
# 1. Clone the engine
git clone https://github.com/bugroger/2bd ~/Code/2bd-engine
cd ~/Code/2bd-engine

# 2. Set up your vault
claude skill run actions/init --args "fresh --vault=~/OneDrive/2bd-vault"

# 3. (Optional) Create a symlink for convenience
ln -s ~/OneDrive/2bd-vault ./vault

# 4. Open the vault in Obsidian

# 5. Start planning!
claude skill run rituals/planning/daily-planning
```

### Daily Usage

Always run Claude from the engine directory:

```bash
cd ~/Code/2bd-engine

# Morning
claude skill run rituals/planning/daily-planning

# Evening
claude skill run rituals/review/daily-review
```

### Reconnecting (New Computer)

If you've moved to a new computer and your vault already exists:

```bash
cd ~/Code/2bd-engine
claude skill run actions/init --args "reconnect --vault=~/OneDrive/2bd-vault"

# Recreate the symlink
ln -s ~/OneDrive/2bd-vault ./vault
```

### Updating Your Profile

```bash
cd ~/Code/2bd-engine
claude skill run actions/init --args "profile"
```

## Key Concepts

**Rituals** are scheduled routines that drive the system—daily planning, weekly review, etc.

**Actions** are one-shot helpers triggered on-demand—create a project, init, migrate, etc.

**Captive Notes** (Today.md, Week.md, Month.md, Quarter.md, Year.md) are your active working space.

**Periodic Notes** are unique, consecutive archives (2026-02-08.md, 2026-W06.md, etc.) that form the timeline.

**PARA Method** organizes Projects, Areas, Resources, Archives alongside the metabolic Brain.

## Vault Structure

Your vault (in OneDrive/iCloud) looks like:

```
2bd-vault/
├── 00_Brain/
│   ├── ✱ Home.md                # Central Hub
│   ├── Captive/                 # Working notes (you write here)
│   │   ├── Today.md
│   │   ├── Week.md
│   │   ├── Month.md
│   │   ├── Quarter.md
│   │   ├── Year.md
│   │   └── Flash/
│   ├── Periodic/                # Archives (rituals write here)
│   │   ├── Daily/               # YYYY-MM-DD.md
│   │   ├── Weekly/              # YYYY-Www.md
│   │   ├── Monthly/             # YYYY-MM.md
│   │   ├── Quarterly/           # YYYY-QN.md
│   │   └── Yearly/              # YYYY.md
│   ├── Semantic/                # Crystallized knowledge
│   ├── Synthetic/               # Active drafts
│   └── Systemic/
│       ├── Templates/           # Your templates (customize freely)
│       └── Directives/          # Your profile & AI personality
├── 01_Projects/                 # Active projects
│   └── ✱ Projects.md
├── 02_Areas/
│   ├── People/                  # Relationship notes
│   │   └── ✱ People.md
│   └── Insights/                # Thematic learnings
│       └── ✱ Insights.md
├── 03_Resources/
│   └── _Templates/para/
├── 04_Archives/
└── .obsidian/
```

**Naming Conventions:**
- **Hubs:** `✱` prefix with Title Case (`✱ Home.md`, `✱ Projects.md`)
- **Projects:** End-date first (`YYYY-MM-DD-project-name.md`)
- **People:** FirstName + LastInitial (`EstherS.md`, `JonnyB.md`)
- **Daily:** `YYYY-MM-DD.md` (2026-02-08.md)
- **Weekly:** `YYYY-Www.md` (2026-W06.md)
- **Monthly:** `YYYY-MM.md` (2026-02.md)
- **Quarterly:** `YYYY-QN.md` (2026-Q1.md)
- **Yearly:** `YYYY.md` (2026.md)

## Documentation

See [CLAUDE.md](CLAUDE.md) for complete documentation:
- Engine + Vault architecture
- Metabolic state system details
- Creating new rituals and actions
- Calendar integration
- Obsidian integration and hotkeys

## Philosophy

**Trust the Rituals.** Run them even when you don't feel like it. The magic is in the rhythm.

**Capture in Captive.** Your Captive notes are volatile, high-velocity intake. Periodic is the permanent record.

**The System Augments.** It scaffolds your thinking, but you supply the content.

## Acknowledgments

- **Tiago Forte** – [PARA Method](https://fortelabs.com/blog/para/)
- **Andy Matuschak** – [Evergreen Notes](https://notes.andymatuschak.org/Evergreen_notes)
- **Matthias Hilse** – [Forever Notes](https://www.myforevernotes.com/) (Hubs, living documents)
- **Anthropic** – Claude Skills

## License

MIT License. See [LICENSE](LICENSE) for details.
