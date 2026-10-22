#!/usr/bin/env bash
# Installs every skill in this repo into ~/.claude/skills (user-level: all projects).
# Usage:  bash install.sh            (from a clone)
#    or:  curl -fsSL https://raw.githubusercontent.com/Chrisxtain/claude-skills/main/install.sh | bash
set -euo pipefail
DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || true)"
if [ -z "$SRC" ] || [ ! -d "$SRC/skills" ]; then
  TMP="$(mktemp -d)"
  git clone --depth 1 https://github.com/Chrisxtain/claude-skills.git "$TMP/claude-skills" >/dev/null 2>&1
  SRC="$TMP/claude-skills"
fi
mkdir -p "$DEST"
for dir in "$SRC"/skills/*/; do
  name="$(basename "$dir")"
  rm -rf "$DEST/$name"
  cp -R "$dir" "$DEST/$name"
  echo "installed $name -> $DEST/$name"
done
