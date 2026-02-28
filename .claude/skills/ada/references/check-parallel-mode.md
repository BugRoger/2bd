# Check Parallel Mode

Determine if parallel execution is enabled.

## Configuration Location

Read: `vault/00_Brain/Systemic/Config/ada.yaml`

Look for:
```yaml
parallel_execution: true  # or false
```

## Default Behavior

If key missing: default to `false` (sequential mode)

## Usage

```
if parallel_execution enabled:
    use parallel draft-and-fill flow
else:
    use sequential interactive flow (legacy)
```

## Migration Path

1. Start with `parallel_execution: false`
2. Test parallel mode thoroughly
3. Switch to `parallel_execution: true`
4. Monitor for issues
5. Can always rollback by setting to `false`
