# 2bd (Second Brain Daemon)

**A personal knowledge system that runs itself—powered by Claude Skills, driven by rituals, stored in markdown.**

## Why 2bd?

Traditional productivity systems depend on you being the engine. They're passive containers waiting for you to fill them. You set up elaborate workflows, miss a day, then a week, and suddenly your second brain is out of date.

2bd flips the script. Instead of you serving your system, your system serves you. **Rituals** run on schedule, **Living Notes** evolve with your life, and everything stays organized in plain markdown files you truly own.

And because everything is plain markdown on your filesystem, AI integration is trivial. No plugins. No APIs. No MCPs. You just point Claude at a folder.

## How It Works

2bd operates on nested time scales, each feeding into the next:

```
Daily ──▶ Weekly ──▶ Monthly ──▶ Quarterly ──▶ Yearly
  ↓          ↓          ↓            ↓            ↓
Small     Tactics   Strategy    Direction    Vision
wins      review    synthesis   reflection   planning
```

**Core rituals** drive the engine:
- **Daily Planning/Review** – What's today? What happened?
- **Weekly Planning/Review** – Tactics and accomplishments
- **Monthly/Quarterly Review** – Patterns and direction
- **Yearly Planning/Review** – Vision and goals

Run rituals from the CLI:
```bash
claude skill run rituals/planning/daily-planning
claude skill run rituals/review/daily-review
```

## Key Concepts

**Rituals** are scheduled routines that drive the system—daily planning, weekly review, etc.

**Actions** are one-shot helpers triggered on-demand—create a project, etc.

**Living Notes** (Day.md, Week.md, Month.md, Quarter.md) are continuously evolving documents updated by rituals.

**Hot/Cold System** separates where you work from where synthesis accumulates:
- **Hot** (`03_Resources/Brain/Hot/`) – Your active workspace. Write here.
- **Cold** (`03_Resources/Brain/Cold/`) – Year-agnostic synthesis. Rituals write here.

**PARA Method** organizes everything: Projects, Areas, Resources, Archives.

## File Organization

```
2bd/
│
├── 01_Projects/             # Active projects (deadline-driven)
│   ├── ✱ Projects.md        # Projects Hub
│   └── YYYY-MM-DD-name.md   # Project files (end-date prefix)
│
├── 02_Areas/                # People and Insights
│   ├── Insights/            # AI-generated thematic patterns (rituals only)
│   │   ├── ✱ Insights.md    # Insights Hub
│   │   └── topic.md
│   └── People/              # Living notes for individuals (user + rituals)
│       ├── ✱ People.md      # People Hub
│       └── FirstNameL.md    # Person files (FirstName + LastInitial)
│
├── 03_Resources/            # Brain and templates
│   ├── _Templates/          # Template library
│   │   ├── current/         # Hot note templates
│   │   ├── para/            # PARA file templates
│   │   ├── resources/       # Cold synthesis templates
│   │   └── archives/        # Archive templates
│   └── Brain/
│       ├── ✱ Home.md        # Central Hub
│       ├── Hot/             # Active workspace (user writes here)
│       │   ├── Day.md
│       │   ├── Week.md
│       │   ├── Month.md
│       │   ├── Quarter.md
│       │   └── Year.md
│       └── Cold/            # Year-agnostic synthesis (rituals write here)
│           ├── Days/        # 366 files: 01-01.md through 12-31.md
│           ├── Months/      # 12 files: 01-january.md through 12-december.md
│           └── Quarters/    # 4 files: q1.md through q4.md
│
├── 04_Archives/             # Backup snapshots
│   ├── Brain/Weekly/        # Archived weekly notes (YYYY/YYYY-Www.md)
│   └── Projects/            # Completed projects
│
└── .claude/skills/          # Claude Skills
    ├── rituals/             # Scheduled routines
    │   ├── planning/        # Forward-looking (daily, weekly, yearly)
    │   └── review/          # Reflective (daily, weekly, monthly, quarterly, yearly)
    └── actions/             # One-shot helpers
```

**Naming Conventions:**
- **Hubs:** `✱` prefix with Title Case (`✱ Home.md`, `✱ Projects.md`)
- **Projects:** End-date first (`YYYY-MM-DD-project-name.md`)
- **People:** FirstName + LastInitial (`EstherS.md`, `JonnyB.md`)
- **Cold Days:** `MM-DD.md` (01-01.md through 12-31.md)
- **Cold Months:** `NN-monthname.md` (01-january.md through 12-december.md)
- **Cold Quarters:** `qN.md` (q1.md through q4.md)

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

Open `03_Resources/Brain/Hot/Day.md` to see your living note.

### Sync

2bd files are just markdown. Store the folder in iCloud, Dropbox, OneDrive, or use Git—sync is an extension, not a requirement.

## Documentation

See [CLAUDE.md](CLAUDE.md) for complete documentation:
- Hot/Cold brain system details
- Editing modes and synthesis workflow
- Creating new rituals and actions
- Obsidian integration and hotkeys

## Philosophy

**Trust the Rituals.** Run them even when you don't feel like it. The magic is in the rhythm.

**Work Only in Hot.** Your Hot notes are messy work-in-progress. Cold and Insights are ritual-generated.

**The System Augments.** It scaffolds your thinking, but you supply the content.

## Acknowledgments

- **Tiago Forte** – [PARA Method](https://fortelabs.com/blog/para/)
- **Andy Matuschak** – [Evergreen Notes](https://notes.andymatuschak.org/Evergreen_notes)
- **Matthias Hilse** – [Forever Notes](https://www.myforevernotes.com/) (Hubs, living documents)
- **Anthropic** – Claude Skills

## License

MIT License. See [LICENSE](LICENSE) for details.
