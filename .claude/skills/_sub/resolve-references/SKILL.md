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

Receive the target date (required, YYYY-MM-DD format) and optional calendar markdown file path.

Validate the target date format. Read the vault path from `.claude/config.md`. If not found or the vault doesn't exist, exit with an error suggesting running `/init`.

Output a markdown header "# Vault References" to stdout.

Check for static vault files (Week.md, Month.md, Quarter.md, Today.md) in the Captive directory. For each file, indicate whether it exists with a checkmark or is not found.

Check for directive files (user-profile.md, ai-personality.md) in the Directives directory (`00_Brain/Systemic/Directives/`). For each file, indicate whether it exists with a checkmark or is not found.

If calendar data is provided, extract people from 1:1 meeting entries. Search for each person's file in `02_Areas/People/` using case-insensitive matching. Report each person with their file path if found, or indicate no file found.

Search for active project files in `01_Projects/`, excluding hub files (containing ✱) and non-active status projects. Extract titles from frontmatter when available. List each active project with its file path.

All output is written to stdout as markdown. The orchestrator captures this output and includes it in the conversation for the skill to reference.

## Output Format

The skill writes to stdout as markdown (orchestrator captures this via Task tool):

```markdown
# Vault References

## Static References

- **Week.md**: /path/to/vault/00_Brain/Captive/Week.md ✓
- **Month.md**: /path/to/vault/00_Brain/Captive/Month.md ✓
- **Quarter.md**: /path/to/vault/00_Brain/Captive/Quarter.md ✗ (not found)
- **Today.md**: /path/to/vault/00_Brain/Captive/Today.md ✗ (not found)

## Directives

- **user-profile.md**: /path/to/vault/00_Brain/Systemic/Directives/user-profile.md ✓
- **ai-personality.md**: /path/to/vault/00_Brain/Systemic/Directives/ai-personality.md ✓

## People (from calendar 1:1s)

- **Sarah Chen**: /path/to/vault/02_Areas/People/Sarah Chen.md ✓
- **John Doe**: (no file found) ✗

## Projects (active)

- **quarterly-planning**: /path/to/vault/01_Projects/2026-03-31-quarterly-planning.md ✓
- **team-restructure**: /path/to/vault/01_Projects/2026-04-15-team-restructure.md ✓
```

The orchestrator includes this output in the conversation history.

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
5. Includes output in conversation history
6. Skills reference context naturally from conversation

Skills can naturally reference:
- "Load Week.md for context" → path already in conversation
- "For each 1:1 person, check their file" → paths listed in conversation
- "Review active projects" → paths available in conversation

## Notes

- Uses bash test commands for file existence checks
- Uses grep and sed for parsing markdown and frontmatter
- Gracefully handles missing optional files (calendar, people, projects)
- Output is included directly in conversation history
- All paths are absolute for easy reference
- Status indicators (✓/✗) provide immediate visibility
- People extraction uses fuzzy matching (case-insensitive find)
- Projects are filtered to active status only
- No session directory required - all data passed as arguments