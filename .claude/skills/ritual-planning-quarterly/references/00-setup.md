# Setup

Load context and validate state before starting the session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: this quarter)
   - Parse: "this quarter", "next quarter", "YYYY-QN"
   - Return: quarter number (1-4), year, start/end dates

### Configuration

2. Read `00_Brain/Systemic/Directives/user-profile.md`
3. Read `00_Brain/Systemic/Directives/ai-personality.md`
4. Read `00_Brain/Semantic/planning-quarterly.md` (graceful if not exists)
5. Read `00_Brain/Systemic/Coaching/planning/quarterly.md` (graceful if not exists)
6. Read `00_Brain/Systemic/Coaching/leadership/quarterly.md` (graceful if not exists)

### Planning Context

5. Read `00_Brain/Captive/Year.md`
6. Glob `01_Projects/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md`, read all matches
7. Read `00_Brain/Systemic/Templates/Captive/quarter.md`

### Prior Quarter Context

8. If not Q1: read `00_Brain/Periodic/Quarterly/YYYY-QN.md` for prior quarter
9. Read weekly archives from prior quarter: `00_Brain/Periodic/Weekly/YYYY-Www.md` for ~13 weeks

## Validate

Before overwriting the current Quarter.md, verify its state:

1. Read `00_Brain/Captive/Quarter.md` if exists
2. If Quarter.md contains a different quarter (check frontmatter):
   - If hasn't been archived → block and suggest running quarterly-review first
   - Offer: Abort, Archive now, or Start fresh (discards unarchived work)
3. If planning for a past quarter → warn that this is unusual, confirm intent
4. If target quarter already has archived Quarter.md → warn about re-planning completed quarter

## Write Initial Quarter.md

After validation passes:

1. Read template from `00_Brain/Systemic/Templates/Captive/quarter.md`
2. Fill frontmatter fields derivable from resolved quarter:
   - `quarter`: N
   - `year`: YYYY
   - `start_date`: first day of quarter
   - `end_date`: last day of quarter
3. Keep other frontmatter fields as placeholders
4. Write to `00_Brain/Captive/Quarter.md`

Proceed to Check-In.
