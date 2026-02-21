---
title: "Tracks"
description: "How to create and extend ritual tracks."
---

Tracks are conceptual domains that flow through all timescales. Each track has its own section in templates and its own phase in rituals.

## Architecture

```
Ritual Structure:
├── Common: Setup
├── Track: Brief
├── Track: Goals
├── Track: Calendar
├── Track: Journal
├── Track: Achievements
├── Track: Relationships
├── Track: Projects
├── Common: Compose
├── Common: Persist
└── Common: Learning
```

Tracks are processed sequentially. Each track:
- Has a consistent `## {Track}` section in templates
- Has a phase file per timescale in rituals
- Cascades independently through timescales

## Track matrix

| Track | Daily | Weekly | Quarterly | Yearly |
|-------|-------|--------|-----------|--------|
| **Brief** | `## Brief`<br>Brief<br>Daily Brief (day shape + context from Week) | `## Brief`<br>Brief<br>Weekly Brief (week overview + context from Quarter) | `## Brief`<br>Brief<br>Quarterly Brief (quarter context from Year) | `## Brief`<br>Brief<br>Yearly Brief (year context + prior year synthesis) |
| **Goals** | `## Goals`<br>Goals<br>Daily 1-3-5 (1 big, 3 medium, 5 small) | `## Goals`<br>Goals<br>Weekly Major Moves (which Quests to advance) | `## Goals`<br>Goals<br>Quarterly Quests (90-day goals) | `## Goals`<br>Goals<br>Yearly Compass (Life Compass, 3-Year Sketch, Why, Anti-Goals) |
| **Calendar** | `## Calendar`<br>Calendar<br>Daily Meetings (prep, context, notes) | `## Calendar`<br>Calendar<br>Weekly Meetings (week's key meetings) | — | — |
| **Journal** | `## Journal`<br>Journal<br>Daily Check-In (energy, mindset, intention) | `## Journal`<br>Journal<br>Weekly Pulse Check (patterns, growth edge) | `## Journal`<br>Journal<br>Quarterly Pivot (adjust approach, themes) | `## Journal`<br>Journal<br>Yearly Vision (leadership identity, development focus) |
| **Achievements** | `## Achievements`<br>Achievements<br>Daily Capture (log wins) | `## Achievements`<br>Achievements<br>Weekly Acknowledge (synthesize daily wins) | `## Achievements`<br>Achievements<br>Quarterly Leverage (what wins enable) | `## Achievements`<br>Achievements<br>Yearly Celebrate (year-defining achievements) |
| **Relationships** | `## Relationships`<br>Relationships<br>Daily Touchpoints (birthdays, personal moments) | `## Relationships`<br>Relationships<br>Weekly Connections (1:1 prep, notes) | `## Relationships`<br>Relationships<br>Quarterly Network (key relationships, stakeholders) | `## Relationships`<br>Relationships<br>Yearly Circle (inner circle, mentors, sponsors) |
| **Projects** | `## Projects`<br>Projects<br>Daily Tasks (active project tasks) | `## Projects`<br>Projects<br>Weekly Progress (status updates) | `## Projects`<br>Projects<br>Quarterly Portfolio (active projects, health) | — |

Each cell contains:
- **Section**: The H2 heading in templates
- **Phase**: The ritual phase file name
- **Intent**: What the track does at that timescale

## Track behavior

### Planning rituals

Tracks in planning rituals use **synthesized inheritance**:
- Load GPS and other track context from higher timescales
- Present context synthesized into a brief narrative
- Guide user to set the track's component for this timescale

### Reflection rituals

Tracks in reflection rituals use **explicit inheritance**:
- Show the actual GPS/track components from higher timescales
- Ask which components were advanced
- Capture evidence and outcomes

## Adding a new track

1. **Define the track matrix row**

   For each timescale, define:
   - Section name (always `## {TrackName}`)
   - Phase name (always `{TrackName}`)
   - Intent (what it does at that timescale)

   Use `—` for timescales where the track does not apply.

2. **Add template sections**

   Add `## {TrackName}` to each Captive template where the track applies:
   - `00_Brain/Systemic/Templates/Captive/Today.md`
   - `00_Brain/Systemic/Templates/Captive/Week.md`
   - `00_Brain/Systemic/Templates/Captive/Quarter.md`
   - `00_Brain/Systemic/Templates/Captive/Year.md`

3. **Create phase files**

   For each timescale where the track applies, create:
   ```
   .claude/skills/ritual-planning-{timescale}/references/{NN}-{trackname}.md
   .claude/skills/ritual-reflection-{timescale}/references/{NN}-{trackname}.md
   ```

   Use the intent from step 1 to guide the phase content.

4. **Update SKILL.md**

   Add the new phase to the ritual's table of contents in `SKILL.md`.

5. **Update template contract**

   Add the new section to the template contract in `SKILL.md`.

6. **Update this matrix**

   Add the new track row to the matrix above.

## Coach system

Each track has a coach that provides guidance and learns from usage.

### Coach files

| Component | Path | Purpose |
|-----------|------|---------|
| Guidance | `Systemic/Coaching/{Track}/{timescale}.md` | Static guidance, prompts, agent selection |
| Insights (raw) | `Synthetic/Coaching/{Track}/insights.md` | Observations, clusters |
| Insights (crystallized) | `Semantic/Coaching/{Track}/insights.md` | Graduated, human-validated learnings |

### Guidance file structure

```markdown
# {Track} Coach - {Timescale}

## Intent

[What this track does at this timescale]

## Agent

[haiku|sonnet|opus]

## Guidance

[How to run this track phase]

### Prompts

[Questions to ask the user]

## References

[Files to load before running]
```

### Learning flow

1. Each track phase captures observations → `Synthetic/Coaching/{Track}/insights.md`
2. Observations auto-cluster with confidence scoring (0-5)
3. Clusters graduate when confidence ≥ 4.5 AND stable for 3+ sessions
4. User crystallizes insight → `Semantic/Coaching/{Track}/insights.md`
5. Crystallized insights inform guidance updates

### Template learning

Templates also learn using the same flow:
- Observations → `Synthetic/Coaching/Template/insights.md`
- Crystallized → `Semantic/Coaching/Template/insights.md`
- Changes applied to `Systemic/Templates/Captive/{timescale}.md`

## Common phases

These phases exist in all rituals:

| Phase | Purpose |
|-------|---------|
| Setup | Load context, validate prerequisites |
| Compose | Assemble final output |
| Persist | Write to archive |
| Learning | Self-improvement observations |

If a phase has no work for a given ritual type, it executes as a no-op.

## Related

- [Rituals](/development/rituals) — Ritual structure and creation
- [Templates](/development/templates) — Template structure and contracts
- [GPS methodology](/overview/gps-methodology) — The Goals track framework
