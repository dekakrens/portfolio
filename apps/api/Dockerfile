FROM node:22-alpine AS base
RUN npm install -g pnpm@11.25.0

FROM base AS builder
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile --filter api...

COPY apps/api ./apps/api
RUN pnpm --filter api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --prod --frozen-lockfile --filter api...

COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]
