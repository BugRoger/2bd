---
title: "Your First Ritual"
description: "A guided walkthrough of your first planning session"
---

## Starting the Ritual

After running `/init`, start your first planning ritual:

```
> /plan
```

Ada will detect the time of day and run the appropriate ritual.

## What Ada Asks

Ada coordinates her assistants to gather information. She'll ask about:

### Goals (1-3-5 Method)

Ada asks you to set:
- **1 Big Thing** — The one task that moves the needle
- **3 Medium Things** — Important supporting tasks
- **5 Small Things** — Quick wins and admin

### Leadership Intention

Ada asks for one word describing your stance for the day:
- Decisive, Collaborative, Curious, Focused, etc.

### Calendar Context

If calendar integration is set up, Ada shows:
- Your meetings for the day
- Focus time available
- Meeting prep suggestions

## What Gets Created

After the ritual, Ada creates or updates:

| File | Location | Content |
|------|----------|---------|
| Today.md | `00_Brain/Captive/Today.md` | Your daily plan |
| Brief | (in Today.md) | Context synthesis |

## Next Steps

Run `/reflect` at the end of your day to capture wins and insights.

## Related

- [How Ada Works](/ada/how-ada-works) — The full ritual loop
- [Goals Assistant](/assistants/goals) — Deep dive on goal-setting
- [Brief Assistant](/assistants/brief) — How briefs are generated
