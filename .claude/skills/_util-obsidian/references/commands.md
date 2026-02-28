# Obsidian CLI Command Reference

Complete reference for Obsidian CLI commands. Run `obsidian help` for the most current list.

## General Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `version` | Show Obsidian version |
| `reload` | Reload the app |
| `restart` | Restart Obsidian |

## File Operations

### Read file content

```bash
obsidian read file="My Note"
obsidian read path="folder/note.md"
```

### Create new file

```bash
obsidian create name="New Note" content="# Hello"
obsidian create name="From Template" template="Meeting Notes" silent
```

### Append to file

```bash
obsidian append file="My Note" content="New paragraph"
```

### Prepend to file

```bash
obsidian prepend file="My Note" content="Added at top"
```

### Move/rename file

```bash
obsidian move file="Old Name" to="New Name"
obsidian rename file="Note" name="Better Name"
```

### Delete file

```bash
obsidian delete file="Unwanted Note"
```

## Search and Navigation

### Full-text search

```bash
obsidian search query="search term" limit=10
obsidian search:context query="term"  # Shows surrounding context
obsidian search:open query="term"     # Opens first result
```

### Backlinks (notes linking TO this file)

```bash
obsidian backlinks file="My Note"
obsidian backlinks file="My Note" total  # Just count
```

### Links (notes this file links TO)

```bash
obsidian links file="My Note"
```

### Unresolved links

```bash
obsidian unresolved  # Links pointing to non-existent notes
```

### Orphan notes

```bash
obsidian orphans  # Notes with no incoming links
```

### Dead ends

```bash
obsidian deadends  # Notes with no outgoing links
```

## Tags

### List all tags

```bash
obsidian tags
obsidian tags sort=count counts  # Sorted by frequency
```

### Find notes with specific tag

```bash
obsidian tag name="project" limit=20
obsidian tag name="status/done"  # Nested tags
```

## Tasks

### List tasks

```bash
obsidian tasks              # All tasks
obsidian tasks daily        # From daily note
obsidian tasks todo         # Incomplete only
obsidian tasks done         # Completed only
```

### Update task status

```bash
obsidian task file="Project" status=x  # Mark complete
obsidian task file="Project" status=" " # Mark incomplete
```

## Properties (Frontmatter)

### Read property

```bash
obsidian property:read name="status" file="My Note"
```

### Set property

```bash
obsidian property:set name="status" value="done" file="My Note"
```

### Remove property

```bash
obsidian property:remove name="status" file="My Note"
```

### List all properties

```bash
obsidian properties file="My Note"
```

### Get aliases

```bash
obsidian aliases file="My Note"
```

## Daily Notes

### Open today's daily note

```bash
obsidian daily
```

### Get daily note path

```bash
obsidian daily:path
```

### Read daily note

```bash
obsidian daily:read
```

### Append to daily note

```bash
obsidian daily:append content="- [ ] New task"
```

### Prepend to daily note

```bash
obsidian daily:prepend content="## Morning"
```

## Templates

### List templates

```bash
obsidian templates
```

### Read template content

```bash
obsidian template:read name="Meeting Notes"
```

### Insert template into file

```bash
obsidian template:insert name="Meeting Notes" file="New Meeting"
```

## Random Notes

### Open random note

```bash
obsidian random
```

### Read random note

```bash
obsidian random:read
```

## Bookmarks

### List bookmarks

```bash
obsidian bookmarks
```

### Add bookmark

```bash
obsidian bookmark file="Important Note"
```

## Outline

### Get document outline (headings)

```bash
obsidian outline file="My Note"
```

## Word Count

```bash
obsidian wordcount file="My Note"
obsidian wordcount path="folder/"  # Entire folder
```

## Tabs and Workspaces

### List open tabs

```bash
obsidian tabs
```

### Open file in new tab

```bash
obsidian tab:open file="My Note"
```

### Recent files

```bash
obsidian recents
```

### Workspaces

```bash
obsidian workspaces              # List all
obsidian workspace               # Current workspace
obsidian workspace:save name="Focus"
obsidian workspace:load name="Focus"
obsidian workspace:delete name="Old"
```

## Commands and Hotkeys

### List all commands

```bash
obsidian commands
```

### Execute command

```bash
obsidian command id="app:reload"
```

### List hotkeys

```bash
obsidian hotkeys
```

## Plugins

### List plugins

```bash
obsidian plugins              # All installed
obsidian plugins:enabled      # Currently enabled
```

### Manage plugins

```bash
obsidian plugin id="my-plugin"           # Plugin info
obsidian plugin:enable id="my-plugin"
obsidian plugin:disable id="my-plugin"
obsidian plugin:install id="plugin-id"
obsidian plugin:uninstall id="my-plugin"
obsidian plugin:reload id="my-plugin"    # Reload after code changes
```

### Restrict plugins

```bash
obsidian plugins:restrict  # Enter restricted mode
```

## Themes and CSS

### List themes

```bash
obsidian themes
```

### Set theme

```bash
obsidian theme              # Current theme
obsidian theme:set name="Minimal"
obsidian theme:install name="Theme Name"
obsidian theme:uninstall name="Theme Name"
```

### CSS Snippets

```bash
obsidian snippets              # List all
obsidian snippets:enabled      # Currently enabled
obsidian snippet:enable name="my-snippet"
obsidian snippet:disable name="my-snippet"
```

## Developer Tools

### Run JavaScript

```bash
obsidian eval code="app.vault.getFiles().length"
obsidian eval code="app.workspace.activeLeaf.view.file.path"
```

### Console and errors

```bash
obsidian dev:console              # All console output
obsidian dev:console level=error  # Errors only
obsidian dev:errors               # Recent errors
```

### Screenshot

```bash
obsidian dev:screenshot path=screenshot.png
```

### DOM inspection

```bash
obsidian dev:dom selector=".workspace-leaf"
obsidian dev:dom selector=".workspace-leaf" text  # Text content only
```

### CSS inspection

```bash
obsidian dev:css selector=".workspace-leaf" prop=background-color
```

### Mobile emulation

```bash
obsidian dev:mobile on
obsidian dev:mobile off
```

### Debug controls

```bash
obsidian dev:debug      # Open debugger
obsidian dev:cdp        # Chrome DevTools Protocol
obsidian devtools       # Open dev tools
```

## File History (Sync)

### View diff

```bash
obsidian diff file="My Note"
```

### History

```bash
obsidian history file="My Note"
obsidian history:list file="My Note"
obsidian history:read file="My Note" version=2
obsidian history:restore file="My Note" version=2
obsidian history:open file="My Note"
```

## Sync

```bash
obsidian sync              # Sync status
obsidian sync:status
obsidian sync:history
obsidian sync:deleted      # Deleted files in sync
```

## Publish

```bash
obsidian publish:site      # Site info
obsidian publish:list      # Published files
obsidian publish:status file="My Note"
obsidian publish:add file="My Note"
obsidian publish:remove file="My Note"
obsidian publish:open file="My Note"
```

## Useful Flags

| Flag | Description |
|------|-------------|
| `--copy` | Copy output to clipboard |
| `silent` | Prevent file from opening |
| `total` | Return count on list commands |
| `overwrite` | Overwrite existing file |
| `vault="Name"` | Target specific vault |

## Multiline Content

Use `\n` for newlines and `\t` for tabs:

```bash
obsidian append file="Log" content="Line 1\nLine 2\n\tIndented"
```
