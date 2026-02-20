---
name: onboard-person 
description: Create a new person dossier through guided interview. Use to onboard a colleague into your people management system.
argument-hint: "[firstname-lastname]"
metadata:
  orchestrated: true
---

# Person Onboard

Create a living dossier for a colleague through a guided interview.

## Context

- Vault configuration and path
- User directives and preferences

## Setup

If a name is provided as argument (e.g., `sarah-kim`), use it as the filename. Otherwise, ask for the name and derive the filename.

---

## Interview

Conduct a conversational interview, asking questions one section at a time.

### Basic Info

Gather full name, nickname/aliases, role or title, and department or team.

For relationship type, present categories:
- **Reports to you** — Direct Report (Manager), Direct Report (IC), Skip-level IC
- **Peers** — Peer (Senior Management), Peer (Executive), Peer (IC)
- **You report to** — Manager, Skip-level Manager
- **External** — Stakeholder, Partner

Allow multiple selections if relevant.

### Context

Capture working relationship context: how they started working together, who they report to, who reports to them, and their key responsibilities or projects.

### Personality & Style

Understand how they operate: personality, communication style (async/sync, detail level, response time), decision-making approach, what motivates them, and any patterns or tendencies to be aware of.

### Development (Optional)

Performance management context: current growth areas, career aspirations, recurring feedback themes.

If the user doesn't have this info yet, skip gracefully.

---

## Output

### Filename

Derive from full name if not provided in arguments: lowercase, spaces to hyphens, remove special characters (umlauts to base letter). Example: "Fabian Krönner" → `fabian-kronner.md`.

### File Structure

Write to `$VAULT/02_Areas/People/[filename].md` with:

**Frontmatter:** name, aliases, role, department, relationship types, created date.

**Sections:**
- **Profile** — Background, personality, communication style
- **Role & Context** — Current role, department, reporting structure, responsibilities, projects
- **Development** — Growth areas, career aspirations, feedback themes
- **Team Goals** — For direct reports, their team objectives
- **Performance** — Running log of wins, feedback given, feedback received, insights
- **Interactions** — Chronological log of 1:1s and meetings (rituals append here)
- **Action Items** — Active and completed items
- **Notes** — Additional context

### Confirmation

After writing, confirm the file was created and explain what it's ready to receive: 1:1 notes from daily reviews, wins and feedback tracking, development goals. Suggest opening in Obsidian to review and add context.
