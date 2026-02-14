---
name: person-onboard
description: Create a new person dossier through guided interview. Use to onboard a colleague into your people management system.
argument-hint: "[firstname-lastname]"
---

# Person Onboard

Create a living dossier for a colleague through a guided interview.

## Setup

**Use sub-skill: `_sub/fetch/get-config`** to get `$VAULT`.

If no config exists, error: "No vault configured. Run `/init` first."

## Mode Detection

Parse `$ARGUMENTS`:

1. If argument provided (e.g., `sarah-kim`) → use as filename, proceed to interview
2. If no argument → ask for name and derive filename

---

## Interview

Conduct a conversational interview. Ask questions one section at a time, waiting for responses.

### Part 1: Basic Info

"Let's create a dossier for this person."

- "What's their full name?"
- "What do people call them? (nickname, short name)" → for `aliases`
- "What's their current role or title?"
- "What department or team are they in?"

**Relationship type** — present options:

"What's your relationship to them?"

| Category | Options |
|----------|---------|
| **Reports to you** | Direct Report (Manager), Direct Report (IC), Skip-level IC |
| **Peers** | Peer (Senior Management), Peer (Executive), Peer (IC) |
| **You report to** | Manager, Skip-level Manager |
| **External** | Stakeholder, Partner |

Allow multiple selections if relevant.

---

### Part 2: Context

"Now let's capture some context about working with them."

- "How did you start working together? When did you first meet?"
- "Who do they report to?"
- "Who reports to them? (if applicable)"
- "What are their key responsibilities or projects?"

---

### Part 3: Personality & Style

"Let's understand how they operate."

- "How would you describe their personality?"
- "What's their communication style?" (Prompt: async/sync preference, detail level, response time)
- "How do they make decisions?"
- "What motivates them?"
- "Any patterns or tendencies to be aware of?"

---

### Part 4: Development (Optional)

"Finally, some optional context for performance management."

- "What are their current growth areas or development goals?"
- "Where do they want to go in their career?"
- "Any recurring feedback themes?"

If the user doesn't have this info yet, skip with: "No problem, you can add this as you learn more about them."

---

## Generate Dossier

### Derive Filename

If not provided in arguments, derive from full name:
- Lowercase
- Replace spaces with hyphens
- Remove special characters (umlauts → base letter)
- Example: "Fabian Krönner" → `fabian-kronner.md`

### Write File

Generate the dossier using the gathered information.

**Path:** `$VAULT/02_Areas/People/[filename].md`

**Content structure:**

```markdown
---
name: [Full Name]
aliases: [nicknames as array]
role: [Role/Title]
department: [Department]
relationship: [relationship types as array]
created: [today's date YYYY-MM-DD]
---

[[00_Brain/✱ Home|✱ Home]] | [[02_Areas/People/✱ People|✱ People]]

---

# [Full Name]

## Profile

**Background:**
[How you started working together, first met context]

**Personality:**
[Personality description from interview]

**Communication Style:**
- Prefers: [preferences from interview]
- Avoid: [any noted avoidances]

---

## Role & Context

**Current Role:** [Role]

**Department:** [Department]

**Reports To:** [Their manager]

**Direct Reports:** [Their reports, or "N/A"]

**Key Responsibilities:**
- [responsibilities from interview]

**Current Projects:**
- [projects from interview]

---

## Development

**Growth Areas:**
- [from interview, or empty]

**Career Aspirations:**
[from interview, or empty]

**Feedback Themes:**
- [from interview, or empty]

---

## Team Goals

*For direct reports: their team's key objectives*

**Current Quarter:**
-

---

## Performance

*Running log of wins, feedback, and insights*

### Wins
<!-- Append wins here, most recent first -->

### Feedback Given
<!-- Feedback you've provided to them -->

### Feedback Received
<!-- Feedback about them from others -->

### Insights
<!-- Patterns and observations over time -->

---

## Interactions

*Chronological log of 1:1s and meetings. Most recent first.*

<!-- Rituals append interactions here -->

---

## Action Items

### Active
- [ ]

### Completed
- [x]

---

## Notes

*Additional context*

- [Any additional notes from interview]
```

---

## Confirmation

After writing:

"Created dossier for **[Name]** at `02_Areas/People/[filename].md`

Their file is now ready to:
- Receive 1:1 notes from daily reviews
- Track wins and feedback over time
- Store development goals

Next: Open the file in Obsidian to review and add any additional context."
