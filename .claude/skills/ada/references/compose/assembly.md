# Assembly Protocol

## Planning Rituals → Captive

For `plan` actions, assemble into `vault/00_Brain/Captive/{Timescale}.md`:

| Timescale | Target File |
|-----------|-------------|
| daily | Captive/Today.md |
| weekly | Captive/Week.md |
| quarterly | Captive/Quarter.md |
| yearly | Captive/Year.md |

### Assembly Order

Read `vault/00_Brain/Systemic/Ada/section-order.md` for section order per timescale:
1. goals
2. calendar
3. journal
4. achievements
5. relationships
6. projects

Note: Brief section is synthesized by compose, not read from an assistant.

### Section Extraction

For each assistant output file:
1. Find `## Section` heading
2. Extract all content until next `##` heading
3. Add to assembled document

### Template

```markdown
# {Timescale} Plan — {date}

## Brief

**This Week's Focus:** {synthesized from context}

**Growth Edge:** {from leadership coaching}

{Day/week shape narrative}

### Priorities
1. {Priority 1} — {Why it matters}
2. {Priority 2} — {Why it matters}
3. {Priority 3} — {Why it matters}

### Intention
**{One word}** — {Brief explanation}

---

{Goals section}

---

{Calendar section}

---

{Journal section}

---

{Achievements section}

---

{Relationships section}

---

{Projects section}

---

*Assembled by Ada at {timestamp}*
```

## Reflection Rituals → Periodic

For `reflect` actions, assemble into `vault/00_Brain/Periodic/{timescale}/{date}.md`:

| Timescale | Target Pattern |
|-----------|----------------|
| daily | Periodic/Daily/{YYYY-MM-DD}.md |
| weekly | Periodic/Weekly/{YYYY}-W{WW}.md |
| quarterly | Periodic/Quarterly/{YYYY}-Q{Q}.md |
| yearly | Periodic/Yearly/{YYYY}.md |

### Template

```markdown
# {Timescale} Reflection — {date}

{Goals section}

---

{Calendar section}

---

(etc.)

---

*Archived by Ada at {timestamp}*
```

## Compose Output Format

Write to `vault/00_Brain/Synthetic/Assistants/compose/{date}-compose-{action}-{timescale}.md`:

```markdown
# Compose: {action}({timescale}) {date}

## Status
ok

## Assembled From
- goals: {path}
- calendar: {path}
- (etc.)

## Brief Synthesized
yes (plan actions) / no (reflect actions)

## Output
{path to assembled file}

## Skipped
- {assistant}: {reason if any failed}

## Timestamp
{ISO timestamp}
```
