# Installation

Prérequis : Node.js ≥ 22, pnpm 10, Docker (pour PostgreSQL et Redis).

1. `pnpm install`
2. `cp .env.example .env` et remplacer `POSTGRES_PASSWORD` (et le mot de passe dans `DATABASE_URL`).
3. `pnpm docker:up`
4. `pnpm dev:api` puis `pnpm dev:web`
5. Vérifier : `curl http://localhost:3001/health`

## Sécurité des fichiers sensibles

- `.env` et `.env.*` sont ignorés par git et par Docker (seul `.env.example` est suivi).
- Les clés `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `XAI_API_KEY`, `DEEPSEEK_API_KEY` ne vivent que dans `.env`.
- Les ports PostgreSQL et Redis sont exposés uniquement sur `127.0.0.1`.
- L'en-tête `Authorization` est masqué dans les logs de l'API.
- Les clés ne doivent jamais être exposées au frontend : seules les variables préfixées `VITE_` le seraient.

## Tests

- `pnpm test` : unitaires, sans service externe.
- `pnpm test:integration` : nécessite PostgreSQL et Redis (par ex. `pnpm docker:up`, puis exporter `DATABASE_URL` et `REDIS_URL` vers `127.0.0.1`).
- `pnpm verify:docker` : construit les images, lance la stack et sonde `/health` ; voir [VALIDATION.md](VALIDATION.md).

`@council/shared` est compilé automatiquement avant `dev`, `build`, `test` et `typecheck` d'api et web.
