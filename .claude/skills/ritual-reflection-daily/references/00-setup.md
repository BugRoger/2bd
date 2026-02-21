# Setup

Load context and validate state before starting the review session.

## Paths

Skill root is `.claude/`. Read vault path from `config.md`. Vault paths below are relative to vault root.

## Load Context

### Sub-skills

1. Invoke `_resolve-dates` with argument (default: today)
2. Invoke `_fetch-calendar` for target date

### Configuration

3. Read `00_Brain/Systemic/Directives/user-profile.md`
4. Read `00_Brain/Systemic/Directives/ai-personality.md`
5. Read `00_Brain/Systemic/Coaching/review.md`
6. Read `00_Brain/Systemic/Coaching/leadership.md`
7. Read `00_Brain/Semantic/review-daily/insights.md` (graceful if not exists)

### Review Context

8. Read `00_Brain/Captive/Today.md` for target date
9. Read `00_Brain/Captive/Week.md`
10. Glob `01_Projects/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md`, read all matches

### Derived

11. Parse calendar and Today.md for mentioned people, glob `02_Areas/People/*.md` for matching names, read matches

## Validate

Check Today.md state before reviewing:

1. **Date alignment** — Compare Today.md frontmatter date with target review date
   - If mismatched → ask which date to review

2. **Archive check** — Check if `00_Brain/Periodic/Daily/{date}.md` exists
   - If exists → offer to view or re-review

3. **Archived marker** — Check Today.md frontmatter for `archived: true`
   - If present → day already archived, offer to view archive

If directives are unavailable, note that and proceed with limited coaching context.

Proceed only when state is validated.
