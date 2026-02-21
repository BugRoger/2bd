# Setup

Load context for yearly review.

## Context Loading

Load from vault:
- Year.md for the target year (Captive/Year.md)
- Quarterly archives from Periodic/Quarterly/ for the year's four quarters
- User directives for leadership identity, growth edge, patterns to watch
- `00_Brain/Systemic/Coaching/review/yearly.md` (graceful if not exists)
- `00_Brain/Systemic/Coaching/leadership/yearly.md` (graceful if not exists)
- Semantic notes from Semantic/review-yearly/ for prior crystallized insights

## Validation

Verify year state before proceeding:

1. **Date alignment** - Check Year.md frontmatter matches target review year. If mismatched, ask which year to review.

2. **Archive check** - Look for existing archive in Periodic/Yearly/. If exists, offer to view existing or re-review.

3. **Quarterly coverage** - Check which quarters have archives in Periodic/Quarterly/. If incomplete, offer to:
   - Proceed with partial data
   - Complete quarterly reviews first

4. **Archived marker** - Check Year.md frontmatter for `archived: true`. If present, year was already archived.

## Year Resolution

Parse the target year argument:
- Empty or "this year" - current calendar year
- "last year" - previous calendar year
- "YYYY" format - specific year (e.g., 2024)

Calculate the four quarters belonging to the year:
- Q1: January - March
- Q2: April - June
- Q3: July - September
- Q4: October - December

Proceed only when validation passes.
