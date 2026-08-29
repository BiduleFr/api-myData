#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Charge les variables locales (ex: RENDER_DEPLOY_HOOK_URL) sans jamais les committer (.env est gitignore).
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

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

if [ -n "${RENDER_DEPLOY_HOOK_URL:-}" ]; then
  echo "Declenchement du deploiement Render..."
  curl -fsS -X POST "$RENDER_DEPLOY_HOOK_URL" > /dev/null
  echo "Deploiement Render declenche."
else
  echo "RENDER_DEPLOY_HOOK_URL non defini: le deploiement Render doit etre automatique (Auto-Deploy) ou manuel."
fi

bash scripts/check-public.sh "$PUBLIC_URL" "$PREV_ASSET"

echo "Termine: commit + push + validation publique OK."
