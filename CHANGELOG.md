# Changelog

## 1.3.0

- **Ada character system** — Ada now has a Samantha-like personality with emotional memory, self-reflection, and growth across sessions
- **Obsidian CLI integration** — New `_util-obsidian` skill wraps Obsidian CLI (v1.12+) for vault search, backlinks, tags, and file operations
- **Context-enriched assistants** — Calendar, Projects, and Relationships assistants now pull related vault content via Obsidian CLI for richer context
- Added Ada's semantic memory (`Semantic/Ada/memory.md`) for emotional state and relationship history
- Added learning references for Ada's post-ritual self-reflection at all 4 timescales
- Added plan/reflect references for Ada's ritual integration
- Updated scaffold with Ada's memory and output directories
- Added worktree cleanup order rule to CLAUDE.md

## 1.2.0

- **Parallel assistant execution** — Ada now runs assistants as parallel background agents for 70-80% faster rituals
- **Draft-and-fill architecture** — Assistants output drafts with HTML comment placeholders, Ada orchestrates questions and fills answers
- **Intelligent question ordering** — Ada orders questions by priority (context → strategy → tactics → capture) for natural conversation flow
- **Graceful degradation** — Failed agents don't block ritual completion; partial results still usable
- **Feature flag support** — Control parallel execution via `vault/00_Brain/Systemic/Config/ada.yaml`
- Updated all 7 assistants (goals, calendar, journal, achievements, relationships, projects) for draft mode
- Updated all plan and reflect rituals across all 4 timescales
- Added comprehensive documentation for parallel execution and draft mode
- Added error handling: timeouts, failures, malformed placeholders

## 0.9.0

- Absorbed init skill into Ada — `/ada setup` replaces `/init`, Ada is now the central UX for all human interactions
- Merged brief assistant into compose phase — brief synthesis happens during composition with access to all assistant outputs
- Split templates into Ada base + assistant sections — 19 assistant-owned templates, 4 Ada base templates with compose order
- Added variance-based reflect flow — each assistant compares plan output to actual capture, returns findings to Ada for coaching
- Moved section order to Ada's systemic memory — `vault/00_Brain/Systemic/Ada/section-order.md` stores Ada's preferences
- Renamed `ada.yaml` → `assistants.yaml` for user-configurable assistant settings
- Moved protocol specs to `_specs/` and compose to `ada/references/compose/` (never were assistants)
- Removed `_assistant-brief` and `init` skills entirely
- Updated all documentation and cross-references

## 0.8.0

- Restructured documentation for new user journey — 5 top-level sections: Overview → Configuration → Ada → Assistants → Reference
- Added Overview section with "What is 2bd?", "What You Get", and "Quick Start" pages
- Created Configuration section consolidating installation, settings, and hooks documentation
- Promoted Assistants to top-level section with overview and 7 assistant pages
- Consolidated development docs into Reference — renamed "skills" to "creating-custom-assistants", "rituals" to "creating-custom-rituals"
- Merged tracks documentation into creating-custom-assistants (assistant matrix, coach system)
- Moved skill writing style and GitHub workflow labels to CLAUDE.md
- Fixed all internal documentation links
- Removed obsolete `docs/setup/` and `docs/development/` directories

## 0.7.0

- Implemented Ada-centric skill architecture — Ada owns all logic, entity skills are thin dispatchers
- Moved entity actions into `ada/references/{entity}/{action}.md` (project/create, project/archive, person/onboard)
- Introduced prefix scheme: (none)=user-invokable, `_assistant-*`=internal assistants, `_util-*`=utilities
- Renamed utilities: `_resolve-date` → `_util-resolve-date`, `_append-changelog` → `_util-changelog`
- Simplified aliases: `planning` → `plan`, `reflection` → `reflect`
- Updated ritual command examples in `ada/how-it-works.md` to match renamed commands
- Updated documentation with new skill architecture and prefix conventions

## 0.6.0

- Restructured docs with Ada-first navigation — Ada is now the top-level entry point with domain assistants beneath
- Created dedicated documentation pages for all 7 domain assistants (brief, goals, calendar, journal, achievements, relationships, projects)
- Absorbed GPS methodology into `ada/goals.md` and rituals reference into `ada/how-it-works.md`
- Removed `overview/concepts.md`, `overview/gps-methodology.md`, `overview/how-it-works.md`, `reference/rituals.md`
- Updated all cross-references across documentation

## 0.5.0

- Refactored init to be Ada-orchestrated — init is now a thin wrapper that invokes Ada for the setup experience
- Added awakening script to Ada with Samantha-style personality (curious, self-discovering, warm but not performative)
- Added `setup` and `profile` actions to Ada for first-run and profile updates
- Renamed `user-profile.md` → `human.md` and `ai-personality.md` → `ada.md` in scaffold templates
- Removed Monthly from scaffold (timescale no longer exists)
- Updated docs to reflect new file names and `/ada profile` command

## 0.4.0

- Added timescale declarations to assistant frontmatter — each assistant's SKILL.md now declares `timescales.plan` and `timescales.reflect` arrays
- Ada reads frontmatter directly to determine which assistants to invoke at each timescale
- Added `_assistant-protocol/references/timescales.md` documenting the frontmatter contract
- Replaced hardcoded timescale table in `ritual-flow.md` with reference to frontmatter declarations

## 0.3.0

- Renamed review rituals to reflection rituals (`ritual-review-*` → `ritual-reflection-*`) for semantic alignment
- Renamed Reflection phase to Learning phase across all rituals to avoid terminology collision
- Updated all documentation, templates, and scaffold files to use new terminology

## 0.2.0

- Added timescale coaches with configurable personality — 12 coaching files organized as `Coaching/{domain}/{timescale}.md` where domain is leadership/planning/review and timescale is daily/weekly/quarterly/yearly
- Added coach personality configuration in `ai-personality.md` with Character, Ego, Challenge Level, and Celebration Style settings
- Added Coaching Preferences section to init wizard with 6 coach archetypes: work wife, brutally honest sparring partner, executive assistant with career ambitions, wise mentor, emo teenager, drill sergeant
- Updated all 8 rituals to load timescale-specific coaching files instead of flat domain files
- Removed old flat coaching files (`leadership.md`, `planning.md`, `review.md`) in favor of new directory structure
- Fixed CLAUDE.md timescale architecture section to include coaching file locations
- Fixed CLAUDE.md agent notes to document vault symlink

## 0.1.0

- Initial release with daily, weekly, quarterly, and yearly planning and review rituals
- Vault scaffold with Systemic templates, Coaching guides, and Directive files
- Init wizard for fresh install, reconnect, and profile update
- Project and people management skills
