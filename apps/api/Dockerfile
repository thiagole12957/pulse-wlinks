# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copiar arquivos de configuração
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY tsconfig.base.json ./
COPY packages/contracts ./packages/contracts
COPY apps/api ./apps/api

# Build
RUN pnpm --filter @wlinks-pulse/contracts build
RUN pnpm --filter @wlinks-pulse/api prisma generate
RUN pnpm --filter @wlinks-pulse/api build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copiar arquivos necessários
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/contracts/package.json ./packages/contracts/

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar build
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Copiar Prisma client gerado completo do builder
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client ./node_modules/@prisma/client

# Instalar openssl para compatibilidade do Prisma e regenerar client
RUN apk add --no-cache openssl && \
    npm install -g prisma@5.22.0 && \
    cd apps/api && prisma generate && \
    npm uninstall -g prisma

USER nestjs

WORKDIR /app/apps/api

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
