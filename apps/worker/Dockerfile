# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copiar arquivos de configuração
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/contracts/package.json ./packages/contracts/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY tsconfig.base.json ./
COPY packages/contracts ./packages/contracts
COPY apps/worker ./apps/worker

# Build
RUN pnpm --filter @wlinks-pulse/contracts build
RUN pnpm --filter @wlinks-pulse/worker build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 worker

# Copiar arquivos necessários
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/apps/worker/package.json ./apps/worker/
COPY --from=builder /app/packages/contracts/package.json ./packages/contracts/

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar build
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist

USER worker

WORKDIR /app/apps/worker

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
