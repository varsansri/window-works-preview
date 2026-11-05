#!/usr/bin/env bash
# Builds the site and publishes it to GitHub Pages as a public repo.
# Safe to run again later: it updates the same address.
set -euo pipefail
cd "$(dirname "$0")"
REPO=varsansri/window-works-preview

npm run build

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --description "Preview: Window Works site and estimator (demo only)"
fi
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
git push -u origin main

# The built files go on their own branch, so publishing uses no GitHub Actions setup of ours.
cd dist
git init -q -b gh-pages
git config user.name varsansri
git config user.email varsansri@users.noreply.github.com
git add .
git commit -q --allow-empty -m "Publish build"
git push --force "https://github.com/$REPO.git" gh-pages
cd ..

gh api -X POST "repos/$REPO/pages" -f "source[branch]=gh-pages" -f "source[path]=/" >/dev/null 2>&1 || true
echo
echo "Published. Live in a few minutes at: https://varsansri.github.io/window-works-preview/"
