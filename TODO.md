# TODO

Ideas, improvements, and features for later reference.

## Ideas
- Group by Urgent, Deadlines, Admin, Creative
    - What does this task require from me?
    - If high pressure then urgent or deadline
    - If boring, draining and non-time sensitive -> Admin
    - Engerizing or Interessting -> Creative
    - What am I actually in the mood to work on right now? 
    - Select a daily hightlight. If not done by 16:00 drop everything and do it

## Improvements
- 

## Features

### Obsidian CLI Integration

Optional provider for enhanced vault operations when Obsidian is running.

**Phase 1: Optional Obsidian CLI Provider**
- Add `file_provider` config option: `native | obsidian-cli`
- Graceful fallback to native file ops if Obsidian not running

**Phase 2: Enhanced Search/Context**
- Replace Grep-based searches with `obsidian search` (indexed, faster)
- Use `obsidian backlinks` to surface related content during reflection
- Use `obsidian tasks` to pull incomplete tasks into planning

**Phase 3: Rich Vault Operations**
- `obsidian properties` for clean frontmatter read/write
- `obsidian tags` for tag-based assistant queries
- `obsidian templates` to leverage user's existing Obsidian templates
- `obsidian eval` for arbitrary Obsidian API calls

**Alternative: MCP Server Integration**
- Add `mcp-obsidian` (bitbonsai) as optional MCP server
- 14 AI-native methods: `search_notes`, `patch_note`, `manage_tags`, etc.
- Works without Obsidian running (direct vault access)

**Research**: See agent research on obsidian-cli tools (2026-02-28)
