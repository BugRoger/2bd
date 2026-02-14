---
cssClasses: dashboard
type: hub
---

[[00_Brain/✱ Home|✱ Home]] | [[01_Projects/✱ Projects|✱ Projects]] | [[02_Areas/People/✱ People|✱ People]] | [[02_Areas/Insights/✱ Insights|✱ Insights]]

---

# ✱ Insights

> Theme-based learnings that transcend time. Curated wisdom extracted from your experiences.

---

## Overview

Insights are thematic notes that accumulate learnings across projects, interactions, and reflections. Each insight note captures patterns, principles, and evolving understanding around a specific theme.

---

## Active Themes

*Add wikilinks to insight notes as they are created:*

<!-- Example insights to add:
- [[leadership]] - Leading teams and organizations
- [[productivity]] - Systems and practices for getting things done
- [[team-dynamics]] - How teams work together effectively
- [[decision-making]] - Frameworks for making better decisions
- [[career-growth]] - Professional development and advancement
-->

---

## All Insights

```dataview
TABLE WITHOUT ID
  file.link as "Insight",
  theme as "Theme",
  file.mtime as "Last Updated"
FROM "02_Areas/Insights"
WHERE file.name != "✱ Insights"
SORT file.name ASC
```

---

## Recently Updated

```dataview
TABLE WITHOUT ID
  file.link as "Insight",
  file.mtime as "Last Updated"
FROM "02_Areas/Insights"
WHERE file.name != "✱ Insights"
SORT file.mtime DESC
LIMIT 10
```

---

## Related Hubs

- [[01_Projects/✱ Projects|✱ Projects]] - Source of project learnings
- [[02_Areas/People/✱ People|✱ People]] - Source of interaction insights
