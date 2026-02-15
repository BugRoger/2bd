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

---

## Daily Resolution (default scope)

When `scope=daily` is passed or no scope is specified, the skill operates in daily mode.

### Daily Input Formats
- `(empty)` → today
- `today` → today
- `tomorrow` → tomorrow
- `monday`, `tuesday`, etc. → next occurrence (including today if matches)
- `next monday`, `next tuesday`, etc. → next occurrence after today
- `YYYY-MM-DD` → specific date

### Daily Output

The base output (lines 59-76 above) is the default for daily scope. No additional fields are needed beyond the standard date fields.

### Daily Scope Behavior

When `scope=daily`:
- Returns standard date fields (target_date, day_name, week, month, quarter, year)
- Does NOT include extended week/month/quarter/year fields
- Simpler output optimized for daily planning context

---

## Week Resolution (for weekly rituals)

When `scope=week` is passed in arguments or the input contains an ISO week format:

### Week Input Formats
- `(empty)` → next week (for forward planning, typically used on Fridays)
- `this week` → current week
- `next week` → following week
- `last week` → previous week
- `YYYY-Www` → specific ISO week (e.g., 2026-W07)

### Week Calculations

```bash
# Get current ISO week
date +"%G-W%V"

# Get week start (Monday) from ISO week
# Use: date command with week calculation

# Get week end (Sunday) from ISO week
# week_end = week_start + 6 days
```

### Extended Output for Weekly Scope

When resolving weeks, include these additional fields:

```json
{
  "target_date": "2026-02-14",
  "day_name": "Saturday",
  "day_short": "Sat",
  "week": "2026-W07",
  "week_start": "2026-02-09",
  "week_end": "2026-02-15",
  "is_current_week": true,
  "is_past_week": false,
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

### Week Resolution Examples

| Input | Target Week | Week Start | Week End |
|-------|-------------|------------|----------|
| `(empty)` scope=week | 2026-W08 | 2026-02-16 | 2026-02-22 |
| `this week` | 2026-W07 | 2026-02-09 | 2026-02-15 |
| `next week` | 2026-W08 | 2026-02-16 | 2026-02-22 |
| `last week` | 2026-W06 | 2026-02-02 | 2026-02-08 |
| `2026-W05` | 2026-W05 | 2026-01-26 | 2026-02-01 |

### Week Resolution Logic

1. If input matches `YYYY-Www` pattern → use directly
2. If input is `this week` → current week
3. If input is `next week` → current week plus 1
4. If input is `last week` → current week minus 1
5. If `scope=week` with empty input → next week (forward planning default)
6. Calculate `week_start` as the Monday of that week
7. Calculate `week_end` as the Sunday of that week

### Prior Week Fields

For weekly planning rituals that need to synthesize the prior week, include:

```json
{
  "prior_week": "2026-W06",
  "prior_week_start": "2026-02-02",
  "prior_week_end": "2026-02-08"
}
```

These fields are always calculated relative to the target week (target week minus 1).

---

## Month Resolution (for monthly rituals)

When `scope=month` is passed in arguments or the input contains a month format:

### Month Input Formats
- `(empty)` with scope=month → this month
- `this month` → current month
- `next month` → following month
- `last month` → previous month
- `YYYY-MM` → specific month (e.g., 2026-02)

### Month Calculations

```bash
# Get current month
date +"%Y-%m"

# Get month name
date -j -f "%Y-%m-%d" "${MONTH}-01" +"%B"

# Get month start (always 1st)
month_start="${MONTH}-01"

# Get month end (last day of month)
# Use: date -v+1m -v-1d to find last day
date -j -f "%Y-%m-%d" "${MONTH}-01" -v+1m -v-1d +"%Y-%m-%d"

# Calculate quarter from month
# Jan-Mar → Q1, Apr-Jun → Q2, Jul-Sep → Q3, Oct-Dec → Q4
```

### Extended Output for Monthly Scope

When resolving months, include these fields:

```json
{
  "month": "2026-02",
  "month_name": "February",
  "month_start": "2026-02-01",
  "month_end": "2026-02-28",
  "is_current_month": true,
  "is_past_month": false,
  "prior_month": "2026-01",
  "prior_month_start": "2026-01-01",
  "prior_month_end": "2026-01-31",
  "quarter": "2026-Q1",
  "year": "2026"
}
```

### Month Resolution Examples

| Input | Target Month | Month Start | Month End |
|-------|--------------|-------------|-----------|
| `(empty)` scope=month | 2026-02 | 2026-02-01 | 2026-02-28 |
| `this month` | 2026-02 | 2026-02-01 | 2026-02-28 |
| `next month` | 2026-03 | 2026-03-01 | 2026-03-31 |
| `last month` | 2026-01 | 2026-01-01 | 2026-01-31 |
| `2026-06` | 2026-06 | 2026-06-01 | 2026-06-30 |

### Month Resolution Logic

1. If input matches `YYYY-MM` pattern → use directly
2. If input is `this month` → current month
3. If input is `next month` → current month plus 1
4. If input is `last month` → current month minus 1
5. If `scope=month` with empty input → this month (current month default)
6. Calculate `month_start` as the 1st of that month
7. Calculate `month_end` as the last day of that month
8. Derive `quarter` from the month (Jan-Mar→Q1, Apr-Jun→Q2, Jul-Sep→Q3, Oct-Dec→Q4)

### Prior Month Fields

For monthly planning rituals that need to synthesize the prior month, include:

```json
{
  "prior_month": "2026-01",
  "prior_month_start": "2026-01-01",
  "prior_month_end": "2026-01-31"
}
```

These fields are always calculated relative to the target month (target month minus 1).

---

## Quarter Resolution (for quarterly rituals)

When `scope=quarter` is passed in arguments or the input contains a quarter format:

### Quarter Input Formats
- `(empty)` with scope=quarter → this quarter
- `this quarter` → current quarter
- `next quarter` → following quarter
- `last quarter` → previous quarter
- `YYYY-QN` → specific quarter (e.g., 2026-Q1)

### Quarter Calculations

```bash
# Get current quarter
# Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec
MONTH=$(date +"%m")
YEAR=$(date +"%Y")
QUARTER=$(( (MONTH - 1) / 3 + 1 ))
echo "${YEAR}-Q${QUARTER}"

# Get quarter start month
# Q1 → 01, Q2 → 04, Q3 → 07, Q4 → 10
START_MONTH=$(( (QUARTER - 1) * 3 + 1 ))
printf "%02d" $START_MONTH

# Get quarter end month
# Q1 → 03, Q2 → 06, Q3 → 09, Q4 → 12
END_MONTH=$(( QUARTER * 3 ))
printf "%02d" $END_MONTH

# Quarter start date (first day of first month)
quarter_start="${YEAR}-$(printf "%02d" $START_MONTH)-01"

# Quarter end date (last day of last month)
# Use date arithmetic to find last day
```

### Extended Output for Quarterly Scope

When resolving quarters, include these fields:

```json
{
  "quarter": "2026-Q1",
  "quarter_start": "2026-01-01",
  "quarter_end": "2026-03-31",
  "quarter_months": ["2026-01", "2026-02", "2026-03"],
  "is_current_quarter": true,
  "is_past_quarter": false,
  "prior_quarter": "2025-Q4",
  "prior_quarter_start": "2025-10-01",
  "prior_quarter_end": "2025-12-31",
  "prior_quarter_months": ["2025-10", "2025-11", "2025-12"],
  "year": "2026"
}
```

### Quarter Resolution Examples

| Input | Target Quarter | Quarter Start | Quarter End | Quarter Months |
|-------|----------------|---------------|-------------|----------------|
| `(empty)` scope=quarter | 2026-Q1 | 2026-01-01 | 2026-03-31 | 01, 02, 03 |
| `this quarter` | 2026-Q1 | 2026-01-01 | 2026-03-31 | 01, 02, 03 |
| `next quarter` | 2026-Q2 | 2026-04-01 | 2026-06-30 | 04, 05, 06 |
| `last quarter` | 2025-Q4 | 2025-10-01 | 2025-12-31 | 10, 11, 12 |
| `2026-Q3` | 2026-Q3 | 2026-07-01 | 2026-09-30 | 07, 08, 09 |

### Quarter Resolution Logic

1. If input matches `YYYY-QN` pattern → parse year and quarter number
2. If input is `this quarter` → current quarter
3. If input is `next quarter` → current quarter plus 1 (with year rollover if Q4→Q1)
4. If input is `last quarter` → current quarter minus 1 (with year rollover if Q1→Q4)
5. If `scope=quarter` with empty input → this quarter (current quarter default)
6. Calculate `quarter_start` as the 1st of the first month in that quarter
7. Calculate `quarter_end` as the last day of the last month in that quarter
8. Calculate `quarter_months` as array of YYYY-MM for all three months

### Prior Quarter Fields

For quarterly planning rituals that need to synthesize the prior quarter, include:

```json
{
  "prior_quarter": "2025-Q4",
  "prior_quarter_start": "2025-10-01",
  "prior_quarter_end": "2025-12-31",
  "prior_quarter_months": ["2025-10", "2025-11", "2025-12"]
}
```

These fields are always calculated relative to the target quarter (target quarter minus 1, with year rollover).

---

## Year Resolution (for yearly rituals)

When `scope=year` is passed in arguments or the input contains a year format:

### Year Input Formats
- `(empty)` with scope=year → this year
- `this year` → current year
- `next year` → following year
- `last year` → previous year
- `YYYY` → specific year (e.g., 2026)

### Year Calculations

```bash
# Get current year
date +"%Y"

# Year start (always January 1st)
year_start="${YEAR}-01-01"

# Year end (always December 31st)
year_end="${YEAR}-12-31"

# All quarters in the year
quarters=("${YEAR}-Q1" "${YEAR}-Q2" "${YEAR}-Q3" "${YEAR}-Q4")
```

### Extended Output for Yearly Scope

When resolving years, include these fields:

```json
{
  "year": "2026",
  "year_start": "2026-01-01",
  "year_end": "2026-12-31",
  "quarters": ["2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4"],
  "is_current_year": true,
  "is_past_year": false,
  "prior_year": "2025",
  "prior_year_start": "2025-01-01",
  "prior_year_end": "2025-12-31"
}
```

### Year Resolution Examples

| Input | Target Year | Year Start | Year End | Quarters |
|-------|-------------|------------|----------|----------|
| `(empty)` scope=year | 2026 | 2026-01-01 | 2026-12-31 | Q1, Q2, Q3, Q4 |
| `this year` | 2026 | 2026-01-01 | 2026-12-31 | Q1, Q2, Q3, Q4 |
| `next year` | 2027 | 2027-01-01 | 2027-12-31 | Q1, Q2, Q3, Q4 |
| `last year` | 2025 | 2025-01-01 | 2025-12-31 | Q1, Q2, Q3, Q4 |
| `2024` | 2024 | 2024-01-01 | 2024-12-31 | Q1, Q2, Q3, Q4 |

### Year Resolution Logic

1. If input matches `YYYY` pattern (4 digits) → use directly
2. If input is `this year` → current year
3. If input is `next year` → current year plus 1
4. If input is `last year` → current year minus 1
5. If `scope=year` with empty input → this year (current year default)
6. Calculate `year_start` as January 1st of that year
7. Calculate `year_end` as December 31st of that year
8. Calculate `quarters` as array of all four quarters for that year

### Prior Year Fields

For yearly planning rituals that need to synthesize the prior year, include:

```json
{
  "prior_year": "2025",
  "prior_year_start": "2025-01-01",
  "prior_year_end": "2025-12-31"
}
```

These fields are always calculated relative to the target year (target year minus 1).
