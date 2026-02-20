# Setup

Load context and validate state before starting the monthly review session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: this month)
2. Invoke `_fetch-calendar` for the entire target month

### Configuration

3. Read `00_Brain/Systemic/Directives/user-profile.md`
4. Read `00_Brain/Systemic/Directives/ai-personality.md`
5. Read `00_Brain/Semantic/review-monthly/insights.md` (graceful if not exists)
6. Read `00_Brain/Systemic/Coaching/review-monthly.md` (graceful if not exists)

### Monthly Context

7. Read `00_Brain/Captive/Month.md`
8. Read `00_Brain/Captive/Quarter.md`
9. Read `00_Brain/Captive/Year.md`

### Weekly Archives

10. Glob `00_Brain/Periodic/Weekly/YYYY-Www.md` for all weeks in target month
11. Read all matching weekly archive files

### Derived

12. Parse weekly archives for mentioned People and Projects
13. Glob `02_Areas/People/*.md` for matching names, read matches
14. Glob `01_Projects/*.md` for matching projects, read matches

## Validate

Check state before reviewing:

1. **Date alignment** — Verify Month.md frontmatter matches target review month
   - If mismatched → ask which month to review

2. **Archive check** — Check if archive exists in `00_Brain/Periodic/Monthly/YYYY-MM.md`
   - If exists → offer to view existing or re-review

3. **Archive marker** — Check Month.md frontmatter for `archived: true`
   - If present → month already archived, confirm intent to re-review

4. **Weekly coverage** — Count weeks with weekly archives available for this month
   - If incomplete → offer to proceed with partial data or complete weekly reviews first

If directives are unavailable, note that and proceed with limited coaching context.

Proceed to Month Summary when state is validated.
