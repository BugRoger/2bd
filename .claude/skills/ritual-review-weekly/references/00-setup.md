# Setup

Load context and validate state before starting the weekly review session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: this week)
2. Invoke `_fetch-calendar` for the entire target week

### Configuration

3. Read `00_Brain/Systemic/Directives/user-profile.md`
4. Read `00_Brain/Systemic/Directives/ai-personality.md`
5. Read `00_Brain/Semantic/review-weekly.md` (graceful if not exists)
6. Read `00_Brain/Systemic/Coaching/review-weekly.md` (graceful if not exists)

### Weekly Context

7. Read `00_Brain/Captive/Week.md`
8. Read `00_Brain/Captive/Month.md`
9. Read `00_Brain/Captive/Quarter.md`

### Daily Archives

10. Glob `00_Brain/Periodic/Daily/YYYY-MM-DD*.md` for each workday (Mon-Fri) in target week
11. Read all matching daily archive files

### Derived

12. Parse daily archives for mentioned People and Projects
13. Glob `02_Areas/People/*.md` for matching names, read matches
14. Glob `01_Projects/*.md` for matching projects, read matches

## Validate

Check state before reviewing:

1. **Date alignment** — Verify Week.md frontmatter matches target review week
   - If mismatched → ask which week to review

2. **Archive check** — Check if archive exists in `00_Brain/Periodic/Weekly/YYYY-Www.md`
   - If exists → offer to view existing or re-review

3. **Archive marker** — Check Week.md frontmatter for `archived: true`
   - If present → week already archived, confirm intent to re-review

4. **Daily coverage** — Count workdays (Mon-Fri) with daily archives available
   - If incomplete → offer to proceed with partial data or complete daily reviews first

If directives are unavailable, note that and proceed with limited coaching context.

Proceed to Week Summary when state is validated.
