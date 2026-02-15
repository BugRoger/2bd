---
name: resolve-references
description: Resolve vault file paths and entity references. Returns structured markdown via Task tool result.
disable-model-invocation: true
argument-hint: "[target_date: YYYY-MM-DD] [calendar_md: (optional)]"
---

# Resolve References

Discover vault file paths and entity references based on needs declared in the skill.

## Inputs

- `$1` (target_date) — Required. Target date in YYYY-MM-DD format
- `$2` (calendar_md) — Optional. Path to calendar.md file containing calendar events

## Task

Execute the bash script below to resolve vault references.

```bash
#!/bin/bash
set -euo pipefail

target_date="${1:?Error: target_date required (YYYY-MM-DD)}"
calendar_md="${2:-}"

# Validate target_date format (basic check)
if [[ ! "$target_date" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    echo "Error: target_date must be in YYYY-MM-DD format, got: $target_date" >&2
    exit 1
fi

# 1. Read Configuration - Get vault path
vault_path=$(grep "^vault_path:" .claude/config.md 2>/dev/null | cut -d' ' -f2-)

if [[ -z "$vault_path" ]]; then
    echo "Error: vault_path not found in .claude/config.md" >&2
    echo "Run /init to configure vault path" >&2
    exit 1
fi

if [[ ! -d "$vault_path" ]]; then
    echo "Error: Vault directory does not exist at $vault_path" >&2
    exit 1
fi

# 2. Check if calendar is provided
has_calendar=false
if [[ -n "$calendar_md" ]] && [[ -f "$calendar_md" ]]; then
    has_calendar=true
fi

# Start output
echo "# Vault References"
echo ""

# 3. Resolve Static Vault Files
echo "## Static References"
echo ""

# Week.md
week_file="$vault_path/00_Brain/Captive/Week.md"
if [[ -f "$week_file" ]]; then
    echo "- **Week.md**: $week_file ✓"
else
    echo "- **Week.md**: $week_file ✗ (not found)"
fi

# Month.md
month_file="$vault_path/00_Brain/Captive/Month.md"
if [[ -f "$month_file" ]]; then
    echo "- **Month.md**: $month_file ✓"
else
    echo "- **Month.md**: $month_file ✗ (not found)"
fi

# Quarter.md
quarter_file="$vault_path/00_Brain/Captive/Quarter.md"
if [[ -f "$quarter_file" ]]; then
    echo "- **Quarter.md**: $quarter_file ✓"
else
    echo "- **Quarter.md**: $quarter_file ✗ (not found)"
fi

# Today.md
today_file="$vault_path/00_Brain/Captive/Today.md"
if [[ -f "$today_file" ]]; then
    echo "- **Today.md**: $today_file ✓"
else
    echo "- **Today.md**: $today_file ✗ (not found)"
fi

echo ""

# 4. Resolve Entity References: People
echo "## People (from calendar 1:1s)"
echo ""

people_found=false
if [[ "$has_calendar" == true ]]; then
    # Extract names from lines containing "1:1" or "1-1"
    # Look for patterns like "1:1: Sarah Chen" or "1:1 with John Doe"
    people_lines=$(grep -iE "(1:1|1-1)" "$calendar_md" 2>/dev/null || true)

    if [[ -n "$people_lines" ]]; then
        # Parse names: extract text after "1:1:" or "1:1 with"
        while IFS= read -r line; do
            if [[ -z "$line" ]]; then continue; fi

            # Extract everything after "1:1" or "1-1" and strip "with", then trim whitespace
            person=$(echo "$line" | sed -E 's/.*(1:1|1-1):? *(with )?//i' | xargs)

            if [[ -z "$person" ]]; then continue; fi

            # Check if People directory exists first
            if [[ ! -d "$vault_path/02_Areas/People" ]]; then
                echo "- **${person}**: (no file found) ✗"
                people_found=true
                continue
            fi

            # Try to find their file in 02_Areas/People/
            person_file=$(find "$vault_path/02_Areas/People" -type f -iname "*${person}*.md" 2>/dev/null | head -1 || true)

            if [[ -n "$person_file" ]]; then
                echo "- **${person}**: $person_file ✓"
                people_found=true
            else
                echo "- **${person}**: (no file found) ✗"
                people_found=true
            fi
        done <<< "$people_lines"
    fi
fi

if [[ "$people_found" == false ]]; then
    echo "(no 1:1 meetings found in calendar)"
fi

echo ""

# 5. Resolve Entity References: Projects
echo "## Projects (active)"
echo ""

projects_dir="$vault_path/01_Projects"
projects_found=false

if [[ -d "$projects_dir" ]]; then
    # List all .md files except the hub file
    for project_file in "$projects_dir"/*.md; do
        # Skip if no files found
        if [[ ! -f "$project_file" ]]; then
            continue
        fi

        # Skip hub file
        filename=$(basename "$project_file")
        if [[ "$filename" == *"✱"* ]]; then
            continue
        fi

        # Extract title from frontmatter if possible, otherwise use filename
        title=$(grep "^title:" "$project_file" 2>/dev/null | cut -d':' -f2- | sed 's/^ *//' | sed 's/ *$//' || echo "")
        if [[ -z "$title" ]]; then
            title="${filename%.md}"
        fi

        # Check if project is active
        status=$(grep "^status:" "$project_file" 2>/dev/null | cut -d':' -f2- | sed 's/^ *//' | sed 's/ *$//' || echo "")

        # Only include active projects or those without explicit status
        if [[ -z "$status" ]] || [[ "$status" == "active" ]]; then
            echo "- **${title}**: $project_file ✓"
            projects_found=true
        fi
    done
fi

if [[ "$projects_found" == false ]]; then
    echo "(no active projects found)"
fi

echo ""
```

## Output Format

The skill writes to stdout as markdown (orchestrator captures this via Task tool):

```markdown
# Vault References

## Static References

- **Week.md**: /path/to/vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /path/to/vault/00_Brain/Captive/Month.md ✓
- **Quarter.md**: /path/to/vault/00_Brain/Captive/Quarter.md ✗ (not found)
- **Today.md**: /path/to/vault/00_Brain/Captive/Today.md ✗ (not found)

## People (from calendar 1:1s)

- **Sarah Chen**: /path/to/vault/02_Areas/People/Sarah Chen.md ✓
- **John Doe**: (no file found) ✗

## Projects (active)

- **quarterly-planning**: /path/to/vault/01_Projects/2026-03-31-quarterly-planning.md ✓
- **team-restructure**: /path/to/vault/01_Projects/2026-04-15-team-restructure.md ✓
```

The orchestrator includes this output in memory.md for the inline phase to reference.

## Error Handling

| Error | Behavior |
|-------|----------|
| Config missing | Exit with error message, suggest running /init |
| Vault path missing | Exit with error message |
| Vault directory doesn't exist | Exit with error message |
| target_date missing | Exit with error message |
| target_date invalid format | Exit with error message |
| calendar_md provided but doesn't exist | Skip people resolution, report "(no 1:1 meetings found)" |
| People/Projects directories missing | Report as "(no active projects found)" or "(no 1:1 meetings found)" |

## Examples

**Basic usage (without calendar):**
```bash
# Run skill with just target date
claude skill run _sub/resolve-references -- "2026-02-15"
```

**With calendar:**
```bash
# Create mock calendar file
calendar_file=$(mktemp)
cat > "$calendar_file" << 'EOF'
## Morning
- **10:00-10:30** 1:1: Sarah Chen
- **11:00-12:00** Team standup
EOF

# Run skill with calendar
claude skill run _sub/resolve-references -- "2026-02-15" "$calendar_file"

# Cleanup
rm "$calendar_file"
```

**Testing manually:**
```bash
# Without calendar
cd /path/to/2bd
./.claude/skills/_sub/resolve-references/SKILL.md "2026-02-15"

# With calendar
echo "- **10:00** 1:1: Sarah Chen" > /tmp/test-calendar.md
./.claude/skills/_sub/resolve-references/SKILL.md "2026-02-15" /tmp/test-calendar.md
```

## Integration with Orchestrator

The orchestrator:
1. Resolves target_date from user input (e.g., "today" → "2026-02-15")
2. Spawns fetch-calendar sub-skill if calendar data needed (writes to temp file)
3. Spawns this skill with target_date and optional calendar file path
4. Captures stdout markdown output via Task tool result
5. Includes output in memory.md under "## Vault References" section
6. Inline phase reads memory.md to see what's available

The inline phase skill instructions can naturally reference:
- "Load Week.md for context" → skill reads path from memory.md
- "For each 1:1 person, check their file" → paths listed in memory.md
- "Review active projects" → paths available in memory.md

## Notes

- Uses bash test commands for file existence checks
- Uses grep and sed for parsing markdown and frontmatter
- Gracefully handles missing optional files (calendar, people, projects)
- Output is designed to be included directly in memory.md
- All paths are absolute for easy reference by inline phase
- Status indicators (✓/✗) provide immediate visibility
- People extraction uses fuzzy matching (case-insensitive find)
- Projects are filtered to active status only
- No session directory required - all data passed as arguments
