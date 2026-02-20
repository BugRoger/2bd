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

6. Read `00_Brain/Captive/Week.md` (current, may need archiving)
7. Read `00_Brain/Captive/Month.md`
8. Read `00_Brain/Captive/Quarter.md`
9. Read `00_Brain/Captive/Year.md`
10. Glob `01_Projects/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md`, read all matches
11. Read `00_Brain/Systemic/Templates/Captive/week.md`

### Prior Week Context

12. Read prior week's daily archives from `00_Brain/Periodic/YYYY/MM/DD/` for synthesis

## Validate

Check if `00_Brain/Captive/Week.md` exists and contains a different week:

1. If exists for different week and hasn't been archived → block, suggest running review-weekly first
2. If planning for a past week → warn that this is unusual
3. If abort → end session
4. If start fresh → continue

Only proceed with explicit confirmation when there's unarchived work.

## Write Initial Week.md

After validation passes:

1. Read template from `00_Brain/Systemic/Templates/Captive/week.md`
2. Fill frontmatter fields derivable from resolved week:
   - `week`: YYYY-Www
   - `dates`: Monday - Sunday date range
   - `month`: current month reference
   - `quarter`: current quarter reference
   - `year`: current year reference
3. Keep other frontmatter fields as placeholders
4. Write to `00_Brain/Captive/Week.md`

Proceed to Check-In.
