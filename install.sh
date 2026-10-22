#!/usr/bin/env bash
# Installs every skill in this repo into ~/.claude/skills (user-level: all projects).
#
#   bash install.sh                 skills only
#   bash install.sh --with-tools    skills + the CLI tools they use (playwright-cli)
#
# From anywhere:
#   curl -fsSL https://raw.githubusercontent.com/Chrisxtain/claude-skills/main/install.sh | bash -s -- --with-tools
set -euo pipefail

WITH_TOOLS=0
for arg in "$@"; do
  case "$arg" in
    --with-tools) WITH_TOOLS=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

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
  rm -rf "${DEST:?}/$name"
  cp -R "$dir" "$DEST/$name"
  echo "installed $name -> $DEST/$name"
done

[ "$WITH_TOOLS" -eq 1 ] || exit 0

# playwright-cli (used by the playwright-cli skill)
if command -v npm >/dev/null 2>&1; then
  npm install -g @playwright/cli@latest >/dev/null 2>&1 && echo "installed playwright-cli $(playwright-cli --version 2>/dev/null)" \
    || echo "warning: could not install @playwright/cli" >&2
else
  echo "warning: npm not found; skipping playwright-cli" >&2
fi

# Browsers: desktop machines with Chrome need nothing more. For root containers (e.g. Claude Code
# cloud sessions) see "Browser setup for cloud containers" in README.md; it is a deliberate,
# opt-in choice and this script does not change browser security settings.
