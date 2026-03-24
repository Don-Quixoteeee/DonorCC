# Multi-stage Dockerfile for building and running this Next.js + Prisma app
# Tailored to this repository: uses pnpm, copies prisma generated client and config.

# -------------------------
# Builder stage
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first for layer caching (pnpm is used in this repo)
COPY package.json pnpm-lock.yaml ./


# Copy Prisma schema early so prisma generate can run
COPY prisma ./prisma


# Install pnpm and project dependencies using the locked lockfile
RUN npm install -g pnpm@10.18.1 && \
    pnpm install --frozen-lockfile


# Copy application source
COPY . .


# Generate Prisma client (schema generator outputs to prisma/generated)
RUN pnpm prisma generate


# Build the Next.js application
RUN pnpm build


# -------------------------
# Runtime stage
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy the standalone server output and static assets produced by Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public


# Copy Prisma schema, migrations and generated client (both prisma/generated and src/generated)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/generated ./prisma/generated
# Some runtime code may import from src/generated — copy it as well if present
COPY --from=builder /app/src/generated ./src/generated


# Copy prisma.config.js (this project uses a JS config file)
COPY --from=builder /app/prisma.config.js ./prisma.config.js


# Copy package.json and tests so CI inside the container can run tests (optional)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/tests ./src/tests


# Expose default Next.js port
EXPOSE 3000


# Start the standalone server
CMD ["node", "server.js"]
