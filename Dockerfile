# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
# Alpine sometimes needs libc6-compat for some npm packages.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace manifests so pnpm can install only necessary packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build only the web app from the pnpm workspace
RUN pnpm --filter web build

# Production image, copy only the standalone output for `apps/web`
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Disable Next.js telemetry at runtime
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public and standalone output from the workspace app
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]