# THE AI COUNCIL V2.0

Monorepo pnpm : application web (React + Vite), API (Node.js + Fastify), PostgreSQL, Redis.
Plateformes ciblées : Web + Desktop. Fournisseurs IA autorisés : OpenAI, Anthropic (Claude), xAI (Grok), DeepSeek.

## Démarrage rapide

```bash
pnpm install
cp .env.example .env        # puis renseigner les valeurs
pnpm docker:up              # PostgreSQL + Redis
pnpm dev:api                # http://localhost:3001/health
pnpm dev:web                # http://localhost:5173
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `pnpm build` | Compile tous les paquets |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm test` | Tests unitaires (vitest) |
| `pnpm test:integration` | Tests contre PostgreSQL et Redis réels (`DATABASE_URL`, `REDIS_URL`) |
| `pnpm verify:docker` | Vérification complète de la stack Docker (démon requis) |
| `docker compose --profile app up --build` | Stack complète en conteneurs |

Documentation : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/SETUP.md](docs/SETUP.md) · [docs/VALIDATION.md](docs/VALIDATION.md)
