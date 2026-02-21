# Setup

Load context and validate state before starting the session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: this week)
2. Invoke `_fetch-calendar` for target week (Monday through Sunday)

### Configuration

3. Read `00_Brain/Systemic/Directives/user-profile.md`
4. Read `00_Brain/Systemic/Directives/ai-personality.md`
5. Read `00_Brain/Semantic/planning-weekly/insights.md` (graceful if not exists)

### Planning Context

6. Read `00_Brain/Captive/Quarter.md`
7. Read `00_Brain/Captive/Year.md`
8. Glob `01_Projects/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md`, read all matches

## Validate

Check if `00_Brain/Captive/Week.md` exists and contains a different week:
1. If exists → warn, offer Abort or Start fresh
2. If abort → end session
3. If start fresh → continue

Only proceed with explicit confirmation when there's unarchived work.

## Write Initial Week.md

After validation passes:

1. Read template from `00_Brain/Systemic/Templates/Captive/week.md`
2. Fill frontmatter fields derivable from resolved date
3. Keep other frontmatter fields as placeholders
4. Write to `00_Brain/Captive/Week.md`

Proceed to Check-In.
