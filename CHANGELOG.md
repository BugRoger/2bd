# Changelog

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
