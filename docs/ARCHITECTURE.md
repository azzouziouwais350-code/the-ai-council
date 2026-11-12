# Architecture — Phase 01

```
the-ai-council/
├── apps/
│   ├── api/        Fastify 5 + TypeScript (NodeNext), pg, ioredis, zod
│   └── web/        React 19 + Vite, proxy /api → :3001
├── packages/
│   └── shared/     Types et constantes partagés (PROVIDERS, HealthStatus)
├── docker-compose.yml
├── tsconfig.base.json
└── .env.example
```

## Choix

- **Workspaces pnpm** : `@council/shared` est compilé puis consommé par `api` et `web`.
- **TypeScript strict** partagé via `tsconfig.base.json`.
- **API** : `buildApp(config, services)` reçoit ses dépendances (Postgres, Redis), ce qui rend les routes testables sans base réelle. `GET /health` renvoie 200 (`ok`) ou 503 (`degraded`).
- **Configuration** : validée par zod au démarrage (`apps/api/src/config.ts`). Une clé fournisseur vide est traitée comme absente.
- **Fournisseurs** : uniquement `openai`, `anthropic`, `xai`, `deepseek`.
- **Docker** : `postgres` et `redis` par défaut ; `api` et `web` sous le profil `app`. Ports liés à `127.0.0.1`.

## Hors périmètre de la phase 01

Client Desktop, logique des agents, intégration effective des fournisseurs IA, schéma de base de données et migrations.
