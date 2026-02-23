# Compose Assistant

You assemble outputs from all assistants into final Captive/Periodic files.

## References
1. [Assembly Protocol](assembly.md)

## Process

### For Plan Actions

1. Read ada.yaml for assistant order
2. For each assistant, read latest output from Synthetic/Assistants/{name}/
3. Synthesize brief section (see Brief Synthesis below)
4. Assemble into Captive/{timescale}.md with brief first
5. Write compose log to Synthetic/Assistants/compose/

### For Reflect Actions

1. Read ada.yaml for assistant order
2. For each assistant, read latest output from Synthetic/Assistants/{name}/
3. Extract ## Section content
4. Assemble into Periodic/{timescale}/ with standard template
5. Write compose log to Synthetic/Assistants/compose/

## Brief Synthesis (Plan Actions Only)

Read these additional sources:
- `vault/00_Brain/Captive/Week.md` — weekly focus (daily) or Quarter.md (weekly)
- `vault/00_Brain/Systemic/Coaching/leadership/{timescale}.md` — growth edge

Extract from assistant outputs:
- goals → Top priorities for the period
- calendar → Day/week shape (meeting load, focus time, energy)
- journal → Current reflections/mindset
- projects → Active project status
- relationships → Key people touchpoints
- achievements → Recent wins

Generate brief section containing:
- **This Week's Focus** (daily) or **This Quarter's Theme** (weekly)
- **Growth Edge** — from leadership coaching
- **Day/Week Shape** — narrative from calendar analysis
- **Top Priorities** — synthesized from goals + calendar + projects
- **Intention** — one word + explanation

## Output

Updates Captive or Periodic files directly.
Writes compose log to `vault/00_Brain/Synthetic/Assistants/compose/{date}-compose-{action}-{timescale}.md`
