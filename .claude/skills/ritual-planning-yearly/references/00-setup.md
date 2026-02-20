# Setup

Load context and validate state before starting the session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: this year)
   - Resolves "this year", "next year", or YYYY to concrete year

### Configuration

2. Read `00_Brain/Systemic/Directives/user-profile.md`
3. Read `00_Brain/Systemic/Directives/ai-personality.md`
4. Read `00_Brain/Semantic/planning-yearly.md` (graceful if not exists)

### Planning Context

5. Read prior year's archive from `00_Brain/Periodic/[PRIOR-YEAR]/Year.md` (graceful if not exists)
6. Glob `01_Projects/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md`, read all matches
7. Read `00_Brain/Systemic/Templates/Captive/year.md`

### Derived

8. Read `00_Brain/Synthetic/planning-yearly.md` (graceful if not exists)

## Validate

Check if `00_Brain/Captive/Year.md` exists for target year:

1. If exists and contains different year that hasn't been archived:
   - Block and suggest running yearly-review first to archive
2. If planning for a past year:
   - Warn that this is unusual, confirm intent
3. If exists for target year:
   - Warn, offer Abort or Start fresh
4. If abort → end session
5. If start fresh → continue

## Write Initial Year.md

After validation passes:

1. Read template from `00_Brain/Systemic/Templates/Captive/year.md`
2. Fill frontmatter fields derivable from resolved year:
   - `year`: YYYY
   - `quarters`: [YYYY-Q1, YYYY-Q2, YYYY-Q3, YYYY-Q4]
3. Keep other content as placeholders
4. Write to `00_Brain/Captive/Year.md`

Proceed to Check-In.
