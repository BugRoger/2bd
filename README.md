# 2bd (Second Brain Daemon)

**A personal knowledge system that runs itself—powered by Claude Skills, driven by rituals, stored in markdown.**

---

## Why 2bd?

You've tried bullet journals, Notion templates, and weekly reminders. They work... until they don't. The problem isn't your system—it's that systems require constant manual maintenance. You set up elaborate workflows, create beautiful templates, and promise yourself you'll stick with it this time. But life gets busy, you miss a day, then a week, and suddenly your second brain is out of date and useless.

The real issue is that traditional productivity systems depend on you being the engine. They're passive containers waiting for you to fill them. But what if your system could run itself? What if scheduled rituals automatically updated living documents, synthesizing your work into insights without you lifting a finger?

2bd flips the script. Instead of you serving your system, your system serves you. Rituals run on schedule, Living Notes evolve with your life, and everything stays organized in plain markdown files you truly own. This is a second brain that actually remembers—so you don't have to.

---

## What is 2bd?

**2bd is a personal knowledge system that uses Claude Skills to automate productivity rituals.** It maintains **Living Notes** (Today.md, Week.md, etc.) through scheduled **Rituals**, organizing everything using the **PARA method** in plain markdown files.

Think of it as:
- **A self-running second brain** that doesn't rely on your memory or discipline
- **An automated journaling system** that reflects on your life at multiple time scales
- **A knowledge synthesis engine** that turns scattered information into coherent insights

**Who it's for:** Power users, productivity enthusiasts, second brain practitioners, and anyone comfortable with CLI tools who wants their knowledge system to work *for* them, not the other way around.

---

## How It Works

2bd is built on a simple architecture:

```
User
  ↓
Invokes Skill ──→ Claude (via CLI or Web)
  ↓
Skill reads context:
  • Previous Living Notes
  • Calendar events
  • Task lists
  • Project status
  ↓
Claude generates/updates content
  ↓
Archives old version
  ↓
Writes new content to Living Note
  ↓
Syncs automatically (cloud services or custom ritual)
```

**Key Principles:**
- **No Databases, No Servers:** Everything is a markdown file in your filesystem
- **Data Ownership:** Your files live on your machine, sync is optional
- **Claude as Processor:** Claude reads, processes, and writes back—every run is stateless
- **Skills as Programs:** Rituals drive the engine, Actions are one-shot helpers

---

## The Productivity Loop

2bd operates on multiple nested time scales, each feeding into the next:

```
Daily ──▶ Weekly ──▶ Monthly ──▶ Quarterly ──▶ Yearly
  ↓          ↓          ↓            ↓            ↓
Small     Tactics   Strategy    Direction    Vision
wins      review    synthesis   reflection   planning
```

**How it works:**
- **Daily:** What happened today? What's next? (5-10 min) → feeds Weekly
- **Weekly:** What did I accomplish? What's this week's priority? (20-30 min) → feeds Monthly
- **Monthly:** What patterns emerged? What needs adjustment? (45-60 min) → feeds Quarterly
- **Quarterly:** Am I on track? What's working? What isn't? (1-2 hrs) → feeds Yearly
- **Yearly:** What's my vision? What will define this year? (2-3 hrs) → sets context for Daily

**Compound Clarity:** Small wins become patterns, patterns become insights, insights become strategy, strategy becomes vision.

You're not just logging—you're synthesizing. And rituals automate the synthesis.

---

## Key Concepts

### Claude Skills

Claude Skills are specialized capabilities that Claude invokes like programs. In 2bd, every ritual and action is a skill that Claude runs autonomously.

### Rituals vs. Actions

**Rituals** are scheduled, recurring operations that drive the engine:
- Daily Planning, Daily Review, Weekly Planning, Weekly Review, Monthly Review, Quarterly Review, Yearly Planning, Yearly Review

**Actions** are discrete, one-shot helpers you trigger when needed:
- Create New Project

Rituals often compose actions as building blocks.

### Living Notes

Living Notes are continuously evolving documents (Today.md, Week.md, etc.) that get updated by rituals. Instead of creating new files daily, a single file gets refreshed and the previous version is archived.

**The Hybrid Approach:** Before updating, 2bd saves a snapshot to Archives. You get a living dashboard AND a historical record.

### PARA Method

2bd follows Tiago Forte's PARA method (Projects, Areas, Resources, Archives) for organizing information by actionability.

---

## File Organization

2bd creates and maintains this structure:

```
2bd/
│
├── 00_Brain/                # System files and temporal organization
│   ├── Current/             # Active Living Notes
│   │   ├── Today.md
│   │   ├── Week.md
│   │   ├── Month.md
│   │   ├── Quarter.md
│   │   └── Year.md
│   ├── Day/                 # Daily templates for each day of the month (01-31)
│   │   ├── day-01.md
│   │   ├── day-02.md
│   │   ├── day-15.md
│   │   └── ...
│   ├── Month/               # Monthly templates (january-december)
│   │   ├── january.md
│   │   ├── june.md
│   │   └── ...
│   └── Quarter/             # Quarterly templates (q1-q4)
│       ├── q1.md
│       ├── q2.md
│       └── ...
│
├── 01_Projects/             # PARA: Active projects (deadline-driven)
│   ├── 2026-06-30-launch-2bd.md
│   ├── 2026-06-30-q2-okrs.md
│   └── 2026-12-31-home-renovation.md
│
├── 02_Areas/                # PARA: Ongoing responsibilities (no end date)
│   ├── Health/
│   │   ├── fitness.md
│   │   ├── nutrition.md
│   │   └── mental-health.md
│   ├── Career/
│   │   ├── skills.md
│   │   ├── networking.md
│   │   └── goals.md
│   └── Relationships/
│       ├── family.md
│       ├── friends.md
│       └── partner.md
│
├── 03_Resources/            # PARA: Reference materials and interests
│   ├── productivity-methods.md
│   ├── leadership-notes.md
│   └── technical-reading.md
│
├── 04_Archives/             # PARA: Completed/inactive items
│   ├── Daily/               # Archived daily notes (year/month subfolder structure)
│   │   ├── 2026/
│   │   │   ├── 02/
│   │   │   │   ├── 2026-02-01.md
│   │   │   │   └── 2026-02-15.md
│   │   │   └── 01/
│   │   │       └── 2026-01-15.md
│   │   └── 2025/
│   │       └── 12/
│   │           └── 2025-12-31.md
│   ├── Monthly/             # Archived monthly notes (year subfolder structure)
│   │   ├── 2026/
│   │   │   ├── 2026-02.md
│   │   │   └── 2026-01.md
│   │   └── 2025/
│   │       └── 2025-12.md
│   ├── Quarterly/           # Archived quarterly notes (ISO 8601: YYYY-Qn)
│   │   ├── 2026-Q1.md
│   │   ├── 2025-Q4.md
│   │   └── 2025-Q3.md
│   ├── Yearly/              # Archived yearly notes (ISO 8601: YYYY)
│   │   ├── 2026.md
│   │   ├── 2025.md
│   │   └── 2024.md
│   ├── Projects/
│   │   └── 2025-12-15-old-website.md
│   ├── Areas/
│   │   └── side-business.md
│   └── Resources/
│       └── old-frameworks.md
│
└── .claude/                 # Claude-specific configuration
    └── skills/
        ├── rituals/         # Scheduled routine skills
        │   ├── planning/    # Forward-looking rituals
        │   │   ├── daily-planning/
        │   │   │   └── SKILL.md
        │   │   ├── weekly-planning/
        │   │   │   └── SKILL.md
        │   │   └── yearly-planning/
        │   │       └── SKILL.md
        │   └── review/      # Reflective rituals
        │       ├── daily-review/
        │       │   └── SKILL.md
        │       ├── weekly-review/
        │       │   └── SKILL.md
        │       ├── monthly-review/
        │       │   └── SKILL.md
        │       ├── quarterly-review/
        │       │   └── SKILL.md
        │       └── yearly-review/
        │           └── SKILL.md
        └── actions/         # One-shot helper skills
            └── create-project/
                └── SKILL.md
```

**Naming Conventions:**
- **Living Notes:** In `00_Brain/Current/`, singular capitalized (Today.md, Week.md, Month.md, Quarter.md, Year.md)
- **Archived Notes:**
  - Daily: `YYYY/MM/YYYY-MM-DD.md` (year/month subfolder structure)
  - Monthly: `YYYY/YYYY-MM.md` (year subfolder structure)
  - Quarterly: `YYYY-Qn.md` (flat structure)
  - Yearly: `YYYY.md` (flat structure)
- **Projects:** End-date first for lexical sorting: `YYYY-MM-DD-project-name.md`
- **Areas:** Organized in subfolders by life domain with related files
- **Resources:** Single file: `topic-name.md`
- **Folders:** Numbered for sorting (`00_`, `01_`, `02_`, `03_`, `04_`)
- **Skills:** Each skill in own folder with `SKILL.md` and optional supporting files (templates, examples, scripts)

**System Folders:**
- `00_Brain/Current/` - Active Living Notes updated by rituals
- `00_Brain/Day/` - Daily templates (day-01.md through day-31.md) for each day of the month
- `00_Brain/Month/` - Monthly templates (january.md through december.md)
- `00_Brain/Quarter/` - Quarterly templates (q1.md through q4.md)
- Yearly ritual condenses and archives at year-end

**Inspiration:** This organization is inspired by Tiago Forte's PARA method, adapted for automated ritual-driven maintenance.

---

## Getting Started

### Prerequisites

- Claude Code CLI or Claude.ai with Skills enabled
- Markdown editor (VS Code, Obsidian, any text editor)
- Cloud storage (iCloud, OneDrive, Dropbox) or Git for sync (optional but recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/2bd.git
cd 2bd

# Initialize the PARA structure
./scripts/init-para.sh
```

### Sync

2bd files are just markdown on your filesystem. Sync happens automatically if you store the folder in:
- **iCloud Drive** (`~/Library/Mobile Documents/com~apple~CloudDocs/2bd`)
- **OneDrive** (`~/OneDrive/2bd`)
- **Dropbox** (`~/Dropbox/2bd`)

Alternatively, use Git and add a custom ritual that commits and pushes changes. Sync is an extension—the core system doesn't care where files live.

### Run Your First Ritual

```bash
claude skill run rituals/daily-review
```

Open [00_Brain/Current/Today.md](00_Brain/Current/Today.md) to see your first Living Note. Run this ritual every morning or evening to keep it current.

---

## Core Rituals

Each ritual is a scheduled operation that drives the productivity loop:

| Ritual | When | Purpose | Duration |
|--------|------|---------|----------|
| **Daily Planning** | Every morning | Plan today's priorities and intentions | 5-10 min |
| **Daily Review** | Every evening | Reflect on yesterday, capture learnings | 5-10 min |
| **Weekly Planning** | Every Monday | Set this week's priorities and focus | 20-30 min |
| **Weekly Review** | Every Sunday | Reflect on last week, synthesize wins and lessons | 20-30 min |
| **Monthly Review** | First of month | Synthesize patterns, review projects | 45-60 min |
| **Quarterly Review** | Every 3 months | Assess direction, review goals | 1-2 hrs |
| **Yearly Planning** | January 1 | Set vision, define annual goals | 2-3 hrs |
| **Yearly Review** | December 31 | Reflect on the year, capture insights | 2-3 hrs |

**Usage:**
```bash
claude skill run rituals/planning/daily-planning
claude skill run rituals/review/daily-review
claude skill run rituals/planning/weekly-planning
claude skill run rituals/review/weekly-review
claude skill run rituals/review/monthly-review
claude skill run rituals/review/quarterly-review
claude skill run rituals/planning/yearly-planning
claude skill run rituals/review/yearly-review
```

---

## Common Actions

Actions are one-shot helpers you invoke on-demand:

| Action | Purpose | Usage |
|--------|---------|-------|
| **Create Project** | Initialize new project file with end-date | `claude skill run actions/create-project --args "Project Name" --end-date "2026-12-31"` |

---

## Philosophy

**Trust the Rituals:** Run them even when you don't feel like it. The magic is in the rhythm, not the motivation.

**Living Notes Are Messy:** They're working documents, not publications. The archives preserve history; the Living Note is for right now.

**Archive Liberally:** Keep your workspace lean and focused on what matters now.

**The System Augments:** It scaffolds your thinking, but you supply the insights.

*"2bd is not a second brain—it's scaffolding for your first brain. The rituals create rhythm, the Living Notes provide continuity, and the markdown keeps you in control."*

---

## Acknowledgments

**2bd stands on the shoulders of giants:**

- **Tiago Forte** for the [PARA Method](https://fortelabs.com/blog/para/) - organizational framework
- **Andy Matuschak** for [Evergreen Notes](https://notes.andymatuschak.org/Evergreen_notes) - inspiration for Living Notes
- **Niklas Luhmann** for the [Zettelkasten Method](https://zettelkasten.de/introduction/) - interconnected notes
- **The Obsidian Community** for [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) - temporal organization
- **Matthias Hilse** for [Forever Notes](https://www.myforevernotes.com/) - organized note systems
- **Anthropic** for Claude Skills

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**Welcome to 2bd. Your second brain just learned to run itself.*
