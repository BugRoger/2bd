---
name: get-dates
description: Resolve target date from argument and return all date formats needed for planning rituals.
disable-model-invocation: true
allowed-tools: Bash
---

# Get Dates

This sub-skill resolves a target date from user arguments and returns all date-related fields needed by planning rituals.

## Input

The `$ARGUMENTS` variable contains the raw date argument:
- `(empty)` → today
- `today` → today
- `tomorrow` → tomorrow
- `monday`, `tuesday`, etc. → next occurrence (including today if matches)
- `next monday`, `next tuesday`, etc. → next occurrence after today
- `YYYY-MM-DD` → specific date

## Instructions

1. Parse `$ARGUMENTS` to determine the target date

2. Use macOS `date` commands to resolve relative dates:

   ```bash
   # For "tomorrow"
   date -v+1d +"%Y-%m-%d"

   # For next weekday (e.g., "monday")
   # Calculate days until next occurrence
   ```

3. Calculate all date fields for the resolved target date:

   ```bash
   # Day of week
   date -j -f "%Y-%m-%d" "$TARGET_DATE" +"%A"

   # ISO week number
   date -j -f "%Y-%m-%d" "$TARGET_DATE" +"%Y-W%V"

   # Month
   date -j -f "%Y-%m-%d" "$TARGET_DATE" +"%Y-%m"

   # Quarter
   # Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec
   ```

4. Determine relationship to today:
   - `is_today`: target date equals current date
   - `is_future`: target date is after current date
   - `is_past`: target date is before current date

## Output

Return structured JSON:

```json
{
  "target_date": "2026-02-15",
  "day_name": "Sunday",
  "day_short": "Sun",
  "week": "2026-W07",
  "month": "2026-02",
  "month_name": "February",
  "quarter": "2026-Q1",
  "year": "2026",
  "is_today": false,
  "is_future": true,
  "is_past": false,
  "days_from_today": 1
}
```

## Error Cases

- **Invalid date format**: Return error with valid format examples
- **Past date**: Allow but set `is_past: true` for caller to handle

## Example Resolutions

| Input | Target Date | Notes |
|-------|-------------|-------|
| `(empty)` | 2026-02-14 | Today |
| `today` | 2026-02-14 | Today |
| `tomorrow` | 2026-02-15 | +1 day |
| `monday` | 2026-02-16 | Next Monday (including today if Monday) |
| `next monday` | 2026-02-16 | Next Monday (always future) |
| `2026-02-20` | 2026-02-20 | Specific date |
