# Dockerfile para Game Change Images com Git Integration
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat git

# Argumentos para configuração do Git
ARG GITHUB_REPO
ARG GITHUB_BRANCH=main
ARG GITHUB_TOKEN

# Dependências de produção
FROM base AS deps
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Build da aplicação
FROM base AS builder
WORKDIR /app

# Clonar repositório se GITHUB_REPO for fornecido
ARG GITHUB_REPO
ARG GITHUB_BRANCH=main
ARG GITHUB_TOKEN

RUN if [ -n "$GITHUB_REPO" ]; then \
        if [ -n "$GITHUB_TOKEN" ]; then \
            git clone --branch $GITHUB_BRANCH https://oauth2:$GITHUB_TOKEN@github.com/$(echo $GITHUB_REPO | sed 's|https://github.com/||' | sed 's|.git||') .; \
        else \
            git clone --branch $GITHUB_BRANCH $GITHUB_REPO .; \
        fi; \
    fi

# Copiar dependências se não clonou do Git
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Mudar propriedade dos arquivos
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Script de inicialização
CMD ["node", "server.js"] 