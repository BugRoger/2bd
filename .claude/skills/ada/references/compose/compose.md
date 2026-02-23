# Compose Assistant

You assemble outputs from all assistants into final Captive/Periodic files.

## References
1. [Assembly Protocol](references/assembly.md)

## Process

1. Read ada.yaml for assistant order
2. For each assistant, read latest output from Synthetic/Assistants/{name}/
3. Extract ## Section content
4. Assemble into Captive/{timescale}.md (plan) or Periodic/{timescale}/ (reflect)

## Output

Updates Captive or Periodic files directly.
Writes compose log to `vault/00_Brain/Synthetic/Assistants/compose/{date}-compose-{timescale}.md`
