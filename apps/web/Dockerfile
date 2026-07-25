# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copiar arquivos de configuração
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/contracts/package.json ./packages/contracts/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY tsconfig.base.json ./
COPY packages/contracts ./packages/contracts
COPY apps/web ./apps/web

# Build
RUN pnpm --filter @wlinks-pulse/contracts build
RUN pnpm --filter @wlinks-pulse/web build

# Production stage - nginx para servir arquivos estáticos
FROM nginx:alpine AS runner

# Copiar build
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copiar configuração nginx
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
