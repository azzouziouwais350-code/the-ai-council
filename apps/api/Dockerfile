FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm install --frozen-lockfile --filter @council/api...
RUN pnpm --filter @council/shared build && pnpm --filter @council/api build
RUN pnpm --filter @council/api deploy --legacy --prod /out

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 3001
CMD ["node", "dist/server.js"]
