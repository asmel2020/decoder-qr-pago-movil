#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

PKG_DIR="packages/decoder-qr-pago-movil"

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: working tree not clean. Commit or stash changes first."
  exit 1
fi

cd "$PKG_DIR"

BUMP=${1:-patch}
VERSION=$(npm version "$BUMP" --no-git-tag-version)
echo "Bumped to $VERSION"

cd - > /dev/null

git add "$PKG_DIR/package.json"
git commit -m "chore: bump version to $VERSION"
git tag "$VERSION"

git push origin master
git push origin "$VERSION"

echo ""
echo "Done. GitHub Actions will publish automatically."
