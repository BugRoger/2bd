---
title: "Installation"
description: "Get 2bd running in five minutes."
---

## Fresh install

1. **Clone the engine**

   ```bash
   git clone https://github.com/bugroger/2bd ~/Code/2bd-engine
   cd ~/Code/2bd-engine
   ```

2. **Create your vault**

   ```bash
   claude skill run init --args "fresh --vault=~/OneDrive/2bd-vault"
   ```

   This creates your vault with the default structure and templates.

3. **Symlink for convenience** (optional)

   ```bash
   ln -s ~/OneDrive/2bd-vault ./vault
   ```

4. **Run your first ritual**

   Open your vault in Obsidian, then:

   ```bash
   claude skill run ritual-planning-daily
   ```

## New computer

If your vault already exists on another device:

```bash
git clone https://github.com/bugroger/2bd ~/Code/2bd-engine
cd ~/Code/2bd-engine
claude skill run init --args "reconnect --vault=~/OneDrive/2bd-vault"
ln -s ~/OneDrive/2bd-vault ./vault
```

## Migrating from combined repo

If you have an older 2bd repo with personal content mixed in:

```bash
claude skill run migrate --args "--vault=~/OneDrive/2bd-vault"
```
