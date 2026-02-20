---
cssClasses: dashboard
type: hub
---

[[00_Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]

---

# ✱ Projects

> Active work with deadlines. Track progress, milestones, and deliverables.

---

## Overview

Projects are deadline-driven work with clear outcomes. Each project has an end date and defined deliverables. Use this Hub to navigate active projects and track overall progress.

---

## Active Projects by Deadline

```dataview
TABLE WITHOUT ID
  file.link as "Project",
  end_date as "Due Date",
  owner as "Owner",
  status as "Status",
  choice(end_date < date(today), "❗️Overdue", choice(end_date < date(today) + dur(14 days), "⚠️ Due Soon", "✅ On Track")) as "Timeline"
FROM "01_Projects"
WHERE status = "active" AND file.name != "✱ Projects"
SORT end_date ASC
```

---

## Recently Updated

```dataview
TABLE WITHOUT ID
  file.link as "Project",
  file.mtime as "Last Updated",
  status as "Status"
FROM "01_Projects"
WHERE status = "active" AND file.name != "✱ Projects"
SORT file.mtime DESC
LIMIT 5
```

---

## Related Hubs

- [[02_Areas/People/✱ People|✱ People]] - Team members and stakeholders
- [[02_Areas/Insights/✱ Insights|✱ Insights]] - Learnings from project work
