# Setup

Load context for quarterly review.

## Context Loading

Load from vault:
- Quarter.md for the target quarter (Captive/Quarter.md)
- Weekly archives from Periodic/Weekly/ for the quarter's ~13 weeks
- Year.md for annual context and goals
- User directives for leadership identity, growth edge, patterns to watch
- Coaching files from Systemic/Coaching/

## Validation

Verify quarter state before proceeding:

1. **Date alignment** - Check Quarter.md frontmatter matches target review quarter. If mismatched, ask which quarter to review.

2. **Archive check** - Look for existing archive in Periodic/Quarterly/. If exists, offer to view existing or re-review.

3. **Weekly coverage** - Check which weeks have archives in Periodic/Weekly/. If incomplete, offer to:
   - Proceed with partial data
   - Complete weekly reviews first

4. **Archived marker** - Check Quarter.md frontmatter for `archived: true`. If present, quarter was already archived.

## Quarter Resolution

Parse the target quarter argument:
- Empty or "this quarter" - current calendar quarter
- "last quarter" - previous calendar quarter
- "YYYY-QN" format - specific quarter (e.g., 2024-Q3)

Calculate the three months belonging to the quarter:
- Q1: January, February, March
- Q2: April, May, June
- Q3: July, August, September
- Q4: October, November, December

Proceed only when validation passes.
