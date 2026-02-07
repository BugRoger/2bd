---
cssClasses: dashboard
---

[[Day]] | [[Week]] | [[Month]] | [[Quarter]] | [[Year]] | [[03_Resources/Brain/Navigator|Brain]]

---

# 2bd Control Center

> Your second brain at a glance. Rituals run via Claude CLI, browse and write here.

## Living Notes (Tier 1)

- [[Day|📅 Today]] - Your active daily workspace
- [[Week|📆 This Week]] - Weekly focus and priorities
- [[Month|📊 This Month]] - Monthly themes and progress
- [[Quarter|🎯 This Quarter]] - Quarterly goals and direction

---

## Active Projects

```dataview
TABLE WITHOUT ID
  file.link as "Project",
  end_date as "Due",
  status as "Status",
  choice(end_date < date(today), "🔴", choice(end_date < date(today) + dur(30 days), "🟡", "🟢")) as "Health"
FROM "01_Projects"
WHERE status = "active"
SORT end_date ASC
LIMIT 10
```

---

## Recent People Interactions

```dataview
TABLE WITHOUT ID
  file.link as "Person",
  role as "Role",
  relationship as "Relationship"
FROM "02_Areas/People"
SORT file.mtime DESC
LIMIT 10
```

---

## Key Insights

```dataview
LIST
FROM "02_Areas/Insights"
SORT file.name ASC
```

---

## Quick Actions

Run these in terminal:
- 🎯 `claude skill run rituals/planning/daily-planning`
- 🔍 `claude skill run rituals/review/daily-review`
- 📦 `claude skill run actions/create-project "Project Name"`

Navigate:
- [[03_Resources/Brain/Navigator|📚 Historical Brain]] - Year, quarters, months, and days
- [[01_Projects/Dashboard|📁 Projects]] - Active project tracking
- [[02_Areas/People/Dashboard|👥 People]] - Relationship notes
- [[02_Areas/Insights/Dashboard|💡 Insights]] - Theme-based learnings

---

## System Stats

```dataview
TABLE WITHOUT ID
  length(rows) as "Count"
FROM ""
GROUP BY file.folder
WHERE file.folder != ".obsidian"
SORT file.folder ASC
```
