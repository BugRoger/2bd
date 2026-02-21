# 2bd - Claude Code Guidelines
This document contains project-specific guidelines and best practices for Claude Code when working on this codebase.

## Important Prime Directives
- You must always refer to me as Michi

## Rules Summary

### 1. Meta - Maintaining This Document
See all rules in section **## META - MAINTAINING THIS DOCUMENT**
1. When adding new rules to detailed sections below, always update this summary section with a corresponding one-sentence summary
2. Each rule in this summary must reference its corresponding detailed section
3. Follow the writing guidelines when adding new rules

### 2. Documentation
See all rules in section **## Documentation**
1. Full docs for skill creation, templates, rituals, and guidelines are at the Development tab

### 3. Docs Linking (Mintlify)
See all rules in section **## Docs Linking (Mintlify)**
1. ALWAYS use root-relative paths without `.md`/`.mdx` for internal doc links
2. ALWAYS use anchors on root-relative paths for section cross-references
3. NEVER use em dashes and apostrophes in headings — they break Mintlify anchor links
4. ALWAYS reply with full `https://2bd.l48a.de/...` URLs when asked for links
5. ALWAYS end replies with referenced doc URLs when you touch docs
6. ALWAYS keep absolute docs URLs in README for GitHub compatibility
7. NEVER include personal device names/hostnames/paths in content — use placeholders

### 4. Timescale Architecture
See all rules in section **## Timescale Architecture**
1. 2bd uses 4 timescales: Daily → Weekly → Quarterly → Yearly
2. ALWAYS update all listed locations when modifying timescales

### 5. Agent-Specific Notes
See all rules in section **## Agent-Specific Notes**
1. `vault/` is a symlink to user's OneDrive Second Brain folder
2. ALWAYS verify in code; NEVER guess
2. NEVER create/apply/drop git stash entries unless explicitly requested
3. ALWAYS assume other agents may be working; keep unrelated WIP untouched
4. NEVER create/remove/modify git worktrees unless explicitly requested
5. NEVER switch branches unless explicitly requested
6. When user says "push": you may `git pull --rebase` to integrate latest changes
7. When user says "commit": scope to your changes only
8. When user says "commit all": commit everything in grouped chunks

---

## META - MAINTAINING THIS DOCUMENT

### Keeping the Summary Section Up to Date

**Rule**: Whenever you add, modify, or remove rules in the detailed sections below, you MUST update the "Rules Summary" section at the top of this document.

**Process**:
1. Add the new rule to the appropriate detailed section below
2. Add a corresponding one-sentence summary to the Rules Summary section
3. Ensure the summary references the detailed section using the format: "See all rules in section **## SECTION NAME**"
4. If creating a new topic, add both a new numbered topic in the summary AND a new detailed section below

**Example**:
If you add a new rule about async patterns in the detailed "ASYNC PATTERNS" section, you must add:
- A new topic in Rules Summary: "4. Async Patterns - See all rules in section **## ASYNC PATTERNS**"
- A one-sentence summary under that topic

### Writing Effective Guidelines

When adding new rules to this document, follow these principles:

**Core Principles (Always Apply):**
1. **Use absolute directives** - Start with "NEVER" or "ALWAYS" for non-negotiable rules
2. **Lead with why** - Explain the problem/rationale before showing the solution (1-3 bullets max)
3. **Be concrete** - Include actual commands/code for project-specific patterns
4. **Minimize examples** - One clear point per code block
5. **Bullets over paragraphs** - Keep explanations concise
6. **Action before theory** - Put immediate takeaways first

**Optional Enhancements (Use Strategically):**
- **❌/✅ examples**: Only when the antipattern is subtle or common
- **"Why" or "Rationale" section**: Keep to 1-3 bullets explaining the underlying reason
- **"Warning Signs" section**: Only for gradual/easy-to-miss violations
- **"General Principle"**: Only when the abstraction is non-obvious  
- **Decision trees**: Only for 3+ factor decisions with multiple considerations

**Anti-Bloat Rules:**
- ❌ Don't add "Warning Signs" to obvious rules (e.g., "imports at top")
- ❌ Don't show bad examples for trivial mistakes
- ❌ Don't create decision trees for simple binary choices
- ❌ Don't add "General Principle" when the section title already generalizes
- ❌ Don't write paragraphs explaining what bullets can convey
- ❌ Don't write long "Why" explanations - 1-3 bullets maximum

---

## Documentation

**[Full docs →](https://2bd.l48a.de/development/skills)**

For skill creation, templates, rituals, and guidelines, see the Development tab in docs.

## Docs Linking (Mintlify)

Docs are hosted on Mintlify (2bd.l48a.de).

- **Internal doc links** in `docs/**/*.md`: root-relative, no `.md`/`.mdx` (example: `[Config](/configuration)`)
- **Section cross-references**: use anchors on root-relative paths (example: `[Hooks](/configuration#hooks)`)
- **Headings and anchors**: avoid em dashes and apostrophes — they break Mintlify anchor links
- **When asked for links**: reply with full `https://2bd.l48a.de/...` URLs (not root-relative)
- **When you touch docs**: end the reply with the `https://2bd.l48a.de/...` URLs you referenced
- **README (GitHub)**: keep absolute docs URLs so links work on GitHub
- **Content must be generic**: no personal device names/hostnames/paths; use placeholders like `user@gateway-host`

When working with documentation, read the mintlify skill.

---

## Timescale Architecture

2bd uses 4 timescales: Daily → Weekly → Quarterly → Yearly

When modifying timescales, update these locations:
- `.claude/skills/ritual-planning-{scale}/` — planning ritual
- `.claude/skills/ritual-review-{scale}/` — review ritual
- `init/assets/scaffold/00_Brain/Systemic/Coaching/{domain}/{scale}.md` — coaching files (leadership, planning, review)
- `init/assets/scaffold/00_Brain/Systemic/Templates/Captive/{scale}.md`
- `init/assets/scaffold/00_Brain/Systemic/Templates/Periodic/{scale}ly.md`
- Adjacent timescale rituals (context loading, synthesis references)
- `docs/reference/rituals.md`, `docs/overview/how-it-works.md`
- `docs/reference/vault-structure.md`, `docs/reference/glossary.md`
- `docs/how-it-works.excalidraw.json`
- `init/assets/scaffold/00_Brain/✱ Home.md` (navigation)

---

## Agent-Specific Notes

- **Vault location**: `vault/` is a symlink to the user's OneDrive Second Brain folder
- **High-confidence answers only**: verify in code; do not guess
- **Multi-agent safety**: do not create/apply/drop git stash entries unless explicitly requested (includes `git pull --rebase --autostash`)
- **Multi-agent safety**: assume other agents may be working; keep unrelated WIP untouched; avoid cross-cutting state changes
- **Multi-agent safety**: do not create/remove/modify git worktree checkouts (or edit `.worktrees/*`) unless explicitly requested
- **Multi-agent safety**: do not switch branches or check out a different branch unless explicitly requested
- **Multi-agent safety**: running multiple agents is OK as long as each agent has its own session
- **When user says "push"**: you may `git pull --rebase` to integrate latest changes (never discard other agents' work)
- **When user says "commit"**: scope to your changes only
- **When user says "commit all"**: commit everything in grouped chunks
- **Unrecognized files**: keep going; focus on your changes and commit only those
- **Reports**: focus on your edits; avoid guard-rail disclaimers unless truly blocked; end with brief "other files present" note only if relevant
