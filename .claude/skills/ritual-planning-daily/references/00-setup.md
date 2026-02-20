# Setup

Load context and validate state before starting the session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: today)
2. Invoke `_fetch-calendar` for target date

### Configuration

3. Read `00_Brain/Systemic/Directives/user-profile.md`
4. Read `00_Brain/Systemic/Directives/ai-personality.md`
5. Read `00_Brain/Semantic/planning-daily.md` (graceful if not exists)

### Planning Context

6. Read `00_Brain/Captive/Week.md`
7. Read `00_Brain/Captive/Month.md`
8. Read `00_Brain/Captive/Quarter.md`
9. Glob `01_Projects/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md`, read all matches
10. Read `00_Brain/Systemic/Templates/Captive/today.md`

### Derived

11. Parse calendar for 1:1 meetings, glob `02_Areas/People/*.md` for matching names, read matches

## Validate

Check if `00_Brain/Captive/Today.md` exists for target date:
1. If exists → warn, offer Abort or Start fresh
2. If abort → end session
3. If start fresh → continue

## Write Initial Today.md

After validation passes:

1. Read template from `00_Brain/Systemic/Templates/Captive/today.md`
2. Fill frontmatter fields derivable from resolved date
3. Keep other frontmatter fields as placeholders
4. Write to `00_Brain/Captive/Today.md`

Proceed to Check-In.
