---
cssClasses: dashboard
type: hub
---

[[00_Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]

---

# ✱ People

> Relationships and interactions. Track connections, conversations, and follow-ups.

---

## Overview

People notes track your professional relationships over time. Each person note accumulates interactions, themes, and action items. Use this Hub to navigate your network and stay connected.

---

## By Relationship Type

### Direct Reports

```dataview
TABLE WITHOUT ID
  file.link as "Name",
  role as "Role",
  file.mtime as "Last Interaction"
FROM "02_Areas/People"
WHERE contains(relationship, "Direct Report") AND file.name != "✱ People"
SORT file.mtime DESC
```

### Peers

```dataview
TABLE WITHOUT ID
  file.link as "Name",
  role as "Role",
  file.mtime as "Last Interaction"
FROM "02_Areas/People"
WHERE contains(relationship, "Peer") AND file.name != "✱ People"
SORT file.mtime DESC
```

### All People

```dataview
TABLE WITHOUT ID
  file.link as "Name",
  role as "Role",
  relationship as "Relationship",
  file.mtime as "Last Updated"
FROM "02_Areas/People"
WHERE file.name != "✱ People"
SORT file.name ASC
```

---

## Follow-Up Needed

```dataview
TASK
FROM "02_Areas/People"
WHERE !completed
```

---

## Related Hubs

- [[01_Projects/✱ Projects|✱ Projects]] - Project collaborations
- [[02_Areas/Insights/✱ Insights|✱ Insights]] - Learnings from interactions
