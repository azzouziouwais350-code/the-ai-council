#!/usr/bin/env bash
# Vérification reproductible de la stack Docker : PostgreSQL, Redis, API, Web.
# Prérequis : démon Docker actif, pnpm installé (pnpm install déjà exécuté).
# Usage : pnpm verify:docker
set -euo pipefail
cd "$(dirname "$0")/.."

CREATED_ENV=0
cleanup() {
  docker compose --profile app down -v --remove-orphans >/dev/null 2>&1 || true
  if [ "$CREATED_ENV" = "1" ]; then rm -f .env; fi
}
trap cleanup EXIT

if ! docker info >/dev/null 2>&1; then
  echo "ÉCHEC : démon Docker injoignable — vérification impossible ici." >&2
  exit 2
fi

if [ ! -f .env ]; then
  cp .env.example .env
  CREATED_ENV=1
fi

set -a
# shellcheck disable=SC1091
. ./.env
set +a

step() { echo "==> $*"; }

step "1/6 Validation du fichier compose"
docker compose --profile app config -q

step "2/6 Construction des images api et web"
docker compose --profile app build

step "3/6 Démarrage de PostgreSQL et Redis (attente des healthchecks)"
docker compose up -d --wait postgres redis

step "4/6 Tests d'intégration PostgreSQL + Redis réels"
DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT:-5432}/${POSTGRES_DB}" \
REDIS_URL="redis://127.0.0.1:${REDIS_PORT:-6379}" \
NODE_ENV=test \
  pnpm test:integration

step "5/6 Démarrage de la stack complète (api + web)"
docker compose --profile app up -d --wait

step "6/6 Sondes HTTP"
curl -fsS "http://127.0.0.1:${API_PORT:-3001}/health" | tee /dev/stderr | grep -q '"status":"ok"'
curl -fsS "http://127.0.0.1:8080/" | grep -q 'THE AI COUNCIL'
curl -fsS "http://127.0.0.1:8080/api/health" | grep -q '"status":"ok"'

echo "OK : Docker, PostgreSQL, Redis, API et Web vérifiés."
