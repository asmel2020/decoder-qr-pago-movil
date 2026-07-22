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

VERSION=$(node -e "
const pkg = require('./package.json');
const [major, minor, patch] = pkg.version.split('.').map(Number);
let v;
switch ('$BUMP') {
  case 'major': v = \`\${major+1}.0.0\`; break;
  case 'minor': v = \`\${major}.\${minor+1}.0\`; break;
  default:     v = \`\${major}.\${minor}.\${patch+1}\`;
}
pkg.version = v;
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('v' + v);
")

echo "Bumped to v$VERSION"

cd - > /dev/null

git add "$PKG_DIR/package.json"
git commit -m "chore: bump version to $VERSION"
git tag "$VERSION"

git push origin master
git push origin "$VERSION"

echo ""
echo "Done. GitHub Actions will publish automatically."
