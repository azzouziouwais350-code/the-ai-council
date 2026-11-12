# Critères de validation — Phase 01

Chaque critère indique comment le vérifier et son statut réel au dernier audit.
Légende : ✅ vérifié par exécution · 🟡 simulé localement (équivalent, pas identique) · ⛔ non vérifié dans cet environnement.

| # | Critère | Commande | Statut |
| --- | --- | --- | --- |
| 1 | Installation reproductible depuis un clone propre | `pnpm install --frozen-lockfile` | ✅ |
| 2 | Typecheck strict de tous les paquets | `pnpm typecheck` | ✅ |
| 3 | Compilation (shared, api, web) | `pnpm build` | ✅ |
| 4 | Tests unitaires (shared, api, web) | `pnpm test` | ✅ |
| 5 | Tests d'intégration contre PostgreSQL et Redis réels | `pnpm test:integration` (avec `DATABASE_URL`, `REDIS_URL`) | ✅ PostgreSQL 18.6 embarqué + Redis local ; ⛔ avec l'image `postgres:17-alpine` |
| 6 | `/health` renvoie 200/503 selon l'état des services | tests api + intégration | ✅ |
| 7 | Fichier compose valide | `docker compose --profile app config -q` | ✅ |
| 8 | Étapes des Dockerfiles api et web (install filtré, build, `pnpm deploy --legacy`, démarrage du résultat) | exécutées à la main hors Docker | 🟡 |
| 9 | Construction réelle des images, healthchecks, stack complète | `pnpm verify:docker` | ⛔ (aucun démon Docker ici) — exécuté par le job `docker` de la CI |
| 10 | Aucun secret suivi par git | `git ls-files \| grep -E '^\.env'` ne renvoie que `.env.example` | ✅ |
| 11 | Seuls les quatre fournisseurs autorisés sont configurés | `PROVIDERS` + `.env.example` | ✅ |

## Reproduire

- Sans Docker : `pnpm install && pnpm typecheck && pnpm build && pnpm test`, puis `pnpm test:integration` avec un PostgreSQL et un Redis accessibles.
- Avec Docker : `pnpm verify:docker` (code de sortie 2 si le démon est injoignable ; nettoie les conteneurs et volumes à la fin).
- CI : `.github/workflows/ci.yml` exécute les deux (services PostgreSQL 17 et Redis 7, puis `verify-docker.sh`).

## Correctifs issus de l'audit

- Un clone propre échouait aux tests : `@council/shared` n'était pas compilé. Les scripts `pre*` d'api et web le compilent désormais.
- Le build web dans Docker échouait (`vitest` non déclaré dans le paquet) : `typescript` et `vitest` déclarés par paquet.
- `pnpm deploy` échouait avec pnpm 10 : `--legacy` ajouté ; `files: ["dist"]` ajouté aux paquets déployés.
- `@types/node` aligné sur Node 22 (était 26).
- Erreurs de clients inactifs du pool `pg` interceptées (sinon risque d'arrêt du process).
- Healthcheck de l'api et dépendance `service_healthy` du web ; `NODE_ENV` et `API_PORT` fixés dans le conteneur api.
