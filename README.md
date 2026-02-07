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
├── 00_Brain/                # User's active working space
│   └── Current/             # Living temporal notes (user works here)
│       ├── Day.md           # Today's working note
│       ├── Week.md          # This week's working note
│       ├── Month.md         # This month's working note
│       └── Quarter.md       # This quarter's working note
│
├── 01_Projects/             # PARA: Active projects (deadline-driven)
│   ├── 2026-06-30-launch-2bd.md
│   ├── 2026-06-30-q2-okrs.md
│   └── 2026-12-31-home-renovation.md
│
├── 02_Areas/                # PARA: Insights and People living notes
│   ├── Insights/            # Theme-based insights extracted from temporal notes
│   │   ├── leadership.md
│   │   ├── productivity.md
│   │   └── team-dynamics.md
│   └── People/              # Living notes for individuals
│       ├── john-doe.md
│       ├── jane-smith.md
│       └── sarah-chen.md
│
├── 03_Resources/            # PARA: Living historical brain (year-agnostic)
│   ├── _Templates/          # Meta-resource: Template library (underscore prefix)
│   │   ├── current/         # Templates for 00_Brain/Current/ notes
│   │   │   ├── Day.md
│   │   │   ├── Week.md
│   │   │   ├── Month.md
│   │   │   └── Quarter.md
│   │   ├── para/            # Templates for PARA method files
│   │   │   ├── project.md
│   │   │   ├── person.md
│   │   │   └── insight.md
│   │   ├── resources/       # Templates for Resources/Brain/ synthesis notes
│   │   │   ├── day.md
│   │   │   ├── month.md
│   │   │   ├── quarter.md
│   │   │   └── year.md
│   │   └── archives/
│   │       └── week.md
│   └── Brain/
│       ├── Days/            # 366 files: 01-01.md through 12-31.md
│       │   ├── 01-01.md     # Accumulates all Jan 1 synthesis across years
│       │   ├── 01-02.md     # Accumulates all Jan 2 synthesis across years
│       │   ├── 02-05.md
│       │   └── ...          # (through 12-31.md)
│       ├── Months/          # 12 files: 01-january.md through 12-december.md
│       │   ├── 01-january.md   # Accumulates all January synthesis across years
│       │   ├── 02-february.md
│       │   └── ...             # (through 12-december.md)
│       ├── Quarters/        # 4 files: q1.md through q4.md
│       │   ├── q1.md        # Accumulates all Q1 synthesis across years
│       │   ├── q2.md
│       │   ├── q3.md
│       │   └── q4.md
│       └── Year.md          # Multi-year accumulation of yearly synthesis
│
├── 04_Archives/             # PARA: Backup snapshots (ephemeral notes only)
│   ├── Brain/
│   │   └── Weekly/          # Archived weekly notes (ISO 8601: YYYY-Www.md)
│   │       └── 2026/
│   │           ├── 2026-W01.md
│   │           ├── 2026-W02.md
│   │           └── ...
│   └── Projects/            # Completed projects
│       └── 2025-12-15-old-website.md
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
- **Meta-resources:** Underscore prefix for system/template files: `_Templates/`, `_Guides/`
- **Current Working Notes:** In `00_Brain/Current/`, capitalized (Day.md, Week.md, Month.md, Quarter.md)
- **Resources Brain (Year-Agnostic Living Notes):**
  - Days: `MM-DD.md` format (01-01.md through 12-31.md, includes leap day 02-29.md)
  - Months: `NN-monthname.md` format (01-january.md through 12-december.md)
  - Quarters: `qN.md` format (q1.md through q4.md)
  - Year: `Year.md` (single file, multi-year accumulation)
- **People:** In `02_Areas/People/`, lowercase-with-hyphens (john-doe.md, jane-smith.md)
- **Insights:** In `02_Areas/Insights/`, lowercase-with-hyphens (leadership.md, productivity.md)
- **Projects:** End-date first for lexical sorting: `YYYY-MM-DD-project-name.md`
- **Archives (Weekly):** ISO 8601 week format: `YYYY/YYYY-Www.md` (e.g., 2026/2026-W06.md)
- **Folders:** Numbered for sorting (`00_`, `01_`, `02_`, `03_`, `04_`)
- **Skills:** Each skill in own folder with `SKILL.md` and optional supporting files (templates, examples, scripts)

**System Architecture:**

**Two-Tier Brain System:**
- **Tier 1 (00_Brain/Current/)** - Your active working space. Write here throughout the day/week/month/quarter. Messy, unstructured, stream of consciousness is OK. Rituals read from here.
- **Tier 2 (03_Resources/Brain/)** - Living historical notes that accumulate synthesis **across years**. Rituals write synthesized content here. Structured, curated, high-signal.

**Year-Agnostic Accumulation:**
- `03_Resources/Brain/Days/02-15.md` contains synthesis from **ALL** Feb 15ths (2026, 2027, 2028...)
- `03_Resources/Brain/Months/03-march.md` contains synthesis from **ALL** Marchs across years
- Enables long-term pattern recognition: "What do I always work on in Q4?" or "What happens every February 15th?"
- Multi-year insights emerge naturally over time

**Synthesis Workflow:**
1. User works in `00_Brain/Current/` notes (Day, Week, Month, Quarter)
2. Review rituals extract and synthesize:
   - Temporal patterns → append to `03_Resources/Brain/{period}/{file}.md`
   - Thematic insights → append to `02_Areas/Insights/{theme}.md`
   - People mentions → append to `02_Areas/People/{person}.md`
   - Project updates → append to `01_Projects/{project}.md`
3. Week notes get backed up to `04_Archives/Brain/Weekly/` (ephemeral safety net)
4. Current note cleared for next period

**Ephemeral vs. Living:**
- **Week notes** are ephemeral → backed up to Archives, synthesis goes to monthly Resources note
- **Day/Month/Quarter notes** go directly to Resources (living, accumulating notes)
- No archives needed for Day/Month/Quarter - they live forever in Resources/Brain

**Inspiration:** This organization is inspired by Tiago Forte's PARA method, adapted for automated ritual-driven maintenance with year-agnostic pattern recognition.

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

## Quick Start: Using Templates

2bd includes comprehensive templates for all note types in [03_Resources/_Templates/](03_Resources/_Templates/). Templates provide structure, YAML frontmatter, and placeholder text to guide your usage.

### Template Categories

**Current Working Notes** (`_Templates/current/`)
- [Day.md](03_Resources/_Templates/current/Day.md) - Daily working note with priorities, meetings, wins, and insights
- [Week.md](03_Resources/_Templates/current/Week.md) - Weekly planning and daily journaling
- [Month.md](03_Resources/_Templates/current/Month.md) - Monthly overview and weekly progress tracking
- [Quarter.md](03_Resources/_Templates/current/Quarter.md) - Quarterly strategic planning and monthly progress

**PARA Method** (`_Templates/para/`)
- [project.md](03_Resources/_Templates/para/project.md) - Project template with outcomes, milestones, and updates
- [person.md](03_Resources/_Templates/para/person.md) - People note with interactions and relationship tracking
- [insight.md](03_Resources/_Templates/para/insight.md) - Theme-based insights with patterns and learnings

**Synthesis Notes** (`_Templates/resources/`)
- [day.md](03_Resources/_Templates/resources/day.md) - Year-agnostic daily synthesis template
- [month.md](03_Resources/_Templates/resources/month.md) - Year-agnostic monthly synthesis template
- [quarter.md](03_Resources/_Templates/resources/quarter.md) - Year-agnostic quarterly synthesis template
- [year.md](03_Resources/_Templates/resources/year.md) - Multi-year accumulation template

**Archives** (`_Templates/archives/`)
- [week.md](03_Resources/_Templates/archives/week.md) - Weekly archive snapshot template

### Using Templates

**For Current Working Notes:**
```bash
# Copy template to start a new working note
cp 03_Resources/_Templates/current/Day.md 00_Brain/Current/Day.md
```

**For Projects:**
```bash
# Create new project from template
cp 03_Resources/_Templates/para/project.md 01_Projects/2026-12-31-my-project.md
# Edit to fill in your project details
```

**For People Notes:**
```bash
# Create new person note
cp 03_Resources/_Templates/para/person.md 02_Areas/People/john-doe.md
```

**For Insights:**
```bash
# Create new insight theme
cp 03_Resources/_Templates/para/insight.md 02_Areas/Insights/leadership.md
```

Templates use placeholder text in brackets `[like this]` to guide what content to add. Replace placeholders with your actual content.

**Note on Synthesis Templates:** The `_Templates/resources/` templates are used by rituals when appending synthesized content to year-agnostic living notes. You typically won't copy these manually—rituals use them as reference for the structure when creating new entries.

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
