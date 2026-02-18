# Meeting Templates

Templates for different meeting types in Today.md.

## 1:1 Meeting Template

Use for one-on-one meetings with direct reports, peers, or skip-levels.

```markdown
### [[PersonName]]
<!-- 1:1 Context: Last spoke [date]. Topics: [active topics]. Related: [projects]. -->
*→ Update [[02_Areas/People/PersonName|their People file]] after this conversation*

**Check-in**
- Mood/Energy:
- *Anything I should know?*

**Their Agenda**
- *What's on your mind?*

**Work**
- Wins:
- Blockers: *Where can I help?*

**Growth**
- *What are you learning/developing?*

**Feedback**
- → Them:
- ← Me: *What can I do better?*

**Commitments**
- [ ] Me:
- [ ] Them:
```

### Context Comment

The HTML comment above the template captures enriched context from the Person file:

- **Last spoke** — Date of last 1:1 or significant interaction
- **Topics** — Active topics from recent conversations
- **Related** — Projects they're involved in

This context is visible when editing but doesn't render in preview.

## Group Meeting Template

Use for team meetings, status updates, workshops, and similar.

```markdown
### [Meeting Name/Topic]
**Decisions:**
- [Decision made with context]

**Next Steps:**
- [ ] [Owner]: [Action item with deadline if relevant]

**Notes:**
- [Key discussion points]
- [Important context]
```

## Interview Template

Use for candidate interviews.

```markdown
### Interview: [Candidate Name]
**Role:** [Position title]

**Scorecard** *(1-5 scale: 1=Poor, 3=Meets bar, 5=Exceptional)*
- Technical: _ /5
- Communication: _ /5
- Problem-solving: _ /5
- Leadership: _ /5
- Culture fit: _ /5

**Strengths:**
-

**Concerns:**
-

**Recommendation:** [ ] Strong Yes  [ ] Yes  [ ] Maybe  [ ] No
```

## Template Selection

Choose template based on meeting detection:

| Signal | Template |
|--------|----------|
| Title contains single person name (from People files) | 1:1 |
| Title contains "Interview" or "Candidate" | Interview |
| All other meetings | Group |

When uncertain, default to Group template.
