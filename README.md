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
| `pnpm test` | Tests (vitest) |
| `docker compose --profile app up --build` | Stack complète en conteneurs |

Documentation : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/SETUP.md](docs/SETUP.md)
