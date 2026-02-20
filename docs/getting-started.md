---
title: "Getting Started"
description: "Get 2bd running in five minutes."
---

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
- Markdown editor (Obsidian recommended)
- Cloud sync folder (OneDrive, iCloud, Dropbox)

## Install

1. **Clone the engine**

   ```bash
   git clone https://github.com/bugroger/2bd ~/Code/2bd-engine
   cd ~/Code/2bd-engine
   ```

2. **Create your vault**

   ```bash
   claude skill run init --args "fresh --vault=~/OneDrive/2bd-vault"
   ```

   This creates your vault with the default folder structure and templates.

3. **Symlink for convenience (optional)**

   ```bash
   ln -s ~/OneDrive/2bd-vault ./vault
   ```

4. **Open in Obsidian and start planning**

   Open your vault folder in Obsidian, then run your first planning ritual:

   ```bash
   claude skill run ritual-planning-daily
   ```

## New computer setup

If your vault already exists elsewhere:

```bash
cd ~/Code/2bd-engine
claude skill run init --args "reconnect --vault=~/OneDrive/2bd-vault"
ln -s ~/OneDrive/2bd-vault ./vault
```

## Configuration

The engine stores vault path in `.claude/config.md` (git-ignored):

```markdown
# 2bd Engine Configuration

## Vault

vault_path: /Users/you/OneDrive/2bd-vault
```

All skills read this config to find your vault. If you move your vault:

```bash
claude skill run init --args "reconnect --vault=/new/path"
ln -sf /new/path ./vault
```

## Update your profile

Personalize how Claude interacts with you:

```bash
claude skill run init --args "profile"
```

This creates directives in your vault that control:
- Your name, role, and goals
- Leadership identity and growth edge
- AI communication style (formality, directness, coaching approach)

## Next steps

- [Daily workflow](/guides/daily-workflow) — Learn the morning and evening rhythm.
- [Obsidian setup](/guides/obsidian-setup) — Configure hotkeys and templates.
