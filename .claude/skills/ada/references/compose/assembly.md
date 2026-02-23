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

Read `vault/00_Brain/Systemic/Config/ada.yaml` for assistant order:
1. brief
2. goals
3. calendar
4. journal
5. achievements
6. relationships
7. projects

### Section Extraction

For each assistant output file:
1. Find `## Section` heading
2. Extract all content until next `##` heading
3. Add to assembled document

### Template

```markdown
# {Timescale} Plan — {date}

{Brief section}

---

{Goals section}

---

{Calendar section}

---

(etc.)

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

{Brief section}

---

{Goals section}

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
- brief: {path}
- goals: {path}
- calendar: {path}
- (etc.)

## Output
{path to assembled file}

## Skipped
- {assistant}: {reason if any failed}

## Timestamp
{ISO timestamp}
```
