# Orchestrator Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign skill orchestration to use pure declarative prose with markdown-based context assembly instead of JSON parsing and variable interpolation.

**Architecture:** Skills declare needs in prose ("What I Need" sections), orchestrator resolves arguments and spawns subagents to fulfill needs, session directory contains only external data with memory.md as index, inline phases read markdown incrementally.

**Tech Stack:** Python, markdown parsing, Claude Code Task tool, file I/O

---

## Task 1: Create Session Management

**Files:**
- Create: `.claude/skills/_core/orchestrator/session.py`
- Test: `.claude/skills/_core/orchestrator/test_session.py`

**Step 1: Write the failing test**

```python
# test_session.py
import pytest
from pathlib import Path
from session import Session

def test_session_creates_temp_directory():
    session = Session.create("planning-daily")
    assert session.directory.exists()
    assert session.directory.name.startswith("2bd-session-")
    session.cleanup()

def test_session_tracks_files():
    session = Session.create("test-skill")
    session.add_file("calendar.md", "# Calendar\nEvent 1")

    assert "calendar.md" in session.files
    assert session.read_file("calendar.md") == "# Calendar\nEvent 1"
    session.cleanup()

def test_session_writes_memory():
    session = Session.create("test-skill")
    session.add_external_data("calendar.md", "3 events")
    session.add_vault_reference("Week.md", "/vault/Week.md", exists=True)
    session.write_memory()

    memory = session.read_file("memory.md")
    assert "calendar.md" in memory
    assert "/vault/Week.md" in memory
    session.cleanup()
```

**Step 2: Run test to verify it fails**

Run: `pytest .claude/skills/_core/orchestrator/test_session.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'session'"

**Step 3: Write minimal implementation**

```python
# session.py
import tempfile
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class Session:
    def __init__(self, directory: Path, skill_name: str):
        self.directory = directory
        self.skill_name = skill_name
        self.files: List[str] = []
        self.external_data: Dict[str, str] = {}  # filename -> description
        self.vault_refs: Dict[str, tuple] = {}   # name -> (path, exists)

    @classmethod
    def create(cls, skill_name: str) -> 'Session':
        """Create a new session with temp directory."""
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        session_dir = Path(tempfile.gettempdir()) / f"2bd-session-{skill_name}-{timestamp}"
        session_dir.mkdir(parents=True, exist_ok=True)
        return cls(session_dir, skill_name)

    def add_file(self, filename: str, content: str):
        """Write a file to session directory."""
        filepath = self.directory / filename
        filepath.write_text(content)
        self.files.append(filename)

    def read_file(self, filename: str) -> str:
        """Read a file from session directory."""
        filepath = self.directory / filename
        return filepath.read_text()

    def add_external_data(self, filename: str, description: str):
        """Track external data file."""
        self.external_data[filename] = description

    def add_vault_reference(self, name: str, path: str, exists: bool):
        """Track vault file reference."""
        self.vault_refs[name] = (path, exists)

    def write_memory(self):
        """Generate memory.md index."""
        lines = [f"# Session Memory: {self.skill_name}\n"]

        if self.external_data:
            lines.append("## External Data Available\n")
            for filename, desc in self.external_data.items():
                lines.append(f"### {filename}\n{desc}\n")

        if self.vault_refs:
            lines.append("## Vault Files Available\n")
            for name, (path, exists) in self.vault_refs.items():
                status = "✓" if exists else "✗"
                lines.append(f"- **{name}**: {path} {status}\n")

        self.add_file("memory.md", "\n".join(lines))

    def cleanup(self):
        """Remove session directory."""
        import shutil
        if self.directory.exists():
            shutil.rmtree(self.directory)
```

**Step 4: Run test to verify it passes**

Run: `pytest .claude/skills/_core/orchestrator/test_session.py -v`
Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add .claude/skills/_core/orchestrator/session.py .claude/skills/_core/orchestrator/test_session.py
git commit -m "feat(orchestrator): add session management with memory.md"
```

---

## Task 2: Create Argument Resolution

**Files:**
- Create: `.claude/skills/_core/orchestrator/resolver.py`
- Test: `.claude/skills/_core/orchestrator/test_resolver.py`

**Step 1: Write the failing test**

```python
# test_resolver.py
import pytest
from datetime import date
from resolver import ArgumentResolver

def test_resolve_empty_to_today():
    resolver = ArgumentResolver(today=date(2026, 2, 15))
    result = resolver.resolve("")

    assert result.target_date == date(2026, 2, 15)
    assert result.scope == "day"
    assert result.relative == "today"

def test_resolve_tomorrow():
    resolver = ArgumentResolver(today=date(2026, 2, 15))
    result = resolver.resolve("tomorrow")

    assert result.target_date == date(2026, 2, 16)
    assert result.scope == "day"
    assert result.relative == "tomorrow"

def test_resolve_next_monday():
    resolver = ArgumentResolver(today=date(2026, 2, 15))  # Saturday
    result = resolver.resolve("next monday")

    assert result.target_date == date(2026, 2, 17)
    assert result.day_of_week == "Monday"
    assert result.relative == "next monday"

def test_resolve_last_week():
    resolver = ArgumentResolver(today=date(2026, 2, 15))
    result = resolver.resolve("last week")

    assert result.scope == "week"
    assert result.week_start == date(2026, 2, 3)
    assert result.week_end == date(2026, 2, 9)
    assert len(result.workdays) == 5

def test_resolve_specific_date():
    resolver = ArgumentResolver(today=date(2026, 2, 15))
    result = resolver.resolve("2026-03-20")

    assert result.target_date == date(2026, 3, 20)
    assert result.scope == "day"
```

**Step 2: Run test to verify it fails**

Run: `pytest .claude/skills/_core/orchestrator/test_resolver.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'resolver'"

**Step 3: Write minimal implementation**

```python
# resolver.py
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional, List
import re

@dataclass
class ResolvedTime:
    target_date: Optional[date]
    scope: str  # "day" or "week"
    relative: str
    day_of_week: Optional[str] = None
    week: Optional[str] = None
    week_start: Optional[date] = None
    week_end: Optional[date] = None
    workdays: Optional[List[date]] = None

class ArgumentResolver:
    def __init__(self, today: date):
        self.today = today

    def resolve(self, arg: str) -> ResolvedTime:
        """Resolve flexible time expression to concrete dates."""
        arg = arg.strip().lower()

        # Empty -> today
        if not arg:
            return ResolvedTime(
                target_date=self.today,
                scope="day",
                relative="today"
            )

        # Tomorrow
        if arg == "tomorrow":
            return ResolvedTime(
                target_date=self.today + timedelta(days=1),
                scope="day",
                relative="tomorrow"
            )

        # Next [weekday]
        if arg.startswith("next "):
            weekday = arg[5:]
            target = self._next_weekday(weekday)
            return ResolvedTime(
                target_date=target,
                scope="day",
                relative=arg,
                day_of_week=weekday.capitalize()
            )

        # Last week
        if arg == "last week":
            week_start = self.today - timedelta(days=self.today.weekday() + 7)
            week_end = week_start + timedelta(days=6)
            workdays = [week_start + timedelta(days=i) for i in range(5)]

            return ResolvedTime(
                target_date=None,
                scope="week",
                relative="last week",
                week_start=week_start,
                week_end=week_end,
                workdays=workdays
            )

        # Specific date (YYYY-MM-DD)
        if re.match(r'\d{4}-\d{2}-\d{2}', arg):
            target = date.fromisoformat(arg)
            return ResolvedTime(
                target_date=target,
                scope="day",
                relative=arg
            )

        raise ValueError(f"Cannot parse time expression: {arg}")

    def _next_weekday(self, weekday: str) -> date:
        """Find next occurrence of weekday."""
        days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        target_idx = days.index(weekday)
        current_idx = self.today.weekday()

        days_ahead = (target_idx - current_idx) % 7
        if days_ahead == 0:
            days_ahead = 7  # Next week's occurrence

        return self.today + timedelta(days=days_ahead)
```

**Step 4: Run test to verify it passes**

Run: `pytest .claude/skills/_core/orchestrator/test_resolver.py -v`
Expected: PASS (all 5 tests)

**Step 5: Commit**

```bash
git add .claude/skills/_core/orchestrator/resolver.py .claude/skills/_core/orchestrator/test_resolver.py
git commit -m "feat(orchestrator): add flexible time argument resolution"
```

---

## Task 3: Create Need Parser

**Files:**
- Create: `.claude/skills/_core/orchestrator/parser.py`
- Test: `.claude/skills/_core/orchestrator/test_parser.py`

**Step 1: Write the failing test**

```python
# test_parser.py
import pytest
from parser import NeedParser, Need, NeedType

def test_parse_calendar_need():
    skill_content = """
## What I Need

- Calendar events for the day
"""
    parser = NeedParser()
    needs = parser.parse(skill_content)

    assert len(needs) == 1
    assert needs[0].type == NeedType.CALENDAR
    assert needs[0].description == "Calendar events for the day"

def test_parse_vault_file_needs():
    skill_content = """
## What I Need

- Today.md file for this day
- Week.md for weekly context
- Month.md for monthly context
"""
    parser = NeedParser()
    needs = parser.parse(skill_content)

    assert len(needs) == 3
    assert needs[0].type == NeedType.VAULT_FILE
    assert "Today.md" in needs[0].description

def test_parse_entity_needs():
    skill_content = """
## What I Need

- People files for anyone with 1:1 meetings
- Active project files
"""
    parser = NeedParser()
    needs = parser.parse(skill_content)

    assert len(needs) == 2
    assert needs[0].type == NeedType.PEOPLE
    assert needs[1].type == NeedType.PROJECTS
```

**Step 2: Run test to verify it fails**

Run: `pytest .claude/skills/_core/orchestrator/test_parser.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'parser'"

**Step 3: Write minimal implementation**

```python
# parser.py
from dataclasses import dataclass
from enum import Enum
from typing import List
import re

class NeedType(Enum):
    CALENDAR = "calendar"
    QMD = "qmd"
    VAULT_FILE = "vault_file"
    PEOPLE = "people"
    PROJECTS = "projects"
    DIRECTIVES = "directives"

@dataclass
class Need:
    type: NeedType
    description: str

class NeedParser:
    def parse(self, skill_content: str) -> List[Need]:
        """Extract needs from skill's 'What I Need' section."""
        needs = []

        # Find "What I Need" section
        match = re.search(r'## What I Need\s*\n(.*?)(?=\n##|\Z)', skill_content, re.DOTALL)
        if not match:
            return needs

        section = match.group(1)

        # Parse bullet points
        for line in section.split('\n'):
            line = line.strip()
            if not line.startswith('-'):
                continue

            desc = line[1:].strip()
            need_type = self._classify_need(desc)
            needs.append(Need(type=need_type, description=desc))

        return needs

    def _classify_need(self, description: str) -> NeedType:
        """Classify need based on keywords."""
        desc_lower = description.lower()

        if "calendar" in desc_lower:
            return NeedType.CALENDAR
        elif "qmd" in desc_lower or "search" in desc_lower:
            return NeedType.QMD
        elif "people" in desc_lower:
            return NeedType.PEOPLE
        elif "project" in desc_lower:
            return NeedType.PROJECTS
        elif "directive" in desc_lower or "preference" in desc_lower:
            return NeedType.DIRECTIVES
        else:
            # Default: vault file reference
            return NeedType.VAULT_FILE
```

**Step 4: Run test to verify it passes**

Run: `pytest .claude/skills/_core/orchestrator/test_parser.py -v`
Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add .claude/skills/_core/orchestrator/parser.py .claude/skills/_core/orchestrator/test_parser.py
git commit -m "feat(orchestrator): add skill needs parser"
```

---

## Task 4: Create Reference Resolver Sub-Skill

**Files:**
- Create: `.claude/skills/_sub/resolve-references/SKILL.md`

**Step 1: Write sub-skill specification**

```markdown
---
name: resolve-references
description: Resolve vault file paths based on declarative needs and session context
disable-model-invocation: false
allowed-tools: Read, Glob, Bash(ls)
---

# Resolve References Sub-Skill

Discover vault file paths based on needs declared in the main skill.

## Prerequisites

- Session directory exists with dates.md (if time-scoped)
- Config available for vault path resolution
- External data files (calendar.md, etc.) if entity resolution needed

## Inputs

You will receive:
1. Prose needs from the main skill's "What I Need" section
2. Session directory path
3. Resolved time context (if applicable)

## Tasks

### Static Vault Files

For needs like "Week.md" or "Month.md", resolve standard vault paths:
- Week.md → $VAULT/00_Brain/Captive/Week.md
- Month.md → $VAULT/00_Brain/Captive/Month.md
- Quarter.md → $VAULT/00_Brain/Captive/Quarter.md
- Today.md → $VAULT/00_Brain/Captive/Today.md (for target date)

Check if each file exists.

### Entity Resolution

For needs like "People files for 1:1 meetings":
1. Read calendar.md from session
2. Extract person names from 1:1 meeting titles
3. Scan $VAULT/02_Areas/People/ for matching .md files
4. Return full paths with existence status

For needs like "Active project files":
1. Scan $VAULT/01_Projects/ for .md files
2. Read frontmatter to check status (active/completed/archived)
3. Return full paths for active projects

### Daily Archives

For needs like "All daily archive files for the week":
1. Read dates.md from session to get workdays list
2. For each workday, resolve path: $VAULT/00_Brain/Periodic/Daily/{date}.md
3. Check existence for each

## Output Format

Write results as markdown with full paths and status:

```markdown
## Static References
- **Week.md**: /Users/me/vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /Users/me/vault/00_Brain/Captive/Month.md ✓
- **Today.md**: /Users/me/vault/00_Brain/Captive/Today.md ✗ (new file)

## People (from calendar 1:1s)
- **Sarah Chen**: /Users/me/vault/02_Areas/People/Sarah Chen.md ✓
- **John Smith**: /Users/me/vault/02_Areas/People/John Smith.md ✗ (suggest creating)

## Projects (active)
- **quarterly-planning**: /Users/me/vault/01_Projects/2026-03-31-quarterly-planning.md ✓
- **hiring-round**: /Users/me/vault/01_Projects/2026-02-20-hiring-round.md ✓
```

Return this to the orchestrator to include in memory.md.
```

**Step 2: Commit**

```bash
git add .claude/skills/_sub/resolve-references/SKILL.md
git commit -m "feat(sub-skill): add resolve-references for vault path discovery"
```

---

## Task 5: Create Orchestrator Core

**Files:**
- Create: `.claude/skills/_core/orchestrator/orchestrator.py`
- Test: `.claude/skills/_core/orchestrator/test_orchestrator.py`

**Step 1: Write the failing test**

```python
# test_orchestrator.py
import pytest
from pathlib import Path
from orchestrator import Orchestrator

@pytest.fixture
def mock_skill():
    return """---
name: test-skill
---

# Test Skill

## What I Need

- Calendar events for the day
- Week.md for weekly context

## Planning Session

Greet the user.
Review their calendar.
"""

def test_orchestrator_creates_session(mock_skill):
    orch = Orchestrator(skill_content=mock_skill, arguments="tomorrow")

    assert orch.session is not None
    assert orch.session.directory.exists()

    orch.cleanup()

def test_orchestrator_resolves_arguments(mock_skill):
    orch = Orchestrator(skill_content=mock_skill, arguments="tomorrow")

    assert orch.resolved_time.relative == "tomorrow"
    assert orch.resolved_time.scope == "day"

    orch.cleanup()

def test_orchestrator_parses_needs(mock_skill):
    orch = Orchestrator(skill_content=mock_skill, arguments="")

    needs = orch.needs
    assert len(needs) == 2
    assert any("calendar" in n.description.lower() for n in needs)

    orch.cleanup()
```

**Step 2: Run test to verify it fails**

Run: `pytest .claude/skills/_core/orchestrator/test_orchestrator.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'orchestrator'"

**Step 3: Write minimal implementation**

```python
# orchestrator.py
from pathlib import Path
from datetime import date
from typing import Optional
from session import Session
from resolver import ArgumentResolver, ResolvedTime
from parser import NeedParser, Need

class Orchestrator:
    def __init__(self, skill_content: str, arguments: str, today: Optional[date] = None):
        # Parse skill metadata
        self.skill_content = skill_content
        self.skill_name = self._extract_skill_name()

        # Create session
        self.session = Session.create(self.skill_name)

        # Resolve time arguments
        resolver = ArgumentResolver(today or date.today())
        self.resolved_time = resolver.resolve(arguments)
        self._write_dates_file()

        # Parse needs
        parser = NeedParser()
        self.needs = parser.parse(skill_content)

    def _extract_skill_name(self) -> str:
        """Extract skill name from frontmatter."""
        import re
        match = re.search(r'name:\s*(\S+)', self.skill_content)
        return match.group(1) if match else "unknown"

    def _write_dates_file(self):
        """Write dates.md for internal coordination."""
        lines = ["# Date Context\n"]

        if self.resolved_time.target_date:
            lines.append(f"target_date: {self.resolved_time.target_date.isoformat()}\n")

        lines.append(f"scope: {self.resolved_time.scope}\n")
        lines.append(f"relative: {self.resolved_time.relative}\n")

        if self.resolved_time.week_start:
            lines.append(f"week_start: {self.resolved_time.week_start.isoformat()}\n")
            lines.append(f"week_end: {self.resolved_time.week_end.isoformat()}\n")

        if self.resolved_time.workdays:
            lines.append("workdays:\n")
            for day in self.resolved_time.workdays:
                lines.append(f"  - {day.isoformat()}\n")

        self.session.add_file("dates.md", "".join(lines))

    def cleanup(self):
        """Clean up session."""
        self.session.cleanup()
```

**Step 4: Run test to verify it passes**

Run: `pytest .claude/skills/_core/orchestrator/test_orchestrator.py -v`
Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add .claude/skills/_core/orchestrator/orchestrator.py .claude/skills/_core/orchestrator/test_orchestrator.py
git commit -m "feat(orchestrator): add core orchestrator with session and need parsing"
```

---

## Task 6: Integrate with Claude Code Skill Execution

**Files:**
- Modify: `.claude/skills/_core/orchestrator/SKILL.md`

**Step 1: Read current orchestrator skill**

Run: `cat .claude/skills/_core/orchestrator/SKILL.md`

**Step 2: Update orchestrator skill to use new implementation**

```markdown
---
name: orchestrator
description: Internal orchestrator for executing skills with prose-driven context assembly
disable-model-invocation: false
internal: true
---

# Orchestrator

This orchestrator executes skills that declare needs in prose. It handles argument resolution, spawns subagents to fulfill needs, and builds session context.

## Execution Flow

### 1. Initialization

When a skill is invoked:
- Create session directory
- Parse arguments and resolve to concrete dates
- Write dates.md for internal coordination
- Parse skill's "What I Need" section

### 2. Fulfill Needs

For each need, determine fulfillment strategy:

| Need Type | Fulfillment |
|-----------|-------------|
| Calendar events | Spawn `_sub/fetch-calendar` with resolved date |
| QMD search | Spawn `_sub/fetch-resources` |
| Vault files (static) | Add to references for resolve-references |
| People files | Add to entity resolution for resolve-references |
| Project files | Add to entity resolution for resolve-references |

Spawn subagents in parallel where possible.

### 3. Build Memory

After subagents complete:
- Collect external data files (calendar.md, resources.md)
- Collect vault references from resolve-references output
- Write memory.md with full paths and status

### 4. Execute Inline Phase

Load skill's prose instructions for inline phases.
Provide session directory path.
Execute in main conversation context.

## Implementation

The orchestrator is implemented in Python at:
- `.claude/skills/_core/orchestrator/orchestrator.py` - Main orchestrator
- `.claude/skills/_core/orchestrator/session.py` - Session management
- `.claude/skills/_core/orchestrator/resolver.py` - Time argument resolution
- `.claude/skills/_core/orchestrator/parser.py` - Need parsing

When Claude Code invokes a skill, it checks for a "What I Need" section. If present, the skill is orchestrated; otherwise executed directly.
```

**Step 3: Commit**

```bash
git add .claude/skills/_core/orchestrator/SKILL.md
git commit -m "docs(orchestrator): update skill documentation for prose-driven approach"
```

---

## Task 7: Create Test Skill

**Files:**
- Create: `.claude/skills/_dev/test-orchestrator/SKILL.md`

**Step 1: Write test skill**

```markdown
---
name: test-orchestrator
description: Test skill for validating orchestrator functionality
---

# Test Orchestrator

Minimal skill to test the new orchestrator.

## What I Need

- Calendar events for the day
- Week.md for weekly context

## Test Session

Read memory.md to see what's available.

If calendar is available, list the events.
If Week.md is available, show the weekly theme.

Confirm orchestrator is working correctly.
```

**Step 2: Commit**

```bash
git add .claude/skills/_dev/test-orchestrator/SKILL.md
git commit -m "test(orchestrator): add test skill for validation"
```

---

## Task 8: Migrate planning-daily Skill

**Files:**
- Modify: `.claude/skills/rituals/planning-daily/SKILL.md`
- Remove: `.claude/skills/rituals/planning-daily/phases.yaml`

**Step 1: Read current skill**

Run: `cat .claude/skills/rituals/planning-daily/SKILL.md | head -100`

**Step 2: Rewrite skill to pure prose**

```markdown
---
name: planning-daily
description: Morning ritual for planning the day
argument-hint: "[target: (empty)|tomorrow|next monday|YYYY-MM-DD]"
---

# Daily Planning

Help the user plan their day.

## What I Need

- Calendar events for the day
- User's directives and preferences
- QMD search results for documents related to meetings and projects
- Today.md file for this day (may not exist yet)
- Week.md for weekly context
- Month.md for monthly context
- People files for anyone with 1:1 meetings
- Active project files

## Pre-Flight Check

Read memory.md to see what context is available.

Check if Today.md already exists. If it does, ask whether to:
- Review existing plan
- Update existing plan
- Start fresh (clear and rewrite)

If calendar is unavailable, note that and proceed without it.
If QMD is unavailable, note that and proceed without it.

## Planning Session

Greet the user using their preferred name from directives.

We're planning their day for {target date}.

### Review Context

Load their calendar for the day. What meetings do they have?

Load Week.md. What are their weekly goals and themes?

Load Month.md if available. What are the monthly objectives?

For each 1:1 meeting on the calendar:
- Load that person's file
- Mention context (last interaction, ongoing topics)

### Guide Planning

Ask: What's the leadership intention for today?
(Reference their leadership identity from directives)

Ask: What are the top 2-3 priorities for today?

For each meeting on the calendar:
- Does it need preparation?
- What outcome are they aiming for?

Where's the focus time? Identify blocks for deep work.

### Check Projects

Review active projects. Which ones need attention today?
For projects with upcoming deadlines, highlight timeline urgency.

### Generate Plan

Based on the conversation, generate their day plan with:
- Leadership intention
- Top priorities
- Meeting preparation notes
- Focus time blocks
- Project work items

Write the plan to plan.md in the session.

## Save to Vault

Write the plan from plan.md to Today.md in the vault for this day.

Confirm with the user that their day is planned.
```

**Step 3: Remove phases.yaml**

Run: `rm .claude/skills/rituals/planning-daily/phases.yaml`

**Step 4: Commit**

```bash
git add .claude/skills/rituals/planning-daily/SKILL.md
git rm .claude/skills/rituals/planning-daily/phases.yaml
git commit -m "refactor(planning-daily): migrate to prose-driven orchestration"
```

---

## Task 9: Test End-to-End

**Files:**
- N/A (manual testing)

**Step 1: Test with test-orchestrator skill**

Run: `claude skill run test-orchestrator`

Expected:
- Session created
- Memory.md written
- Inline phase executes with available context

**Step 2: Test with planning-daily skill (today)**

Run: `claude skill run planning-daily`

Expected:
- Date resolved to today
- Calendar fetched
- References resolved
- Interactive planning session works

**Step 3: Test with planning-daily skill (tomorrow)**

Run: `claude skill run planning-daily tomorrow`

Expected:
- Date resolved to tomorrow
- Calendar fetched for tomorrow's date
- References resolved for tomorrow's Today.md path

**Step 4: Test with planning-daily skill (next monday)**

Run: `claude skill run planning-daily "next monday"`

Expected:
- Date resolved correctly
- Session created with right date context

**Step 5: Document any issues**

If any tests fail, document:
- What failed
- Expected vs actual behavior
- Root cause hypothesis

---

## Task 10: Migrate Remaining Rituals

**Files:**
- Modify: `.claude/skills/rituals/review-daily/SKILL.md`
- Modify: `.claude/skills/rituals/planning-weekly/SKILL.md`
- Modify: `.claude/skills/rituals/review-weekly/SKILL.md`
- Remove: All `phases.yaml` files

**Step 1: Rewrite review-daily**

Follow same pattern as planning-daily:
- Add "What I Need" section
- Rewrite as pure prose
- Remove phases.yaml

**Step 2: Test review-daily**

Run: `claude skill run review-daily`

**Step 3: Rewrite planning-weekly**

Add needs for:
- Current Week.md
- Calendar for upcoming week
- Active projects

**Step 4: Test planning-weekly**

Run: `claude skill run planning-weekly`

**Step 5: Rewrite review-weekly**

Add needs for:
- All daily archives for the week
- Week.md
- People and projects mentioned

**Step 6: Test review-weekly**

Run: `claude skill run review-weekly "last week"`

**Step 7: Commit each migration**

```bash
git add .claude/skills/rituals/review-daily/
git commit -m "refactor(review-daily): migrate to prose-driven orchestration"

git add .claude/skills/rituals/planning-weekly/
git commit -m "refactor(planning-weekly): migrate to prose-driven orchestration"

git add .claude/skills/rituals/review-weekly/
git commit -m "refactor(review-weekly): migrate to prose-driven orchestration"
```

---

## Task 11: Update Documentation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `DEVELOPING.md`

**Step 1: Update CLAUDE.md orchestration section**

Replace current orchestration description with:

```markdown
### Orchestrated Skills

Skills with a "What I Need" section are orchestrated automatically.

The orchestrator:
1. Resolves time arguments ("tomorrow" → concrete dates)
2. Parses declarative needs from "What I Need" section
3. Spawns subagents to fulfill needs (fetch calendar, resolve vault paths)
4. Builds session with memory.md as index
5. Executes inline phases with available context

Skills declare needs in prose - no knowledge of implementation.

Session files contain only external data (calendar, QMD). Vault files are referenced by full paths in memory.md.
```

**Step 2: Update DEVELOPING.md skill creation guide**

Add section on writing orchestrated skills:

```markdown
### Writing Orchestrated Skills

Skills that need context assembly use the "What I Need" pattern:

1. **Declare needs in prose:**
   ```markdown
   ## What I Need

   - Calendar events for the day
   - Week.md for weekly context
   - People files for 1:1 meetings
   ```

2. **Write inline instructions naturally:**
   ```markdown
   ## Planning Session

   Greet the user.
   Review their calendar.
   Guide them through planning.
   ```

3. **The orchestrator handles:**
   - Resolving time arguments
   - Spawning fetch sub-skills
   - Building session directory
   - Writing memory.md with references

4. **Inline phase reads incrementally:**
   - Starts with memory.md
   - Loads vault files as needed
   - Natural interpretation of prose
```

**Step 3: Commit**

```bash
git add CLAUDE.md DEVELOPING.md
git commit -m "docs: update for prose-driven orchestration"
```

---

## Task 12: Clean Up Old Implementation

**Files:**
- Review and remove deprecated code

**Step 1: Check for unused files**

Run: `find .claude/skills/_core/orchestrator/ -name "*.py" -o -name "*.md"`

Review each file - is it part of new implementation or old?

**Step 2: Remove deprecated sub-skills**

Check `_sub/` directory for synthesis sub-skills that are no longer needed:
- `fetch-active-projects` (replaced by resolve-references)
- Any sub-skills that format/synthesize data

**Step 3: Archive phases.yaml examples**

Move example phases.yaml to docs for reference:

```bash
mkdir -p docs/archive/old-orchestration
mv .claude/skills/rituals/*/phases.yaml docs/archive/old-orchestration/ 2>/dev/null || true
```

**Step 4: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove old orchestration implementation"
```

---

## Testing Strategy

### Unit Tests

- Session management (create, add files, write memory)
- Argument resolution (all time expressions)
- Need parsing (all need types)
- Orchestrator initialization

Run: `pytest .claude/skills/_core/orchestrator/ -v`

### Integration Tests

- test-orchestrator skill (minimal validation)
- planning-daily with different arguments
- review-weekly with date ranges

### Manual Validation

- Context window usage (should be lower than before)
- Session directory inspection (verify structure)
- Memory.md accuracy (full paths, status indicators)

---

## Rollback Plan

If the new orchestrator has critical issues:

1. **Revert skill changes:**
   ```bash
   git revert HEAD~N  # where N is number of commits
   ```

2. **Restore phases.yaml files:**
   ```bash
   cp docs/archive/old-orchestration/*.yaml .claude/skills/rituals/*/
   ```

3. **Switch back to old orchestrator:**
   - Keep new orchestrator code for future work
   - Document issues encountered
   - Plan incremental migration strategy

---

## Success Criteria

- [ ] All unit tests pass
- [ ] planning-daily works with: (empty), "tomorrow", "next monday"
- [ ] review-weekly works with: "last week"
- [ ] memory.md contains full vault paths
- [ ] Session contains only external data
- [ ] Context window usage reduced
- [ ] Skills have zero orchestration knowledge
- [ ] Documentation updated

---

## Notes

- Keep session directories for debugging (configurable retention)
- Log orchestrator decisions for transparency
- Consider adding debug mode with verbose logging
- Monitor performance vs old orchestration

---

## Future Enhancements

1. **Caching:** Cache external data for repeat invocations
2. **Parallel optimization:** More aggressive parallel subagent spawning
3. **Smart inference:** Better entity resolution from context
4. **User feedback:** Learn from corrections to improve need fulfillment

---

## Migration Status (2026-02-15)

### Completed Infrastructure
- ✅ create-session sub-skill - Creates temp session directories
- ✅ resolve-dates sub-skill - Resolves flexible time expressions
- ✅ resolve-references sub-skill - Discovers vault file paths
- ✅ fetch-calendar sub-skill - Updated for session integration
- ✅ test-orchestrator skill - Minimal validation skill
- ✅ CLAUDE.md - Updated orchestration documentation
- ✅ DEVELOPING.md - Updated developer guide

### Migrated Skills
- ✅ planning-daily - Full prose-driven migration with "What I Need" pattern

### Remaining Skills (Still Using phases.yaml)
- ⏳ review-daily
- ⏳ planning-weekly, review-weekly
- ⏳ planning-monthly, review-monthly
- ⏳ planning-quarterly, review-quarterly
- ⏳ planning-yearly, review-yearly
- ⏳ create-project, archive-project

### Next Steps
1. **Implement orchestrator engine** - Core coordination logic to read "What I Need" and spawn sub-skills
2. **Test end-to-end** - Validate planning-daily works with full orchestration
3. **Migrate remaining rituals** - Follow planning-daily pattern
4. **Remove phases.yaml files** - Clean up as skills are migrated

### Notes
- Orchestrator engine is the missing piece - infrastructure and one migrated skill are complete
- All sub-skills and session patterns are in place
- Ready for orchestrator engine implementation
