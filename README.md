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
claude skill run rituals/planning/daily-planning
claude skill run rituals/review/daily-review
```

## Key Concepts

**Rituals** are scheduled routines that drive the system—daily planning, weekly review, etc.

**Actions** are one-shot helpers triggered on-demand—create a project, etc.

**Captive Notes** (Today.md, Week.md, Month.md, Quarter.md, Year.md) are your active working space.

**Periodic Notes** are unique, consecutive archives (2026-02-08.md, 2026-W06.md, etc.) that form the timeline.

**PARA Method** organizes Projects, Areas, Resources, Archives alongside the metabolic Brain.

## File Organization

```
2bd/
│
├── 00_Brain/                    # Metabolic state hierarchy
│   ├── ✱ Home.md                # Central Hub
│   ├── Captive/                 # Working notes (user writes here)
│   │   ├── Today.md
│   │   ├── Week.md
│   │   ├── Month.md
│   │   ├── Quarter.md
│   │   ├── Year.md
│   │   └── Flash/               # Raw unstructured stimuli
│   ├── Synthetic/               # Active project work
│   ├── Periodic/                # Timeline archives (rituals write here)
│   │   ├── Daily/               # YYYY-MM-DD.md
│   │   ├── Weekly/              # YYYY-Www.md
│   │   ├── Monthly/             # YYYY-MM.md
│   │   ├── Quarterly/           # YYYY-QN.md
│   │   └── Yearly/              # YYYY.md
│   ├── Semantic/                # Crystallized knowledge
│   └── Systemic/                # Templates, SOPs
│       └── Templates/
│
├── 01_Projects/                 # Active projects (deadline-driven)
│   ├── ✱ Projects.md            # Projects Hub
│   └── YYYY-MM-DD-name.md       # Project files (end-date prefix)
│
├── 02_Areas/                    # People and Insights
│   ├── Insights/                # AI-generated thematic patterns
│   │   └── ✱ Insights.md        # Insights Hub
│   └── People/                  # Living notes for individuals
│       └── ✱ People.md          # People Hub
│
├── 03_Resources/                # PARA templates
│   └── _Templates/para/
│
├── 04_Archives/                 # Completed projects
│   └── Projects/
│
└── .claude/skills/              # Claude Skills
    ├── rituals/
    │   ├── planning/            # Forward-looking
    │   └── review/              # Reflective
    └── actions/                 # One-shot helpers
```

**Naming Conventions:**
- **Hubs:** `✱` prefix with Title Case (`✱ Home.md`, `✱ Projects.md`)
- **Projects:** End-date first (`YYYY-MM-DD-project-name.md`)
- **People:** FirstName + LastInitial (`EstherS.md`, `JonnyB.md`)
- **Periodic Daily:** `YYYY-MM-DD.md` (2026-02-08.md)
- **Periodic Weekly:** `YYYY-Www.md` (2026-W06.md)
- **Periodic Monthly:** `YYYY-MM.md` (2026-02.md)
- **Periodic Quarterly:** `YYYY-QN.md` (2026-Q1.md)
- **Periodic Yearly:** `YYYY.md` (2026.md)

## Getting Started

### Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) or Claude.ai with Skills
- Markdown editor (Obsidian recommended, any editor works)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/bugroger/2bd.git
cd 2bd

# Run your first ritual
claude skill run rituals/planning/daily-planning
```

Open `00_Brain/Captive/Today.md` to see your working note.

### Sync

2bd files are just markdown. Store the folder in iCloud, Dropbox, OneDrive, or use Git—sync is an extension, not a requirement.

## Documentation

See [CLAUDE.md](CLAUDE.md) for complete documentation:
- Metabolic state system details
- Synthesis workflow (Captive → Periodic)
- Creating new rituals and actions
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
