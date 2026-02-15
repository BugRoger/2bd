---
name: update-semantic
description: Append insights and updates to semantic notes (People, Projects, Areas, Insights, Resources). Preserves existing content while adding new dated entries.
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

<HARD-GATE>
Before appending prose to any semantic note, pass the content through the `apply-writing-style` sub-skill. Invoke it with the draft content, receive polished version, then proceed with the append.
</HARD-GATE>

# Update Semantic Sub-Skill

Appends new content to semantic notes based on daily review synthesis. Handles multiple note types and preserves existing content.

## Input Arguments

Arguments are passed as key-value pairs:
- `vault`: Path to the vault
- `updates`: JSON array of updates to apply

**Update format:**
```json
{
  "updates": [
    {
      "type": "person",
      "path": "02_Areas/People/SarahK.md",
      "section": "Interactions",
      "content": "2026-02-14: Discussed career growth goals. She's interested in tech lead path.",
      "changelog_skill": "review-daily"
    },
    {
      "type": "project",
      "path": "01_Projects/2026-03-15-platform-migration.md",
      "section": "Progress",
      "content": "2026-02-14: API design finalized. Ready for implementation.",
      "changelog_skill": "review-daily"
    },
    {
      "type": "insight",
      "path": "02_Areas/Insights/delegation.md",
      "section": "Evidence",
      "content": "2026-02-14: Letting Sarah lead the design review freed up 2 hours.",
      "changelog_skill": "review-daily"
    },
    {
      "type": "resource",
      "path": "03_Resources/articles/distributed-systems.md",
      "section": "Notes",
      "content": "Captured from daily review. Key insight: CAP theorem tradeoffs."
    }
  ]
}
```

## Instructions

Parse the updates JSON array. Validate each update has type, path, section, content, and optionally changelog_skill.

For each update, resolve the full path by prepending the vault path. Check if the file exists. If not, log a warning and add to the skipped array.

Read the existing content of the semantic note. Locate the target section heading matching `## {section}`. If the section exists, append the new content after existing section content. If the section doesn't exist, append a new section at the end.

Insert the new content with a blank line before it, and prepend with a bullet point if not already formatted. Preserve all existing content in the section.

Write the modified content back to the file.

If `changelog_skill` was provided in the update, call the `append-changelog` sub-skill with the file path, skill name, action "Added", and the section name.

For resource type notes that don't exist, optionally create a minimal note with frontmatter and the content. For other types, skip creation and add to skipped array.

Return structured JSON showing applied updates, skipped items, and created files:

**Success:**
```json
{
  "success": true,
  "applied": [
    { "path": "02_Areas/People/SarahK.md", "section": "Interactions", "status": "appended", "changelog": true }
  ],
  "skipped": [],
  "created": []
}
```

## Semantic Note Paths by Type

| Type | Expected Path Pattern | Default Section |
|------|----------------------|-----------------|
| person | `02_Areas/People/{Name}.md` | Interactions |
| project | `01_Projects/{date-name}.md` | Progress |
| insight | `02_Areas/Insights/{topic}.md` | Evidence |
| area | `02_Areas/{name}.md` | Notes |
| resource | `03_Resources/{category}/{name}.md` | Notes |

## Safety

- Always read before write to preserve existing content
- Never delete or overwrite existing section content
- Only append to existing sections
- Skip updates for non-existent files (except resources)
- Log all actions for transparency
