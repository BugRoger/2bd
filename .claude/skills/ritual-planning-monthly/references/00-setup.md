# Setup

Load context and validate state before starting the session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: this month)

### Configuration

2. Read `00_Brain/Systemic/Directives/user-profile.md`
3. Read `00_Brain/Systemic/Directives/ai-personality.md`
4. Read `00_Brain/Semantic/planning-monthly/insights.md` (graceful if not exists)

### Planning Context

5. Read `00_Brain/Captive/Month.md` (current, may need archiving)
6. Read `00_Brain/Captive/Quarter.md`
7. Read `00_Brain/Captive/Year.md`
8. Glob `01_Projects/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md`, read all matches
9. Read `00_Brain/Systemic/Templates/Captive/month.md`

### Prior Month Context

10. Read prior month's weekly archives from `00_Brain/Periodic/YYYY/MM/` for synthesis

## Validate

Check if `00_Brain/Captive/Month.md` exists and contains a different month:

1. If exists for different month and hasn't been archived → block, suggest running review-monthly first
2. If planning for a past month → warn that this is unusual
3. If abort → end session
4. If start fresh → continue

Only proceed with explicit confirmation when there's unarchived work.

## Write Initial Month.md

After validation passes:

1. Read template from `00_Brain/Systemic/Templates/Captive/month.md`
2. Fill frontmatter fields derivable from resolved month:
   - `month`: YYYY-MM
   - `quarter`: current quarter reference (Q1-Q4)
   - `year`: current year reference
   - `position_in_quarter`: [first|middle|final] month
3. Keep other frontmatter fields as placeholders
4. Write to `00_Brain/Captive/Month.md`

Proceed to Check-In.
