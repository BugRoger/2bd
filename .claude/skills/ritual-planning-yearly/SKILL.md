---
name: yearly-planning
description: Plan a year's vision, theme, and leadership development focus. The highest-level planning ritual.
argument-hint: "[target-year: this year|next year|YYYY]"
metadata:
  orchestrated: true
---

# Yearly Planning

An annual ritual to set vision, theme, annual goals, and leadership development focus. The highest-level planning ritual that establishes direction for all quarters.

## Context

- User directives and preferences
- Prior year archive (if exists)
- Active projects
- Current Year.md state (if exists)

---

## Validate

Before overwriting the current Year.md, verify its state:

- If Year.md contains a different year and hasn't been archived, block and suggest running yearly-review first
- If planning for a past year, warn that this is unusual
- Only proceed with explicit confirmation when there's unarchived work

---

## Session

### Prior Year Synthesis

If prior year archive exists (from gather-year-context), present:

**Year Theme & Trajectory:**
- What last year was about
- How the quarterly themes evolved
- Overall trajectory (improving, stable, or challenging)

**Accomplishments:**
- Major wins by category (personal, organisational, strategic)
- Key outcomes achieved
- Projects completed or advanced

**Carryover Candidates:**
- Incomplete goals or initiatives
- Strategic patterns that need continued attention
- Relationships to maintain or deepen

**Leadership Development Progress:**
- Growth edge evolution across the year
- Key coaching moments
- Leadership identity development
- Patterns that emerged

If prior year data is unavailable, note it and continue.

### Life Context Check-in

This is the time to step back and consider what's changing:

**Role & Responsibilities:**
- Any role changes expected this year?
- New scope, team, or reporting structure?
- Shifting priorities from leadership?

**Team & Organisation:**
- Team composition changes?
- Organisational shifts to navigate?
- Strategic direction changes?

**Personal:**
- Life milestones or transitions?
- Health, energy, or lifestyle priorities?
- Learning or growth aspirations?

Use these signals to inform the year's theme and goals.

### Vision & Theme

Guide the user to one clear theme for the year:

**Theme Considerations:**
- What does this year need to be about?
- What would make this year meaningful?
- What's the narrative arc you want to write?

**Theme Examples by Context:**
- New role: "Year of Becoming" — Growing into expanded responsibilities
- Scaling team: "Year of Leverage" — Building systems and developing leaders
- Major initiative: "Year of Execution" — Delivering on strategic commitments
- After burnout: "Year of Sustainability" — Rebuilding with intention
- Transition period: "Year of Foundation" — Establishing new norms

The theme should be memorable and guide quarterly decisions.

### Annual Goals

Guide the user to three annual goals aligned with the hierarchy of concerns:

1. **Personal** — What personal leadership growth will you make this year? What aspect of yourself are you developing? How does this connect to your growth edge and leadership identity?

2. **Organisational** — What organisational capability will you build? What team structures, processes, or cultural elements will you establish? What will be different about how your team operates?

3. **Strategic** — What strategic achievement would make this year remarkable? What deliverable, milestone, or outcome would define success?

Frame these as outcomes that span the full year. What will be measurably different by December?

### Leadership Development

This section establishes the leadership development context that cascades to all quarterly and monthly planning.

**Primary Focus:**
Guide the user to identify one primary leadership competency to develop. This should connect to their growth edge and be applicable across multiple situations.

Examples:
- "Listening deeply before responding"
- "Delegating with trust, not micromanaging"
- "Creating clarity in ambiguity"
- "Having difficult conversations early"

**Secondary Focus:**
A supporting competency that complements the primary focus.

**Leadership Identity:**
Help the user articulate who they are becoming as a leader. This is aspirational but grounded — 1-2 sentences that capture the leader they want to be.

Format: "I am a leader who..."

Examples:
- "I am a leader who creates clarity, develops people, and builds sustainable high-performing teams."
- "I am a leader who leads with curiosity, empowers through trust, and makes the complex simple."
- "I am a leader who brings calm to chaos, coaches rather than directs, and models sustainable excellence."

**Growth Edge:**
The specific stretch area where discomfort lives. This is the thing they tend to avoid or struggle with that, if addressed, would unlock significant growth.

Examples:
- "Having difficult conversations early instead of avoiding them"
- "Letting go of details to operate at strategic altitude"
- "Saying no to protect focus on what matters most"
- "Being vulnerable about what I don't know"

### Quarterly Sketch

Rough allocation of focus across the four quarters. Not detailed planning — that happens in quarterly-planning — but directional thinking:

**Q1 (January - March):**
- Typical: Foundation, alignment, planning
- What needs to be established early?

**Q2 (April - June):**
- Typical: Execution, momentum, iteration
- What gets built or shipped?

**Q3 (July - September):**
- Typical: Growth, expansion, deepening
- What scales or expands?

**Q4 (October - December):**
- Typical: Completion, harvest, reflection
- What gets finished? What's the exit into next year?

This sketch provides context but doesn't lock in commitments.

---

## Compose

Use the Year.md template as the source of truth. Fill:

- **Frontmatter** with year and quarters array
- **Vision & Theme** with the chosen theme and rationale
- **Key Annual Goals** with the three goals (personal, organisational, strategic)
- **Leadership Development** with primary/secondary focus, identity, and growth edge
- **Quarterly Progress** sections with the sketched direction (to be filled during quarterly reviews)
- **Annual Wins** sections empty (filled during yearly review)
- **Reflections** sections empty (filled during yearly review)

---

## Persist

Write Year.md to Captive.

---

## Confirm

After writing, summarize:
- The vision theme and what it means
- The three annual goals
- Leadership development focus (primary, secondary, growth edge)
- The quarterly sketch
- Suggested first steps for Q1

Offer encouragement for the year ahead.
