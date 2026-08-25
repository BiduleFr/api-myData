#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

MESSAGE="${1:-auto: sync + deploy $(date '+%Y-%m-%d %H:%M:%S')}"
PUBLIC_URL="${PUBLIC_URL:-https://bidulefr.github.io/api-myData/}"

PREV_HTML="$(curl -sS -L "$PUBLIC_URL" || true)"
PREV_ASSET="$(printf '%s' "$PREV_HTML" | grep -o '/api-myData/assets/index-[^"]*\.js' | head -1 || true)"

npm run validate

git add -A

if git diff --cached --quiet; then
  echo "Aucun changement a commit."
  bash scripts/check-public.sh "$PUBLIC_URL" "$PREV_ASSET"
  echo "Termine: aucun commit, validation publique OK."
  exit 0
fi

git commit -m "$MESSAGE"

git pull --rebase origin main
git push origin main

bash scripts/check-public.sh "$PUBLIC_URL" "$PREV_ASSET"

echo "Termine: commit + push + validation publique OK."
