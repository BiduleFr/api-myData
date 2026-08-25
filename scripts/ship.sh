#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

MESSAGE="${1:-auto: sync + deploy $(date '+%Y-%m-%d %H:%M:%S')}"

npm run validate

git add -A

if git diff --cached --quiet; then
  echo "Aucun changement a commit."
  exit 0
fi

git commit -m "$MESSAGE"

git pull --rebase origin main
git push origin main

echo "Termine: commit + push effectues. GitHub Actions va deployer automatiquement."
