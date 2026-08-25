#!/usr/bin/env bash
set -euo pipefail

URL="${1:-https://bidulefr.github.io/api-myData/}"
PREV_ASSET="${2:-}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-40}"
SLEEP_SECONDS="${SLEEP_SECONDS:-6}"

echo "Check public: $URL"
echo "Previous asset: ${PREV_ASSET:-<none>}"

attempt=1
while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
  echo "Attempt $attempt/$MAX_ATTEMPTS"

  HTML="$(curl -sS -L "$URL" || true)"
  STATUS="$(curl -sS -o /dev/null -w '%{http_code}' "$URL" || true)"

  ASSET_PATH="$(printf '%s' "$HTML" | grep -o '/api-myData/assets/index-[^"]*\.js' | head -1 || true)"

  if [ "$STATUS" = "200" ] && [ -n "$ASSET_PATH" ]; then
    ASSET_URL="https://bidulefr.github.io${ASSET_PATH}"
    ASSET_STATUS="$(curl -sS -o /dev/null -w '%{http_code}' "$ASSET_URL" || true)"

    if [ "$ASSET_STATUS" = "200" ]; then
      if [ -n "$PREV_ASSET" ] && [ "$ASSET_PATH" = "$PREV_ASSET" ]; then
        echo "Deploiement pas encore propage (asset inchange: $ASSET_PATH)"
      else
        echo "OK public: $URL"
        echo "Asset: $ASSET_PATH"
        exit 0
      fi
    else
      echo "Asset non disponible: $ASSET_URL (HTTP $ASSET_STATUS)"
    fi
  else
    echo "Root non pret (HTTP $STATUS) ou asset introuvable"
  fi

  attempt=$((attempt + 1))
  sleep "$SLEEP_SECONDS"
done

echo "Echec: deploy public non valide dans le delai imparti."
exit 1
