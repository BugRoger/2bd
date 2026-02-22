# Output File Format

## Path Convention

```
vault/00_Brain/Synthetic/Assistants/{assistant}/{date}-{action}-{timescale}.md
```

Example: `vault/00_Brain/Synthetic/Assistants/goals/2026-02-22-plan-daily.md`

## Structure

```markdown
# {Assistant}: {action}({timescale}) {date}

## Status
ok | error

## Section
(Content Ada extracts for Captive/Periodic)

## Observations
- Notable patterns or insights from this session

## Modified
- List of files modified during this action

## Timestamp
{ISO 8601 timestamp}
```

## Error Format

When status is error:

```markdown
## Status
error

## Error
{Description of what went wrong}

## Timestamp
{ISO 8601 timestamp}
```
