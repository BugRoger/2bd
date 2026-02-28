# Obsidian CLI Context Enrichment - Design Document

**Date:** 2026-02-28
**Status:** Approved
**Approach:** Multi-Assistant Rollout

---

## Motivation

Enhance assistant context fetching using Obsidian CLI. Currently assistants read static vault paths. With CLI integration, they can dynamically discover projects, fetch backlinks, and surface related context.

---

## Scope

### Assistants

| Assistant | Current Context | Enhanced Context |
|-----------|-----------------|------------------|
| **Projects** | Reads `vault/01_Projects/` directory | + Search by path, backlinks to goals/people |
| **Calendar** | Reads person dossiers for attendees | + Backlinks from dossiers (recent context) |
| **Relationships** | Reads person dossiers | + Backlinks, search for recent mentions |

### Actions

Plan actions only (daily + weekly). Reflect actions excluded for initial rollout.

### Constraint

CLI is optional. Assistants must work without it (graceful fallback).

---

## Implementation Pattern

Each assistant adds a Context Enrichment phase before draft generation.

```
┌─────────────────────────────────────────┐
│  1. Load static context (current)       │
│  2. Check CLI available                 │
│  3. If yes: run queries, add to context │
│  4. Generate draft (with richer context)│
└─────────────────────────────────────────┘
```

### CLI Availability Check

```bash
obsidian version 2>/dev/null
```

If non-zero exit, skip CLI operations and continue without enrichment.

### Key Principle

CLI enrichment is additive. Never blocks. Never required.

---

## Per-Assistant Queries

### Projects Assistant

```bash
# Find all active projects
obsidian search query="path:01_Projects" limit=20

# For each important project, get related context
obsidian backlinks file="01_Projects/2026-03-15-launch"
```

Enriches draft with: related goals, people involved, recent mentions.

### Calendar Assistant

```bash
# For each meeting attendee, get their context
obsidian backlinks file="02_Areas/People/MarcusT"
```

Enriches draft with: recent interactions, shared projects, open threads with attendee.

### Relationships Assistant

```bash
# Get backlinks for people being reviewed
obsidian backlinks file="02_Areas/People/SarahK"

# Find recent mentions across vault
obsidian search query="Sarah" limit=10
```

Enriches draft with: touchpoint history, recent context, relationship signals.

---

## File Changes

### Modified Files (6 total)

| File | Change |
|------|--------|
| `.claude/skills/_assistant-projects/plan/daily.md` | Add CLI enrichment for project discovery |
| `.claude/skills/_assistant-projects/plan/weekly.md` | Add CLI enrichment for project discovery |
| `.claude/skills/_assistant-calendar/plan/daily.md` | Add CLI enrichment for attendee context |
| `.claude/skills/_assistant-calendar/plan/weekly.md` | Add CLI enrichment for attendee context |
| `.claude/skills/_assistant-relationships/plan/daily.md` | Add CLI enrichment for people context |
| `.claude/skills/_assistant-relationships/plan/weekly.md` | Add CLI enrichment for people context |

### No New Files

Enhancing existing context loading sections only.

---

## Testing Strategy

### Manual Testing

1. Run each assistant manually with Obsidian open - verify enriched context appears
2. Run each assistant with Obsidian closed - verify graceful fallback
3. Run full `ada plan` ritual - verify no regressions

### Success Criteria

- [ ] Projects assistant discovers projects via CLI search
- [ ] Calendar assistant shows attendee backlinks in draft
- [ ] Relationships assistant shows people context in draft
- [ ] All assistants work normally when CLI unavailable
- [ ] No increase in ritual execution time (CLI calls are fast)

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Which assistants | Projects, Calendar, Relationships | Biggest context gaps |
| Discovery method | Path-based search + backlinks | No taxonomy changes needed |
| Integration point | Each assistant enriches own context | Matches parallel architecture |
| Scope | Plan actions only | Where enriched context helps most |

---

## Next Steps

1. Create implementation plan
2. Update 6 plan/*.md files
3. Test each assistant individually
4. Test full ritual flow
