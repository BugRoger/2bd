# Changelog

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
