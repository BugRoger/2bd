# Writing Style Integration Design

**Issue:** #19 — Epic: Integrate concise writing style across 2bd
**Date:** 2026-02-15
**Status:** Approved

## Vision

All AI-generated content in 2bd reads like skilled human writing. Strunk's principles applied systematically through a copyeditor sub-skill.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Separation of concerns | `ai-personality.md` = interaction style, `apply-writing-style` = prose quality | Personality governs how we interact; writing style governs how prose reads |
| Enforcement model | Copyeditor sub-skill | Skills pass draft prose, get polished version back |
| Location | `_sub/apply-writing-style/` | Follows existing sub-skill pattern |
| Self-contained | Rules live in 2bd | No external skill dependencies |

## Components

### 1. New Sub-skill: apply-writing-style

**Location:** `.claude/skills/_sub/apply-writing-style/SKILL.md`

**Purpose:** Receive draft prose, return polished version.

**Content:**
- Core Strunk rules (active voice, omit needless words, positive form, concrete language)
- AI anti-patterns to avoid (puffery, hedge words, overused AI vocabulary)

**Frontmatter:**
```yaml
name: apply-writing-style
description: Polish prose before writing to files. Applies concise writing principles.
```

### 2. Update write-captive-note

Add mandatory invocation:

```markdown
<HARD-GATE>
Before writing prose to any file, pass the content through the `apply-writing-style` sub-skill.
</HARD-GATE>
```

All rituals flow through write-captive-note, so they inherit polished prose automatically.

### 3. Update update-semantic

Same pattern — add HARD-GATE requiring apply-writing-style before appending to semantic notes.

### 4. Clean Up ai-personality.md

Remove the "Writing Style" section (lines 27-54). Keep only:
- Communication Style (formality, directness, humor)
- Coaching Approach
- Interaction Patterns

Writing rules move to apply-writing-style sub-skill.

### 5. Tighten Templates

Apply writing principles to template prompt text. Example:

**Before:**
```markdown
- *What personal win will you protect for yourself?*
- *What decision did you make that you're proud of?*
```

**After:**
```markdown
- *What win did you protect?*
- *What decision are you proud of?*
```

**Scope:**
- `Templates/Captive/today.md`
- `Templates/Captive/week.md`
- `Templates/Captive/month.md`
- `Templates/Captive/quarter.md`
- `Templates/Captive/year.md`

## Flow

```
Ritual generates prose → write-captive-note → apply-writing-style → polished file
                                    ↓
                           update-semantic → apply-writing-style → polished append
```

## Implementation Stories

1. **Create apply-writing-style sub-skill** — New skill with Strunk's rules and AI anti-patterns
2. **Add HARD-GATEs to prose-writing skills** — write-captive-note and update-semantic
3. **Clean ai-personality.md** — Remove Writing Style section
4. **Tighten Captive templates** — Apply concise writing to prompt text

## Acceptance Criteria

- [x] `apply-writing-style` sub-skill exists with complete rules
- [x] `write-captive-note` invokes apply-writing-style before writes
- [x] `update-semantic` invokes apply-writing-style before writes
- [x] `ai-personality.md` contains only interaction/personality guidance
- [x] Captive templates use tight, direct prompt language
- [ ] Generated content across rituals is more direct and human
